#ifndef GRAPH_BUILDER_H
#define GRAPH_BUILDER_H

#include "Graph.h"
#include "RouteProvider.h"

/*
 * GraphBuilder: turns RouteRecord lists into a Graph.
 *
 * Owns the "how do we fill the adjacency list?" logic.
 * Does not care whether records came from CSV, API, or tests.
 */
class GraphBuilder {
public:
    /*
     * Fetch routes from the provider and add them to graph.
     * Returns true if fetch succeeded and at least one route was added.
     */
    static bool build(Graph& graph, RouteProvider& provider);
};

#endif
