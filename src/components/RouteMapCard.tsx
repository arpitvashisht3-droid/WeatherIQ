import React, { useState } from 'react';
import { 
  Navigation, 
  Plus, 
  Minus, 
  Crosshair, 
  Layers, 
  MapPin, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  Car
} from 'lucide-react';
import { RoutePlan, RouteWaypoint } from '../types/weather';

// Import stylized map background image
import mapBgImg from '../assets/images/stylized_map_1785079809182.jpg';

interface RouteMapCardProps {
  routes: RoutePlan[];
}

export const RouteMapCard: React.FC<RouteMapCardProps> = ({ routes }) => {
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);
  const activeRoute = routes[selectedRouteIndex] || routes[0];
  const [selectedWaypoint, setSelectedWaypoint] = useState<RouteWaypoint | null>(
    activeRoute?.waypoints?.[1] || activeRoute?.waypoints?.[0] || null
  );
  const [zoomLevel, setZoomLevel] = useState(100);
  const [activeLayer, setActiveLayer] = useState<'weather' | 'traffic' | 'terrain'>('weather');

  if (!activeRoute) return null;

  return (
    <div 
      id="route-map-card"
      className="relative overflow-hidden rounded-[2rem] bg-[#0F172A] border border-slate-800 shadow-md shadow-slate-900/10 flex flex-col justify-between min-h-[320px] group select-none"
    >
      {/* Background Map Image with Scale Effect */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-70 transition-transform duration-500 pointer-events-none"
        style={{ 
          backgroundImage: `url(${mapBgImg})`,
          transform: `scale(${zoomLevel / 100})`
        }}
      />
      {/* Overlay tint gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-slate-900/60 pointer-events-none" />

      {/* Top Map Header Bar */}
      <div className="relative z-10 p-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#F27D26]/20 text-[#F27D26] border border-[#F27D26]/30 backdrop-blur-md">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <span>Weather-Aware Highway Route Map</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                activeRoute.overallHazardLevel === 'Low' 
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
              }`}>
                {activeRoute.overallHazardLevel} Hazard
              </span>
            </h3>
            <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
              <Car className="w-3.5 h-3.5 text-[#F27D26]" />
              <span>{activeRoute.origin} → {activeRoute.destination} ({activeRoute.totalDistanceKm} km, ~{activeRoute.totalDurationMinutes} mins)</span>
            </p>
          </div>
        </div>

        {/* Route Selector Dropdown */}
        {routes.length > 1 && (
          <select
            id="route-selector"
            value={selectedRouteIndex}
            onChange={(e) => {
              const idx = Number(e.target.value);
              setSelectedRouteIndex(idx);
              if (routes[idx]?.waypoints?.[0]) {
                setSelectedWaypoint(routes[idx].waypoints[1] || routes[idx].waypoints[0]);
              }
            }}
            className="bg-slate-800/90 text-white text-xs font-medium px-3 py-1.5 rounded-full border border-slate-700 focus:outline-none focus:ring-2 focus:ring-[#F27D26] backdrop-blur-md cursor-pointer"
          >
            {routes.map((r, i) => (
              <option key={r.destination} value={i}>
                Route: {r.origin} → {r.destination}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Interactive Map Waypoints Layer */}
      <div className="relative z-10 flex-1 min-h-[180px] my-2">
        {/* Draw SVG Route Path Line */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F27D26" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <path
            d={`M ${activeRoute.waypoints.map(wp => `${wp.mapXPercent}% ${wp.mapYPercent}%`).join(' L ')}`}
            fill="none"
            stroke="url(#routeGrad)"
            strokeWidth="4"
            strokeDasharray="6 4"
            className="animate-pulse"
          />
        </svg>

        {/* Render Waypoint Pins on Map */}
        {activeRoute.waypoints.map((wp) => {
          const isSelected = selectedWaypoint?.id === wp.id;

          return (
            <div
              key={wp.id}
              onClick={() => setSelectedWaypoint(wp)}
              style={{
                left: `${wp.mapXPercent}%`,
                top: `${wp.mapYPercent}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group/pin"
            >
              {/* Waypoint Pin Badge */}
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold shadow-lg border transition-all duration-200 ${
                isSelected 
                  ? 'bg-[#F27D26] text-white border-white scale-110 ring-4 ring-orange-500/30' 
                  : wp.hasAlert 
                    ? 'bg-amber-500 text-slate-900 border-amber-300 hover:scale-105'
                    : 'bg-slate-900/90 text-slate-100 border-slate-700 hover:bg-slate-800'
              }`}>
                <MapPin className="w-3.5 h-3.5" />
                <span>{wp.tempC}°C</span>
                {wp.hasAlert && <AlertTriangle className="w-3 h-3 text-slate-900 animate-bounce" />}
              </div>
            </div>
          );
        })}

        {/* Selected Pin Popup Card */}
        {selectedWaypoint && (
          <div className="absolute left-6 bottom-4 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3.5 shadow-2xl text-white max-w-xs z-20 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold text-[#F27D26] uppercase tracking-wider">
                  Waypoint Checkpoint
                </span>
                <h4 className="text-xs font-extrabold text-white">
                  {selectedWaypoint.name}
                </h4>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Distance: {selectedWaypoint.distanceFromStartKm} km from origin
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-white font-sans">
                  {selectedWaypoint.tempC}°C
                </span>
                <div className="text-[10px] text-slate-400 font-medium">
                  {selectedWaypoint.conditionLabel}
                </div>
              </div>
            </div>

            {selectedWaypoint.hasAlert ? (
              <div className="mt-2 text-[11px] text-amber-300 bg-amber-500/20 border border-amber-500/30 rounded-lg p-2 flex items-center gap-1.5 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{selectedWaypoint.alertText || 'Hazard caution along route segment'}</span>
              </div>
            ) : (
              <div className="mt-2 text-[11px] text-emerald-300 bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-1.5 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                <span>Optimal driving conditions. Clear visibility.</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Map Controls on Right Edge */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-1.5">
        <button
          onClick={() => setZoomLevel(prev => Math.min(prev + 20, 160))}
          className="p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-700 shadow-md backdrop-blur-md transition-colors"
          title="Zoom In"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel(prev => Math.max(prev - 20, 80))}
          className="p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-700 shadow-md backdrop-blur-md transition-colors"
          title="Zoom Out"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel(100)}
          className="p-2 bg-slate-900/90 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-700 shadow-md backdrop-blur-md transition-colors"
          title="Recenter Map"
        >
          <Crosshair className="w-4 h-4" />
        </button>
        <button
          onClick={() => setActiveLayer(prev => prev === 'weather' ? 'traffic' : prev === 'traffic' ? 'terrain' : 'weather')}
          className="p-2 bg-slate-900/90 hover:bg-slate-800 text-[#F27D26] rounded-xl border border-slate-700 shadow-md backdrop-blur-md transition-colors"
          title={`Layer: ${activeLayer}`}
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Bottom Route Summary Strip */}
      <div className="relative z-10 px-5 py-3 bg-slate-950/80 backdrop-blur-md border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#F27D26] shrink-0" />
          <span>Active Layer: <strong className="text-white capitalize">{activeLayer} Overlay</strong></span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-slate-400">Click any pin to inspect segment risk</span>
          <span className="font-semibold text-[#F27D26] bg-[#F27D26]/10 px-2.5 py-1 rounded-full border border-[#F27D26]/20">
            Route Safe
          </span>
        </div>
      </div>
    </div>
  );
};
