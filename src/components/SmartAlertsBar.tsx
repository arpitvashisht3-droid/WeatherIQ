import React, { useState } from 'react';
import { 
  CloudRain, 
  Flame, 
  Zap, 
  CloudFog, 
  Wind, 
  Sun, 
  AlertTriangle, 
  Info,
  ChevronRight,
  X
} from 'lucide-react';
import { SmartAlert } from '../types/weather';

interface SmartAlertsBarProps {
  alerts: SmartAlert[];
}

export const SmartAlertsBar: React.FC<SmartAlertsBarProps> = ({ alerts }) => {
  const [selectedAlert, setSelectedAlert] = useState<SmartAlert | null>(null);

  const getSeverityStyle = (severity: SmartAlert['severity']) => {
    switch (severity) {
      case 'severe':
        return {
          chip: 'bg-rose-500/15 border-rose-500/30 text-rose-700 hover:bg-rose-500/25',
          badge: 'bg-rose-500 text-white',
          icon: <Flame className="w-4 h-4 text-rose-600" />,
        };
      case 'moderate':
        return {
          chip: 'bg-amber-500/15 border-amber-500/30 text-amber-800 hover:bg-amber-500/25',
          badge: 'bg-amber-500 text-slate-900 font-bold',
          icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
        };
      default:
        return {
          chip: 'bg-sky-500/15 border-sky-500/30 text-sky-800 hover:bg-sky-500/25',
          badge: 'bg-sky-500 text-white',
          icon: <Info className="w-4 h-4 text-sky-600" />,
        };
    }
  };

  const getAlertIcon = (iconName: string) => {
    switch (iconName) {
      case 'CloudRain': return <CloudRain className="w-4 h-4" />;
      case 'Sun': return <Sun className="w-4 h-4" />;
      case 'Wind': return <Wind className="w-4 h-4" />;
      case 'Zap': return <Zap className="w-4 h-4" />;
      case 'CloudFog': return <CloudFog className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  return (
    <div 
      id="section-alerts"
      className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-md flex flex-col gap-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-orange-500 text-white shadow-xs">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <span>Smart Weather Alerts</span>
              <span className="bg-orange-100 text-orange-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                {alerts.length} Active
              </span>
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Real-time hazard notifications color-coded by severity level
            </p>
          </div>
        </div>
      </div>

      {/* Horizontal Scrollable Row of Alert Chips */}
      <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-none">
        {alerts.map((alert) => {
          const style = getSeverityStyle(alert.severity);

          return (
            <button
              key={alert.id}
              onClick={() => setSelectedAlert(alert)}
              className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all cursor-pointer shadow-2xs hover:scale-[1.02] ${style.chip}`}
            >
              <div className="p-1.5 rounded-xl bg-white/80 backdrop-blur-xs shadow-2xs">
                {getAlertIcon(alert.iconName)}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[9px] uppercase font-black px-1.5 py-0.2 rounded-md ${style.badge}`}>
                    {alert.severity}
                  </span>
                  <span className="text-xs font-bold text-slate-900 truncate max-w-[180px]">
                    {alert.title}
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-600 block mt-0.5">
                  {alert.time}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
            </button>
          );
        })}
      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedAlert(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-orange-100 text-orange-600">
                {getAlertIcon(selectedAlert.iconName)}
              </div>
              <div>
                <span className="text-xs font-bold uppercase text-orange-600 tracking-wider">
                  {selectedAlert.type}
                </span>
                <h3 className="text-base font-extrabold text-slate-900">
                  {selectedAlert.title}
                </h3>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1">
                <p><strong>Timing:</strong> {selectedAlert.time}</p>
                <p><strong>Affected Region:</strong> {selectedAlert.affectedArea}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">Impact Overview:</h4>
                <p className="leading-relaxed">{selectedAlert.description}</p>
              </div>

              <div className="bg-orange-50 border border-orange-200 p-3 rounded-2xl text-orange-900">
                <h4 className="font-bold mb-1 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-orange-600" /> Actionable Safety Recommendation:
                </h4>
                <p>{selectedAlert.recommendation}</p>
              </div>
            </div>

            <button
              onClick={() => setSelectedAlert(null)}
              className="mt-5 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-2xl transition-colors"
            >
              Acknowledge & Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
