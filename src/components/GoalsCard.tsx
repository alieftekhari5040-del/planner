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

      {/* داخل */}
      <div className="flex-1 surface-inset p-3 rounded-xl space-y-2.5">
        {goals.map((item, idx) => (
          <div key={item.id} className="flex items-center gap-2.5 group">
            {/* چک‌باکس کوچک‌تر */}
            <button type="button" onClick={() => onGoalToggle(item.id)}
              aria-pressed={item.completed}
              className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border-2 transition-all cursor-pointer ${
                item.completed
                  ? 'bg-sky-600 border-sky-300 shadow-[0_0_10px_rgba(14,165,233,.7)]'
                  : 'bg-slate-900/60 border-slate-600/45 hover:border-sky-400/70'
              }`}>
              <Check className={`w-3 h-3 stroke-[3] text-white transition-all ${item.completed ? 'opacity-100' : 'opacity-0'}`} />
            </button>

            <span className="text-[11px] font-bold text-slate-600 w-4 text-center shrink-0">
              {formatPersianNumber(idx + 1)}
            </span>

            <input
              type="text"
              value={item.text}
              onChange={(e) => handleTextChange(item.id, e.target.value)}
              placeholder={`هدف ${formatPersianNumber(idx + 1)}...`}
              className={`flex-1 py-0.5 text-sm text-slate-200 bg-transparent border-b border-slate-600/30 focus:border-sky-400/65 focus:outline-none transition placeholder-slate-600 ${
                item.completed ? 'line-through text-slate-500 decoration-sky-400/55' : ''
              }`}
            />

            <button type="button" onClick={() => handleRemove(item.id)}
              className="no-print opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition cursor-pointer"
              aria-label="حذف">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      <div className="no-print mt-4 pt-3 divider">
        <button type="button" onClick={handleAdd}
          className="btn mt-3 text-xs"
          style={{ background: 'rgba(14,165,233,.12)', borderColor: 'rgba(56,189,248,.22)', color: '#7dd3fc' }}>
          <Plus className="w-3.5 h-3.5" />
          <span>افزودن هدف</span>
        </button>
      </div>
    </div>
  );
};
