#ifndef CITY_COORDINATE_STORE_H
#define CITY_COORDINATE_STORE_H

#include <string>
#include <unordered_map>
#include "CityProvider.h"
#include "CityRecord.h"

/*
 * CityCoordinateStore: in-memory lookup of city -> (latitude, longitude).
 *
 * Separate from Graph so routing logic stays unchanged.
 * Future OpenRouteService flow:
 *   1) resolve city name -> coordinates (this store / geocoder)
 *   2) request real road geometry / distance from the API
 */
class CityCoordinateStore {
private:
    // city name (as loaded) -> full CityRecord
    std::unordered_map<std::string, CityRecord> coordinates_;

public:
    // Load all cities from a CityProvider (CSV today, API later)
    bool loadFromProvider(CityProvider& provider);

    // True if we have coordinates for this exact city name
    bool hasCity(std::string city) const;

    // Case-insensitive match; returns stored city spelling, or ""
    std::string resolveCityName(std::string userInput) const;

    // Return coordinates for a stored city name; false if missing
    bool getCoordinates(std::string city, double& latitude, double& longitude) const;

    // Add or update a city in the in-memory cache (e.g. after geocoding)
    void putCity(std::string city, double latitude, double longitude);

    // Print loaded cities and coordinates
    void displayCities() const;

    // How many cities are stored
    int size() const;
};

#endif
