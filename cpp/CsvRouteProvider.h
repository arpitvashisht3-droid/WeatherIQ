#ifndef CSV_ROUTE_PROVIDER_H
#define CSV_ROUTE_PROVIDER_H

#include <string>
#include <vector>
#include "RouteProvider.h"

/*
 * CsvRouteProvider: reads routes from a local CSV file.
 *
 * Expected columns: city,destination,distance_km,weather
 * This keeps file I/O out of Graph so Graph stays a pure data structure.
 */
class CsvRouteProvider : public RouteProvider {
private:
    std::string filename_;

public:
    explicit CsvRouteProvider(std::string filename);

    std::string sourceName() const;
    bool fetchRoutes(std::vector<RouteRecord>& outRoutes);
};

#endif
