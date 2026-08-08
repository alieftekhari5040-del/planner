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
      <div className="flex items-center justify-between mb-5">
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
            <button
              type="button"
              onClick={onApplyPresetTasks}
              className="no-print hidden sm:flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-lg transition cursor-pointer"
              style={{ background: 'rgba(217,119,6,.14)', border: '1px solid rgba(252,211,77,.22)', color: '#fcd34d' }}
              title="برنامه پیشنهادی"
            >
              <Sparkles className="w-3 h-3" />
              <span>پیشنهادی</span>
            </button>
          )}
        </div>
      </div>

      {/* ردیف‌ها */}
      <div className="flex-1 flex flex-col gap-2.5">
        {schedule.map((item, idx) => (
          <div
            key={item.id}
            className={`group flex items-center gap-3 px-3 py-3 rounded-xl border transition-all duration-200 ${
              item.completed
                ? 'bg-emerald-950/20 border-emerald-500/20 shadow-[inset_0_1px_0_rgba(52,211,153,.06)]'
                : 'bg-slate-900/30 border-slate-700/25 hover:bg-slate-800/45 hover:border-slate-600/40'
            }`}
          >
            {/* چک‌باکس نئون — همون مدل PrioritiesCard */}
            <button
              type="button"
              onClick={() => onItemToggle(item.id)}
              aria-pressed={item.completed}
              className={`neon-check shrink-0 ${item.completed ? 'checked' : ''}`}
              style={item.completed ? {
                background: 'linear-gradient(135deg,#059669,#047857)',
                borderColor: '#6ee7b7',
                boxShadow: '0 0 18px rgba(5,150,105,.7), 0 0 6px rgba(110,231,183,.35)'
              } : undefined}
            >
              <Check className={`w-4 h-4 stroke-[3] text-white transition-all duration-200 ${item.completed ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`} />
            </button>

            {/* شماره ردیف */}
            <span className={`text-xs font-bold shrink-0 w-5 text-center tabular-nums ${item.completed ? 'text-slate-600' : 'text-slate-500'}`}>
              {formatPersianNumber(idx + 1)}
            </span>

            {/* متن تسک */}
            <input
              type="text"
              value={item.task}
              onChange={(e) => handleTaskChange(item.id, e.target.value)}
              placeholder={`تسک ${formatPersianNumber(idx + 1)}...`}
              className={`flex-1 text-sm bg-transparent focus:outline-none font-medium transition-all duration-200 ${
                item.completed
                  ? 'line-through text-slate-500 decoration-emerald-500/50 decoration-2 placeholder-slate-700'
                  : 'text-slate-200 placeholder-slate-700 focus:placeholder-slate-600'
              }`}
            />

            {/* دکمه حذف */}
            <button
              type="button"
              onClick={() => handleRemove(item.id)}
              className="no-print shrink-0 opacity-0 group-hover:opacity-100 p-1 text-slate-600 hover:text-rose-400 transition-all cursor-pointer rounded-md hover:bg-rose-950/30"
              aria-label="حذف"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* افزودن ردیف */}
      <div className="no-print mt-4 pt-3 divider">
        <button
          type="button"
          onClick={handleAdd}
          className="btn btn-ghost mt-3 text-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>افزودن تسک</span>
        </button>
      </div>
    </div>
  );
};
