#ifndef ROUTE_RECORD_H
#define ROUTE_RECORD_H

#include <string>

#include <limits>

/*
 * RouteRecord: one road between two cities, independent of how we fetched it.
 *
 * This is the shared data shape for CSV files, future HTTP APIs, databases, etc.
 * Graph and A* never need to know where a RouteRecord came from.
 */
struct RouteRecord {
    std::string fromCity;     // starting city for this road
    std::string toCity;       // destination city
    int distanceKm;           // length in kilometers
    std::string weather;      // weather condition on this road
    double temperatureC = std::numeric_limits<double>::quiet_NaN();
};

#endif
