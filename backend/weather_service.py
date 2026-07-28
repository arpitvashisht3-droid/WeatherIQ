"""
weather_service.py — OpenWeatherMap integration for WeatherIQ.

Maps live OWM conditions to the same labels used by the C++ Weather class:
Sunny, Cloudy, Hot, Rainy, Stormy, Windy.
"""

from __future__ import annotations

import os
from typing import Any

import httpx


class WeatherService:
    """Fetches current weather via OpenWeatherMap."""

    def __init__(self) -> None:
        self.api_key = os.getenv("OPENWEATHERMAP_API_KEY", "").strip()
        self.base_url = os.getenv(
            "OPENWEATHERMAP_BASE_URL",
            "https://api.openweathermap.org/data/2.5",
        ).rstrip("/")

    def is_configured(self) -> bool:
        return bool(self.api_key)

    @staticmethod
    def map_openweather_to_condition(owm_main: str, temp_c: float, wind_speed: float) -> str:
        """Match C++ Weather::mapOpenWeatherToCondition logic."""
        if temp_c >= 35.0:
            return "Hot"
        if owm_main == "Thunderstorm":
            return "Stormy"
        if owm_main in ("Rain", "Drizzle"):
            return "Rainy"
        if owm_main == "Clear":
            return "Sunny"
        if owm_main == "Clouds":
            return "Cloudy"
        if owm_main in ("Mist", "Fog", "Haze", "Smoke", "Dust", "Sand"):
            return "Cloudy"
        if wind_speed >= 10.0:
            return "Windy"
        return "Cloudy"

    def get_weather_at(self, latitude: float, longitude: float) -> dict[str, Any]:
        """Fetch live weather at coordinates."""
        if not self.is_configured():
            return {
                "latitude": latitude,
                "longitude": longitude,
                "status": "not_configured",
                "condition": "Unknown",
                "owm_main": None,
                "temperature_c": None,
            }

        url = f"{self.base_url}/weather"
        params = {
            "lat": latitude,
            "lon": longitude,
            "units": "metric",
            "appid": self.api_key,
        }

        try:
            with httpx.Client(timeout=15.0) as client:
                response = client.get(url, params=params)
                response.raise_for_status()
                data = response.json()
        except httpx.HTTPError as exc:
            return {
                "latitude": latitude,
                "longitude": longitude,
                "status": "error",
                "condition": "Unknown",
                "message": str(exc),
                "owm_main": None,
                "temperature_c": None,
            }

        weather_list = data.get("weather") or []
        owm_main = weather_list[0].get("main", "Clouds") if weather_list else "Clouds"
        temp_c = float((data.get("main") or {}).get("temp", 20.0))
        wind_speed = float((data.get("wind") or {}).get("speed", 0.0))
        condition = self.map_openweather_to_condition(owm_main, temp_c, wind_speed)

        return {
            "latitude": latitude,
            "longitude": longitude,
            "status": "ok",
            "condition": condition,
            "owm_main": owm_main,
            "temperature_c": temp_c,
            "wind_speed_ms": wind_speed,
            "provider": "openweathermap",
        }

    def get_weather_for_city(self, city: str) -> dict[str, Any]:
        """City-name lookup is not used for edge weather; kept for API responses."""
        return {
            "city": city,
            "status": "name_only",
            "message": "Edge weather is resolved by coordinates in the C++ planner.",
            "condition": None,
            "temperature_c": None,
        }

    def get_weather_for_edges(self, edges: list[dict[str, Any]]) -> list[dict[str, Any]]:
        """Attach live weather metadata to parsed route edges (if coords available)."""
        results: list[dict[str, Any]] = []
        for edge in edges:
            results.append(
                {
                    "from": edge.get("from"),
                    "to": edge.get("to"),
                    "condition": edge.get("weather"),
                    "weather_penalty": edge.get("weather_penalty"),
                }
            )
        return results
