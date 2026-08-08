import React from 'react';
import type { ScheduleItem } from '../types/planner';
import { Check, Plus, Trash2, ClipboardList, Sparkles } from 'lucide-react';
import { formatPersianNumber } from '../utils/jalali';

interface ScheduleCardProps {
  schedule: ScheduleItem[];
  onChange: (schedule: ScheduleItem[]) => void;
  onItemToggle: (id: string) => void;
  onApplyPresetTasks?: () => void;
}

export const ScheduleCard: React.FC<ScheduleCardProps> = ({
  schedule, onChange, onItemToggle, onApplyPresetTasks,
}) => {
  const handleTaskChange = (id: string, task: string) =>
    onChange(schedule.map((s) => (s.id === id ? { ...s, task } : s)));

  const handleAdd = () =>
    onChange([...schedule, { id: `s-${Date.now()}`, task: '', completed: false }]);

  const handleRemove = (id: string) => {
    if (schedule.length <= 1) return;
    onChange(schedule.filter((s) => s.id !== id));
  };

  const done  = schedule.filter((s) => s.completed && s.task.trim()).length;
  const total = schedule.filter((s) => s.task.trim()).length;

  return (
    <div className="surface-card w-full p-4 md:p-5 relative overflow-hidden flex flex-col">
      {/* glow */}
      <div className="absolute top-1/3 -left-16 w-52 h-52 bg-emerald-600/8 blur-3xl pointer-events-none" />

      {/* هدر */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="card-accent-bar accent-emerald" />
          <ClipboardList className="w-4 h-4 text-emerald-400" />
          <h2 className="text-base md:text-lg font-bold text-white">برنامه‌ی امروز</h2>
        </div>
        <div className="flex items-center gap-2">
          {total > 0 && (
            <span className="badge badge-emerald">
              {formatPersianNumber(done)}/{formatPersianNumber(total)} تسک
            </span>
          )}
          {onApplyPresetTasks && (
            <button type="button" onClick={onApplyPresetTasks}
              className="no-print hidden sm:flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg transition cursor-pointer"
              style={{ background: 'rgba(217,119,6,.14)', borderColor: 'rgba(252,211,77,.22)', color: '#fcd34d', border: '1px solid' }}
              title="برنامه پیشنهادی">
              <Sparkles className="w-3 h-3" />
              <span>پیشنهادی</span>
            </button>
          )}
        </div>
      </div>

      {/* جدول ردیف‌ها */}
      <div className="flex-1 surface-inset rounded-xl overflow-hidden">
        {schedule.map((item, idx) => (
          <div
            key={item.id}
            className={`flex items-center group transition-colors border-b last:border-b-0 ${
              item.completed
                ? 'bg-violet-950/30 border-violet-500/15'
                : 'hover:bg-slate-800/40 border-slate-700/20'
            }`}
          >
            {/* چک‌باکس */}
            <div className="px-3 py-2.5 shrink-0 border-l border-slate-700/25">
              <button
                type="button"
                onClick={() => onItemToggle(item.id)}
                aria-pressed={item.completed}
                className={`w-5 h-5 rounded-md flex items-center justify-center border-2 transition-all cursor-pointer ${
                  item.completed
                    ? 'bg-gradient-to-tr from-violet-600 to-violet-400 border-violet-200 shadow-[0_0_10px_rgba(139,92,246,.7)] scale-105'
                    : 'bg-slate-900/55 border-slate-600/45 hover:border-violet-400/65'
                }`}>
                <Check className={`w-3 h-3 stroke-[3] text-white transition-all ${item.completed ? 'opacity-100' : 'opacity-0'}`} />
              </button>
            </div>

            {/* شماره */}
            <div className="w-8 shrink-0 text-center border-l border-slate-700/25 text-[11px] font-bold text-slate-600 py-2.5">
              {formatPersianNumber(idx + 1)}
            </div>

            {/* متن */}
            <div className="flex-1 px-3 py-2">
              <input
                type="text"
                value={item.task}
                onChange={(e) => handleTaskChange(item.id, e.target.value)}
                placeholder={`ردیف ${formatPersianNumber(idx + 1)}...`}
                className={`w-full text-sm text-slate-200 bg-transparent focus:outline-none placeholder-slate-700 font-medium transition ${
                  item.completed ? 'line-through text-slate-500 decoration-violet-400/55' : ''
                }`}
              />
            </div>

            {/* حذف */}
            <div className="no-print shrink-0 px-2 opacity-0 group-hover:opacity-100 transition">
              <button type="button" onClick={() => handleRemove(item.id)}
                className="p-1 text-slate-600 hover:text-rose-400 transition cursor-pointer"
                aria-label="حذف">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* افزودن */}
      <div className="no-print mt-3.5 pt-3 divider">
        <button type="button" onClick={handleAdd}
          className="btn btn-ghost mt-3 text-xs">
          <Plus className="w-3.5 h-3.5" />
          <span>افزودن ردیف</span>
        </button>
      </div>
    </div>
  );
};
