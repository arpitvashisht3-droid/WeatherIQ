#include "CsvCityProvider.h"

#include <iostream>
#include <fstream>
#include <sstream>

using namespace std;

extern bool g_debugMode;

static string trimCityField(string text) {
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

CsvCityProvider::CsvCityProvider(string filename) {
    filename_ = filename;
}

string CsvCityProvider::sourceName() const {
    return "CSV (" + filename_ + ")";
}

/*
 * Read cities from CSV.
 * Skips blank lines, # comments, and the header row.
 */
bool CsvCityProvider::fetchCities(vector<CityRecord>& outCities) {
    outCities.clear();

    ifstream input(filename_);
    if (!input.is_open()) {
        cout << "Error: could not open city data file: " << filename_ << endl;
        return false;
    }

    if (g_debugMode)
        cout << "Fetching cities from " << sourceName() << "..." << endl;

    string line;
    while (getline(input, line)) {
        line = trimCityField(line);

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

        city = trimCityField(city);
        latText = trimCityField(latText);
        lonText = trimCityField(lonText);

        // Skip header row
        if (city == "city" && latText == "latitude") {
            continue;
        }

        double latitude = 0.0;
        double longitude = 0.0;
        stringstream latStream(latText);
        stringstream lonStream(lonText);

        if (!(latStream >> latitude) || !(lonStream >> longitude)) {
            cout << "Error: bad coordinates in line: " << line << endl;
            continue;
        }

        CityRecord record;
        record.city = city;
        record.latitude = latitude;
        record.longitude = longitude;
        outCities.push_back(record);
    }

    input.close();
    if (g_debugMode)
        cout << "Fetched " << outCities.size() << " city coordinate(s) from CSV." << endl;
    return true;
}
