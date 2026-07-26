#include "ApiRouteProvider.h"
#include "Config.h"

#include <iostream>
#include <fstream>
#include <sstream>
#include <cstdlib>
#include <cstdio>
#include <cmath>
#include <unistd.h>

using namespace std;

ApiRouteProvider::ApiRouteProvider(string endpointUrl) {
    endpointUrl_ = endpointUrl;
    citiesCsvPath_ = Config::DEFAULT_CITIES_CSV;
    routesCsvPath_ = Config::DEFAULT_ROUTES_CSV;
}

ApiRouteProvider::ApiRouteProvider(string endpointUrl,
                                   string citiesCsvPath,
                                   string routesCsvPath) {
    endpointUrl_ = endpointUrl;
    citiesCsvPath_ = citiesCsvPath;
    routesCsvPath_ = routesCsvPath;
}

string ApiRouteProvider::sourceName() const {
    return "OpenRouteService (" + endpointUrl_ + ")";
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

string ApiRouteProvider::toLowerCopy(string text) {
    for (int i = 0; i < (int)text.size(); i++) {
        char c = text[i];
        if (c >= 'A' && c <= 'Z') {
            text[i] = (char)(c - 'A' + 'a');
        }
    }
    return text;
}

/*
 * Prefer OPENROUTESERVICE_API_KEY, then ORS_API_KEY.
 * Never embed the key in source code.
 */
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

bool ApiRouteProvider::loadCityCoordinates(
    unordered_map<string, pair<double, double> >& outCoords) const {
    outCoords.clear();

    ifstream input(citiesCsvPath_);
    if (!input.is_open()) {
        cout << "ApiRouteProvider: could not open cities file: "
             << citiesCsvPath_ << endl;
        return false;
    }

    string line;
    while (getline(input, line)) {
        line = trim(line);
        if (line.empty() || line[0] == '#') {
            continue;
        }

        stringstream ss(line);
        string city;
        string latText;
        string lonText;

        if (!getline(ss, city, ',')) {
            continue;
        }
        if (!getline(ss, latText, ',')) {
            continue;
        }
        if (!getline(ss, lonText)) {
            continue;
        }

        city = trim(city);
        latText = trim(latText);
        lonText = trim(lonText);

        if (city == "city" && latText == "latitude") {
            continue;
        }

        double latitude = 0.0;
        double longitude = 0.0;
        stringstream latStream(latText);
        stringstream lonStream(lonText);
        if (!(latStream >> latitude) || !(lonStream >> longitude)) {
            cout << "ApiRouteProvider: bad coordinates in line: " << line << endl;
            continue;
        }

        outCoords[city] = make_pair(latitude, longitude);
    }

    input.close();
    return !outCoords.empty();
}

bool ApiRouteProvider::loadRoutePairs(vector<RoutePair>& outPairs) const {
    outPairs.clear();

    ifstream input(routesCsvPath_);
    if (!input.is_open()) {
        cout << "ApiRouteProvider: could not open routes file: "
             << routesCsvPath_ << endl;
        return false;
    }

    string line;
    while (getline(input, line)) {
        line = trim(line);
        if (line.empty() || line[0] == '#') {
            continue;
        }

        stringstream ss(line);
        string fromCity;
        string toCity;
        string distanceText;
        string weather;

        if (!getline(ss, fromCity, ',')) {
            continue;
        }
        if (!getline(ss, toCity, ',')) {
            continue;
        }
        if (!getline(ss, distanceText, ',')) {
            continue;
        }
        if (!getline(ss, weather)) {
            continue;
        }

        fromCity = trim(fromCity);
        toCity = trim(toCity);
        weather = trim(weather);

        if (fromCity == "city" && toCity == "destination") {
            continue;
        }

        // CSV distance is ignored; ORS supplies real distance.
        // Weather is kept from the CSV until a weather API is added.
        RoutePair pair;
        pair.fromCity = fromCity;
        pair.toCity = toCity;
        pair.weather = weather;
        outPairs.push_back(pair);
    }

    input.close();
    return !outPairs.empty();
}

bool ApiRouteProvider::findCoordinates(
    const unordered_map<string, pair<double, double> >& coords,
    const string& city,
    double& latitude,
    double& longitude) {
    string needle = toLowerCopy(city);

    for (auto entry : coords) {
        if (toLowerCopy(entry.first) == needle) {
            latitude = entry.second.first;
            longitude = entry.second.second;
            return true;
        }
    }
    return false;
}

/*
 * Extract routes[0].summary.distance (meters) from ORS JSON.
 * Keeps parsing simple and beginner-friendly (no JSON library).
 */
bool ApiRouteProvider::parseDistanceMeters(const string& json, double& metersOut) {
    if (json.find("\"error\"") != string::npos && json.find("\"routes\"") == string::npos) {
        return false;
    }

    size_t summaryPos = json.find("\"summary\"");
    if (summaryPos == string::npos) {
        return false;
    }

    size_t distancePos = json.find("\"distance\"", summaryPos);
    if (distancePos == string::npos) {
        return false;
    }

    size_t colonPos = json.find(':', distancePos);
    if (colonPos == string::npos) {
        return false;
    }

    size_t numberStart = colonPos + 1;
    while (numberStart < json.size() &&
           (json[numberStart] == ' ' || json[numberStart] == '\t')) {
        numberStart++;
    }

    size_t numberEnd = numberStart;
    while (numberEnd < json.size()) {
        char c = json[numberEnd];
        if ((c >= '0' && c <= '9') || c == '.' || c == '-' || c == '+' || c == 'e' || c == 'E') {
            numberEnd++;
        } else {
            break;
        }
    }

    if (numberEnd <= numberStart) {
        return false;
    }

    string numberText = json.substr(numberStart, numberEnd - numberStart);
    stringstream numberStream(numberText);
    if (!(numberStream >> metersOut)) {
        return false;
    }

    return metersOut >= 0.0;
}

string ApiRouteProvider::httpPostJson(const string& url,
                                      const string& jsonBody,
                                      const string& apiKey) {
    // Write body to a temp file so shell quoting stays simple and safe
    string bodyPath = "/tmp/weatheriq_ors_body.json";
    ofstream bodyFile(bodyPath.c_str());
    if (!bodyFile.is_open()) {
        cout << "ApiRouteProvider: could not write temp request body file." << endl;
        return "";
    }
    bodyFile << jsonBody;
    bodyFile.close();

    // -s silent, -S show errors, --fail fail on HTTP error codes
    string command =
        "curl -s -S --fail -X POST \"" + url + "\" "
        "-H \"Authorization: " + apiKey + "\" "
        "-H \"Content-Type: application/json; charset=utf-8\" "
        "-H \"Accept: application/json\" "
        "-d @\"" + bodyPath + "\" 2>/tmp/weatheriq_ors_curl_err.txt";

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
        ifstream errFile("/tmp/weatheriq_ors_curl_err.txt");
        string errLine;
        cout << "ApiRouteProvider: curl request failed.";
        if (errFile.is_open() && getline(errFile, errLine)) {
            cout << " " << errLine;
        }
        cout << endl;
        if (!response.empty()) {
            cout << "ApiRouteProvider: response snippet: "
                 << response.substr(0, 200) << endl;
        }
        return "";
    }

    return response;
}

