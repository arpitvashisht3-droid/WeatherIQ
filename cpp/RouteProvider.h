#ifndef ROUTE_PROVIDER_H
#define ROUTE_PROVIDER_H

#include <string>
#include <vector>
#include "RouteRecord.h"

/*
 * RouteProvider: abstract interface for any route data source.
 *
 * Graph building talks only to this interface.
 * Swap CsvRouteProvider for ApiRouteProvider (or another source) without
 * changing Graph, GraphBuilder, A*, or Weather.
 */
class RouteProvider {
public:
    // Virtual destructor is required for safe delete through a base pointer
    virtual ~RouteProvider() {}

    // Short name for logs (e.g. "CSV", "API")
    virtual std::string sourceName() const = 0;

    /*
     * Fetch all available routes into outRoutes.
     * Returns true on success, false if the source could not be read.
     * On failure, outRoutes should be left empty or partially filled is OK
     * as long as the caller checks the return value before building.
     */
    virtual bool fetchRoutes(std::vector<RouteRecord>& outRoutes) = 0;
};

#endif
