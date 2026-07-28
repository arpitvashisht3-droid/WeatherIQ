#ifndef CONFIG_H
#define CONFIG_H

/*
 * Project-wide path and API defaults.
 * Paths are relative to the project root (WeatherIQ/).
 */
namespace Config {
    // Local city cache (optional; geocoding fills gaps)
    const char* const DEFAULT_CITIES_CSV = "data/cities.csv";

    // Legacy static routes file (CsvRouteProvider fallback only)
    const char* const DEFAULT_ROUTES_CSV = "data/routes.csv";

    // OpenRouteService endpoints
    const char* const ORS_DIRECTIONS_URL =
        "https://api.openrouteservice.org/v2/directions/driving-car";
    const char* const ORS_GEOCODE_URL =
        "https://api.openrouteservice.org/geocode/search";

    // OpenWeatherMap current weather API (lat/lon lookup)
    const char* const OWM_WEATHER_URL =
        "https://api.openweathermap.org/data/2.5/weather";
}

#endif
