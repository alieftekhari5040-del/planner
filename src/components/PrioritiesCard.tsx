import React from 'react';
import type { PriorityItem } from '../types/planner';
import { Check, Plus, Trash2 } from 'lucide-react';
import { formatPersianNumber } from '../utils/jalali';

interface PrioritiesCardProps {
  priorities: PriorityItem[];
  onChange: (priorities: PriorityItem[]) => void;
  onItemToggle: (id: string) => void;
}

export const PrioritiesCard: React.FC<PrioritiesCardProps> = ({
  priorities,
  onChange,
  onItemToggle,
}) => {
  const handleTextChange = (id: string, text: string) => {
    onChange(
      priorities.map((item) => (item.id === id ? { ...item, text } : item))
    );
  };

  const handleAdd = () => {
    const newItem: PriorityItem = {
      id: `p-${Date.now()}`,
      text: '',
      completed: false,
    };
    onChange([...priorities, newItem]);
  };

  const handleRemove = (id: string) => {
    if (priorities.length <= 1) return;
    onChange(priorities.filter((item) => item.id !== id));
  };

  const completedCount = priorities.filter((p) => p.completed && p.text.trim()).length;
  const totalCount = priorities.filter((p) => p.text.trim()).length;

  return (
    <div className="surface-card w-full p-4 md:p-5 relative overflow-hidden flex flex-col justify-between">
      {/* Glow highlight */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-600/15 blur-3xl pointer-events-none" />

      <div>
        {/* Card Header with Coral/Red Accent Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-rose-500 to-red-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
            <h2 className="text-base md:text-lg font-bold text-white tracking-wide">
              اولویت کارها
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {totalCount > 0 && (
              <span className="text-[11px] font-semibold text-purple-200 bg-purple-950/70 px-2.5 py-0.5 rounded-full border border-purple-500/30 shadow-inner">
                {formatPersianNumber(completedCount)} از {formatPersianNumber(totalCount)} انجام شده
              </span>
            )}
          </div>
        </div>

        {/* 5 Priority Rows matching the original blueprint format */}
        <div className="space-y-3">
          {priorities.map((item, index) => (
            <div key={item.id} className="flex items-center gap-3 group">
              {/* Upgraded Tactile Neon Rounded Rectangle Checkbox (مستطیل تیک زدن اختصاصی) */}
              <button
                type="button"
                onClick={() => onItemToggle(item.id)}
                className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-250 shrink-0 cursor-pointer ${
                  item.completed
                    ? 'bg-gradient-to-tr from-purple-600 via-purple-500 to-indigo-500 border-2 border-purple-200 text-white shadow-[0_0_15px_rgba(168,85,247,0.9)] scale-105'
                    : 'bg-[#150e38]/90 border-2 border-purple-400/60 hover:border-purple-300 text-transparent hover:shadow-[0_0_10px_rgba(168,85,247,0.5)] hover:scale-105'
                }`}
                title={item.completed ? 'انجام شد (کلیک برای لغو)' : 'تیک زدن و ثبت تکمیل اولویت'}
                aria-pressed={item.completed}
                aria-label={item.completed ? 'لغو تکمیل اولویت' : 'تکمیل اولویت'}
              >
                <Check className={`w-4 h-4 stroke-[3] transition-all duration-200 ${item.completed ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`} />
              </button>

              {/* Lined Text Field with Inline Edit */}
              <div className="relative flex-1">
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => handleTextChange(item.id, e.target.value)}
                  placeholder={`اولویت شماره ${formatPersianNumber(index + 1)}...`}
                  className={`w-full py-1 text-sm md:text-base text-purple-100 bg-transparent border-b border-purple-500/40 focus:border-purple-300 focus:outline-none transition placeholder-purple-400/30 font-medium ${
                    item.completed ? 'line-through text-purple-400/60 decoration-purple-400/70 decoration-2' : ''
                  }`}
                />
              </div>

              {/* Delete action */}
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="no-print opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1 text-purple-400 hover:text-rose-400 transition cursor-pointer"
                title="حذف این اولویت"
                aria-label="حذف این اولویت"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Row Button */}
      <div className="no-print mt-3.5 pt-2 flex items-center justify-between border-t border-purple-500/20">
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 text-xs font-semibold text-purple-300/80 hover:text-purple-100 px-2.5 py-1 rounded-lg bg-purple-900/30 hover:bg-purple-800/50 border border-purple-500/20 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>افزودن اولویت جدید</span>
        </button>

        <span className="text-[10px] text-purple-400/50">
          قابل ویرایش و حذف آنلاین
        </span>
      </div>
    </div>
  );
};
