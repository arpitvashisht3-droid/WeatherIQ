#include "Weather.h"
#include "Config.h"

#include <iostream>
#include <fstream>
#include <sstream>
#include <cstdlib>
#include <cstdio>
#include <cmath>

using namespace std;

extern bool g_debugMode;

static string readOpenWeatherApiKey() {
    const char* key = getenv("OPENWEATHERMAP_API_KEY");
    if (key != NULL && string(key).size() > 0) {
        return string(key);
    }
    return "";
}

static string httpGetWeather(const string& url) {
    string command =
        "curl -s -S --fail -G \"" + url + "\" "
        "2>/tmp/weatheriq_owm_err.txt";

    FILE* pipe = popen(command.c_str(), "r");
    if (pipe == NULL) {
        return "";
    }

    string response;
    char buffer[512];
    while (fgets(buffer, sizeof(buffer), pipe) != NULL) {
        response += buffer;
    }

    int status = pclose(pipe);
    if (status != 0) {
        return "";
    }
    return response;
}

/*
 * Extract the first JSON string value for a key, e.g. "main":"Clear".
 */
static string parseJsonStringField(const string& json, const string& key) {
    string pattern = "\"" + key + "\"";
    size_t keyPos = json.find(pattern);
    if (keyPos == string::npos) {
        return "";
    }

    size_t colon = json.find(':', keyPos + pattern.size());
    if (colon == string::npos) {
        return "";
    }

    size_t quoteStart = json.find('"', colon + 1);
    if (quoteStart == string::npos) {
        return "";
    }

    size_t quoteEnd = json.find('"', quoteStart + 1);
    if (quoteEnd == string::npos) {
        return "";
    }

    return json.substr(quoteStart + 1, quoteEnd - quoteStart - 1);
}

static bool parseJsonNumberField(const string& json, const string& key, double& valueOut) {
    string pattern = "\"" + key + "\"";
    size_t keyPos = json.find(pattern);
    if (keyPos == string::npos) {
        return false;
    }

    size_t colon = json.find(':', keyPos + pattern.size());
    if (colon == string::npos) {
        return false;
    }

    size_t numStart = colon + 1;
    while (numStart < json.size() &&
           (json[numStart] == ' ' || json[numStart] == '\t')) {
        numStart++;
    }

    size_t numEnd = numStart;
    while (numEnd < json.size()) {
        char ch = json[numEnd];
        if ((ch >= '0' && ch <= '9') || ch == '.' || ch == '-' ||
            ch == '+' || ch == 'e' || ch == 'E') {
            numEnd++;
        } else {
            break;
        }
    }

    if (numEnd <= numStart) {
        return false;
    }

    stringstream ss(json.substr(numStart, numEnd - numStart));
    return (bool)(ss >> valueOut);
}

/*
 * Map OpenWeatherMap condition + temperature to WeatherIQ labels
 * used by getWeatherPenalty().
 */
static string mapOpenWeatherToCondition(string owmMain, double tempC, double windSpeed) {
    if (tempC >= 35.0) {
        return "Hot";
    }
    if (owmMain == "Thunderstorm") {
        return "Stormy";
    }
    if (owmMain == "Rain" || owmMain == "Drizzle") {
        return "Rainy";
    }
    if (owmMain == "Clear") {
        return "Sunny";
    }
    if (owmMain == "Clouds") {
        return "Cloudy";
    }
    if (owmMain == "Mist" || owmMain == "Fog" || owmMain == "Haze" ||
        owmMain == "Smoke" || owmMain == "Dust" || owmMain == "Sand") {
        return "Cloudy";
    }
    if (windSpeed >= 10.0) {
        return "Windy";
    }
    return "Cloudy";
}

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
    if (condition == "Unknown") {
        return true;
    }
    return false;
}

string Weather::describe(string condition) {
    return condition;
}

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

int Weather::getRoadCost(int distance, string condition) {
    return distance + getWeatherPenalty(condition);
}

bool Weather::isApiConfigured() {
    return !readOpenWeatherApiKey().empty();
}

WeatherQueryResult Weather::fetchConditionAt(double latitude, double longitude) {
    string apiKey = readOpenWeatherApiKey();
    if (apiKey.empty()) {
        cout << "Weather: OPENWEATHERMAP_API_KEY not set; returning Unknown for edge."
             << endl;
        return {"Unknown", 0.0};
    }

    ostringstream url;
    url.setf(ios::fixed);
    url.precision(4);
    url << Config::OWM_WEATHER_URL
        << "?lat=" << latitude
        << "&lon=" << longitude
        << "&units=metric"
        << "&appid=" << apiKey;

    string response = httpGetWeather(url.str());
    if (response.empty()) {
        cout << "Weather: API request failed at (" << latitude << ", " << longitude
             << "); returning Unknown." << endl;
        return {"Unknown", 0.0};
    }

    // weather[0].main holds the broad condition (Rain, Clear, Clouds, ...)
    string owmMain;
    size_t weatherPos = response.find("\"weather\"");
    if (weatherPos != string::npos) {
        string weatherBlock = response.substr(weatherPos, 250);
        owmMain = parseJsonStringField(weatherBlock, "main");
    }

    double tempC = 20.0;
    double windSpeed = 0.0;
    parseJsonNumberField(response, "temp", tempC);

    size_t windPos = response.find("\"wind\"");
    if (windPos != string::npos) {
        size_t speedPos = response.find("\"speed\"", windPos);
        if (speedPos != string::npos) {
            size_t colon = response.find(':', speedPos);
            stringstream ss(response.substr(colon + 1, 12));
            ss >> windSpeed;
        }
    }

    if (owmMain.empty()) {
        return {"Unknown", tempC};
    }

    string condition = mapOpenWeatherToCondition(owmMain, tempC, windSpeed);
    if (g_debugMode) {
        cout << "Weather: (" << latitude << ", " << longitude << ") OWM="
             << owmMain << " temp=" << tempC << "C -> " << condition << endl;
    }
    return {condition, tempC};
}
