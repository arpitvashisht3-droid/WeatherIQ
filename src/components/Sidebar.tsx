import React from 'react';
import { 
  LayoutDashboard, 
  Clock, 
  Map, 
  BellRing, 
  Lightbulb, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export type SidebarSection = 
  | 'dashboard' 
  | 'perfect-window' 
  | 'route-planner' 
  | 'alerts' 
  | 'recommendations' 
  | 'settings';

interface SidebarProps {
  activeSection: SidebarSection;
  onSelectSection: (section: SidebarSection) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  onSelectSection,
  isCollapsed,
  onToggleCollapse,
  onOpenSettings,
}) => {
  const navItems = [
    { id: 'dashboard' as SidebarSection, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'perfect-window' as SidebarSection, label: 'Window Finder', icon: Clock },
    { id: 'route-planner' as SidebarSection, label: 'Route Map', icon: Map },
    { id: 'alerts' as SidebarSection, label: 'Smart Alerts', icon: BellRing },
    { id: 'recommendations' as SidebarSection, label: 'Insights', icon: Lightbulb },
  ];

  const handleNavClick = (id: SidebarSection) => {
    onSelectSection(id);
    if (id === 'settings') {
      onOpenSettings();
      return;
    }
    // Smooth scroll to target section if on main dashboard
    const element = document.getElementById(`section-${id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <aside 
      id="main-sidebar"
      className={`fixed top-[65px] left-0 bottom-0 z-20 bg-[#0F172A] border-r border-slate-800 transition-all duration-300 flex flex-col justify-between py-4 shadow-xl ${
        isCollapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Top Nav Items */}
      <div className="flex flex-col gap-1.5 px-2.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`group relative flex items-center gap-3 px-3 py-3 rounded-2xl font-semibold text-sm transition-all ${
                isActive
                  ? 'bg-[#F27D26] text-white shadow-lg shadow-orange-500/30'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-[#F27D26]'}`} />
              {!isCollapsed && (
                <span className="truncate tracking-tight">{item.label}</span>
              )}
              {/* Active Indicator Bar */}
              {isActive && isCollapsed && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#F27D26] rounded-r-full" />
              )}
              {/* Tooltip on collapse */}
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg border border-slate-700">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Nav Items */}
      <div className="flex flex-col gap-1 px-2.5 border-t border-slate-800 pt-3">
        {/* Settings */}
        <button
          id="nav-item-settings"
          onClick={onOpenSettings}
          className="group relative flex items-center gap-3 px-3 py-3 rounded-2xl font-semibold text-sm text-slate-300 hover:bg-slate-800/80 hover:text-white transition-all"
          title={isCollapsed ? 'Settings' : undefined}
        >
          <Settings className="w-5 h-5 shrink-0 text-slate-400 group-hover:text-[#F27D26]" />
          {!isCollapsed && <span className="truncate">Settings</span>}
          {isCollapsed && (
            <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg border border-slate-700">
              Settings
            </div>
          )}
        </button>

        {/* Toggle Collapse */}
        <button
          id="btn-toggle-sidebar"
          onClick={onToggleCollapse}
          className="group flex items-center gap-3 px-3 py-2.5 rounded-2xl font-semibold text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-all"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 shrink-0 text-slate-400" />
          ) : (
            <ChevronLeft className="w-5 h-5 shrink-0 text-slate-400" />
          )}
          {!isCollapsed && <span>Collapse Sidebar</span>}
        </button>

        {/* Logout */}
        <button
          id="btn-logout"
          onClick={() => alert('Demo Session: Logged in as Alex')}
          className="group relative flex items-center gap-3 px-3 py-3 rounded-2xl font-semibold text-sm text-rose-400 hover:bg-rose-950/40 transition-all mt-1"
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0 text-rose-400" />
          {!isCollapsed && <span className="truncate">Logout</span>}
          {isCollapsed && (
            <div className="absolute left-full ml-3 px-2.5 py-1 bg-slate-900 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg border border-slate-700">
              Logout
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
