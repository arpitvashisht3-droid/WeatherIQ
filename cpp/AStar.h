#ifndef ASTAR_H
#define ASTAR_H

#include <string>
#include <vector>
#include "Graph.h"

/*
 * A* pathfinding for the weather-aware route planner.
 *
 * Edge cost = distance + Weather::getWeatherPenalty(weather).
 */

// Estimate of remaining cost from city to goal (currently always 0)
int heuristic(std::string city, std::string goal);

// Find the best route from start to goal. Returns empty vector if none.
std::vector<std::string> aStarSearch(Graph& graph, std::string start, std::string goal);

// Print route, distance, weather penalty, and final cost
void printPath(Graph& graph, std::vector<std::string> path);

#endif
