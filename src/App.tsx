/**
 * WeatherIQ – Intelligent Weather Decision Support System
 * Apache-2.0 License
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar, SidebarSection } from './components/Sidebar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { RouteMapCard } from './components/RouteMapCard';
import { MiniForecastList } from './components/MiniForecastList';
import { AirQualityCard } from './components/AirQualityCard';
import { HourlyTemperatureCard } from './components/HourlyTemperatureCard';
import { TomorrowCard } from './components/TomorrowCard';
import { PerfectWindowFinder } from './components/PerfectWindowFinder';
import { SmartAlertsBar } from './components/SmartAlertsBar';
import { RecommendationsGrid } from './components/RecommendationsGrid';
import { WeeklyForecastStrip } from './components/WeeklyForecastStrip';
import { WeatherAIChatModal } from './components/WeatherAIChatModal';
import { SettingsModal } from './components/SettingsModal';
import { NotificationsModal } from './components/NotificationsModal';

import { CITIES, MOCK_WEATHER_DATA } from './data/mockWeatherData';
import { CityLocation, TemperatureUnit } from './types/weather';

export default function App() {
  const [currentCity, setCurrentCity] = useState<CityLocation>(CITIES[0]);
  const [unit, setUnit] = useState<TemperatureUnit>('C');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(true);
  const [activeSection, setActiveSection] = useState<SidebarSection>('dashboard');

  // Modal visibility states
  const [isAIChatOpen, setIsAIChatOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);

  // Retrieve weather dataset for current selected city
  const activeWeather = MOCK_WEATHER_DATA[currentCity.id] || MOCK_WEATHER_DATA['mumbai'];

  const handleRefresh = () => {
    // Refresh weather feedback notification
    alert(`Refreshed atmospheric data for ${currentCity.name}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f2f9f5] via-[#f7f5f0] to-[#eaf3f8] text-slate-800 font-sans antialiased selection:bg-[#F27D26] selection:text-white">
      {/* 1. Top Navbar */}
      <Navbar
        currentLocation={currentCity}
        onSelectLocation={(city) => setCurrentCity(city)}
        onOpenAIChat={() => setIsAIChatOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenCalendar={() => alert(`Today is ${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}`)}
        activeAlertCount={activeWeather.alerts.length}
      />

      {/* Main Body with Left Sidebar + Content */}
      <div className="flex">
        {/* 2. Left Sidebar */}
        <Sidebar
          activeSection={activeSection}
          onSelectSection={(sec) => setActiveSection(sec)}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* 3. Main Content Container */}
        <main 
          className={`flex-1 p-4 lg:p-8 transition-all duration-300 max-w-7xl mx-auto space-y-6 ${
            isSidebarCollapsed ? 'pl-20' : 'pl-60'
          }`}
        >
          {/* TOP ROW (2-Column Grid) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT CARD: Current Weather */}
            <div className="lg:col-span-5">
              <CurrentWeatherCard
                location={currentCity}
                weather={activeWeather.current}
                onRefresh={handleRefresh}
              />
            </div>

            {/* RIGHT CARD: Weather-Aware Route Map */}
            <div className="lg:col-span-7">
              <RouteMapCard
                routes={activeWeather.routes}
              />
            </div>
          </div>

          {/* MIDDLE ROW (3-Column Layout) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* LEFT (Narrow): Stacked Mini Forecast Rows + Air Quality Card */}
            <div className="md:col-span-3 flex flex-col gap-4">
              <MiniForecastList
                currentLocationId={currentCity.id}
                onSelectCity={(city) => setCurrentCity(city)}
              />
              <AirQualityCard
                airQuality={activeWeather.airQuality}
              />
            </div>

            {/* CENTER (Wide): "How is the temperature today?" Hourly Card */}
            <div className="md:col-span-6">
              <HourlyTemperatureCard
                hourlyPoints={activeWeather.hourly}
              />
            </div>

            {/* RIGHT (Narrow): "Tomorrow's Forecast" Card */}
            <div className="md:col-span-3">
              <TomorrowCard
                forecast={activeWeather.tomorrow}
              />
            </div>
          </div>

          {/* NEW SECTION A: "Perfect Window Finder" Widget */}
          <PerfectWindowFinder
            hourlyData={activeWeather.hourly}
          />

          {/* NEW SECTION B: "Smart Alerts" Bar */}
          <SmartAlertsBar
            alerts={activeWeather.alerts}
          />

          {/* NEW SECTION C: "Personalized Recommendations" Grid */}
          <RecommendationsGrid
            recommendations={activeWeather.recommendations}
          />

          {/* NEW SECTION D: "7-Day Forecast" Horizontal Scroll Strip */}
          <WeeklyForecastStrip
            dailyList={activeWeather.daily}
          />
        </main>
      </div>

      {/* Popovers & Modals */}
      <WeatherAIChatModal
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        weatherData={activeWeather}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentLocation={currentCity}
        onSelectLocation={(c) => {
          setCurrentCity(c);
          setIsSettingsOpen(false);
        }}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        alerts={activeWeather.alerts}
      />
    </div>
  );
}
