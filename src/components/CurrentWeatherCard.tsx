import React from 'react';
import { 
  MapPin, 
  Eye, 
  Droplets, 
  Wind, 
  Sun, 
  Thermometer, 
  RefreshCw 
} from 'lucide-react';
import { CurrentWeather, CityLocation, TemperatureUnit } from '../types/weather';

// Import image generated
import sunCloudImg from '../assets/images/sun_cloud_3d_1785079780882.jpg';

interface CurrentWeatherCardProps {
  location: CityLocation;
  weather: CurrentWeather;
  unit: TemperatureUnit;
  onToggleUnit: () => void;
  onRefresh: () => void;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  location,
  weather,
  onRefresh,
}) => {
  return (
    <div 
      id="current-weather-card"
      className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#e0f2fe]/90 via-[#f0f9ff]/90 to-white p-6 lg:p-7 border border-sky-100 shadow-md shadow-sky-900/5 flex flex-col justify-between min-h-[320px]"
    >
      {/* Background soft glow elements */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-sky-200/40 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="relative z-10 flex items-center justify-between gap-3">
        {/* Location Pill Badge */}
        <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full border border-sky-200/70 shadow-xs">
          <MapPin className="w-4 h-4 text-[#F27D26] shrink-0" />
          <span className="text-xs font-bold text-slate-800">
            📍 {location.name}, {location.country}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          {/* Locked Celsius badge */}
          <div className="flex items-center bg-white/90 text-xs font-bold rounded-full px-3 py-1 border border-slate-200/80 shadow-xs text-[#F27D26]">
            °C
          </div>

          {/* Refresh button */}
          <button
            onClick={onRefresh}
            id="btn-refresh-weather"
            className="p-2 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-[#F27D26] border border-slate-200 shadow-xs transition-transform active:rotate-180 duration-300"
            title="Refresh weather data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Content: Illustration + Large Temperature */}
      <div className="relative z-10 my-4 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* 3D Sun Cloud Illustration */}
        <div className="relative group">
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl overflow-hidden bg-gradient-to-tr from-sky-100/50 to-amber-100/50 p-2 border border-white shadow-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <img 
              src={sunCloudImg} 
              alt={weather.conditionLabel} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain filter drop-shadow-md"
            />
          </div>
          <div className="mt-2 text-center sm:text-left">
            <span className="inline-block bg-white/90 backdrop-blur-xs text-slate-800 text-xs font-bold px-3 py-1 rounded-lg border border-slate-200/60 shadow-2xs">
              {weather.conditionLabel}
            </span>
          </div>
        </div>

        {/* Temperature & Condition Text */}
        <div className="flex flex-col items-center sm:items-end text-center sm:text-right">
          <div className="flex items-baseline gap-1">
            <span className="text-6xl sm:text-7xl font-black text-[#0F172A] tracking-tight font-sans">
              {weather.tempC}
            </span>
            <span className="text-3xl font-extrabold text-[#F27D26]">
              °C
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-1 text-sm font-semibold text-slate-600">
            <Thermometer className="w-4 h-4 text-[#F27D26]" />
            <span>Feels like {weather.feelsLikeC}°C</span>
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Atmospheric Pressure: {weather.pressureHpa} hPa
          </p>
        </div>
      </div>

      {/* Bottom Stat Pills Inline */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
        {/* Visibility */}
        <div className="bg-[#F8FAFC] rounded-2xl p-2.5 border border-slate-200/60 flex items-center gap-2.5 shadow-2xs">
          <div className="p-2 rounded-xl bg-sky-100 text-sky-600">
            <Eye className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400">Visibility</span>
            <span className="text-xs font-extrabold text-slate-800">{weather.visibilityKm} km</span>
          </div>
        </div>

        {/* Humidity */}
        <div className="bg-[#F8FAFC] rounded-2xl p-2.5 border border-slate-200/60 flex items-center gap-2.5 shadow-2xs">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
            <Droplets className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400">Humidity</span>
            <span className="text-xs font-extrabold text-slate-800">{weather.humidityPercent}%</span>
          </div>
        </div>

        {/* Wind Speed */}
        <div className="bg-[#F8FAFC] rounded-2xl p-2.5 border border-slate-200/60 flex items-center gap-2.5 shadow-2xs">
          <div className="p-2 rounded-xl bg-indigo-100 text-indigo-600">
            <Wind className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400">Wind</span>
            <span className="text-xs font-extrabold text-slate-800">{weather.windKmH} km/h ({weather.windDirection})</span>
          </div>
        </div>

        {/* UV Index */}
        <div className="bg-[#F8FAFC] rounded-2xl p-2.5 border border-slate-200/60 flex items-center gap-2.5 shadow-2xs">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-600">
            <Sun className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-slate-400">UV Index</span>
            <span className="text-xs font-extrabold text-slate-800">{weather.uvIndex} / 10</span>
          </div>
        </div>
      </div>
    </div>
  );
};
