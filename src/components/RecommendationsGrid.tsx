import React, { useState } from 'react';
import { 
  Footprints, 
  Bike, 
  Zap, 
  Sun, 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight,
  ShieldAlert,
  Info
} from 'lucide-react';
import { Recommendation } from '../types/weather';

interface RecommendationsGridProps {
  recommendations: Recommendation[];
}

export const RecommendationsGrid: React.FC<RecommendationsGridProps> = ({ recommendations }) => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [selectedRec, setSelectedRec] = useState<Recommendation | null>(null);

  const getCategoryIcon = (cat: Recommendation['category']) => {
    switch (cat) {
      case 'running': return <Footprints className="w-5 h-5 text-emerald-600" />;
      case 'cycling': return <Bike className="w-5 h-5 text-blue-600" />;
      case 'ev': return <Zap className="w-5 h-5 text-amber-500" />;
      case 'solar': return <Sun className="w-5 h-5 text-[#F27D26]" />;
      default: return <Compass className="w-5 h-5 text-indigo-500" />;
    }
  };

  const filteredRecs = activeTab === 'all' 
    ? recommendations 
    : recommendations.filter(r => r.category === activeTab);

  return (
    <div 
      id="section-recommendations"
      className="bg-white rounded-[2rem] p-5 sm:p-6 border border-slate-200/80 shadow-md flex flex-col gap-4"
    >
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#F27D26] text-white shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#0F172A]">
              Personalized Activity & Energy Insights
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Data-driven weather optimizations tailored for health, EV commute & solar harvest
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-bold text-slate-600">
          {['all', 'running', 'cycling', 'ev', 'solar'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-3.5 py-1.5 rounded-full capitalize transition-all ${
                activeTab === cat 
                  ? 'bg-[#0F172A] text-white shadow-xs' 
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Recommendation Tiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-1">
        {filteredRecs.map((rec) => (
          <div
            key={rec.id}
            onClick={() => setSelectedRec(rec)}
            className="bg-gradient-to-br from-slate-50 to-white hover:from-orange-50/40 hover:to-amber-50/20 rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:border-[#F27D26]/40 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div>
              {/* Tile Top Row */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="p-2 rounded-xl bg-white shadow-2xs border border-slate-100 group-hover:scale-105 transition-transform">
                  {getCategoryIcon(rec.category)}
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${rec.badgeColor}`}>
                  {rec.status}
                </span>
              </div>

              {/* Title & One-line Insight */}
              <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#F27D26] transition-colors">
                {rec.title}
              </h4>
              <p className="text-[11px] text-slate-600 font-medium mt-1 leading-snug line-clamp-2">
                {rec.insight}
              </p>
            </div>

            {/* Bottom Metric & Action */}
            <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-extrabold text-[#0F172A]">
                {rec.metric || 'Optimal Window'}
              </span>
              <span className="text-[#F27D26] font-bold group-hover:translate-x-1 transition-transform flex items-center gap-0.5">
                <span>Details</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedRec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-orange-100">
                {getCategoryIcon(selectedRec.category)}
              </div>
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${selectedRec.badgeColor}`}>
                  {selectedRec.status} Insight
                </span>
                <h3 className="text-base font-extrabold text-[#0F172A] mt-1">
                  {selectedRec.title}
                </h3>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 font-medium leading-relaxed">
                {selectedRec.insight}
              </div>

              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl text-emerald-900 space-y-1">
                <h4 className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Deep Technical Analysis:
                </h4>
                <p>{selectedRec.detailText}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedRec(null)}
              className="mt-5 w-full py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold rounded-2xl transition-colors"
            >
              Close Insight
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
