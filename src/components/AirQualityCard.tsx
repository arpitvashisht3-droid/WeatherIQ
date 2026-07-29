import React from 'react';
import { Wind, ShieldCheck, Activity } from 'lucide-react';
import { AirQuality } from '../types/weather';

interface AirQualityCardProps {
  airQuality: AirQuality;
}

export const AirQualityCard: React.FC<AirQualityCardProps> = ({ airQuality }) => {
  // AQI level color bar mapping
  const getAQIBarWidth = (aqi: number) => Math.min(100, Math.max(10, (aqi / 150) * 100));

  return (
    <div 
      id="air-quality-card"
      className="bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-800 text-white shadow-md flex flex-col justify-between gap-3 relative overflow-hidden"
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-extrabold text-white">Air Quality & Pollutants</h4>
            <span className="text-[10px] text-slate-400 font-medium">Real-time Environmental Index</span>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
          <ShieldCheck className="w-3 h-3" />
          <span>{airQuality.label}</span>
        </div>
      </div>

      {/* Main AQI Number + Meter */}
      <div className="my-1 flex items-baseline justify-between">
        <div>
          <span className="text-3xl font-black tracking-tight text-white font-sans">
            AQI {airQuality.aqi}
          </span>
          <span className="text-xs text-slate-400 block font-medium">
            Air Quality Score
          </span>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 justify-end">
            <Activity className="w-3 h-3" /> Safe for Outdoor Exercise
          </span>
        </div>
      </div>

      {/* AQI Progress Bar */}
      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden p-0.5">
        <div 
          className="h-full bg-gradient-to-r from-emerald-400 via-yellow-400 to-rose-500 rounded-full transition-all duration-500"
          style={{ width: `${getAQIBarWidth(airQuality.aqi)}%` }}
        />
      </div>

      {/* Pollutant breakdown grid */}
      <div className="grid grid-cols-4 gap-1.5 pt-1 text-center border-t border-slate-800">
        <div className="bg-slate-800/60 p-1.5 rounded-xl">
          <span className="text-[9px] text-slate-400 block font-bold">PM2.5</span>
          <span className="text-xs font-black text-slate-200">{airQuality.pm25}</span>
        </div>
        <div className="bg-slate-800/60 p-1.5 rounded-xl">
          <span className="text-[9px] text-slate-400 block font-bold">PM10</span>
          <span className="text-xs font-black text-slate-200">{airQuality.pm10}</span>
        </div>
        <div className="bg-slate-800/60 p-1.5 rounded-xl">
          <span className="text-[9px] text-slate-400 block font-bold">O3</span>
          <span className="text-xs font-black text-slate-200">{airQuality.o3}</span>
        </div>
        <div className="bg-slate-800/60 p-1.5 rounded-xl">
          <span className="text-[9px] text-slate-400 block font-bold">NO2</span>
          <span className="text-xs font-black text-slate-200">{airQuality.no2}</span>
        </div>
      </div>
    </div>
  );
};
