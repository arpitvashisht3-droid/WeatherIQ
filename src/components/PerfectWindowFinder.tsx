import React, { useState, useMemo } from 'react';
import { 
  Clock, 
  Target, 
  Sparkles, 
  CheckCircle2, 
  Flame, 
  Info,
  ChevronRight
} from 'lucide-react';
import { ActivityType, HourlyPoint, TimeWindowResult } from '../types/weather';
import { findPerfectWindow } from '../data/mockWeatherData';

interface PerfectWindowFinderProps {
  hourlyData: HourlyPoint[];
}

export const PerfectWindowFinder: React.FC<PerfectWindowFinderProps> = ({ hourlyData }) => {
  const [selectedActivity, setSelectedActivity] = useState<ActivityType>('Cricket');
  const [selectedDuration, setSelectedDuration] = useState<number>(2);

  const activities: ActivityType[] = [
    'Cricket',
    'Running',
    'Cycling',
    'Outdoor Photography',
    'Drone Flying',
    'Solar Generation',
    'Tennis',
    'Lawn Mowing',
    'Beach Visit',
  ];

  /**
   * PLACEHOLDER DSA FUNCTION INVOCATION:
   * Calls findPerfectWindow(selectedActivity, hourlyData, selectedDuration)
   * Future DSA extension point for sliding window optimization algorithm!
   */
  const windowResult: TimeWindowResult = useMemo(() => {
    return findPerfectWindow(selectedActivity, hourlyData, selectedDuration);
  }, [selectedActivity, hourlyData, selectedDuration]);

  return (
    <div 
      id="section-perfect-window"
      className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-7 border border-slate-800 text-white shadow-xl relative overflow-hidden"
    >
      {/* Glow background accent */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/20">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black tracking-tight text-white">
                Perfect Window Finder
              </h2>
              <span className="bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> DSA Decision Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Identifies optimal continuous outdoor time-slots by evaluating heat index, precipitation probability & wind vectors.
            </p>
          </div>
        </div>

        {/* Input Controls: Activity Dropdown + Duration */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Activity Dropdown */}
          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase text-slate-400 mb-1">
              Select Activity
            </label>
            <select
              id="select-window-activity"
              value={selectedActivity}
              onChange={(e) => setSelectedActivity(e.target.value as ActivityType)}
              className="bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
            >
              {activities.map((act) => (
                <option key={act} value={act}>
                  {act}
                </option>
              ))}
            </select>
          </div>

          {/* Duration Selector */}
          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase text-slate-400 mb-1">
              Duration
            </label>
            <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-bold">
              {[1, 2, 3].map((dur) => (
                <button
                  key={dur}
                  onClick={() => setSelectedDuration(dur)}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    selectedDuration === dur ? 'bg-orange-500 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {dur}h
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Result Display Banner */}
      <div className="mt-6 bg-slate-800/80 backdrop-blur-md rounded-2xl p-5 border border-slate-700/80 shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-lg shadow-orange-500/25">
            {windowResult.score}%
          </div>
          <div>
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-1">
              <Flame className="w-3.5 h-3.5" /> High Match Score for {selectedActivity}
            </span>
            <h3 className="text-base font-extrabold text-white mt-0.5">
              Best Window: <span className="text-orange-400 font-black">{windowResult.bestStartTime} – {windowResult.bestEndTime}</span>
            </h3>
            <p className="text-xs text-slate-300 font-medium mt-1">
              {windowResult.reason}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end lg:self-center">
          <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Recommended Slot
          </span>
        </div>
      </div>

      {/* Horizontal Timeline Bar with glowing recommended window */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
          <span>Daily Time-Slot Suitability Curve (6 AM – 9 PM)</span>
          <span className="text-orange-400 text-[11px] font-semibold">Glowing Orange = Best Window</span>
        </div>

        <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {hourlyData.map((h, idx) => {
            const isBestWindow = (idx >= 0 && idx <= 3); // Highlighted match hours
            return (
              <div
                key={h.time + idx}
                className={`group relative flex flex-col items-center justify-between p-2 rounded-xl border text-center transition-all ${
                  isBestWindow
                    ? 'bg-gradient-to-b from-orange-500 to-amber-600 text-white border-orange-400 shadow-lg shadow-orange-500/30 ring-2 ring-orange-400/50 scale-105 z-10'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600'
                }`}
              >
                <span className="text-[10px] font-bold block">{h.label}</span>
                <div className="my-1 text-xs font-black">
                  {h.tempC}°C
                </div>
                {/* Micro Score Pill */}
                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-md ${
                  isBestWindow ? 'bg-white/20 text-white' : 'bg-slate-900/60 text-slate-400'
                }`}>
                  {h.suitabilityScore}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info / Code Marker Note */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-orange-400" />
          <span>DSA logic placeholder: <code className="text-orange-300 font-mono">findPerfectWindow(activity, hourlyData)</code></span>
        </div>
        <button 
          onClick={() => alert(`Saved alert reminder for ${selectedActivity} at ${windowResult.bestStartTime}`)}
          className="text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1"
        >
          <span>Set Calendar Reminder</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
