#ifndef LOCATION_RESOLVER_H
#define LOCATION_RESOLVER_H

#include <string>
#include "CityCoordinateStore.h"

/*
 * ResolvedPlace: one location after local cache lookup or ORS geocoding.
 */
struct ResolvedPlace {
    std::string name;       // canonical name used in the graph
    double latitude;
    double longitude;
    bool fromLocalCache;    // true if cities.csv had this place
};

/*
 * LocationResolver: turn any user-entered place name into coordinates.
 *
 * 1) Check CityCoordinateStore (cities.csv cache)
 * 2) If missing, call OpenRouteService Geocoding (India-bounded)
 *
 * Geocoded results are stored back into the cache for this session.
 */
class LocationResolver {
private:
    std::string geocodeUrl_;
    CityCoordinateStore* cityStore_;

    static std::string readApiKeyFromEnv();
    static std::string trim(std::string text);
    static std::string urlEncode(std::string text);
    static std::string httpGet(const std::string& url, const std::string& apiKey);
    static bool parseGeocodeResponse(const std::string& json,
                                     std::string& nameOut,
                                     double& latOut,
                                     double& lonOut);

public:
    explicit LocationResolver(CityCoordinateStore& cityStore);

    /*
     * Resolve userInput to coordinates.
     * Returns true on success; false if the place could not be found.
     */
    bool resolve(const std::string& userInput, ResolvedPlace& outPlace);
};

#endif
