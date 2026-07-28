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
                                      const string& apiKey,
                                      const string& acceptHeader) {
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
        "-H \"Accept: " + acceptHeader + "\" "
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
                // We are at the opening '[' of a [lon, lat] coordinate pair.
                // Find the comma and closing ']' strictly within this pair.
                size_t pairStart = i;
                size_t comma = json.find(',', pairStart + 1);
                size_t close = json.find(']', pairStart + 1);
                if (comma != string::npos && close != string::npos && comma < close) {
                    string lonStr = json.substr(pairStart + 1, comma - (pairStart + 1));
                    string latStr = json.substr(comma + 1, close - (comma + 1));
                    char* endptr1;
                    char* endptr2;
                    double lon = strtod(lonStr.c_str(), &endptr1);
                    double lat = strtod(latStr.c_str(), &endptr2);
                    if (endptr1 != lonStr.c_str() && endptr2 != latStr.c_str()) {
                        coordsOut.push_back({lat, lon});
                    }
                    // Set i so that the loop's i++ lands on 'close' (the ']'),
                    // which will be processed by the else-if branch below to
                    // decrement depth back to 1.
                    i = close - 1;
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

    string acceptHeader = enableWaypoints ? "application/geo+json" : "application/json";
    jsonOut = httpPostJson(url, body.str(), apiKey, acceptHeader);
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

// ---------------------------------------------------------------------------
// Waypoint mode: parse GeoJSON geometry, sample intermediate coordinates,
// resolve them to nearest cities, build named RouteRecords.
// Falls back to legacy mode on any failure.
// ---------------------------------------------------------------------------
bool ApiRouteProvider::fetchRoutes(vector<RouteRecord>& outRoutes) {
    outRoutes.clear();

    if (!queryReady_) {
        cout << "ApiRouteProvider: call setQuery() before fetchRoutes()." << endl;
        return false;
    }

    // Determine if waypoints are active (env overrides compile-time default)
    const char* envFlag = getenv("ENABLE_WAYPOINTS");
    bool enableWaypoints = Config::ENABLE_WAYPOINTS;
    if (envFlag != nullptr) {
        enableWaypoints = (string(envFlag) == "1" || string(envFlag) == "true");
    }

    if (g_debugMode) {
        cout << "ApiRouteProvider: fetching driving route "
             << sourceName_ << " -> " << destName_ << " from OpenRouteService"
             << (enableWaypoints ? " [waypoint mode]" : " [legacy mode]")
             << "..." << endl;
    }

    string json;
    if (!fetchDirectionsJson(json)) {
        return false;
    }

    // ===== WAYPOINT MODE =====
    if (enableWaypoints && cityStore_ != nullptr) {
        vector<pair<double, double>> geoCoords;
        bool parsedGeo = parseGeoJsonCoordinates(json, geoCoords);

        if (parsedGeo && geoCoords.size() >= 2) {
            if (g_debugMode) {
                cout << "ApiRouteProvider: GeoJSON has " << geoCoords.size()
                     << " coordinate point(s). Sampling intermediate cities..." << endl;
            }

            // Compute cumulative arc lengths along the polyline (degrees-squared dist is fine
            // for sampling; we convert to km at the end).
            int N = (int)geoCoords.size();
            vector<double> arcLen(N, 0.0); // cumulative length in degrees
            for (int i = 1; i < N; i++) {
                double dLat = geoCoords[i].first  - geoCoords[i-1].first;
                double dLon = geoCoords[i].second - geoCoords[i-1].second;
                arcLen[i] = arcLen[i-1] + sqrt(dLat*dLat + dLon*dLon);
            }
            double totalArc = arcLen[N-1];

            // Choose how many intermediate waypoints to sample:
            // ~1 per 150 km; minimum 1, maximum 8.
            double totalKmEst = totalArc * 111.0;
            int numIntermediate = (int)(totalKmEst / 150.0);
            if (numIntermediate < 1)  numIntermediate = 1;
            if (numIntermediate > 8)  numIntermediate = 8;

            // Build city sequence: source, sampled intermediates, destination
            vector<string>  cityNames;
            vector<double>  cityLats;
            vector<double>  cityLons;

            cityNames.push_back(sourceName_);
            cityLats.push_back(sourceLat_);
            cityLons.push_back(sourceLon_);

            // Keep track of used city names to avoid duplicates
            vector<string> usedCities;
            usedCities.push_back(sourceName_);
            usedCities.push_back(destName_);

            for (int s = 1; s <= numIntermediate; s++) {
                // Target arc position: evenly spaced between source and dest
                double targetArc = totalArc * ((double)s / (double)(numIntermediate + 1));

                // Find the two polyline points that straddle targetArc
                int lo = 0;
                for (int k = 0; k < N - 1; k++) {
                    if (arcLen[k] <= targetArc && arcLen[k+1] >= targetArc) {
                        lo = k;
                        break;
                    }
                }
                // Interpolate between lo and lo+1
                double segArc = arcLen[lo+1] - arcLen[lo];
                double t = (segArc > 0.0) ? (targetArc - arcLen[lo]) / segArc : 0.0;
                double sampLat = geoCoords[lo].first  + t * (geoCoords[lo+1].first  - geoCoords[lo].first);
                double sampLon = geoCoords[lo].second + t * (geoCoords[lo+1].second - geoCoords[lo].second);

                // Snap to nearest real city from the 6924-city dataset
                double distKm = 0.0;
                string nearestCity = cityStore_->findNearestCity(sampLat, sampLon, distKm, usedCities);

                if (nearestCity.empty()) {
                    if (g_debugMode) {
                        cout << "  Waypoint " << s << ": no city found (skipping)." << endl;
                    }
                    continue;
                }

                // Retrieve actual stored coordinates for this city
                double cityLat = sampLat, cityLon = sampLon;
                cityStore_->getCoordinates(nearestCity, cityLat, cityLon);

                if (g_debugMode) {
                    cout << "  Waypoint " << s << ": " << nearestCity
                         << " (" << cityLat << ", " << cityLon
                         << ") dist from sample = " << (int)distKm << " km" << endl;
                }

                cityNames.push_back(nearestCity);
                cityLats.push_back(cityLat);
                cityLons.push_back(cityLon);
                usedCities.push_back(nearestCity);
            }

            cityNames.push_back(destName_);
            cityLats.push_back(destLat_);
            cityLons.push_back(destLon_);

            // Build RouteRecords between consecutive cities
            int segCount = (int)cityNames.size() - 1;
            if (g_debugMode) {
                cout << "ApiRouteProvider: fetching live weather for "
                     << segCount << " waypoint segment(s)..." << endl;
            }

            for (int i = 0; i < segCount; i++) {
                double midLat = (cityLats[i] + cityLats[i+1]) / 2.0;
                double midLon = (cityLons[i] + cityLons[i+1]) / 2.0;

                string condition = Weather::fetchConditionAt(midLat, midLon);

                // Haversine-approximated segment distance
                double dLat = (cityLats[i+1] - cityLats[i]) * M_PI / 180.0;
                double dLon = (cityLons[i+1] - cityLons[i]) * M_PI / 180.0;
                double a = sin(dLat/2)*sin(dLat/2)
                         + cos(cityLats[i]*M_PI/180.0) * cos(cityLats[i+1]*M_PI/180.0)
                         * sin(dLon/2)*sin(dLon/2);
                double c = 2.0 * atan2(sqrt(a), sqrt(1.0-a));
                int distKm = (int)(6371.0 * c + 0.5);
                if (distKm < 1) distKm = 1;

                RouteRecord record;
                record.fromCity   = cityNames[i];
                record.toCity     = cityNames[i+1];
                record.distanceKm = distKm;
                record.weather    = condition;
                outRoutes.push_back(record);
            }

            if (g_debugMode) {
                cout << "ApiRouteProvider: built " << outRoutes.size()
                     << " waypoint segment(s)." << endl;
                for (int i = 0; i < (int)outRoutes.size(); i++) {
                    cout << "  " << outRoutes[i].fromCity << " -> " << outRoutes[i].toCity
                         << ": " << outRoutes[i].distanceKm << " km"
                         << " [" << outRoutes[i].weather << "]" << endl;
                }
            }

            return !outRoutes.empty();
        }

        // GeoJSON parse failed — fall through to legacy mode
        if (g_debugMode) {
            cout << "ApiRouteProvider: GeoJSON parse failed; falling back to legacy mode." << endl;
        }
    }

    // ===== LEGACY MODE (also fallback from failed GeoJSON) =====
    // If we were in waypoint mode, we fetched a GeoJSON response which the
    // segment parser cannot parse. Re-fetch from the standard (non-/geojson) URL.
    if (enableWaypoints) {
        string apiKey = ApiRouteProvider::readApiKeyFromEnv();
        ostringstream body;
        body.setf(ios::fixed);
        body.precision(6);
        body << "{\"coordinates\":[[" << sourceLon_ << "," << sourceLat_ << "],["
             << destLon_ << "," << destLat_ << "]]}";

        string baseUrl = endpointUrl_;
        // Strip /geojson if present
        size_t pos = baseUrl.find("/geojson");
        if (pos != string::npos) {
            baseUrl = baseUrl.substr(0, pos);
        }
        if (!apiKey.empty()) {
            json = httpPostJson(baseUrl, body.str(), apiKey);
        }
        if (json.empty()) {
            cout << "ApiRouteProvider: legacy re-fetch also failed." << endl;
            return false;
        }
    }

    vector<double> segmentMeters;
    if (!parseSegmentDistances(json, segmentMeters)) {
        cout << "ApiRouteProvider: could not parse segments from ORS response." << endl;
        if (g_debugMode) {
            cout << "ApiRouteProvider: snippet: " << json.substr(0, 300) << endl;
        }
        return false;
    }

    if (!buildRecordsFromSegments(segmentMeters, outRoutes)) {
        return false;
    }

    if (g_debugMode) {
        cout << "ApiRouteProvider: built " << outRoutes.size()
             << " legacy segment(s) for the dynamic graph." << endl;
        for (int i = 0; i < (int)outRoutes.size(); i++) {
            cout << "  " << outRoutes[i].fromCity << " -> " << outRoutes[i].toCity
                 << ": " << outRoutes[i].distanceKm << " km"
                 << " [" << outRoutes[i].weather << "]" << endl;
        }
    }

    return true;
}
