import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  User, 
  CheckCircle2,
  Clock,
  HelpCircle
} from 'lucide-react';
import { FullLocationWeather } from '../types/weather';

interface WeatherAIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  weatherData: FullLocationWeather;
}

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  time: string;
}

export const WeatherAIChatModal: React.FC<WeatherAIChatModalProps> = ({
  isOpen,
  onClose,
  weatherData,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'ai',
      text: `Hello Alex! I am WeatherIQ Assistant. I can analyze thermal comfort, rain windows, EV battery efficiency, or route safety for ${weatherData.location.name}. What weather decision would you like help with today?`,
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');

  if (!isOpen) return null;

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Generate intelligent decision response
    setTimeout(() => {
      let aiReply = `Based on the latest atmospheric analysis for ${weatherData.location.name}: current temperature is ${weatherData.current.tempC}°C with ${weatherData.current.conditionLabel}. `;

      const lowerQ = query.toLowerCase();
      if (lowerQ.includes('run') || lowerQ.includes('jog')) {
        aiReply += `The optimal running window today is between 6:00 AM and 8:30 AM when humidity is 58% and temperatures are cool (19°C). Afternoon hours will see increased wind.`;
      } else if (lowerQ.includes('cricket') || lowerQ.includes('tennis') || lowerQ.includes('sport')) {
        aiReply += `For outdoor sports like Cricket or Tennis, we recommend the 8:00 AM - 10:00 AM slot. Humidity is 57% with 0% rain probability.`;
      } else if (lowerQ.includes('solar') || lowerQ.includes('energy')) {
        aiReply += `Solar energy output is projected at 38.5 kWh today with peak photovoltaic yield between 11:30 AM and 2:30 PM under clear solar radiation.`;
      } else if (lowerQ.includes('umbrella') || lowerQ.includes('rain')) {
        aiReply += `No umbrella needed today (${weatherData.current.humidityPercent}% humidity, 10% rain chance). However, tomorrow evening has a 65% chance of light showers after 5 PM.`;
      } else {
        aiReply += `All weather factors are within comfortable bounds for general travel and outdoor activities today. Feel free to use the Perfect Window Finder tool to inspect specific hours.`;
      }

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 600);
  };

  const samplePrompts = [
    'Should I go for a run at 5 PM?',
    'Will solar generation hit peak today?',
    'Best window for Cricket or Tennis?',
    'Do I need an umbrella tomorrow?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full h-[580px] flex flex-col shadow-2xl border border-slate-100 overflow-hidden relative">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-bold shadow-md shadow-orange-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold flex items-center gap-1.5">
                <span>WeatherIQ AI Assistant</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                  Online
                </span>
              </h3>
              <p className="text-[11px] text-slate-300 font-medium">
                Intelligent Decision Support System
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Sample Prompts Strip */}
        <div className="bg-slate-50 border-b border-slate-100 p-2.5 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase shrink-0 flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-orange-500" /> Ask AI:
          </span>
          {samplePrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(p)}
              className="shrink-0 bg-white hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-slate-700 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/50">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-8 h-8 rounded-2xl flex items-center justify-center shrink-0 text-white text-xs font-bold ${
                m.sender === 'user' ? 'bg-slate-900' : 'bg-orange-500 shadow-sm shadow-orange-500/20'
              }`}>
                {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl p-3.5 text-xs font-medium shadow-2xs ${
                m.sender === 'user'
                  ? 'bg-orange-500 text-white rounded-tr-none'
                  : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none leading-relaxed'
              }`}>
                <p>{m.text}</p>
                <span className={`text-[9px] block mt-1 text-right font-medium ${m.sender === 'user' ? 'text-orange-100' : 'text-slate-400'}`}>
                  {m.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask WeatherIQ AI a weather decision question..."
            className="flex-1 bg-slate-100 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:bg-white"
          />
          <button
            onClick={() => handleSendMessage()}
            className="p-2.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition-colors shadow-md shadow-orange-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
