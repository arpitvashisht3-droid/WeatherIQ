#ifndef CITY_PROVIDER_H
#define CITY_PROVIDER_H

#include <string>
#include <vector>
#include "CityRecord.h"

/*
 * CityProvider: abstract interface for city + coordinate data sources.
 *
 * Parallel to RouteProvider. Swap CsvCityProvider for an API geocoder
 * later without changing CityCoordinateStore or the route planner core.
 */
class CityProvider {
public:
    virtual ~CityProvider() {}

    virtual std::string sourceName() const = 0;

    /*
     * Fetch all city coordinates into outCities.
     * Returns true on success, false if the source could not be read.
     */
    virtual bool fetchCities(std::vector<CityRecord>& outCities) = 0;
};

#endif
