#include "GraphBuilder.h"

#include <iostream>
#include <vector>
#include "RouteRecord.h"

using namespace std;

extern bool g_debugMode;

bool GraphBuilder::build(Graph& graph, RouteProvider& provider) {
    vector<RouteRecord> routes;

    if (!provider.fetchRoutes(routes)) {
        cout << "GraphBuilder: failed to fetch routes from "
             << provider.sourceName() << "." << endl;
        return false;
    }

    if (routes.empty()) {
        cout << "GraphBuilder: provider returned no routes." << endl;
        return false;
    }

    if (g_debugMode) {
        cout << "GraphBuilder: building graph from " << provider.sourceName()
             << " (" << routes.size() << " route(s))..." << endl;
    }

    for (int i = 0; i < (int)routes.size(); i++) {
        RouteRecord route = routes[i];

        // Ensure both cities exist before linking them
        if (!graph.hasCity(route.fromCity)) {
            graph.addCity(route.fromCity);
        }
        if (!graph.hasCity(route.toCity)) {
            graph.addCity(route.toCity);
        }

        graph.addRoad(route.fromCity, route.toCity, route.distanceKm, route.weather, route.temperatureC);
    }

    if (g_debugMode) cout << "GraphBuilder: graph build complete." << endl;
    return true;
}
