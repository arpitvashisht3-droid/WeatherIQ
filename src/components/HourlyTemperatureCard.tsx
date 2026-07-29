import React, { useState } from 'react';
import { 
  Thermometer, 
  Wind, 
  CloudRain, 
  Sun, 
  Cloud, 
  Clock,
  Sparkles
} from 'lucide-react';
import { HourlyPoint, TemperatureUnit } from '../types/weather';

interface HourlyTemperatureCardProps {
  hourlyPoints: HourlyPoint[];
}

export const HourlyTemperatureCard: React.FC<HourlyTemperatureCardProps> = ({
  hourlyPoints,
}) => {
  const [activeTab, setActiveTab] = useState<'temp' | 'wind' | 'rain'>('temp');

  // Filter 4 representational hourly periods: Morning (~08:00 AM), Afternoon (~01:00 PM), Evening (~06:00 PM), Night (~09:00 PM)
  const morningPoint = hourlyPoints.find(h => h.period === 'Morning' && (h.time.includes('08') || h.label.includes('08'))) || hourlyPoints[2] || hourlyPoints[0];
  const afternoonPoint = hourlyPoints.find(h => h.period === 'Afternoon' && (h.time.includes('13') || h.time.includes('01') || h.label.includes('01'))) || hourlyPoints[7] || hourlyPoints[1];
  const eveningPoint = hourlyPoints.find(h => h.period === 'Evening' && (h.time.includes('18') || h.time.includes('06') || h.label.includes('06'))) || hourlyPoints[12] || hourlyPoints[2];
  const nightPoint = hourlyPoints.find(h => h.period === 'Night' && (h.time.includes('21') || h.time.includes('09') || h.label.includes('09'))) || hourlyPoints[15] || hourlyPoints[3];

  const fourPeriods = [
    { title: 'Morning', timeLabel: morningPoint?.label || '08:00 AM', data: morningPoint, isHighlight: false },
    { title: 'Afternoon', timeLabel: afternoonPoint?.label || '01:00 PM', data: afternoonPoint, isHighlight: true },
    { title: 'Evening', timeLabel: eveningPoint?.label || '06:00 PM', data: eveningPoint, isHighlight: false },
    { title: 'Night', timeLabel: nightPoint?.label || '09:00 PM', data: nightPoint, isHighlight: false },
  ];

  const renderWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny':
        return <Sun className="w-8 h-8 text-amber-500 animate-spin-slow" />;
      case 'rainy':
      case 'thunderstorm':
        return <CloudRain className="w-8 h-8 text-sky-500" />;
      default:
        return <Cloud className="w-8 h-8 text-slate-400" />;
    }
  };

  return (
    <div 
      id="hourly-temperature-card"
      className="bg-white rounded-[2rem] p-5 sm:p-6 border border-slate-200/80 shadow-md flex flex-col justify-between h-full"
    >
      {/* Top Title & Interactive View Tabs */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-2">
            <span>How is the temperature today?</span>
            <Sparkles className="w-4 h-4 text-[#F27D26]" />
          </h3>
          <p className="text-xs text-slate-500 font-medium">
            Diurnal curve breakdown by key daily intervals (IST)
          </p>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex items-center bg-slate-100/80 p-1 rounded-full border border-slate-200/60 text-xs font-bold">
          <button
            onClick={() => setActiveTab('temp')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              activeTab === 'temp' ? 'bg-[#F27D26] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" />
            <span>Temp</span>
          </button>
          <button
            onClick={() => setActiveTab('wind')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              activeTab === 'wind' ? 'bg-[#F27D26] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Wind</span>
          </button>
          <button
            onClick={() => setActiveTab('rain')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
              activeTab === 'rain' ? 'bg-[#F27D26] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>Rain</span>
          </button>
        </div>
      </div>

      {/* 4-Column Hourly Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
        {fourPeriods.map((period, idx) => {
          const item = period.data;
          if (!item) return null;

          const displayValue = activeTab === 'temp' 
            ? `${item.tempC}°C`
            : activeTab === 'wind'
              ? `${item.windKmH} km/h`
              : `${item.precipChancePercent}%`;

          return (
            <div
              key={period.title + idx}
              className={`rounded-2xl p-4 border transition-all hover:scale-[1.02] flex flex-col items-center text-center group ${
                period.isHighlight
                  ? 'bg-gradient-to-b from-orange-500/10 to-orange-100/40 border-[#F27D26]/40 shadow-xs'
                  : 'bg-gradient-to-b from-slate-50/80 to-slate-100/50 hover:from-orange-50/50 hover:to-orange-100/30 border-slate-200/60 shadow-2xs'
              }`}
            >
              <span className={`text-[11px] font-bold uppercase tracking-wider ${period.isHighlight ? 'text-[#F27D26]' : 'text-slate-400'}`}>
                {period.title}
              </span>
              <span className="text-xs text-slate-600 font-semibold flex items-center gap-1 mt-0.5 mb-2">
                <Clock className="w-3 h-3 text-[#F27D26]" />
                {period.timeLabel}
              </span>

              <div className="my-1.5 transform group-hover:scale-110 transition-transform">
                {renderWeatherIcon(item.condition)}
              </div>

              <span className="text-xl font-black text-[#0F172A] mt-1 font-sans">
                {displayValue}
              </span>

              <span className="text-[10px] text-slate-500 font-medium capitalize mt-1">
                {item.condition.replace('_', ' ')}
              </span>
            </div>
          );
        })}
      </div>

      {/* Hourly Timeline Mini Scroller Strip */}
      <div className="pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-2">
          <span>Continuous Hourly Trend</span>
          <span className="text-[#F27D26] font-semibold">16-Hour Lookahead</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {hourlyPoints.slice(0, 10).map((hp, i) => (
            <div key={i} className="flex-shrink-0 bg-slate-50 border border-slate-100 rounded-xl px-2.5 py-1.5 text-center min-w-[62px]">
              <span className="text-[10px] text-slate-400 block font-semibold">{hp.label}</span>
              <span className="text-xs font-bold text-slate-800 block">{hp.tempC}°C</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
