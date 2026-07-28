#ifndef WEATHER_H
#define WEATHER_H

#include <string>

/*
 * Weather: helpers for weather conditions on roads.
 * Used by A* so bad weather increases route cost.
 *
 * Live conditions come from OpenWeatherMap (OPENWEATHERMAP_API_KEY).
 */
class Weather {
public:
    // Return true if we recognize this weather name
    static bool isKnown(std::string condition);

    // Short text for printing a weather condition
    static std::string describe(std::string condition);

    // Extra cost added for this weather (higher = worse weather)
    static int getWeatherPenalty(std::string condition);

    // Full edge cost = distance + weather penalty
    static int getRoadCost(int distance, std::string condition);

    // True when OPENWEATHERMAP_API_KEY is set
    static bool isApiConfigured();

    /*
     * Fetch live weather at a coordinate and map it to a WeatherIQ label
     * (Sunny, Cloudy, Hot, Rainy, Stormy, Windy).
     * Returns "Cloudy" if the API is unavailable or the call fails.
     */
    static std::string fetchConditionAt(double latitude, double longitude);
};

#endif
