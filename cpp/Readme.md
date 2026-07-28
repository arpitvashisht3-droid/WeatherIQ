# WeatherIQ C++ Route Planner

Weather-aware A* pathfinding with dynamic OpenRouteService routing.

## City coordinate data

`data/cities.csv` is a local cache of Indian city/town coordinates used by `CsvCityProvider` and `LocationResolver`. Unknown places are still resolved via OpenRouteService geocoding.

### Source and license

City coordinates are derived from the **GeoNames** `cities1000` extract (places in India with population ≥ 1,000 or administrative seats).

- **Dataset:** [GeoNames cities1000](https://download.geonames.org/export/dump/cities1000.zip)
- **License:** [Creative Commons Attribution 4.0 (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/)
- **Attribution:** Data © [GeoNames](https://www.geonames.org/), used under CC BY 4.0

Extended fields (GeoNames ID, state, population) are stored separately in `data/cities_metadata.csv` for future use. Only `city,latitude,longitude` are loaded by the C++ parser.

### Build

```bash
g++ -std=c++17 -o weatheriq \
  cpp/Graph.cpp cpp/AStar.cpp cpp/Weather.cpp \
  cpp/CsvRouteProvider.cpp cpp/ApiRouteProvider.cpp \
  cpp/GraphBuilder.cpp cpp/CsvCityProvider.cpp \
  cpp/CityCoordinateStore.cpp cpp/LocationResolver.cpp \
  cpp/main.cpp
```

Run from the project root:

```bash
Set API keys from the environment (never hardcode them):

```bash
export OPENROUTESERVICE_API_KEY="your_ors_key"
export OPENWEATHERMAP_API_KEY="your_owm_key"
./weatheriq
```

OpenWeatherMap supplies live weather per route segment; the C++ `Weather` class maps conditions to A* penalties.
