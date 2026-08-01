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
  Car,
  Search,
  Loader2,
  ArrowRight,
  CloudSun,
  Thermometer,
  ShieldCheck,
  ShieldAlert,
  Lightbulb,
  Route,
  Gauge,
  ChevronRight,
} from 'lucide-react';
import { planRoute, RouteApiResponse, RouteApiEdge } from '../services/api';

// Import stylized map background image
import mapBgImg from '../assets/images/stylized_map_1785079809182.jpg';

interface RouteMapCardProps {
  routes?: unknown[]; // kept for prop compatibility
}

// ─── helpers ────────────────────────────────────────────────────────────────

/** Weather string → display label + Tailwind colour token */
function weatherMeta(condition: string): { label: string; dot: string; bg: string } {
  const c = (condition ?? '').toLowerCase();
  if (c.includes('thunder') || c.includes('storm'))
    return { label: 'Thunderstorm', dot: 'bg-rose-500',    bg: 'bg-rose-500/10 border-rose-500/30 text-rose-300' };
  if (c.includes('rain') || c.includes('drizzle'))
    return { label: 'Rainy',        dot: 'bg-blue-400',    bg: 'bg-blue-500/10 border-blue-400/30 text-blue-300' };
  if (c.includes('snow'))
    return { label: 'Snowy',        dot: 'bg-sky-200',     bg: 'bg-sky-100/10 border-sky-300/30 text-sky-200' };
  if (c.includes('fog') || c.includes('mist'))
    return { label: 'Foggy',        dot: 'bg-slate-400',   bg: 'bg-slate-400/10 border-slate-400/30 text-slate-300' };
  if (c.includes('cloud') || c.includes('overcast'))
    return { label: 'Cloudy',       dot: 'bg-blue-300',    bg: 'bg-blue-300/10 border-blue-300/30 text-blue-200' };
  if (c.includes('clear') || c.includes('sunny') || c.includes('fair'))
    return { label: 'Clear',        dot: 'bg-yellow-400',  bg: 'bg-yellow-400/10 border-yellow-400/30 text-yellow-300' };
  return   { label: condition || 'N/A', dot: 'bg-slate-400', bg: 'bg-slate-400/10 border-slate-400/30 text-slate-300' };
}

/** travel_risk → hazard classification */
function hazardLevel(risk: string | null): 'Low' | 'Moderate' | 'High' {
  if (!risk) return 'Low';
  const r = risk.toLowerCase();
  if (r.includes('high') || r.includes('severe')) return 'High';
  if (r.includes('moderate') || r.includes('medium')) return 'Moderate';
  return 'Low';
}

/** Position N cities across the map in a gentle arc */
function buildMapPositions(n: number): { x: number; y: number }[] {
  if (n === 0) return [];
  if (n === 1) return [{ x: 50, y: 50 }];
  return Array.from({ length: n }, (_, i) => ({
    x: 8 + (i / (n - 1)) * 84,
    y: 30 + Math.sin((i / (n - 1)) * Math.PI) * 38,
  }));
}

// ─── sub-components ──────────────────────────────────────────────────────────

