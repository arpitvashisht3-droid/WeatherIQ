#include "AStar.h"
#include "Weather.h"

#include <algorithm>
#include <iostream>
#include <limits>
#include <queue>
#include <unordered_map>

using namespace std;

extern bool g_debugMode;

/*
 * AStarNode: one entry in the priority queue.
 *
 * f = g + h
 *   g = real cost from the start so far
 *   h = estimated cost still left to the goal (heuristic)
 *   f = total estimated cost of the path through this city
 *
 * A* always expands the city with the smallest f first.
 */
struct AStarNode {
  string city; // which city this node represents
  int g;       // cost from start to this city
  int f;       // g + heuristic
};

/*
 * CompareAStarNode: tells the priority queue to put smaller f on top.
 *
 * priority_queue in C++ is a MAX-heap by default (largest on top).
 * For A* we need a MIN-heap (smallest f on top), so we reverse the order:
 * "a has lower priority than b" when a.f > b.f
 */
struct CompareAStarNode {
  bool operator()(AStarNode a, AStarNode b) {
    return a.f > b.f; // higher f => lower priority
  }
};

/*
 * heuristic: estimate of remaining cost from city to goal.
 *
 * For now we return 0 for every city.
 * That is still a valid (admissible) heuristic, and A* behaves like Dijkstra:
 * it finds the shortest path using only real road costs.
 */
int heuristic(string city, string goal) {
  if (city == goal) {
    return 0;
  }
  return 0; // no estimate yet -> use measured cost only
}

/*
 * reconstructPath: walk backwards from goal to start using cameFrom,
 * then reverse the list so the path reads start -> ... -> goal.
 * (Helper used only inside this file.)
 */
static vector<string> reconstructPath(unordered_map<string, string> cameFrom,
                                      string current) {
  vector<string> path;
  path.push_back(current);

  // Keep stepping to the previous city until we reach the start
  // (the start city has no entry in cameFrom)
  while (cameFrom.find(current) != cameFrom.end()) {
    current = cameFrom[current];
    path.push_back(current);
  }

  // Path was built backwards, so reverse it
  reverse(path.begin(), path.end());
  return path;
}

/*
 * aStarSearch: find the best route from start to goal.
 *
 * Cost per edge: distance + getWeatherPenalty(weather).
 * Returns the list of city names on the best path, or empty if none.
 */
