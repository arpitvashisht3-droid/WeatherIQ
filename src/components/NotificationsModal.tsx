import React from 'react';
import { X, Bell, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { SmartAlert } from '../types/weather';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: SmartAlert[];
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  alerts,
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
          <div className="p-3 rounded-2xl bg-orange-100 text-orange-600">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              WeatherIQ Smart Notifications
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              System alerts, UV warnings & route advisories
            </p>
          </div>
        </div>

        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {alerts.map((alt) => (
            <div
              key={alt.id}
              className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-3"
            >
              <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600 shrink-0 mt-0.5">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div className="flex-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900">{alt.title}</span>
                  <span className="text-[10px] text-slate-400 font-bold">{alt.time}</span>
                </div>
                <p className="text-slate-600 font-medium mt-1 leading-snug">{alt.description}</p>
                <span className="text-[10px] text-orange-600 font-bold block mt-1.5 bg-orange-100/60 p-1.5 rounded-lg">
                  Recommendation: {alt.recommendation}
                </span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-2xl transition-colors"
        >
          Close Notifications
        </button>
      </div>
    </div>
  );
};
