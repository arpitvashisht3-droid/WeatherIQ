import React from 'react';
import { 
  X, 
  Settings, 
  Thermometer, 
  Wind, 
  Bell, 
  RotateCcw, 
  Check, 
  ShieldCheck,
  MapPin
} from 'lucide-react';
import { TemperatureUnit, CityLocation } from '../types/weather';
import { CITIES } from '../data/mockWeatherData';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: CityLocation;
  onSelectLocation: (city: CityLocation) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onSelectLocation,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 rounded-2xl bg-orange-100 text-[#F27D26]">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#0F172A]">
              WeatherIQ Preferences
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Configure Indian location defaults, metrics & push alerts
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs">
          {/* Temperature Unit - Locked to Celsius per IST Standard */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2.5">
              <Thermometer className="w-4 h-4 text-[#F27D26]" />
              <div>
                <span className="font-bold text-slate-800 block">Temperature Scale</span>
                <span className="text-[10px] text-slate-400 font-medium">Metric Standard (Celsius °C)</span>
              </div>
            </div>
            <span className="bg-[#F27D26]/10 text-[#F27D26] px-3 py-1 rounded-full border border-[#F27D26]/30 font-black text-xs">
              °C Only
            </span>
          </div>

          {/* Default City Picker */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#F27D26]" />
              <div>
                <span className="font-bold text-slate-800 block">Active Indian Metro</span>
                <span className="text-[10px] text-slate-400 font-medium">Default dashboard metro location</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {CITIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => onSelectLocation(c)}
                  className={`px-3 py-2 rounded-xl text-left font-bold transition-all flex items-center justify-between ${
                    currentLocation.id === c.id 
                      ? 'bg-[#F27D26] text-white shadow-xs' 
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span className="truncate">{c.name}</span>
                  {currentLocation.id === c.id && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          {/* Smart Notifications Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-[#F27D26]" />
              <div>
                <span className="font-bold text-slate-800 block">IMD / Monsoonal Push Alerts</span>
                <span className="text-[10px] text-slate-400 font-medium">Monsoon & Heatwave advisories</span>
              </div>
            </div>
            <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
              Enabled
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold rounded-2xl transition-colors"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};
