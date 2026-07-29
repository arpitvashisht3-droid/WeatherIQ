#include "LocationResolver.h"
#include "Config.h"

#include <iostream>
#include <fstream>
#include <sstream>
#include <cstdlib>
#include <cstdio>
#include <cctype>

using namespace std;

extern bool g_debugMode;

LocationResolver::LocationResolver(CityCoordinateStore& cityStore) {
    geocodeUrl_ = Config::ORS_GEOCODE_URL;
    cityStore_ = &cityStore;
}

string LocationResolver::readApiKeyFromEnv() {
    const char* primary = getenv("OPENROUTESERVICE_API_KEY");
    if (primary != NULL && string(primary).size() > 0) {
        return string(primary);
    }
    const char* fallback = getenv("ORS_API_KEY");
    if (fallback != NULL && string(fallback).size() > 0) {
        return string(fallback);
    }
    return "";
}

string LocationResolver::trim(string text) {
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

string LocationResolver::urlEncode(string text) {
    ostringstream encoded;
    for (int i = 0; i < (int)text.size(); i++) {
        unsigned char c = (unsigned char)text[i];
        if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') ||
            (c >= '0' && c <= '9') || c == '-' || c == '_' || c == '.' || c == '~') {
            encoded << c;
        } else if (c == ' ') {
            encoded << "%20";
        } else {
            encoded << '%' << hex << uppercase << (int)c << dec << nouppercase;
        }
    }
    return encoded.str();
}

string LocationResolver::httpGet(const string& url, const string& apiKey) {
    string command =
        "curl -s -S --fail -G \"" + url + "\" "
        "-H \"Authorization: " + apiKey + "\" "
        "-H \"Accept: application/json\" "
        "2>/tmp/weatheriq_ors_geocode_err.txt";

    FILE* pipe = popen(command.c_str(), "r");
    if (pipe == NULL) {
        cout << "LocationResolver: failed to start curl." << endl;
        return "";
    }

    string response;
    char buffer[512];
    while (fgets(buffer, sizeof(buffer), pipe) != NULL) {
        response += buffer;
    }

    int status = pclose(pipe);
    if (status != 0) {
        ifstream errFile("/tmp/weatheriq_ors_geocode_err.txt");
        string errLine;
        cout << "LocationResolver: geocode request failed.";
        if (errFile.is_open() && getline(errFile, errLine)) {
            cout << " " << errLine;
        }
        cout << endl;
        return "";
    }
    return response;
}

/*
 * Parse ORS geocode JSON (Pelias-style features array).
 * Uses features[0].geometry.coordinates [lon, lat] and properties.label.
 */
bool LocationResolver::parseGeocodeResponse(const string& json,
                                            string& nameOut,
                                            double& latOut,
                                            double& lonOut) {
    if (json.find("\"features\"") == string::npos) {
        return false;
    }

    // Find first coordinates array [lon, lat]
    size_t coordKey = json.find("\"coordinates\"");
    if (coordKey == string::npos) {
        return false;
    }
    size_t bracket = json.find('[', coordKey);
    if (bracket == string::npos) {
        return false;
    }

    size_t comma = json.find(',', bracket);
    if (comma == string::npos) {
        return false;
    }

    string lonText = json.substr(bracket + 1, comma - bracket - 1);
    size_t closeBracket = json.find(']', comma);
    if (closeBracket == string::npos) {
        return false;
    }
    string latText = json.substr(comma + 1, closeBracket - comma - 1);

    stringstream lonStream(trim(lonText));
    stringstream latStream(trim(latText));
    if (!(lonStream >> lonOut) || !(latStream >> latOut)) {
        return false;
    }

    // Prefer human-readable label from geocoder
    nameOut = "";
    size_t labelKey = json.find("\"label\"");
    if (labelKey != string::npos) {
        size_t colon = json.find(':', labelKey);
        size_t quoteStart = json.find('"', colon + 1);
        size_t quoteEnd = json.find('"', quoteStart + 1);
        if (quoteStart != string::npos && quoteEnd != string::npos) {
            nameOut = json.substr(quoteStart + 1, quoteEnd - quoteStart - 1);
        }
    }

    if (nameOut.empty()) {
        size_t nameKey = json.find("\"name\"");
        if (nameKey != string::npos) {
            size_t colon = json.find(':', nameKey);
            size_t quoteStart = json.find('"', colon + 1);
            size_t quoteEnd = json.find('"', quoteStart + 1);
            if (quoteStart != string::npos && quoteEnd != string::npos) {
                nameOut = json.substr(quoteStart + 1, quoteEnd - quoteStart - 1);
            }
        }
    }

    return !nameOut.empty();
}

bool LocationResolver::resolve(const string& userInput, ResolvedPlace& outPlace) {
    string query = trim(userInput);
    if (query.empty()) {
        return false;
    }

    // Step 1: local cache (cities.csv)
    string cachedName = cityStore_->resolveCityName(query);
    if (!cachedName.empty()) {
        double lat = 0.0;
        double lon = 0.0;
        if (cityStore_->getCoordinates(cachedName, lat, lon)) {
            outPlace.name = cachedName;
            outPlace.latitude = lat;
            outPlace.longitude = lon;
            outPlace.fromLocalCache = true;
            if (g_debugMode) {
                cout << "LocationResolver: \"" << query << "\" found in local cache as "
                     << cachedName << endl;
            }
            return true;
        }
    }

    // Step 2: ORS geocoding (India)
    string apiKey = readApiKeyFromEnv();
    if (apiKey.empty()) {
        cout << "LocationResolver: no API key for geocoding. Set OPENROUTESERVICE_API_KEY."
             << endl;
        return false;
    }

    string url = geocodeUrl_
        + "?text=" + urlEncode(query)
        + "&boundary.country=IN"
        + "&size=1";

    if (g_debugMode) {
        cout << "LocationResolver: geocoding \"" << query << "\" via OpenRouteService..."
             << endl;
    }

    string response = httpGet(url, apiKey);
    if (response.empty()) {
        return false;
    }

    string geocodedName;
    double lat = 0.0;
    double lon = 0.0;
    if (!parseGeocodeResponse(response, geocodedName, lat, lon)) {
        cout << "LocationResolver: could not parse geocode response for \"" << query
             << "\"." << endl;
        return false;
    }

    // Use first part of label before comma as short graph name when possible
    string shortName = geocodedName;
    size_t commaPos = shortName.find(',');
    if (commaPos != string::npos) {
        shortName = trim(shortName.substr(0, commaPos));
    }
    if (shortName.empty()) {
        shortName = geocodedName;
    }

    cityStore_->putCity(shortName, lat, lon);

    outPlace.name = shortName;
    outPlace.latitude = lat;
    outPlace.longitude = lon;
    outPlace.fromLocalCache = false;

    if (g_debugMode) {
        cout << "LocationResolver: \"" << query << "\" resolved to " << shortName
             << " (" << lat << ", " << lon << ")" << endl;
    }
    return true;
}
