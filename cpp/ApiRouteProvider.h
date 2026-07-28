#ifndef API_ROUTE_PROVIDER_H
#define API_ROUTE_PROVIDER_H

#include <string>
#include <vector>
#include "RouteProvider.h"

/*
 * ApiRouteProvider: fetches ONE driving route from OpenRouteService Directions API.
 *
 * Call setQuery() with resolved source/destination coordinates, then fetchRoutes().
 * Parses ORS segments into a chain of RouteRecord objects for GraphBuilder.
 *
 * Does NOT use routes.csv. No hardcoded roads.
 *
 * API key: OPENROUTESERVICE_API_KEY or ORS_API_KEY (environment only).
 */
class ApiRouteProvider : public RouteProvider {
private:
    std::string endpointUrl_;

    // Query set by main() after LocationResolver runs
    bool queryReady_;
    std::string sourceName_;
    std::string destName_;
    double sourceLat_;
    double sourceLon_;
    double destLat_;
    double destLon_;

    static std::string readApiKeyFromEnv();
    static std::string trim(std::string text);
    static int metersToKm(double meters);

    static std::string httpPostJson(const std::string& url,
                                    const std::string& jsonBody,
                                    const std::string& apiKey);

    // Parse ORS directions JSON into segment distances (meters)
    static bool parseSegmentDistances(const std::string& json,
                                      std::vector<double>& segmentMetersOut);

    bool fetchDirectionsJson(std::string& jsonOut) const;
    bool buildRecordsFromSegments(const std::vector<double>& segmentMeters,
                                  std::vector<RouteRecord>& outRoutes) const;

public:
    explicit ApiRouteProvider(std::string endpointUrl);

    /*
     * Set the trip to fetch before calling fetchRoutes().
     * Coordinates come from LocationResolver (cache or geocoding).
     */
    void setQuery(std::string sourceName,
                  double sourceLat,
                  double sourceLon,
                  std::string destName,
                  double destLat,
                  double destLon);

    std::string sourceName() const;
    bool fetchRoutes(std::vector<RouteRecord>& outRoutes);
};

#endif