bool ApiRouteProvider::fetchDistanceKm(double fromLon,
                                       double fromLat,
                                       double toLon,
                                       double toLat,
                                       int& distanceKmOut) const {
    string apiKey = readApiKeyFromEnv();
    if (apiKey.empty()) {
        cout << "ApiRouteProvider: missing API key. Set OPENROUTESERVICE_API_KEY "
             << "(or ORS_API_KEY) in your environment." << endl;
        return false;
    }

    // ORS expects [longitude, latitude] pairs
    ostringstream body;
    body.setf(ios::fixed);
    body.precision(6);
    body << "{\"coordinates\":[["
         << fromLon << "," << fromLat << "],["
         << toLon << "," << toLat << "]]}";

    string response = httpPostJson(endpointUrl_, body.str(), apiKey);
    if (response.empty()) {
        return false;
    }

    double meters = 0.0;
    if (!parseDistanceMeters(response, meters)) {
        cout << "ApiRouteProvider: could not parse distance from ORS response." << endl;
        cout << "ApiRouteProvider: response snippet: "
             << response.substr(0, 300) << endl;
        return false;
    }

    // Convert meters -> whole kilometers for RouteRecord.distanceKm
    distanceKmOut = (int)floor((meters / 1000.0) + 0.5);
    if (distanceKmOut < 1 && meters > 0.0) {
        distanceKmOut = 1;
    }
    return true;
}

