import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  MessageSquareText, 
  Bell, 
  MapPin, 
  Sparkles, 
  X,
  Compass
} from 'lucide-react';
import { CityLocation } from '../types/weather';
import { CITIES } from '../data/mockWeatherData';

interface NavbarProps {
  currentLocation: CityLocation;
  onSelectLocation: (city: CityLocation) => void;
  onOpenAIChat: () => void;
  onOpenNotifications: () => void;
  onOpenCalendar: () => void;
  activeAlertCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLocation,
  onSelectLocation,
  onOpenAIChat,
  onOpenNotifications,
  onOpenCalendar,
  activeAlertCount,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const filteredCities = CITIES.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCity = (city: CityLocation) => {
    onSelectLocation(city);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  // Format today's date in DD/MM/YYYY IST format
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  const formattedToday = `${day}/${month}/${year}`;

  return (
    <header id="top-navbar" className="sticky top-0 z-30 bg-white/70 backdrop-blur-md border-b border-[#E2E8F0] px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
      {/* Left Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-[#F27D26] flex items-center justify-center text-white shadow-md shadow-orange-500/20 font-bold text-xl">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 font-extrabold text-xl tracking-tight text-[#0F172A]">
            <span>Weather</span>
            <span className="text-white bg-[#F27D26] px-2 py-0.5 rounded-lg text-sm font-black">
              IQ
            </span>
          </div>
          <span className="text-[10px] font-medium text-slate-500 hidden sm:inline-block">
            Intelligent Decision Support (IST)
          </span>
        </div>
      </div>

      {/* Center Search Bar */}
      <div className="relative flex-1 max-w-md mx-2 sm:mx-4">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <input
            id="navbar-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            placeholder="Search location or activity (e.g. Cricket, Mumbai)..."
            className="w-full bg-[#F1F5F9] border border-slate-200/80 rounded-full pl-10 pr-9 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#F27D26]/30 focus:border-[#F27D26] shadow-xs transition-all"
          />
          {searchQuery && (
            <button 
              onClick={() => {
                setSearchQuery('');
                setIsSearchOpen(false);
              }}
              className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {isSearchOpen && (
          <>
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setIsSearchOpen(false)} 
            />
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-20 overflow-hidden max-h-72 overflow-y-auto">
              <div className="px-3.5 py-1.5 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Cities & Locations
              </div>
              {filteredCities.length > 0 ? (
                filteredCities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => handleSelectCity(city)}
                    className={`w-full text-left px-4 py-2.5 flex items-center justify-between text-sm hover:bg-orange-50/60 transition-colors ${
                      currentLocation.id === city.id ? 'bg-orange-50 text-orange-600 font-semibold' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <MapPin className="w-4 h-4 text-orange-500" />
                      <span>{city.name}, {city.region}</span>
                    </div>
                    <span className="text-xs text-slate-400">{city.country}</span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-slate-500 text-center">
                  No location found for &quot;{searchQuery}&quot;
                </div>
              )}

              <div className="border-t border-slate-100 mt-1 pt-1.5 px-3.5 py-1 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                Popular Activities
              </div>
              {['Cricket Window', 'Morning Running', 'Road Cycling', 'Outdoor Solar'].map((activity) => (
                <div
                  key={activity}
                  onClick={() => setIsSearchOpen(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                >
                  <Compass className="w-3.5 h-3.5 text-slate-400" />
                  <span>Check best time for <strong>{activity}</strong></span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Date Calendar Button */}
        <button
          id="btn-navbar-calendar"
          onClick={onOpenCalendar}
          className="hidden md:flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold px-3 py-2 rounded-full transition-colors shadow-xs"
          title="Today's Date"
        >
          <Calendar className="w-4 h-4 text-orange-500" />
          <span>{formattedToday}</span>
        </button>

        {/* AI Assistant Chat Button */}
        <button
          id="btn-navbar-ai-chat"
          onClick={onOpenAIChat}
          className="p-2.5 rounded-full bg-white hover:bg-orange-50 border border-slate-200 text-slate-700 hover:text-orange-600 transition-colors relative shadow-xs"
          title="Ask WeatherIQ AI"
        >
          <MessageSquareText className="w-4 h-4" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full animate-ping" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-orange-500 rounded-full" />
        </button>

        {/* Notifications Bell */}
        <button
          id="btn-navbar-notifications"
          onClick={onOpenNotifications}
          className="p-2.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 transition-colors relative shadow-xs"
          title="Smart Alerts"
        >
          <Bell className="w-4 h-4" />
          {activeAlertCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
              {activeAlertCount}
            </span>
          )}
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2.5 pl-1 sm:pl-2 border-l border-slate-200">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-slate-800 to-slate-900 text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-sm ring-1 ring-slate-200">
            AX
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-800 leading-none">
              Hello, Alex
            </span>
            <span className="text-[10px] text-slate-500 font-medium">
              Premium Member
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
