import React from 'react';
import { CalendarDays, Umbrella, Briefcase, ChevronRight } from 'lucide-react';
import { TomorrowForecast } from '../types/weather';

// Import image generated
import characterImg from '../assets/images/tomorrow_character_1785079795615.jpg';

interface TomorrowCardProps {
  forecast: TomorrowForecast;
}

export const TomorrowCard: React.FC<TomorrowCardProps> = ({ forecast }) => {
  return (
    <div 
      id="tomorrow-forecast-card"
      className="bg-[#E7F5E9] rounded-[2rem] p-5 sm:p-6 border border-emerald-200/80 shadow-md flex flex-col justify-between h-full relative overflow-hidden group"
    >
      {/* Background subtle leaf glow */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-300/30 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-700 text-white shadow-xs">
            <CalendarDays className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-900">
              Next Day Outlook
            </span>
            <h3 className="text-sm font-extrabold text-[#0F172A]">
              Tomorrow&apos;s Forecast
            </h3>
          </div>
        </div>
        <span className="text-xs font-bold text-emerald-900 bg-emerald-200/80 px-2.5 py-1 rounded-full border border-emerald-300/60">
          {forecast.locationName}
        </span>
      </div>

      {/* Center Row: Character Image + Main Temp */}
      <div className="relative z-10 my-3 flex items-center justify-between gap-3">
        {/* Character Illustration */}
        <div className="relative shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-white/80 p-1 border border-emerald-200 shadow-xs flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
            <img 
              src={characterImg} 
              alt="Tomorrow weather character" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain filter drop-shadow-xs"
            />
          </div>
        </div>

        {/* Temperature & Conditions */}
        <div className="flex flex-col text-right">
          <div className="flex items-baseline justify-end gap-1">
            <span className="text-3xl sm:text-4xl font-black text-emerald-950 font-sans">
              {forecast.tempHighC}°
            </span>
            <span className="text-sm font-bold text-emerald-700">
              / {forecast.tempLowC}°C
            </span>
          </div>
          <span className="text-xs font-bold text-emerald-900 mt-0.5">
            {forecast.conditionLabel}
          </span>
          <p className="text-[11px] text-emerald-900/90 font-medium mt-1 leading-snug max-w-[170px]">
            {forecast.summary}
          </p>
        </div>
      </div>

      {/* Outfit & Travel Tip Banner */}
      <div className="relative z-10 bg-white/90 backdrop-blur-xs rounded-2xl p-3 border border-emerald-200/80 shadow-2xs space-y-2 text-xs">
        <div className="flex items-start gap-2">
          <Umbrella className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
          <span className="text-slate-800 font-medium">
            <strong>Outfit:</strong> {forecast.outfitRecommendation}
          </span>
        </div>
        <div className="flex items-start gap-2 border-t border-emerald-100 pt-1.5">
          <Briefcase className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
          <span className="text-slate-800 font-medium">
            <strong>Travel Tip:</strong> {forecast.travelTip}
          </span>
        </div>
      </div>

      {/* Bottom CTA */}
      <button 
        onClick={() => alert(`Detailed tomorrow timeline for ${forecast.locationName}`)}
        className="relative z-10 mt-3 w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors shadow-xs"
      >
        <span>View Full 24-Hour Tomorrow Report</span>
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