vector<string> aStarSearch(Graph &graph, string start, string goal) {
  // Check that both cities exist
  if (!graph.hasCity(start) || !graph.hasCity(goal)) {
    cout << "Error: start or goal city is not in the graph." << endl;
    return vector<string>();
  }

  // Same city: path is just that one city
  if (start == goal) {
    vector<string> single;
    single.push_back(start);
    return single;
  }

  // openSet: cities we still want to explore, ordered by smallest f
  priority_queue<AStarNode, vector<AStarNode>, CompareAStarNode> openSet;

  // cameFrom[city] = previous city on the best path found so far
  unordered_map<string, string> cameFrom;

  // gScore[city] = best (smallest) cost from start to city found so far
  unordered_map<string, int> gScore;

  // Start with a very large "infinity" for unknown cities
  const int INF = numeric_limits<int>::max();

  // Cost from start to itself is 0
  gScore[start] = 0;

  // Put the start city into the priority queue
  AStarNode startNode;
  startNode.city = start;
  startNode.g = 0;
  startNode.f = 0 + heuristic(start, goal); // f = g + h
  openSet.push(startNode);

  if (g_debugMode) {
    cout << "\nRunning A* from " << start << " to " << goal << "..." << endl;
  }

  // Main A* loop: keep exploring until the queue is empty
  while (!openSet.empty()) {
    // Take the city with the smallest f value
    AStarNode current = openSet.top();
    openSet.pop();

    if (g_debugMode) {
      cout << "  Exploring: " << current.city << " (g=" << current.g
           << ", f=" << current.f << ")" << endl;
    }

    // If we reached the goal, rebuild and return the path
    if (current.city == goal) {
      if (g_debugMode)
        cout << "  Reached goal!" << endl;
      return reconstructPath(cameFrom, current.city);
    }

    // Skip outdated queue entries (same city may be pushed more than once)
    if (gScore.find(current.city) != gScore.end() &&
        current.g > gScore[current.city]) {
      continue;
    }

    // Look at every road leaving the current city
    vector<Road> roads = graph.getRoads(current.city);
    for (int i = 0; i < (int)roads.size(); i++) {
      string neighbor = roads[i].destination;

      // Weather-aware cost:
      // newCost = currentCost + edge.distance + getWeatherPenalty(edge.weather)
      int weatherPenalty = Weather::getWeatherPenalty(roads[i].weather);
      int roadCost = roads[i].distance + weatherPenalty;

      // tentativeG = cost from start -> current -> neighbor
      if (current.g == INF) {
        continue;
      }
      int tentativeG = current.g + roadCost;

      // If we have never seen this neighbor, treat old score as infinity
      int oldG = INF;
      if (gScore.find(neighbor) != gScore.end()) {
        oldG = gScore[neighbor];
      }

      // If this path to neighbor is better, record it
      if (tentativeG < oldG) {
        cameFrom[neighbor] = current.city;
        gScore[neighbor] = tentativeG;

        AStarNode nextNode;
        nextNode.city = neighbor;
        nextNode.g = tentativeG;
        nextNode.f = tentativeG + heuristic(neighbor, goal);
        openSet.push(nextNode);

        if (g_debugMode) {
          cout << "    Update path to " << neighbor << " via " << current.city
               << " (g=" << tentativeG << ", f=" << nextNode.f << ")" << endl;
        }
      }
    }
  }

  // Queue empty and goal never reached => no route
  cout << "No path found from " << start << " to " << goal << "." << endl;
  return vector<string>();
}

// Print route, distance, weather penalty, and final weather-aware cost
void printPath(Graph &graph, vector<string> path) {
  if (path.empty()) {
    cout << "\nNo route to display.\n" << endl;
    return;
  }

  cout << "\n=== Best Weather-Aware Route ===" << endl;

  // Route taken: A -> B -> C
  cout << "Route taken: ";
  for (int i = 0; i < (int)path.size(); i++) {
    cout << path[i];
    if (i < (int)path.size() - 1) {
      cout << " -> ";
    }
  }
  cout << endl;

  // Walk each edge: show weather, and sum distance + penalties
  int totalDistance = 0;
  int totalWeatherPenalty = 0;

  cout << "Edges:" << endl;
  for (int i = 0; i < (int)path.size() - 1; i++) {
    string from = path[i];
    string to = path[i + 1];
    vector<Road> roads = graph.getRoads(from);

    // Find the road that goes from "from" to "to"
    for (int j = 0; j < (int)roads.size(); j++) {
      if (roads[j].destination == to) {
        int penalty = Weather::getWeatherPenalty(roads[j].weather);
        int edgeCost = roads[j].distance + penalty;

        totalDistance = totalDistance + roads[j].distance;
        totalWeatherPenalty = totalWeatherPenalty + penalty;

        cout << "  " << from << " -> " << to << ": " << roads[j].distance
             << " km"
             << ", weather = " << Weather::describe(roads[j].weather)
             << " (penalty " << penalty << ")";
        if (!std::isnan(roads[j].temperatureC)) {
          cout << ", temp = " << (int)round(roads[j].temperatureC) << " C";
        }
        cout << ", edge cost = " << edgeCost << endl;
        break;
      }
    }
  }

  int finalRouteCost = totalDistance + totalWeatherPenalty;

  cout << "Distance travelled: " << totalDistance << " km" << endl;
  cout << "Total weather penalty: " << totalWeatherPenalty << endl;
  cout << "Final route cost: " << finalRouteCost
       << " (distance + weather penalty)" << endl;
  cout << "================================\n" << endl;
}
