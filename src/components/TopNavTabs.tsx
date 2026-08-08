import React from 'react';
import { Calendar, Flame, BarChart3 } from 'lucide-react';

export type MainTabType = 'planner' | 'habits' | 'analytics';

const TABS = [
  { id: 'planner'   as MainTabType, label: 'برنامه‌ریزی',   Icon: Calendar,  iconColor: 'text-violet-400' },
  { id: 'habits'    as MainTabType, label: 'ردیاب عادت‌ها', Icon: Flame,     iconColor: 'text-amber-400'  },
  { id: 'analytics' as MainTabType, label: 'داشبورد',        Icon: BarChart3, iconColor: 'text-sky-400'    },
];

interface Props { activeTab: MainTabType; onChangeTab: (t: MainTabType) => void; }

export const TopNavTabs: React.FC<Props> = ({ activeTab, onChangeTab }) => (
  <div className="no-print app-tabs-wrapper">
    <nav className="app-tabs" role="tablist">
      {TABS.map(({ id, label, Icon, iconColor }) => {
        const active = activeTab === id;
        return (
          <button key={id} type="button" role="tab" aria-selected={active}
            onClick={() => onChangeTab(id)}
            className={`app-tab ${active ? 'is-active' : ''}`}>
            <Icon className={`w-4 h-4 ${active ? 'text-white' : iconColor}`} />
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  </div>
);
