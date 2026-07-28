#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <cstdlib>   // setenv

/*
 * loadDotEnv: reads KEY=VALUE pairs from a .env file and injects them into
 * the process environment with setenv(..., overwrite=0), meaning an already-
 * exported shell variable always takes precedence.
 * Lines starting with '#' and blank lines are skipped.
 */
static void loadDotEnv(const std::string& path) {
    std::ifstream file(path.c_str());
    if (!file.is_open()) {
        return;  // file absent — silent, not an error
    }
    std::string line;
    while (std::getline(file, line)) {
        // Strip leading whitespace
        size_t start = line.find_first_not_of(" \t\r");
        if (start == std::string::npos) continue;
        line = line.substr(start);

        if (line.empty() || line[0] == '#') continue;

        size_t eq = line.find('=');
        if (eq == std::string::npos) continue;

        std::string key   = line.substr(0, eq);
        std::string value = line.substr(eq + 1);

        // Trim trailing whitespace / carriage return from value
        size_t end = value.find_last_not_of(" \t\r");
        if (end != std::string::npos) {
            value = value.substr(0, end + 1);
        } else {
            value.clear();
        }

        if (key.empty()) continue;

        // overwrite=0: do NOT override a variable already set in the shell
        setenv(key.c_str(), value.c_str(), 0);
    }
}

#include "Graph.h"
#include "AStar.h"
#include "ApiRouteProvider.h"
#include "GraphBuilder.h"
#include "CsvCityProvider.h"
#include "CityCoordinateStore.h"
#include "LocationResolver.h"
#include "Config.h"

using namespace std;

// ---------------------------------------------------------------------------
// Debug flag: set DEBUG_MODE=1 in the environment to enable verbose logs.
// ---------------------------------------------------------------------------
bool g_debugMode = false;

static int weatherSeverity(const string& w) {
    if (w == "Stormy") return 5;
    if (w == "Rainy")  return 4;
    if (w == "Hot")    return 3;
    if (w == "Windy")  return 2;
    if (w == "Cloudy") return 1;
    if (w == "Sunny")  return 0;
    return -1;
}

static string weatherRisk(const string& w) {
    if (w == "Stormy")                               return "High";
    if (w == "Rainy" || w == "Windy" || w == "Hot") return "Moderate";
    return "Low";
}

static string weatherAdvice(const string& w) {
    if (w == "Sunny")  return "Great time to travel.";
    if (w == "Cloudy") return "Normal driving conditions.";
    if (w == "Windy")  return "Drive carefully in open areas.";
    if (w == "Hot")    return "Stay hydrated and avoid peak afternoon travel if possible.";
    if (w == "Rainy")  return "Carry rain gear and expect slower traffic.";
    if (w == "Stormy") return "Consider postponing your journey.";
    return "Check local conditions before departure.";
}

static void printUserFriendlyRoute(Graph& graph, const vector<string>& path) {
    if (path.empty()) {
        cout << "\nNo route could be found. Please try a different destination." << endl;
        return;
    }

    int totalDistance = 0;
    string worstWeather = "Sunny";
    int worstSeverity   = -1;

    for (int i = 0; i < (int)path.size() - 1; i++) {
        vector<Road> roads = graph.getRoads(path[i]);
        for (int j = 0; j < (int)roads.size(); j++) {
            if (roads[j].destination == path[i + 1]) {
                totalDistance += roads[j].distance;
                int sev = weatherSeverity(roads[j].weather);
                if (sev > worstSeverity) {
                    worstSeverity = sev;
                    worstWeather  = roads[j].weather;
                }
                break;
            }
        }
    }

    cout << "\n============================================" << endl;
    cout << "            Recommended Route" << endl;
    cout << "============================================" << endl;
    cout << "\n  Route            : " << path.front() << " -> " << path.back() << endl;
    cout << "  Distance         : " << totalDistance << " km" << endl;
    cout << "  Expected Weather : " << worstWeather << endl;
    cout << "  Travel Risk      : " << weatherRisk(worstWeather) << endl;
    cout << "  Recommendation   : " << weatherAdvice(worstWeather) << endl;
    cout << "\n  Why this route?  : This route is currently recommended" << endl;
    cout << "                     based on live weather conditions." << endl;
    cout << "\n============================================\n" << endl;
}

