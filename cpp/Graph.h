#ifndef GRAPH_H
#define GRAPH_H

#include <string>
#include <vector>
#include <unordered_map>

#include <limits>

/*
 * Road: one connection from a city to another.
 * Holds destination, distance, and weather on that road.
 */
struct Road {
    std::string destination;  // city this road leads to
    int distance;             // length of the road in km
    std::string weather;      // weather along this road (e.g. "Sunny", "Rainy")
    double temperatureC = std::numeric_limits<double>::quiet_NaN();
};

/*
 * Graph: adjacency-list storage only.
 * Data loading belongs to RouteProvider + GraphBuilder, not this class.
 */
class Graph {
private:
    // Key = city name, Value = list of roads leaving that city
    std::unordered_map<std::string, std::vector<Road> > adjList;

public:
    // Add a new city (no roads yet)
    void addCity(std::string city);

    // Add a two-way road with distance, weather and temperature
    void addRoad(std::string city1, std::string city2, int distance, std::string weather, double temperatureC = std::numeric_limits<double>::quiet_NaN());

    // Print every city and its roads
    void displayGraph();

    // Return true if the city exists in the graph
    bool hasCity(std::string city);

    // Return all roads leaving a city (used by A*)
    std::vector<Road> getRoads(std::string city);

    /*
     * Match user input to a city already in the graph, ignoring letter case.
     * Returns the city name exactly as stored in the graph (for display/A*).
     * Returns "" if no match is found.
     */
    std::string resolveCityName(std::string userInput);
};

#endif
