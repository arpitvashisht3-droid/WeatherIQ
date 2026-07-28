#include "CityCoordinateStore.h"

#include <iostream>
#include <cctype>
#include <vector>

using namespace std;

extern bool g_debugMode;

static string trimCoordText(string text) {
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

static string toLowerCoord(string text) {
    for (int i = 0; i < (int)text.size(); i++) {
        text[i] = (char)tolower((unsigned char)text[i]);
    }
    return text;
}

bool CityCoordinateStore::loadFromProvider(CityProvider& provider) {
    coordinates_.clear();

    vector<CityRecord> cities;
    if (!provider.fetchCities(cities)) {
        cout << "CityCoordinateStore: failed to fetch cities from "
             << provider.sourceName() << "." << endl;
        return false;
    }

    if (cities.empty()) {
        cout << "CityCoordinateStore: provider returned no cities." << endl;
        return false;
    }

    for (int i = 0; i < (int)cities.size(); i++) {
        coordinates_[cities[i].city] = cities[i];
    }

    if (g_debugMode) {
        cout << "CityCoordinateStore: loaded " << coordinates_.size()
             << " city coordinate(s)." << endl;
    }
    return true;
}

bool CityCoordinateStore::hasCity(string city) const {
    return coordinates_.find(city) != coordinates_.end();
}

string CityCoordinateStore::resolveCityName(string userInput) const {
    string normalizedInput = toLowerCoord(trimCoordText(userInput));
    if (normalizedInput.empty()) {
        return "";
    }

    for (auto entry : coordinates_) {
        if (toLowerCoord(entry.first) == normalizedInput) {
            return entry.first;
        }
    }
    return "";
}

bool CityCoordinateStore::getCoordinates(string city, double& latitude, double& longitude) const {
    auto found = coordinates_.find(city);
    if (found == coordinates_.end()) {
        return false;
    }

    latitude = found->second.latitude;
    longitude = found->second.longitude;
    return true;
}

void CityCoordinateStore::putCity(string city, double latitude, double longitude) {
    CityRecord record;
    record.city = city;
    record.latitude = latitude;
    record.longitude = longitude;
    coordinates_[city] = record;
}

void CityCoordinateStore::displayCities() const {
    cout << "\n=== City Coordinates ===" << endl;
    for (auto entry : coordinates_) {
        cout << entry.second.city
             << " -> lat " << entry.second.latitude
             << ", lon " << entry.second.longitude << endl;
    }
    cout << "========================\n" << endl;
}

int CityCoordinateStore::size() const {
    return (int)coordinates_.size();
}
