#include "ApiRouteProvider.h"
#include "Config.h"
#include "Weather.h"

#include <iostream>
#include <fstream>
#include <sstream>
#include <cstdlib>
#include <cstdio>
#include <cmath>

using namespace std;

extern bool g_debugMode;

ApiRouteProvider::ApiRouteProvider(string endpointUrl, const CityCoordinateStore* cityStore) {
    endpointUrl_ = endpointUrl;
    cityStore_ = cityStore;
    queryReady_ = false;
    sourceLat_ = 0.0;
    sourceLon_ = 0.0;
    destLat_ = 0.0;
    destLon_ = 0.0;
}

void ApiRouteProvider::setQuery(string sourceName,
                              double sourceLat,
                              double sourceLon,
                              string destName,
                              double destLat,
                              double destLon) {
    sourceName_ = sourceName;
    sourceLat_ = sourceLat;
    sourceLon_ = sourceLon;
    destName_ = destName;
    destLat_ = destLat;
    destLon_ = destLon;
    queryReady_ = true;
}

string ApiRouteProvider::sourceName() const {
    if (queryReady_) {
        return "OpenRouteService (" + sourceName_ + " -> " + destName_ + ")";
    }
    return "OpenRouteService (" + endpointUrl_ + ")";
}

string ApiRouteProvider::readApiKeyFromEnv() {
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

string ApiRouteProvider::trim(string text) {
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

int ApiRouteProvider::metersToKm(double meters) {
    int km = (int)floor((meters / 1000.0) + 0.5);
    if (km < 1 && meters > 0.0) {
        km = 1;
    }
    return km;
}

string ApiRouteProvider::httpPostJson(const string& url,
                                      const string& jsonBody,
                                      const string& apiKey) {
    string bodyPath = "/tmp/weatheriq_ors_directions_body.json";
    ofstream bodyFile(bodyPath.c_str());
    if (!bodyFile.is_open()) {
        cout << "ApiRouteProvider: could not write temp request body file." << endl;
        return "";
    }
    bodyFile << jsonBody;
    bodyFile.close();

    string command =
        "curl -s -S --fail -X POST \"" + url + "\" "
        "-H \"Authorization: " + apiKey + "\" "
        "-H \"Content-Type: application/json; charset=utf-8\" "
        "-H \"Accept: application/json\" "
        "-d @\"" + bodyPath + "\" 2>/tmp/weatheriq_ors_directions_err.txt";

    FILE* pipe = popen(command.c_str(), "r");
    if (pipe == NULL) {
        cout << "ApiRouteProvider: failed to start curl." << endl;
        return "";
    }

    string response;
    char buffer[512];
    while (fgets(buffer, sizeof(buffer), pipe) != NULL) {
        response += buffer;
    }

    int status = pclose(pipe);
    if (status != 0) {
        ifstream errFile("/tmp/weatheriq_ors_directions_err.txt");
        string errLine;
        cout << "ApiRouteProvider: directions request failed.";
        if (errFile.is_open() && getline(errFile, errLine)) {
            cout << " " << errLine;
        }
        cout << endl;
        return "";
    }
    return response;
}

/*
 * Parse each segment's distance from ORS directions JSON.
 * Collects "distance" fields only at segment-object depth (ignores step distances).
 */
bool ApiRouteProvider::parseSegmentDistances(const string& json,
                                           vector<double>& segmentMetersOut) {
    segmentMetersOut.clear();

    if (json.find("\"error\"") != string::npos && json.find("\"routes\"") == string::npos) {
        return false;
    }

    size_t segmentsPos = json.find("\"segments\"");
    if (segmentsPos == string::npos) {
        return false;
    }

    size_t arrayStart = json.find('[', segmentsPos);
    if (arrayStart == string::npos) {
        return false;
    }

    int depth = 0;
    for (size_t i = arrayStart; i < json.size(); i++) {
        char c = json[i];

        if (c == '[' || c == '{') {
            depth++;
        } else if (c == ']' || c == '}') {
            if (c == ']' && depth == 1) {
                break;  // end of segments array
            }
            depth--;
        }

        // depth 2 = inside a segment object { ... } (array depth 1 + object depth 1)
        if (depth == 2 && json.compare(i, 10, "\"distance\"") == 0) {
            size_t colon = json.find(':', i + 10);
            if (colon == string::npos) {
                continue;
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
            if (numEnd > numStart) {
                stringstream ss(json.substr(numStart, numEnd - numStart));
                double meters = 0.0;
                if (ss >> meters) {
                    segmentMetersOut.push_back(meters);
                }
            }
            i = numEnd;
        }
    }

    // Fallback: single route with no segment list — use summary distance
    if (segmentMetersOut.empty()) {
        size_t summaryPos = json.find("\"summary\"");
        if (summaryPos != string::npos) {
            size_t distancePos = json.find("\"distance\"", summaryPos);
            if (distancePos != string::npos) {
                size_t colon = json.find(':', distancePos);
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
                if (numEnd > numStart) {
                    stringstream ss(json.substr(numStart, numEnd - numStart));
                    double meters = 0.0;
                    if (ss >> meters) {
                        segmentMetersOut.push_back(meters);
                    }
                }
            }
        }
    }

    return !segmentMetersOut.empty();
}

bool ApiRouteProvider::parseGeoJsonCoordinates(const string& json, vector<pair<double, double>>& coordsOut) {
    coordsOut.clear();
    size_t geomPos = json.find("\"geometry\"");
    if (geomPos == string::npos) return false;
    
    size_t coordsPos = json.find("\"coordinates\"", geomPos);
    if (coordsPos == string::npos) return false;
    
    size_t arrayStart = json.find('[', coordsPos);
    if (arrayStart == string::npos) return false;
    
    int depth = 0;
    size_t i = arrayStart;
    while (i < json.size()) {
        char c = json[i];
        if (c == '[') {
            depth++;
            if (depth == 2) {
                size_t comma = json.find(',', i);
                size_t close = json.find(']', i);
                if (comma != string::npos && close != string::npos && comma < close) {
                    string lonStr = json.substr(i + 1, comma - (i + 1));
                    string latStr = json.substr(comma + 1, close - (comma + 1));
                    char* endptr;
                    double lon = strtod(lonStr.c_str(), &endptr);
                    double lat = strtod(latStr.c_str(), &endptr);
                    coordsOut.push_back({lat, lon});
                    i = close;
                }
            }
        } else if (c == ']') {
            depth--;
            if (depth == 0) break;
        }
        i++;
    }
    return !coordsOut.empty();
}

bool ApiRouteProvider::fetchDirectionsJson(string& jsonOut) const {
    jsonOut.clear();

    string apiKey = readApiKeyFromEnv();
    if (apiKey.empty()) {
        cout << "ApiRouteProvider: missing API key. Set OPENROUTESERVICE_API_KEY "
             << "or ORS_API_KEY." << endl;
        return false;
    }

    ostringstream body;
    body.setf(ios::fixed);
    body.precision(6);
    body << "{\"coordinates\":[["
         << sourceLon_ << "," << sourceLat_ << "],["
         << destLon_ << "," << destLat_ << "]]}";

    const char* envFlag = getenv("ENABLE_WAYPOINTS");
    bool enableWaypoints = Config::ENABLE_WAYPOINTS;
    if (envFlag != nullptr) {
        enableWaypoints = (string(envFlag) == "1" || string(envFlag) == "true");
    }

    string url = endpointUrl_;
    if (enableWaypoints) {
        if (url.find("/geojson") == string::npos) {
            url += "/geojson";
        }
    }

    jsonOut = httpPostJson(url, body.str(), apiKey);
    return !jsonOut.empty();
}

/*
 * Turn ORS segment distances into a chain of RouteRecords:
 *   Source -> WP1 -> WP2 -> ... -> Destination
 *
 * For each segment we sample the route midpoint and fetch live weather
 * from OpenWeatherMap, mapped to WeatherIQ labels for A* penalties.
 */
bool ApiRouteProvider::buildRecordsFromSegments(const vector<double>& segmentMeters,
                                                vector<RouteRecord>& outRoutes) const {
    outRoutes.clear();

    if (segmentMeters.empty()) {
        return false;
    }

    // Total route length for coordinate interpolation along the path
    double totalMeters = 0.0;
    for (int i = 0; i < (int)segmentMeters.size(); i++) {
        totalMeters += segmentMeters[i];
    }

    // Build node coordinates: source, interpolated waypoints, destination
    vector<string> nodes;
    vector<double> nodeLats;
    vector<double> nodeLons;

    nodes.push_back(sourceName_);
    nodeLats.push_back(sourceLat_);
    nodeLons.push_back(sourceLon_);

    double cumulative = 0.0;
    for (int i = 0; i < (int)segmentMeters.size() - 1; i++) {
        cumulative += segmentMeters[i];
        double ratio = 0.0;
        if (totalMeters > 0.0) {
            ratio = cumulative / totalMeters;
        }

        ostringstream wp;
        wp << "WP" << (i + 1);
        nodes.push_back(wp.str());

        double lat = sourceLat_ + ratio * (destLat_ - sourceLat_);
        double lon = sourceLon_ + ratio * (destLon_ - sourceLon_);
        nodeLats.push_back(lat);
        nodeLons.push_back(lon);
    }

    nodes.push_back(destName_);
    nodeLats.push_back(destLat_);
    nodeLons.push_back(destLon_);

    if (g_debugMode) {
        cout << "ApiRouteProvider: fetching live weather for "
             << segmentMeters.size() << " segment(s)..." << endl;
    }

    for (int i = 0; i < (int)segmentMeters.size(); i++) {
        double midLat = (nodeLats[i] + nodeLats[i + 1]) / 2.0;
        double midLon = (nodeLons[i] + nodeLons[i + 1]) / 2.0;

        string condition = Weather::fetchConditionAt(midLat, midLon);

        RouteRecord record;
        record.fromCity = nodes[i];
        record.toCity = nodes[i + 1];
        record.distanceKm = metersToKm(segmentMeters[i]);
        record.weather = condition;
        outRoutes.push_back(record);
    }

    return true;
}

bool ApiRouteProvider::fetchRoutes(vector<RouteRecord>& outRoutes) {
    outRoutes.clear();

    if (!queryReady_) {
        cout << "ApiRouteProvider: call setQuery() before fetchRoutes()." << endl;
        return false;
    }

    if (g_debugMode) {
        cout << "ApiRouteProvider: fetching driving route "
             << sourceName_ << " -> " << destName_ << " from OpenRouteService..."
             << endl;
    }

    string json;
    if (!fetchDirectionsJson(json)) {
        return false;
    }

    vector<double> segmentMeters;
    if (!parseSegmentDistances(json, segmentMeters)) {
        cout << "ApiRouteProvider: could not parse segments from ORS response." << endl;
        cout << "ApiRouteProvider: snippet: " << json.substr(0, 300) << endl;
        return false;
    }

    if (!buildRecordsFromSegments(segmentMeters, outRoutes)) {
        return false;
    }

    if (g_debugMode) {
        cout << "ApiRouteProvider: built " << outRoutes.size()
             << " segment(s) for the dynamic graph." << endl;
        for (int i = 0; i < (int)outRoutes.size(); i++) {
            cout << "  " << outRoutes[i].fromCity << " -> " << outRoutes[i].toCity
                 << ": " << outRoutes[i].distanceKm << " km"
                 << " [" << outRoutes[i].weather << "]" << endl;
        }
    }

    return true;
}
