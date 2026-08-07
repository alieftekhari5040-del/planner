import React from 'react';
import type { ScheduleItem } from '../../types/planner';
import { Check, Plus, Trash2, ListChecks, Sparkles } from 'lucide-react';
import { formatPersianNumber } from '../../utils/jalali';

interface ScheduleCardProps {
  schedule: ScheduleItem[];
  onChange: (schedule: ScheduleItem[]) => void;
  onItemToggle: (id: string) => void;
  onApplyPresetTasks?: () => void;
}

const ScheduleCardComponent: React.FC<ScheduleCardProps> = ({
  schedule,
  onChange,
  onItemToggle,
  onApplyPresetTasks,
}) => {
  const handleTaskChange = (id: string, task: string) => {
    onChange(
      schedule.map((item) => (item.id === id ? { ...item, task } : item))
    );
  };

  const handleAddRow = () => {
    const newItem: ScheduleItem = {
      id: `s-${Date.now()}`,
      task: '',
      completed: false,
    };
    onChange([...schedule, newItem]);
  };

  const handleRemoveRow = (id: string) => {
    if (schedule.length <= 1) return;
    onChange(schedule.filter((item) => item.id !== id));
  };

  const completedCount = schedule.filter((s) => s.completed && s.task.trim()).length;
  const totalCount = schedule.filter((s) => s.task.trim()).length;

  return (
    <div className="surface-card w-full h-full p-4 md:p-5 relative overflow-hidden flex flex-col justify-between">
      {/* Glow highlight */}
      <div className="absolute top-1/3 -right-20 w-48 h-48 bg-purple-600/10 blur-3xl pointer-events-none" />

      <div>
        {/* Header with Red/Coral Accent Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-rose-500 to-red-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
            <h2 className="text-base md:text-lg font-bold text-white tracking-wide">
              برنامه‌ی امروز
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {totalCount > 0 && (
              <span className="text-[11px] font-semibold text-purple-200 bg-purple-950/70 px-2.5 py-0.5 rounded-full border border-purple-500/30">
                {formatPersianNumber(completedCount)} از {formatPersianNumber(totalCount)} تسک انجام شد
              </span>
            )}
            {onApplyPresetTasks && (
              <button
                type="button"
                onClick={onApplyPresetTasks}
                className="no-print hidden sm:flex items-center gap-1 text-[11px] font-semibold text-purple-200 hover:text-white px-2.5 py-1 rounded-lg bg-purple-900/50 hover:bg-purple-800/80 border border-purple-500/30 transition cursor-pointer"
                title="بارگذاری نمونه برنامه‌های پیشنهادی"
              >
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>برنامه پیشنهادی</span>
              </button>
            )}
          </div>
        </div>

        {/* Schedule Table Grid matching the 14 lined rows of the original poster */}
        <div className="surface-inset rounded-2xl overflow-hidden divide-y divide-purple-500/25">
          {schedule.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center transition-colors group ${
                item.completed ? 'bg-purple-950/50' : 'hover:bg-purple-900/20'
              }`}
            >
              {/* Checkbox column with Tactile Rounded Neon Rectangle */}
              <div className="p-2.5 shrink-0 border-l border-purple-500/25 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => onItemToggle(item.id)}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer ${
                    item.completed
                      ? 'bg-gradient-to-tr from-purple-600 to-purple-400 border border-purple-200 text-white shadow-[0_0_10px_rgba(168,85,247,0.8)] scale-105'
                      : 'bg-purple-950/70 border border-purple-400/50 hover:border-purple-300 text-transparent'
                  }`}
                  title={item.completed ? 'تکمیل شد (کلیک برای لغو)' : 'تیک زدن و انجام برنامه'}
                  aria-pressed={item.completed}
                  aria-label={item.completed ? 'لغو تکمیل برنامه' : 'تکمیل برنامه'}
                >
                  <Check className={`w-3.5 h-3.5 stroke-[3] ${item.completed ? 'opacity-100' : 'opacity-0'}`} />
                </button>
              </div>

              {/* Row index number (بدون ستون ساعت - ردیف‌های منظم) */}
              <div className="w-9 shrink-0 text-center border-l border-purple-500/25 text-xs font-bold text-purple-400/60 font-mono">
                {formatPersianNumber(index + 1)}
              </div>

              {/* Task Description column with inline edit */}
              <div className="flex-1 px-3 py-2 flex items-center gap-2">
                <input
                  type="text"
                  value={item.task}
                  onChange={(e) => handleTaskChange(item.id, e.target.value)}
                  placeholder={`تسک و برنامه ردیف ${formatPersianNumber(index + 1)}...`}
                  className={`w-full text-xs sm:text-sm text-purple-100 bg-transparent focus:outline-none transition placeholder-purple-400/25 font-medium ${
                    item.completed ? 'line-through text-purple-400/60 decoration-purple-400/70' : ''
                  }`}
                />
              </div>

              {/* Row actions */}
              <div className="no-print shrink-0 px-2 py-1 flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                <button
                  type="button"
                  onClick={() => handleRemoveRow(item.id)}
                  className="p-1 text-purple-400 hover:text-rose-400 transition cursor-pointer"
                  title="حذف این ردیف"
                  aria-label="حذف این ردیف"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Row Button */}
      <div className="no-print mt-3.5 pt-2 flex items-center justify-between border-t border-purple-500/20">
        <button
          type="button"
          onClick={handleAddRow}
          className="flex items-center gap-1.5 text-xs font-semibold text-purple-300/80 hover:text-purple-100 px-2.5 py-1 rounded-lg bg-purple-900/30 hover:bg-purple-800/50 border border-purple-500/20 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>افزودن سطر برنامه جدید</span>
        </button>

        <span className="text-[10px] text-purple-400/50 flex items-center gap-1">
          <ListChecks className="w-3 h-3 text-purple-400" />
          <span>جدول برنامه‌ریزی روزانه بدون اجبار ساعت</span>
        </span>
      </div>
    </div>
  );
};

export const ScheduleCard = React.memo(ScheduleCardComponent);
ScheduleCard.displayName = 'ScheduleCard';
