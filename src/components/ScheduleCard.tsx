import React from 'react';
import type { ScheduleItem } from '../types/planner';
import { Check, Plus, Trash2, LayoutList, Sparkles } from 'lucide-react';
import { formatPersianNumber } from '../utils/jalali';

interface Props {
  schedule: ScheduleItem[];
  onChange: (s: ScheduleItem[]) => void;
  onItemToggle: (id: string) => void;
  onApplyPresetTasks?: () => void;
}

export const ScheduleCard: React.FC<Props> = ({ schedule, onChange, onItemToggle, onApplyPresetTasks }) => {
  const set = (id: string, task: string) =>
    onChange(schedule.map((s) => (s.id === id ? { ...s, task } : s)));
  const add = () =>
    onChange([...schedule, { id: `s-${Date.now()}`, task: '', completed: false }]);
  const del = (id: string) =>
    schedule.length > 1 && onChange(schedule.filter((s) => s.id !== id));

  const done  = schedule.filter((s) => s.completed && s.task.trim()).length;
  const total = schedule.filter((s) => s.task.trim()).length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <div className="card flex flex-col">
      {/* head */}
      <div className="card-head">
        <div className="card-head-left">
          <span className="accent accent-e" />
          <LayoutList className="w-3.5 h-3.5 text-emerald-400" />
          <span className="card-title">برنامه‌ی امروز</span>
        </div>
        <div className="flex items-center gap-2">
          {total > 0 && (
            <span className="badge badge-e">{formatPersianNumber(done)}/{formatPersianNumber(total)} تسک</span>
          )}
          {onApplyPresetTasks && (
            <button type="button" onClick={onApplyPresetTasks}
              className="no-print btn btn-add text-xs hidden sm:flex">
              <Sparkles className="w-3 h-3 text-amber-400" /> پیشنهادی
            </button>
          )}
        </div>
      </div>

      {/* progress bar */}
      {total > 0 && (
        <div className="h-[2px] bg-slate-800/80 mx-0">
          <div className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${pct}%` }} />
        </div>
      )}

      {/* body — لیست تسک‌ها */}
      <div className="flex-1">
        {schedule.map((item, i) => (
          <div key={item.id} className={`task-row group ${item.completed ? 'done' : ''}`}>
            {/* شماره */}
            <span className="num shrink-0">{formatPersianNumber(i + 1)}</span>

            {/* چک‌باکس */}
            <button type="button" onClick={() => onItemToggle(item.id)} aria-pressed={item.completed}
              className={`cb shrink-0 ${item.completed ? 'on-emerald' : ''}`}>
              <Check className={`w-3.5 h-3.5 stroke-[3] text-white ${item.completed ? 'opacity-100' : 'opacity-0'}`} />
            </button>

            {/* متن */}
            <input
              type="text" value={item.task}
              onChange={(e) => set(item.id, e.target.value)}
              placeholder={`تسک ${formatPersianNumber(i + 1)}...`}
              className={`task-field ${item.completed ? 'done' : ''}`}
            />

            {/* حذف */}
            <button type="button" onClick={() => del(item.id)}
              className="icon-btn no-print opacity-0 group-hover:opacity-100 shrink-0">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* foot */}
      <div className="card-foot no-print">
        <button type="button" onClick={add} className="btn btn-add text-xs">
          <Plus className="w-3.5 h-3.5" /> افزودن تسک
        </button>
      </div>
    </div>
  );
};
