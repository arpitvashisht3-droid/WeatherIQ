import React from 'react';
import { MapPin, Sun, CloudRain, Cloud, ArrowRight } from 'lucide-react';
import { CITIES, MOCK_WEATHER_DATA } from '../data/mockWeatherData';
import { CityLocation } from '../types/weather';

interface MiniForecastListProps {
  currentLocationId: string;
  onSelectCity: (city: CityLocation) => void;
}

export const MiniForecastList: React.FC<MiniForecastListProps> = ({
  currentLocationId,
  onSelectCity,
}) => {
  // Select alternative Indian cities
  const otherCities = CITIES.filter(c => c.id !== currentLocationId).slice(0, 2);

  const renderIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="w-5 h-5 text-amber-500" />;
      case 'rainy':
      case 'thunderstorm':
        return <CloudRain className="w-5 h-5 text-sky-500" />;
      default:
        return <Cloud className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div id="mini-forecast-list" className="flex flex-col gap-3">
      {otherCities.map((city) => {
        const cityData = MOCK_WEATHER_DATA[city.id];
        if (!cityData) return null;

        const highTemp = cityData.daily[0].tempHighC;
        const lowTemp = cityData.daily[0].tempLowC;
        const currentTemp = cityData.current.tempC;

        return (
          <button
            key={city.id}
            onClick={() => onSelectCity(city)}
            className="w-full text-left bg-white hover:bg-slate-50/90 rounded-2xl p-3.5 border border-slate-200/80 shadow-2xs hover:border-[#F27D26]/40 transition-all group flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-50 text-[#F27D26] group-hover:bg-[#F27D26] group-hover:text-white transition-colors">
                {renderIcon(cityData.current.condition)}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#F27D26]" />
                  <span>{city.name}</span>
                </h4>
                <p className="text-[11px] font-medium text-slate-500">
                  {cityData.current.conditionLabel}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-right">
              <div>
                <span className="text-sm font-black text-[#0F172A] block">
                  {currentTemp}°C
                </span>
                <span className="text-[10px] text-slate-400 font-semibold">
                  H:{highTemp}° L:{lowTemp}°
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#F27D26] group-hover:translate-x-0.5 transition-all" />
            </div>
          </button>
        );
      })}
    </div>
  );
};
