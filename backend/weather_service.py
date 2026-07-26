"""
weather_service.py — OpenWeatherMap integration (placeholder).

Loads OPENWEATHERMAP_API_KEY from the environment.
Real HTTP calls will be added in a later step; this module defines the
clean interface the FastAPI layer can already depend on.
"""

from __future__ import annotations

import os
from typing import Any


class WeatherService:
    """Fetches current weather for a city via OpenWeatherMap (stub for now)."""

    def __init__(self) -> None:
        # Never hardcode keys — read from environment / .env
        self.api_key = os.getenv("OPENWEATHERMAP_API_KEY", "").strip()
        self.base_url = os.getenv(
            "OPENWEATHERMAP_BASE_URL",
            "https://api.openweathermap.org/data/2.5",
        ).rstrip("/")

    def is_configured(self) -> bool:
        """True when an API key is available."""
        return bool(self.api_key)

    def get_weather_for_city(self, city: str) -> dict[str, Any]:
        """
        Return weather for a city name.

        Placeholder: does not call OpenWeatherMap yet.
        When wired up, this will GET /weather?q={city}&appid={key}.
        """
        if not self.is_configured():
            return {
                "city": city,
                "status": "not_configured",
                "message": (
                    "OPENWEATHERMAP_API_KEY is not set. "
                    "Weather lookup is unavailable."
                ),
                "condition": None,
                "temperature_c": None,
            }

        # Placeholder until live OWM integration is implemented
        return {
            "city": city,
            "status": "placeholder",
            "message": (
                "OpenWeatherMap client is configured but not implemented yet. "
                "API key was loaded from the environment."
            ),
            "condition": None,
            "temperature_c": None,
            "provider": "openweathermap",
        }

    def get_weather_for_route(self, cities: list[str]) -> list[dict[str, Any]]:
        """Return placeholder weather entries for each city on a route."""
        return [self.get_weather_for_city(city) for city in cities]
