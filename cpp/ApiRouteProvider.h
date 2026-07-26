#ifndef API_ROUTE_PROVIDER_H
#define API_ROUTE_PROVIDER_H

#include <string>
#include <vector>
#include <utility>
#include <unordered_map>
#include "RouteProvider.h"

/*
 * ApiRouteProvider: loads roads by calling the OpenRouteService Directions API.
 *
 * For each city pair listed in routes.csv, looks up coordinates in cities.csv,
 * requests driving distance from ORS, and builds a RouteRecord:
 *   fromCity, toCity, distanceKm (from ORS), weather (from routes.csv)
 *
 * API key must come from the environment (never hardcode it):
 *   OPENROUTESERVICE_API_KEY  (preferred)
 *   or ORS_API_KEY
 */
class ApiRouteProvider : public RouteProvider {
private:
    std::string endpointUrl_;
    std::string citiesCsvPath_;
    std::string routesCsvPath_;

    // Read API key from environment variables
    static std::string readApiKeyFromEnv();

    // Small string helpers
    static std::string trim(std::string text);
    static std::string toLowerCopy(std::string text);

    // Load city -> (latitude, longitude) from cities.csv
    bool loadCityCoordinates(
        std::unordered_map<std::string, std::pair<double, double> >& outCoords) const;

    // One planned road: names + weather (distance comes from ORS)
    struct RoutePair {
        std::string fromCity;
        std::string toCity;
        std::string weather;
    };

    // Load city pairs and weather labels from routes.csv
    bool loadRoutePairs(std::vector<RoutePair>& outPairs) const;

    // Case-insensitive lookup of coordinates for a city name
    static bool findCoordinates(
        const std::unordered_map<std::string, std::pair<double, double> >& coords,
        const std::string& city,
        double& latitude,
        double& longitude);

    // POST one directions request; distanceKmOut is rounded kilometers
    bool fetchDistanceKm(
        double fromLon,
        double fromLat,
        double toLon,
        double toLat,
        int& distanceKmOut) const;

    // Parse meters from ORS JSON: routes[0].summary.distance
    static bool parseDistanceMeters(const std::string& json, double& metersOut);

    // HTTP POST via curl; returns response body (empty on failure)
    static std::string httpPostJson(
        const std::string& url,
        const std::string& jsonBody,
        const std::string& apiKey);

public:
    /*
     * endpointUrl: ORS directions URL, e.g.
     *   https://api.openrouteservice.org/v2/directions/driving-car
     * Optional CSV paths default to Config project paths when left empty.
     */
    explicit ApiRouteProvider(std::string endpointUrl);
    ApiRouteProvider(std::string endpointUrl,
                     std::string citiesCsvPath,
                     std::string routesCsvPath);

    std::string sourceName() const;
    bool fetchRoutes(std::vector<RouteRecord>& outRoutes);
};

#endif
