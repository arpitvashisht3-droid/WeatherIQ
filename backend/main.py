"""
WeatherIQ FastAPI backend.

Endpoints:
  GET  /health  — API status
  POST /route   — weather-aware route via the C++ planner
"""

from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

from route_service import RoutePlannerError, RouteService
from weather_service import WeatherService

# Load keys from project-root .env (never hardcode secrets)
PROJECT_ROOT = Path(__file__).resolve().parent.parent
load_dotenv(PROJECT_ROOT / ".env")
load_dotenv()  # also allow process / backend-local env

app = FastAPI(
    title="WeatherIQ API",
    description="Weather-aware route planning backed by the C++ A* engine.",
    version="0.1.0",
)

route_service = RouteService(project_root=PROJECT_ROOT)
weather_service = WeatherService()


class RouteRequest(BaseModel):
    source: str = Field(..., examples=["Delhi"])
    destination: str = Field(..., examples=["Mumbai"])


@app.get("/health")
def health() -> dict:
    """Return API status and whether external keys/binary are available."""
    binary_ok = route_service.binary_path.is_file()
    return {
        "status": "ok",
        "service": "WeatherIQ",
        "cpp_binary_found": binary_ok,
        "cpp_binary_path": str(route_service.binary_path),
        "openrouteservice_configured": bool(
            os.getenv("OPENROUTESERVICE_API_KEY", "").strip()
            or os.getenv("ORS_API_KEY", "").strip()
        ),
        "openweathermap_configured": weather_service.is_configured(),
    }


@app.post("/route")
def create_route(body: RouteRequest) -> dict:
    """
    Plan a route from source to destination using the C++ weatheriq binary.

    Example body:
      { "source": "Delhi", "destination": "Mumbai" }
    """
    try:
        result = route_service.plan_route(body.source, body.destination)
    except RoutePlannerError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    # Attach placeholder weather info (OpenWeatherMap later)
    result["weather"] = weather_service.get_weather_for_route(result.get("route", []))
    return result
