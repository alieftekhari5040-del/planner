import React from 'react';
import { Calendar, Flame, BarChart3 } from 'lucide-react';

export type MainTabType = 'planner' | 'habits' | 'analytics';

interface TopNavTabsProps {
  activeTab: MainTabType;
  onChangeTab: (tab: MainTabType) => void;
}

const TABS: { id: MainTabType; label: string; icon: React.ReactNode; activeColor: string }[] = [
  {
    id: 'planner',
    label: 'برنامه‌ریزی روزانه',
    icon: <Calendar className="w-4 h-4" />,
    activeColor: 'text-violet-200',
  },
  {
    id: 'habits',
    label: 'ردیاب عادت‌ها',
    icon: <Flame className="w-4 h-4" />,
    activeColor: 'text-amber-300',
  },
  {
    id: 'analytics',
    label: 'داشبورد و آمار',
    icon: <BarChart3 className="w-4 h-4" />,
    activeColor: 'text-sky-300',
  },
];

export const TopNavTabs: React.FC<TopNavTabsProps> = ({ activeTab, onChangeTab }) => (
  <div className="no-print app-tabs-wrapper flex items-center justify-center">
    <nav className="app-tabs" role="tablist" aria-label="بخش‌های برنامه">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChangeTab(tab.id)}
            className={`app-tab flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm cursor-pointer ${isActive ? 'is-active' : ''}`}
          >
            <span className={isActive ? tab.activeColor : 'text-slate-500 group-hover:text-slate-300'}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  </div>
);
