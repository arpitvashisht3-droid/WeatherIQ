import React, { useState } from 'react';
import { 
  Calendar, 
  Sun, 
  CloudRain, 
  Cloud, 
  CloudFog, 
  Zap, 
  Droplets, 
  Wind,
  ChevronRight,
  X
} from 'lucide-react';
import { DailyForecast } from '../types/weather';

interface WeeklyForecastStripProps {
  dailyList: DailyForecast[];
}

export const WeeklyForecastStrip: React.FC<WeeklyForecastStripProps> = ({ dailyList }) => {
  const [selectedDay, setSelectedDay] = useState<DailyForecast | null>(null);

  const renderIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="w-6 h-6 text-amber-500" />;
      case 'rainy':
        return <CloudRain className="w-6 h-6 text-sky-500" />;
      case 'thunderstorm':
        return <Zap className="w-6 h-6 text-amber-600" />;
      case 'foggy':
        return <CloudFog className="w-6 h-6 text-slate-400" />;
      default:
        return <Cloud className="w-6 h-6 text-slate-400" />;
    }
  };

  return (
    <div 
      id="section-weekly-forecast"
      className="bg-white rounded-[2rem] p-5 sm:p-6 border border-slate-200/80 shadow-md flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#F27D26] text-white shadow-xs">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#0F172A]">
              7-Day Extended Weather Outlook
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Click any day to inspect full atmospheric breakdown & summary
            </p>
          </div>
        </div>
      </div>

      {/* 7 Horizontal Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
        {dailyList.map((dayItem, idx) => {
          const isToday = idx === 0;

          return (
            <button
              key={dayItem.day + idx}
              onClick={() => setSelectedDay(dayItem)}
              className={`flex flex-col items-center text-center p-3.5 rounded-2xl border transition-all cursor-pointer group hover:scale-[1.03] ${
                isToday 
                  ? 'bg-gradient-to-b from-orange-50 to-amber-50/50 border-[#F27D26]/40 shadow-xs ring-1 ring-orange-400/30' 
                  : 'bg-slate-50/80 hover:bg-white border-slate-200/80 hover:border-orange-200 shadow-2xs'
              }`}
            >
              <span className={`text-xs font-black uppercase ${isToday ? 'text-[#F27D26]' : 'text-slate-800'}`}>
                {isToday ? 'Today' : dayItem.day}
              </span>
              <span className="text-[10px] font-bold text-slate-400 mt-0.5">
                {dayItem.date}
              </span>

              <div className="my-2.5 transform group-hover:scale-110 transition-transform">
                {renderIcon(dayItem.condition)}
              </div>

              <div className="flex items-baseline justify-center gap-1 my-0.5">
                <span className="text-sm font-black text-[#0F172A] font-sans">
                  {dayItem.tempHighC}°
                </span>
                <span className="text-xs font-bold text-slate-400">
                  /{dayItem.tempLowC}°C
                </span>
              </div>

              <span className="text-[10px] font-bold text-slate-500 truncate max-w-full mt-0.5">
                {dayItem.conditionLabel}
              </span>

              {/* Rain chance badge */}
              {dayItem.precipChancePercent > 10 && (
                <span className="mt-2 text-[9px] font-extrabold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                  <Droplets className="w-2.5 h-2.5" />
                  {dayItem.precipChancePercent}%
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Day Modal */}
      {selectedDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <button
              onClick={() => setSelectedDay(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-orange-100 text-[#F27D26]">
                {renderIcon(selectedDay.condition)}
              </div>
              <div>
                <span className="text-xs font-bold uppercase text-[#F27D26]">
                  {selectedDay.fullDayName} • {selectedDay.date}
                </span>
                <h3 className="text-base font-extrabold text-[#0F172A]">
                  {selectedDay.conditionLabel}
                </h3>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">High Temp</span>
                  <span className="text-sm font-black text-[#0F172A]">{selectedDay.tempHighC}°C</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase">Low Temp</span>
                  <span className="text-sm font-black text-[#0F172A]">{selectedDay.tempLowC}°C</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 p-2.5 bg-sky-50 rounded-xl border border-sky-100 text-sky-900">
                  <Droplets className="w-4 h-4 text-sky-600" />
                  <span>Rain Chance: <strong>{selectedDay.precipChancePercent}%</strong></span>
                </div>
                <div className="flex items-center gap-2 p-2.5 bg-indigo-50 rounded-xl border border-indigo-100 text-indigo-900">
                  <Wind className="w-4 h-4 text-indigo-600" />
                  <span>Wind: <strong>{selectedDay.windKmH} km/h</strong></span>
                </div>
              </div>

              <div className="bg-orange-50 p-3 rounded-2xl border border-orange-200 text-orange-950">
                <h4 className="font-bold mb-0.5">Day Summary:</h4>
                <p>{selectedDay.summary}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedDay(null)}
              className="mt-5 w-full py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold rounded-2xl"
            >
              Close Breakdown
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
