import React from 'react';
import type { GoalItem } from '../types/planner';
import { Check, Plus, Trash2, Target } from 'lucide-react';
import { formatPersianNumber } from '../utils/jalali';

interface GoalsCardProps {
  goals: GoalItem[];
  onChange: (goals: GoalItem[]) => void;
  onGoalToggle: (id: string) => void;
}

export const GoalsCard: React.FC<GoalsCardProps> = ({
  goals, onChange, onGoalToggle,
}) => {
  const handleTextChange = (id: string, text: string) =>
    onChange(goals.map((g) => (g.id === id ? { ...g, text } : g)));

  const handleAdd = () =>
    onChange([...goals, { id: `g-${Date.now()}`, text: '', completed: false }]);

  const handleRemove = (id: string) => {
    if (goals.length <= 1) return;
    onChange(goals.filter((g) => g.id !== id));
  };

  const done  = goals.filter((g) => g.completed && g.text.trim()).length;
  const total = goals.filter((g) => g.text.trim()).length;

  return (
    <div className="surface-card w-full p-4 md:p-5 relative overflow-hidden flex flex-col">
      {/* glow */}
      <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-sky-600/10 blur-3xl pointer-events-none" />

      {/* هدر */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="card-accent-bar accent-sky" />
          <Target className="w-4 h-4 text-sky-400" />
          <h2 className="text-base md:text-lg font-bold text-white">اهداف امروز</h2>
        </div>
        {total > 0 && (
          <span className="badge badge-sky">
            {formatPersianNumber(done)}/{formatPersianNumber(total)} محقق شد
          </span>
        )}
      </div>

      {/* ردیف‌ها — دقیقاً مثل PrioritiesCard */}
      <div className="flex-1 space-y-2.5">
        {goals.map((item, idx) => (
          <div key={item.id} className="flex items-center gap-2.5 group">
            {/* چک‌باکس نئون بزرگ */}
            <button
              type="button"
              onClick={() => onGoalToggle(item.id)}
              aria-pressed={item.completed}
              className={`neon-check ${item.completed ? 'checked' : ''}`}
              style={item.completed ? {
                background: 'linear-gradient(135deg,#0ea5e9,#0284c7)',
                borderColor: '#7dd3fc',
                boxShadow: '0 0 18px rgba(14,165,233,.75), 0 0 6px rgba(125,211,252,.4)'
              } : undefined}
            >
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
              placeholder={`هدف ${formatPersianNumber(idx + 1)}...`}
              className={`flex-1 py-1 text-sm text-slate-200 bg-transparent border-b border-slate-600/35 focus:border-sky-400/70 focus:outline-none transition placeholder-slate-600 font-medium ${
                item.completed ? 'line-through text-slate-500 decoration-sky-400/60 decoration-2' : ''
              }`}
            />

            {/* حذف */}
            <button
              type="button"
              onClick={() => handleRemove(item.id)}
              className="no-print opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition cursor-pointer"
              aria-label="حذف"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* افزودن */}
      <div className="no-print mt-4 pt-3 divider">
        <button
          type="button"
          onClick={handleAdd}
          className="btn mt-3 text-xs"
          style={{ background: 'rgba(14,165,233,.12)', borderColor: 'rgba(56,189,248,.22)', color: '#7dd3fc', border: '1px solid' }}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>افزودن هدف</span>
        </button>
      </div>
    </div>
  );
};
