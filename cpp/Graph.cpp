#include "Graph.h"
#include <iostream>
#include <cctype>

using namespace std;

extern bool g_debugMode;

// Remove spaces at the start and end of a string
static string trimText(string text) {
    int start = 0;
    while (start < (int)text.size() && text[start] == ' ') {
        start++;
    }

    int end = (int)text.size() - 1;
    while (end >= start && text[end] == ' ') {
        end--;
    }

    if (end < start) {
        return "";
    }
    return text.substr(start, end - start + 1);
}

// Convert a string to lowercase for case-insensitive comparison
static string toLowerCopy(string text) {
    for (int i = 0; i < (int)text.size(); i++) {
        text[i] = (char)tolower((unsigned char)text[i]);
    }
    return text;
}

// Add a new city to the graph (no roads yet)
void Graph::addCity(string city) {
    if (adjList.find(city) == adjList.end()) {
        adjList[city] = vector<Road>();
        if (g_debugMode) cout << "Added city: " << city << endl;
    } else {
        if (g_debugMode) cout << "City already exists: " << city << endl;
    }
}

// Add a two-way road between city1 and city2 with distance and weather
void Graph::addRoad(string city1, string city2, int distance, string weather) {
    if (adjList.find(city1) == adjList.end()) {
        cout << "Error: " << city1 << " is not in the graph. Add it first." << endl;
        return;
    }
    if (adjList.find(city2) == adjList.end()) {
        cout << "Error: " << city2 << " is not in the graph. Add it first." << endl;
        return;
    }

    Road roadToCity2;
    roadToCity2.destination = city2;
    roadToCity2.distance = distance;
    roadToCity2.weather = weather;
    adjList[city1].push_back(roadToCity2);

    Road roadToCity1;
    roadToCity1.destination = city1;
    roadToCity1.distance = distance;
    roadToCity1.weather = weather;
    adjList[city2].push_back(roadToCity1);

    if (g_debugMode) {
        cout << "Added road: " << city1 << " <-> " << city2
             << " (" << distance << " km, " << weather << ")" << endl;
    }
}

// Print every city and the roads connected to it
void Graph::displayGraph() {
    cout << "\n=== Weather Route Planner - Graph ===" << endl;

    for (auto entry : adjList) {
        string city = entry.first;
        vector<Road> roads = entry.second;

        cout << city << " -> ";

        if (roads.empty()) {
            cout << "(no roads)";
        } else {
            for (int i = 0; i < (int)roads.size(); i++) {
                cout << roads[i].destination << " ("
                     << roads[i].distance << " km, "
                     << roads[i].weather << ")";

                if (i < (int)roads.size() - 1) {
                    cout << ", ";
                }
            }
        }
        cout << endl;
    }
    cout << "=====================================\n" << endl;
}

bool Graph::hasCity(string city) {
    return adjList.find(city) != adjList.end();
}

vector<Road> Graph::getRoads(string city) {
    if (adjList.find(city) == adjList.end()) {
        return vector<Road>();
    }
    return adjList[city];
}

/*
 * Find a city in the graph using case-insensitive comparison.
 * Returns the original graph spelling so A* output stays unchanged.
 */
string Graph::resolveCityName(string userInput) {
    string normalizedInput = toLowerCopy(trimText(userInput));

    if (normalizedInput.empty()) {
        return "";
    }

    for (auto entry : adjList) {
        string storedCity = entry.first;
        if (toLowerCopy(storedCity) == normalizedInput) {
            return storedCity;
        }
    }

    return "";
}
