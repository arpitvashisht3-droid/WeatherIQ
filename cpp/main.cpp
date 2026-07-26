#include <iostream>
#include <string>
#include <vector>

#include "Graph.h"
#include "AStar.h"
#include "ApiRouteProvider.h"
#include "CsvRouteProvider.h"
#include "GraphBuilder.h"
#include "CsvCityProvider.h"
#include "CityCoordinateStore.h"
#include "Config.h"

using namespace std;

/*
 * main: load city coordinates, build the graph from OpenRouteService
 * (CSV fallback), then run weather-aware A*.
 *
 * Run from the project root so Config paths resolve correctly.
 * Set OPENROUTESERVICE_API_KEY (or ORS_API_KEY) for live ORS distances.
 */
int main() {
    // ----- City coordinates (separate from Graph / A*) -----
    CityCoordinateStore cityCoords;
    CsvCityProvider cityProvider(Config::DEFAULT_CITIES_CSV);
    if (!cityCoords.loadFromProvider(cityProvider)) {
        cout << "Failed to load city coordinates." << endl;
        return 1;
    }
    cityCoords.displayCities();

    // ----- Build route graph: OpenRouteService first, CSV fallback -----
    Graph weatherMap;

    const string orsEndpoint =
        "https://api.openrouteservice.org/v2/directions/driving-car";
    ApiRouteProvider apiProvider(orsEndpoint);

    cout << "Trying OpenRouteService for route distances..." << endl;
    bool graphReady = GraphBuilder::build(weatherMap, apiProvider);

    if (!graphReady) {
        cout << "OpenRouteService unavailable. Falling back to CsvRouteProvider ("
             << Config::DEFAULT_ROUTES_CSV << ")..." << endl;

        CsvRouteProvider csvProvider(Config::DEFAULT_ROUTES_CSV);
        graphReady = GraphBuilder::build(weatherMap, csvProvider);
    }

    if (!graphReady) {
        cout << "Failed to build graph from OpenRouteService and CSV fallback." << endl;
        return 1;
    }

    weatherMap.displayGraph();

    string startInput;
    string goalInput;

    cout << "Enter starting city: ";
    getline(cin, startInput);

    cout << "Enter destination city: ";
    getline(cin, goalInput);

    string startCity = weatherMap.resolveCityName(startInput);
    string goalCity = weatherMap.resolveCityName(goalInput);

    if (startCity.empty()) {
        cout << "Error: starting city \"" << startInput << "\" was not found in the graph." << endl;
        return 1;
    }
    if (goalCity.empty()) {
        cout << "Error: destination city \"" << goalInput << "\" was not found in the graph." << endl;
        return 1;
    }

    double startLat = 0.0;
    double startLon = 0.0;
    double goalLat = 0.0;
    double goalLon = 0.0;

    if (cityCoords.getCoordinates(startCity, startLat, startLon)) {
        cout << "Start coordinates: " << startCity
             << " (" << startLat << ", " << startLon << ")" << endl;
    } else {
        cout << "Warning: no coordinates loaded for " << startCity << endl;
    }

    if (cityCoords.getCoordinates(goalCity, goalLat, goalLon)) {
        cout << "Goal coordinates: " << goalCity
             << " (" << goalLat << ", " << goalLon << ")" << endl;
    } else {
        cout << "Warning: no coordinates loaded for " << goalCity << endl;
    }

    vector<string> path = aStarSearch(weatherMap, startCity, goalCity);
    printPath(weatherMap, path);

    return 0;
}
