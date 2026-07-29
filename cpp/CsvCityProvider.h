#ifndef CSV_CITY_PROVIDER_H
#define CSV_CITY_PROVIDER_H

#include <string>
#include <vector>
#include "CityProvider.h"

/*
 * CsvCityProvider: reads city coordinates from a local CSV file.
 *
 * Expected columns: city,latitude,longitude
 * Does not touch Graph, A*, or Weather.
 */
class CsvCityProvider : public CityProvider {
private:
    std::string filename_;

public:
    explicit CsvCityProvider(std::string filename);

    std::string sourceName() const;
    bool fetchCities(std::vector<CityRecord>& outCities);
};

#endif
