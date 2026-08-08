import React from 'react';
import type { PriorityItem } from '../types/planner';
import { Check, Plus, Trash2, Star } from 'lucide-react';
import { formatPersianNumber } from '../utils/jalali';

interface PrioritiesCardProps {
  priorities: PriorityItem[];
  onChange: (priorities: PriorityItem[]) => void;
  onItemToggle: (id: string) => void;
}

export const PrioritiesCard: React.FC<PrioritiesCardProps> = ({
  priorities, onChange, onItemToggle,
}) => {
  const handleTextChange = (id: string, text: string) =>
    onChange(priorities.map((p) => (p.id === id ? { ...p, text } : p)));

  const handleAdd = () =>
    onChange([...priorities, { id: `p-${Date.now()}`, text: '', completed: false }]);

  const handleRemove = (id: string) => {
    if (priorities.length <= 1) return;
    onChange(priorities.filter((p) => p.id !== id));
  };

  const done  = priorities.filter((p) => p.completed && p.text.trim()).length;
  const total = priorities.filter((p) => p.text.trim()).length;

  return (
    <div className="surface-card w-full p-4 md:p-5 relative flex flex-col">
      {/* glow */}
      <div className="absolute -top-8 -left-8 w-40 h-40 bg-violet-600/12 blur-3xl pointer-events-none" />

      {/* هدر */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="card-accent-bar accent-violet" />
          <Star className="w-4 h-4 text-violet-400" />
          <h2 className="text-base md:text-lg font-bold text-white">اولویت کارها</h2>
        </div>
        {total > 0 && (
          <span className="badge badge-violet">
            {formatPersianNumber(done)}/{formatPersianNumber(total)} انجام شده
          </span>
        )}
      </div>

      {/* ردیف‌ها */}
      <div className="flex-1 space-y-2.5">
        {priorities.map((item, idx) => (
          <div key={item.id} className="flex items-center gap-2.5 group">
            {/* چک‌باکس */}
            <button type="button" onClick={() => onItemToggle(item.id)}
              aria-pressed={item.completed}
              className={`neon-check ${item.completed ? 'checked' : ''}`}>
              <Check className={`w-4 h-4 stroke-[3] text-white transition-all ${item.completed ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`} />
            </button>

            {/* شماره */}
            <span className="text-[11px] font-bold text-slate-600 w-4 text-center shrink-0">
              {formatPersianNumber(idx + 1)}
            </span>

            {/* متن */}
            <input
              type="text"
              value={item.text}
              onChange={(e) => handleTextChange(item.id, e.target.value)}
              placeholder={`اولویت ${formatPersianNumber(idx + 1)}...`}
              className={`flex-1 py-1 text-sm text-slate-200 bg-transparent border-b border-slate-600/35 focus:border-violet-400/70 focus:outline-none transition placeholder-slate-600 font-medium ${
                item.completed ? 'line-through text-slate-500 decoration-violet-400/60 decoration-2' : ''
              }`}
            />

            {/* حذف */}
            <button type="button" onClick={() => handleRemove(item.id)}
              className="no-print opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition cursor-pointer"
              aria-label="حذف">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* افزودن */}
      <div className="no-print mt-4 pt-3 divider">
        <button type="button" onClick={handleAdd}
          className="btn btn-ghost mt-3 text-xs">
          <Plus className="w-3.5 h-3.5" />
          <span>افزودن اولویت</span>
        </button>
      </div>
    </div>
  );
};