/*
 * main: India-scale dynamic routing.
 *
 * 1) Load cities.csv as optional local cache
 * 2) User enters source and destination (any Indian place)
 * 3) LocationResolver: cache or ORS geocoding
 * 4) ApiRouteProvider: ORS directions -> segment RouteRecords
 * 5) GraphBuilder -> in-memory Graph
 * 6) A* weather-aware pathfinding
 *
 * Set OPENROUTESERVICE_API_KEY (or ORS_API_KEY). Run from project root.
 */
int main() {
    // ----- Load API keys from .env at project root -----
    loadDotEnv(".env");

    // Debug mode: export DEBUG_MODE=1 before running to see internal logs.
    const char* dbgEnv = getenv("DEBUG_MODE");
    g_debugMode = (dbgEnv != nullptr && string(dbgEnv) == "1");

    // ----- Optional local city cache (not required for every place) -----
    CityCoordinateStore cityCoords;
    CsvCityProvider cityProvider(Config::DEFAULT_CITIES_CSV);
    if (!cityCoords.loadFromProvider(cityProvider)) {
        if (g_debugMode)
            cout << "Note: local city cache not loaded; geocoding will resolve all places." << endl;
    } else {
        if (g_debugMode)
            cout << "Loaded " << cityCoords.size()
                 << " cached city coordinate(s) from " << Config::DEFAULT_CITIES_CSV << "." << endl;
    }

    // ----- User query -----
    string startInput;
    string goalInput;

    cout << "Enter starting city: ";
    getline(cin, startInput);

    cout << "Enter destination city: ";
    getline(cin, goalInput);

    LocationResolver resolver(cityCoords);

    ResolvedPlace startPlace;
    ResolvedPlace goalPlace;

    if (!resolver.resolve(startInput, startPlace)) {
        cout << "Error: could not resolve starting location \"" << startInput << "\"."
             << endl;
        return 1;
    }
    if (!resolver.resolve(goalInput, goalPlace)) {
        cout << "Error: could not resolve destination \"" << goalInput << "\"."
             << endl;
        return 1;
    }

    if (g_debugMode) {
        cout << "Start: " << startPlace.name
             << " (" << startPlace.latitude << ", " << startPlace.longitude << ")"
             << (startPlace.fromLocalCache ? " [cache]" : " [geocoded]") << endl;
        cout << "Goal: " << goalPlace.name
             << " (" << goalPlace.latitude << ", " << goalPlace.longitude << ")"
             << (goalPlace.fromLocalCache ? " [cache]" : " [geocoded]") << endl;
    } else {
        cout << "\nPlanning route: " << startPlace.name << " -> " << goalPlace.name
             << "  (fetching live route and weather...)" << endl;
    }

    // ----- Build graph dynamically from ORS directions -----
    Graph weatherMap;
    ApiRouteProvider routeProvider(Config::ORS_DIRECTIONS_URL);
    routeProvider.setQuery(
        startPlace.name,
        startPlace.latitude,
        startPlace.longitude,
        goalPlace.name,
        goalPlace.latitude,
        goalPlace.longitude);

    if (!GraphBuilder::build(weatherMap, routeProvider)) {
        cout << "Failed to build dynamic graph from OpenRouteService." << endl;
        return 1;
    }

    if (g_debugMode) {
        weatherMap.displayGraph();
    }

    // Resolve names as stored in the graph (case-insensitive)
    string startCity = weatherMap.resolveCityName(startPlace.name);
    string goalCity = weatherMap.resolveCityName(goalPlace.name);

    if (startCity.empty()) {
        startCity = startPlace.name;
    }
    if (goalCity.empty()) {
        goalCity = goalPlace.name;
    }

    vector<string> path = aStarSearch(weatherMap, startCity, goalCity);
    if (g_debugMode) {
        printPath(weatherMap, path);
    } else {
        printUserFriendlyRoute(weatherMap, path);
    }

    return 0;
}