/*
 * fetchRoutes:
 * 1) Read city coordinates and route pairs from CSV (pair list / weather only)
 * 2) Call OpenRouteService for each pair's driving distance
 * 3) Emit RouteRecord{from, to, orsDistanceKm, weather}
 */
bool ApiRouteProvider::fetchRoutes(vector<RouteRecord>& outRoutes) {
    outRoutes.clear();

    string apiKey = readApiKeyFromEnv();
    if (apiKey.empty()) {
        cout << "ApiRouteProvider: missing API key." << endl;
        cout << "Export one of these before running:" << endl;
        cout << "  export OPENROUTESERVICE_API_KEY=\"your_key_here\"" << endl;
        cout << "  export ORS_API_KEY=\"your_key_here\"" << endl;
        return false;
    }

    unordered_map<string, pair<double, double> > coords;
    if (!loadCityCoordinates(coords)) {
        cout << "ApiRouteProvider: failed to load city coordinates." << endl;
        return false;
    }

    vector<RoutePair> pairs;
    if (!loadRoutePairs(pairs)) {
        cout << "ApiRouteProvider: failed to load route pairs." << endl;
        return false;
    }

    cout << "ApiRouteProvider: fetching " << pairs.size()
         << " route distance(s) from OpenRouteService..." << endl;

    for (int i = 0; i < (int)pairs.size(); i++) {
        RoutePair pair = pairs[i];

        double fromLat = 0.0;
        double fromLon = 0.0;
        double toLat = 0.0;
        double toLon = 0.0;

        if (!findCoordinates(coords, pair.fromCity, fromLat, fromLon)) {
            cout << "ApiRouteProvider: no coordinates for " << pair.fromCity << endl;
            continue;
        }
        if (!findCoordinates(coords, pair.toCity, toLat, toLon)) {
            cout << "ApiRouteProvider: no coordinates for " << pair.toCity << endl;
            continue;
        }

        int distanceKm = 0;
        // ORS uses lon,lat order
        bool ok = fetchDistanceKm(fromLon, fromLat, toLon, toLat, distanceKm);
        if (!ok) {
            cout << "ApiRouteProvider: ORS request failed for "
                 << pair.fromCity << " -> " << pair.toCity << endl;
            continue;
        }

        RouteRecord record;
        record.fromCity = pair.fromCity;
        record.toCity = pair.toCity;
        record.distanceKm = distanceKm;
        record.weather = pair.weather;
        outRoutes.push_back(record);

        cout << "  ORS: " << record.fromCity << " -> " << record.toCity
             << " = " << record.distanceKm << " km"
             << " [" << record.weather << "]" << endl;

        // Be gentle with the free-tier rate limit between requests
        if (i + 1 < (int)pairs.size()) {
            sleep(1);
        }
    }

    if (outRoutes.empty()) {
        cout << "ApiRouteProvider: no routes were fetched successfully." << endl;
        return false;
    }

    cout << "ApiRouteProvider: built " << outRoutes.size()
         << " RouteRecord(s) from OpenRouteService." << endl;
    return true;
}
