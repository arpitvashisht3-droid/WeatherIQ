#ifndef CONFIG_H
#define CONFIG_H

/*
 * Project-wide path defaults.
 * Keep file locations here so main (and future tools) do not hardcode paths.
 *
 * Paths are relative to the project root (WeatherIQ/), where the executable
 * is expected to be run from.
 */
namespace Config {
    // Default route data used by CsvRouteProvider
    const char* const DEFAULT_ROUTES_CSV = "data/routes.csv";

    // Default city coordinates used by CsvCityProvider
    const char* const DEFAULT_CITIES_CSV = "data/cities.csv";
}

#endif