/** One edge segment card in the scrollable list */
const EdgeCard: React.FC<{ edge: RouteApiEdge; index: number; isLast: boolean }> = ({
  edge,
  index,
  isLast,
}) => {
  const wm = weatherMeta(edge.weather);
  return (
    <div className="flex gap-3 items-start">
      {/* Timeline column */}
      <div className="flex flex-col items-center shrink-0">
        <div className="w-6 h-6 rounded-full bg-[#F27D26]/20 border border-[#F27D26]/50 flex items-center justify-center text-[10px] font-black text-[#F27D26]">
          {index + 1}
        </div>
        {!isLast && <div className="w-px flex-1 bg-slate-700 mt-1 min-h-[24px]" />}
      </div>

      {/* Card body */}
      <div className="flex-1 mb-3 bg-slate-800/60 border border-slate-700/60 rounded-xl p-3 text-white">
        {/* Cities */}
        <div className="flex items-center gap-1.5 mb-2 text-xs font-bold">
          <span className="text-slate-200">{edge.from}</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#F27D26] shrink-0" />
          <span className="text-slate-200">{edge.to}</span>
        </div>

        {/* Metrics row */}
        <div className="flex flex-wrap gap-2">
          {/* Distance */}
          {edge.distance_km !== null && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-300 bg-slate-700/60 border border-slate-600/40 rounded-lg px-2 py-0.5">
              <Route className="w-3 h-3 text-slate-400" />
              {edge.distance_km} km
            </span>
          )}

          {/* Weather condition */}
          <span className={`flex items-center gap-1 text-[10px] font-semibold rounded-lg px-2 py-0.5 border ${wm.bg}`}>
            <span className={`w-2 h-2 rounded-full shrink-0 ${wm.dot}`} />
            {wm.label}
          </span>

          {/* Temperature */}
          {edge.temperature_c !== undefined && (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-sky-300 bg-sky-500/10 border border-sky-400/30 rounded-lg px-2 py-0.5">
              <Thermometer className="w-3 h-3 text-sky-400" />
              {edge.temperature_c}°C
            </span>
          )}

          {/* Weather penalty */}
          <span className={`flex items-center gap-1 text-[10px] font-semibold rounded-lg px-2 py-0.5 border ${
            edge.weather_penalty === 0
              ? 'text-emerald-300 bg-emerald-500/10 border-emerald-400/30'
              : edge.weather_penalty < 100
              ? 'text-amber-300 bg-amber-500/10 border-amber-400/30'
              : 'text-rose-300 bg-rose-500/10 border-rose-400/30'
          }`}>
            <Gauge className="w-3 h-3" />
            Penalty {edge.weather_penalty}
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── main component ──────────────────────────────────────────────────────────

export const RouteMapCard: React.FC<RouteMapCardProps> = () => {
  const [source,      setSource]      = useState('');
  const [destination, setDestination] = useState('');
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [result,      setResult]      = useState<RouteApiResponse | null>(null);
  const [zoomLevel,   setZoomLevel]   = useState(100);
  const [activeLayer, setActiveLayer] = useState<'weather' | 'traffic' | 'terrain'>('weather');

  // derived
  const cities       = result?.route   ?? [];
  const edges        = result?.edges   ?? [];
  const hazard       = hazardLevel(result?.travel_risk ?? null);
  const mapPositions = buildMapPositions(cities.length);

  // ── api call ────────────────────────────────────────────────────────────
  const handlePlan = async () => {
    const src = source.trim();
    const dst = destination.trim();
    if (!src || !dst) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await planRoute(src, dst);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handlePlan();
  };

  // ── render ───────────────────────────────────────────────────────────────
  return (
    <div
      id="route-map-card"
      className="relative overflow-hidden rounded-[2rem] bg-[#0F172A] border border-slate-800 shadow-md shadow-slate-900/10 flex flex-col min-h-[420px] select-none"
    >
      {/* Map background (top half only) */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-60 transition-transform duration-500 pointer-events-none"
        style={{
          backgroundImage: `url(${mapBgImg})`,
          transform: `scale(${zoomLevel / 100})`,
          height: '55%',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-950/80 to-[#0F172A] pointer-events-none" />

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="relative z-10 p-5 pb-2 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#F27D26]/20 text-[#F27D26] border border-[#F27D26]/30">
            <Navigation className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2 flex-wrap">
              <span>Weather-Aware Route Map</span>
              {result && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  hazard === 'Low'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : hazard === 'High'
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  {hazard} Hazard
                </span>
              )}
            </h3>

            {/* route_display — shown as main route breadcrumb */}
            <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
              <Car className="w-3.5 h-3.5 text-[#F27D26] shrink-0" />
              {result
                ? result.route_display          // ← backend route_display field
                : 'Enter origin & destination to plan your route'}
              {result?.distance_km && (
                <span className="text-slate-500 ml-1">· {result.distance_km} km</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ── Search inputs ─────────────────────────────────────────────────── */}
      <div className="relative z-10 px-5 pb-3 flex flex-wrap items-center gap-2">
        <input
          id="route-source-input"
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Origin city"
          className="flex-1 min-w-[110px] bg-slate-800/90 text-white text-xs font-medium px-3 py-2 rounded-full border border-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#F27D26] backdrop-blur-md"
        />
        <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          id="route-destination-input"
          type="text"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Destination city"
          className="flex-1 min-w-[110px] bg-slate-800/90 text-white text-xs font-medium px-3 py-2 rounded-full border border-slate-700 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#F27D26] backdrop-blur-md"
        />
        <button
          id="btn-plan-route"
          onClick={handlePlan}
          disabled={loading}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#F27D26] hover:bg-orange-500 disabled:bg-slate-700 text-white text-xs font-bold rounded-full transition-colors shadow-md shrink-0"
        >
          {loading
            ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
            : <Search className="w-3.5 h-3.5" />}
          {loading ? 'Planning…' : 'Plan Route'}
        </button>
      </div>

      {/* ── Map viewport with waypoint pins ───────────────────────────────── */}
      <div className="relative z-10 h-[140px] mx-3 rounded-2xl overflow-hidden border border-slate-700/50">
        {/* SVG path */}
        {result && cities.length > 1 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <linearGradient id="routeGrad" x1="0%" y1="50%" x2="100%" y2="50%">
                <stop offset="0%"   stopColor="#F27D26" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            <path
              d={`M ${mapPositions.map((p) => `${p.x}% ${p.y}%`).join(' L ')}`}
              fill="none"
              stroke="url(#routeGrad)"
              strokeWidth="3"
              strokeDasharray="6 4"
              className="animate-pulse"
            />
          </svg>
        )}

        {/* Waypoint pins — all cities including intermediates */}
        {result && cities.map((city, i) => {
          const edgeForPin = edges[i] ?? edges[i - 1] ?? null;
          const tempC = edgeForPin?.temperature_c ?? result.temperature_c ?? null;
          const isFirst = i === 0;
          const isLast  = i === cities.length - 1;

          return (
            <div
              key={`pin-${i}`}
              style={{ left: `${mapPositions[i]?.x ?? 50}%`, top: `${mapPositions[i]?.y ?? 50}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-lg border ${
                isFirst
                  ? 'bg-emerald-600 text-white border-emerald-400'
                  : isLast
                  ? 'bg-[#F27D26] text-white border-orange-400'
                  : 'bg-slate-800/95 text-slate-100 border-slate-600'
              }`}>
                <MapPin className="w-2.5 h-2.5 shrink-0" />
                <span>{city}</span>
                {tempC !== null && <span className="ml-0.5 opacity-80">· {tempC}°C</span>}
              </div>
            </div>
          );
        })}

        {/* Idle / loading overlay for the map area */}
        {!result && !loading && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-[2px]">
            <div className="text-center text-slate-500 text-xs pointer-events-none">
              <Navigation className="w-6 h-6 mx-auto mb-1 opacity-25" />
              <p>Route will appear here</p>
            </div>
          </div>
        )}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900/70 backdrop-blur-[2px]">
            <Loader2 className="w-7 h-7 text-[#F27D26] animate-spin" />
          </div>
        )}
      </div>

      {/* ── Intermediate cities breadcrumb (route_display) ─────────────────── */}
      {result && cities.length > 2 && (
        <div className="relative z-10 px-5 pt-3 pb-1 flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mr-1">
            Via
          </span>
          {cities.slice(1, -1).map((city, i) => (
            <span key={i} className="flex items-center gap-1 text-[10px] font-medium text-slate-300 bg-slate-800/60 border border-slate-700 px-2 py-0.5 rounded-full">
              <MapPin className="w-2.5 h-2.5 text-[#F27D26]" />
              {city}
            </span>
          ))}
        </div>
      )}

      {/* ── Edge segment cards ─────────────────────────────────────────────── */}
      {result && edges.length > 0 && (
        <div className="relative z-10 px-5 pt-3 pb-2">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Route className="w-3 h-3" />
            Route Segments · {edges.length} segment{edges.length > 1 ? 's' : ''}
          </div>
          {/* Scrollable list */}
          <div className="max-h-[220px] overflow-y-auto pr-1 space-y-0 scrollbar-thin scrollbar-thumb-slate-700">
            {edges.map((edge, i) => (
              <EdgeCard
                key={`edge-${i}`}
                edge={edge}
                index={i}
                isLast={i === edges.length - 1}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Error state ─────────────────────────────────────────────────────── */}
      {error && (
        <div className="relative z-10 mx-5 mb-3 bg-rose-900/40 border border-rose-700/60 rounded-2xl p-4 text-rose-200 text-xs text-center">
          <AlertTriangle className="w-5 h-5 text-rose-400 mx-auto mb-1" />
          <p className="font-bold mb-0.5">Route Planning Failed</p>
          <p className="text-rose-300">{error}</p>
        </div>
      )}

      {/* ── Idle empty state ─────────────────────────────────────────────────── */}
      {!loading && !error && !result && (
        <div className="relative z-10 px-5 pb-4 text-center text-slate-600 text-xs">
          Enter a source and destination above, then press <strong className="text-slate-400">Plan Route</strong>
        </div>
      )}

      {/* ── Map controls ────────────────────────────────────────────────────── */}
      <div className="absolute right-4 top-28 z-20 flex flex-col gap-1.5">
        <button onClick={() => setZoomLevel(p => Math.min(p + 20, 160))}
          className="p-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-700 shadow-md backdrop-blur-md transition-colors"
          title="Zoom In"><Plus className="w-3.5 h-3.5" /></button>
        <button onClick={() => setZoomLevel(p => Math.max(p - 20, 80))}
          className="p-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-700 shadow-md backdrop-blur-md transition-colors"
          title="Zoom Out"><Minus className="w-3.5 h-3.5" /></button>
        <button onClick={() => setZoomLevel(100)}
          className="p-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 rounded-xl border border-slate-700 shadow-md backdrop-blur-md transition-colors"
          title="Reset"><Crosshair className="w-3.5 h-3.5" /></button>
        <button onClick={() => setActiveLayer(p => p === 'weather' ? 'traffic' : p === 'traffic' ? 'terrain' : 'weather')}
          className="p-1.5 bg-slate-900/90 hover:bg-slate-800 text-[#F27D26] rounded-xl border border-slate-700 shadow-md backdrop-blur-md transition-colors"
          title={`Layer: ${activeLayer}`}><Layers className="w-3.5 h-3.5" /></button>
      </div>

      {/* ── Bottom strip: global weather + risk + recommendation ───────────── */}
      <div className="relative z-10 mt-auto px-5 py-3 bg-slate-950/80 backdrop-blur-md border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
        {result ? (
          <>
            {/* Left: overall weather + temperature */}
            <div className="flex items-center gap-3 flex-wrap">
              {result.expected_weather && (
                <span className="flex items-center gap-1">
                  <CloudSun className="w-3.5 h-3.5 text-[#F27D26]" />
                  {result.expected_weather}
                </span>
              )}
              {result.temperature_c !== undefined && (
                <span className="flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-sky-400" />
                  {result.temperature_c}°C
                </span>
              )}
            </div>
            {/* Right: risk badge + recommendation */}
            <div className="flex items-center gap-2 flex-wrap">
              {result.travel_risk && (
                <span className={`flex items-center gap-1 font-semibold px-2.5 py-1 rounded-full border text-[10px] ${
                  hazard === 'Low'
                    ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20'
                    : hazard === 'High'
                    ? 'text-rose-300 bg-rose-500/10 border-rose-500/20'
                    : 'text-amber-300 bg-amber-500/10 border-amber-500/20'
                }`}>
                  {hazard === 'Low'
                    ? <ShieldCheck className="w-3 h-3" />
                    : <ShieldAlert className="w-3 h-3" />}
                  {result.travel_risk}
                </span>
              )}
              {result.recommendation && (
                <span className="flex items-center gap-1 text-slate-400 text-[11px]">
                  <Lightbulb className="w-3 h-3 text-yellow-400 shrink-0" />
                  <span className="truncate max-w-[200px]">{result.recommendation}</span>
                </span>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-[#F27D26] shrink-0" />
              <span>Active Layer: <strong className="text-white capitalize">{activeLayer} Overlay</strong></span>
            </div>
            <span className="text-slate-400 hidden sm:inline">Plan a route to see live weather</span>
          </>
        )}
      </div>
    </div>
  );
};
