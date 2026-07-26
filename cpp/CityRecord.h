#ifndef CITY_RECORD_H
#define CITY_RECORD_H

#include <string>

/*
 * CityRecord: one city with geographic coordinates.
 *
 * Used by coordinate loaders today (CSV) and later by geocoding APIs
 * such as OpenRouteService, where a city name is turned into lat/lon.
 */
struct CityRecord {
    std::string city;     // city name (display spelling)
    double latitude;      // degrees north/south
    double longitude;     // degrees east/west
};

#endif
