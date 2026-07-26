"""
route_service.py — Clean interface to the existing C++ WeatherIQ planner.

Invokes the compiled `weatheriq` binary (project root), feeds source/destination
via stdin (matching cpp/main.cpp prompts), and parses stdout into structured data.

Does not change Graph / A* / Weather C++ logic.
"""

from __future__ import annotations

import os
import re
import subprocess
from pathlib import Path
from typing import Any


class RoutePlannerError(Exception):
    """Raised when the C++ planner cannot produce a valid route."""


class RouteService:
    """Bridge between FastAPI and the C++ route planner executable."""

    def __init__(self, project_root: Path | None = None) -> None:
        # backend/ -> WeatherIQ/
        self.project_root = project_root or Path(__file__).resolve().parent.parent
        self.binary_path = Path(
            os.getenv("WEATHERIQ_BINARY", str(self.project_root / "weatheriq"))
        )
        # Forward ORS key to the child process if present
        self.ors_api_key = (
            os.getenv("OPENROUTESERVICE_API_KEY", "").strip()
            or os.getenv("ORS_API_KEY", "").strip()
        )
        self.timeout_seconds = float(os.getenv("WEATHERIQ_TIMEOUT_SECONDS", "120"))

    def plan_route(self, source: str, destination: str) -> dict[str, Any]:
        """
        Run the C++ planner for source -> destination and return JSON-ready data.
        """
        source = (source or "").strip()
        destination = (destination or "").strip()
        if not source or not destination:
            raise RoutePlannerError("source and destination are required")

        if not self.binary_path.is_file():
            raise RoutePlannerError(
                f"C++ binary not found at {self.binary_path}. "
                "Build it from the project root, e.g.: "
                "g++ -std=c++17 -o weatheriq "
                "cpp/Graph.cpp cpp/AStar.cpp cpp/Weather.cpp "
                "cpp/CsvRouteProvider.cpp cpp/ApiRouteProvider.cpp "
                "cpp/GraphBuilder.cpp cpp/CsvCityProvider.cpp "
                "cpp/CityCoordinateStore.cpp cpp/main.cpp"
            )

        env = os.environ.copy()
        if self.ors_api_key:
            env["OPENROUTESERVICE_API_KEY"] = self.ors_api_key
            env.setdefault("ORS_API_KEY", self.ors_api_key)

        stdin_payload = f"{source}\n{destination}\n"

        try:
            completed = subprocess.run(
                [str(self.binary_path)],
                input=stdin_payload,
                capture_output=True,
                text=True,
                cwd=str(self.project_root),
                env=env,
                timeout=self.timeout_seconds,
                check=False,
            )
        except subprocess.TimeoutExpired as exc:
            raise RoutePlannerError(
                f"C++ planner timed out after {self.timeout_seconds}s"
            ) from exc
        except OSError as exc:
            raise RoutePlannerError(f"Failed to start C++ planner: {exc}") from exc

        stdout = completed.stdout or ""
        stderr = completed.stderr or ""

        if completed.returncode != 0:
            detail = self._extract_error(stdout, stderr) or (
                f"planner exited with code {completed.returncode}"
            )
            raise RoutePlannerError(detail)

        return self._parse_planner_output(stdout, source, destination)

    @staticmethod
    def _extract_error(stdout: str, stderr: str) -> str:
        combined = f"{stdout}\n{stderr}"
        for line in combined.splitlines():
            stripped = line.strip()
            if stripped.startswith("Error:") or stripped.startswith("Failed"):
                return stripped
        return stderr.strip()

    def _parse_planner_output(
        self, stdout: str, source: str, destination: str
    ) -> dict[str, Any]:
        """Parse printPath / coordinate lines from weatheriq stdout."""
        route_taken = None
        cities: list[str] = []
        edges: list[dict[str, Any]] = []
        distance_km: int | None = None
        weather_penalty: int | None = None
        final_cost: int | None = None
        start_coordinates: dict[str, float] | None = None
        goal_coordinates: dict[str, float] | None = None

        route_re = re.compile(r"^Route taken:\s*(.+)\s*$")
        edge_re = re.compile(
            r"^\s*(.+?)\s*->\s*(.+?):\s*(\d+)\s*km,\s*"
            r"weather\s*=\s*(.+?)\s*\(penalty\s*(\d+)\)"
            r"(?:,\s*edge cost\s*=\s*(\d+))?\s*$"
        )
        distance_re = re.compile(r"^Distance travelled:\s*(\d+)\s*km")
        penalty_re = re.compile(r"^Total weather penalty:\s*(\d+)")
        cost_re = re.compile(r"^Final route cost:\s*(\d+)")
        coord_re = re.compile(
            r"^(Start|Goal) coordinates:\s*(.+?)\s*\(([-0-9.]+),\s*([-0-9.]+)\)\s*$"
        )

        for raw_line in stdout.splitlines():
            line = raw_line.rstrip()

            m = route_re.match(line)
            if m:
                route_taken = m.group(1).strip()
                cities = [c.strip() for c in route_taken.split("->")]
                continue

            m = edge_re.match(line)
            if m:
                edges.append(
                    {
                        "from": m.group(1).strip(),
                        "to": m.group(2).strip(),
                        "distance_km": int(m.group(3)),
                        "weather": m.group(4).strip(),
                        "weather_penalty": int(m.group(5)),
                        "edge_cost": int(m.group(6)) if m.group(6) else None,
                    }
                )
                continue

            m = distance_re.match(line)
            if m:
                distance_km = int(m.group(1))
                continue

            m = penalty_re.match(line)
            if m:
                weather_penalty = int(m.group(1))
                continue

            m = cost_re.match(line)
            if m:
                final_cost = int(m.group(1))
                continue

            m = coord_re.match(line)
            if m:
                coords = {
                    "latitude": float(m.group(3)),
                    "longitude": float(m.group(4)),
                }
                if m.group(1) == "Start":
                    start_coordinates = coords
                else:
                    goal_coordinates = coords

        if not route_taken or not cities:
            if "No path found" in stdout or "No route to display" in stdout:
                raise RoutePlannerError(
                    f"No path found from {source} to {destination}"
                )
            raise RoutePlannerError(
                "Could not parse route from C++ planner output"
            )

        return {
            "source": source,
            "destination": destination,
            "route": cities,
            "route_display": route_taken,
            "edges": edges,
            "distance_km": distance_km,
            "total_weather_penalty": weather_penalty,
            "final_route_cost": final_cost,
            "start_coordinates": start_coordinates,
            "goal_coordinates": goal_coordinates,
            "engine": "weatheriq-cpp",
        }
