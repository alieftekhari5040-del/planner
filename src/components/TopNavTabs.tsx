import React from 'react';
import { Calendar, Flame, BarChart3 } from 'lucide-react';

export type MainTabType = 'planner' | 'habits' | 'analytics';

interface TopNavTabsProps {
  activeTab: MainTabType;
  onChangeTab: (tab: MainTabType) => void;
}

export const TopNavTabs: React.FC<TopNavTabsProps> = ({ activeTab, onChangeTab }) => {
  return (
    <div className="no-print app-tabs-wrapper flex items-center justify-center">
      <div className="app-tabs" role="tablist" aria-label="بخش‌های برنامه">
        {/* Tab 1: Daily Planner (Original Blueprint) */}
        <button
          type="button"
          onClick={() => onChangeTab('planner')}
          className={`app-tab flex items-center gap-2 px-4 py-2.5 rounded-xl md:rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
            activeTab === 'planner'
              ? 'is-active bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.7)] border border-purple-300'
              : 'text-purple-300 hover:text-white hover:bg-purple-950/60'
          }`}
        >
          <Calendar className="w-4 h-4 text-purple-200" />
          <span>برنامه‌ریزی روزانه</span>
        </button>

        {/* Tab 2: Pro Habit OS (Dedicated Habit Tracker) */}
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'habits'}
          onClick={() => onChangeTab('habits')}
          className={`app-tab flex items-center gap-2 px-4 py-2.5 rounded-xl md:rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
            activeTab === 'habits'
              ? 'is-active bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.7)] border border-purple-300'
              : 'text-purple-300 hover:text-white hover:bg-purple-950/60'
          }`}
        >
          <Flame className="w-4 h-4 text-amber-400" />
          <span>ردیاب عادت‌ها</span>
        </button>

        {/* Tab 3: Analytics & Insights */}
        <button
          type="button"
          onClick={() => onChangeTab('analytics')}
          className={`app-tab flex items-center gap-2 px-4 py-2.5 rounded-xl md:rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
            activeTab === 'analytics'
              ? 'is-active bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(168,85,247,0.7)] border border-purple-300'
              : 'text-purple-300 hover:text-white hover:bg-purple-950/60'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-cyan-300" />
          <span>داشبورد و آمار</span>
        </button>
      </div>
    </div>
  );
};
