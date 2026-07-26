#include "Weather.h"

using namespace std;

// Return true if we recognize this weather name
bool Weather::isKnown(string condition) {
    if (condition == "Sunny") {
        return true;
    }
    if (condition == "Cloudy") {
        return true;
    }
    if (condition == "Rainy") {
        return true;
    }
    if (condition == "Windy") {
        return true;
    }
    if (condition == "Stormy") {
        return true;
    }
    if (condition == "Hot") {
        return true;
    }
    return false;
}

// Short text for printing a weather condition
string Weather::describe(string condition) {
    return condition;
}

/*
 * Weather penalty added on top of distance in A*.
 *
 * Sunny  = 0
 * Cloudy = 50
 * Hot    = 100
 * Rainy  = 300
 * Stormy = 1000
 *
 * Unknown conditions (e.g. Windy) get penalty 0.
 */
int Weather::getWeatherPenalty(string condition) {
    if (condition == "Sunny") {
        return 0;
    }
    if (condition == "Cloudy") {
        return 50;
    }
    if (condition == "Hot") {
        return 100;
    }
    if (condition == "Rainy") {
        return 300;
    }
    if (condition == "Stormy") {
        return 1000;
    }
    return 0;
}

// Full edge cost used by routing: distance + weather penalty
int Weather::getRoadCost(int distance, string condition) {
    return distance + getWeatherPenalty(condition);
}
