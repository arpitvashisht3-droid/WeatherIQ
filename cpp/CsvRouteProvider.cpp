#include "CsvRouteProvider.h"

#include <iostream>
#include <fstream>
#include <sstream>

using namespace std;

// Remove spaces at the start and end of a string
static string trimCsvField(string text) {
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

CsvRouteProvider::CsvRouteProvider(string filename) {
    filename_ = filename;
}

string CsvRouteProvider::sourceName() const {
    return "CSV (" + filename_ + ")";
}

/*
 * Read routes from CSV.
 * Skips blank lines, # comments, and the header row.
 */
bool CsvRouteProvider::fetchRoutes(vector<RouteRecord>& outRoutes) {
    outRoutes.clear();

    ifstream input(filename_);
    if (!input.is_open()) {
        cout << "Error: could not open route data file: " << filename_ << endl;
        return false;
    }

    cout << "Fetching routes from " << sourceName() << "..." << endl;

    string line;
    while (getline(input, line)) {
        line = trimCsvField(line);

        if (line.empty() || line[0] == '#') {
            continue;
        }

        stringstream ss(line);
        string city;
        string destination;
        string distanceText;
        string weather;

        if (!getline(ss, city, ',')) {
            continue;
        }
        if (!getline(ss, destination, ',')) {
            continue;
        }
        if (!getline(ss, distanceText, ',')) {
            continue;
        }
        if (!getline(ss, weather)) {
            continue;
        }

        city = trimCsvField(city);
        destination = trimCsvField(destination);
        distanceText = trimCsvField(distanceText);
        weather = trimCsvField(weather);

        // Skip header row
        if (city == "city" && destination == "destination") {
            continue;
        }

        int distance = 0;
        stringstream distanceStream(distanceText);
        if (!(distanceStream >> distance)) {
            cout << "Error: bad distance in line: " << line << endl;
            continue;
        }

        RouteRecord record;
        record.fromCity = city;
        record.toCity = destination;
        record.distanceKm = distance;
        record.weather = weather;
        outRoutes.push_back(record);
    }

    input.close();
    cout << "Fetched " << outRoutes.size() << " route(s) from CSV." << endl;
    return true;
}
