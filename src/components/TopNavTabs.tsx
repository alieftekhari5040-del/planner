import React from 'react';
import { Calendar, Flame, BarChart3 } from 'lucide-react';

export type MainTabType = 'planner' | 'habits' | 'analytics';

interface TopNavTabsProps {
  activeTab: MainTabType;
  onChangeTab: (tab: MainTabType) => void;
}

export const TopNavTabs: React.FC<TopNavTabsProps> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { id: 'planner'   as MainTabType, label: 'برنامه‌ریزی روزانه',  icon: <Calendar  className="w-4 h-4" />, color: 'text-violet-300' },
    { id: 'habits'    as MainTabType, label: 'ردیاب عادت‌ها',       icon: <Flame     className="w-4 h-4" />, color: 'text-amber-400'  },
    { id: 'analytics' as MainTabType, label: 'داشبورد و آمار',      icon: <BarChart3 className="w-4 h-4" />, color: 'text-sky-300'    },
  ];

  return (
    <div className="no-print app-tabs-wrapper flex items-center justify-center">
      <div className="app-tabs" role="tablist" aria-label="بخش‌های برنامه">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => onChangeTab(tab.id)}
            className={`app-tab flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm cursor-pointer ${
              activeTab === tab.id ? 'is-active' : ''
            }`}
          >
            <span className={activeTab === tab.id ? 'text-white' : tab.color}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
