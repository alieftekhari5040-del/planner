import React from 'react';
import type { GoalItem } from '../types/planner';
import { Check, Plus, Trash2, Target } from 'lucide-react';
import { formatPersianNumber } from '../utils/jalali';

interface Props {
  goals: GoalItem[];
  onChange: (g: GoalItem[]) => void;
  onGoalToggle: (id: string) => void;
}

export const GoalsCard: React.FC<Props> = ({ goals, onChange, onGoalToggle }) => {
  const set = (id: string, text: string) =>
    onChange(goals.map((g) => (g.id === id ? { ...g, text } : g)));
  const add = () =>
    onChange([...goals, { id: `g-${Date.now()}`, text: '', completed: false }]);
  const del = (id: string) =>
    goals.length > 1 && onChange(goals.filter((g) => g.id !== id));

  const done  = goals.filter((g) => g.completed && g.text.trim()).length;
  const total = goals.filter((g) => g.text.trim()).length;

  return (
    <div className="card flex flex-col">
      {/* head */}
      <div className="card-head">
        <div className="card-head-left">
          <span className="accent accent-s" />
          <Target className="w-3.5 h-3.5 text-sky-400" />
          <span className="card-title">اهداف امروز</span>
        </div>
        {total > 0 && (
          <span className="badge badge-s">{formatPersianNumber(done)}/{formatPersianNumber(total)}</span>
        )}
      </div>

      {/* body */}
      <div className="card-body flex-1 space-y-0.5 py-2">
        {goals.map((item, i) => (
          <div key={item.id} className={`row-item group ${item.completed ? 'done' : ''}`}>
            <button type="button" onClick={() => onGoalToggle(item.id)} aria-pressed={item.completed}
              className={`cb ${item.completed ? 'on-sky' : ''}`}>
              <Check className={`w-3.5 h-3.5 stroke-[3] text-white ${item.completed ? 'opacity-100' : 'opacity-0'}`} />
            </button>
            <span className="num">{formatPersianNumber(i + 1)}</span>
            <input
              type="text" value={item.text}
              onChange={(e) => set(item.id, e.target.value)}
              placeholder={`هدف ${formatPersianNumber(i + 1)}...`}
              className={`field ${item.completed ? 'done' : ''}`}
            />
            <button type="button" onClick={() => del(item.id)}
              className="icon-btn no-print opacity-0 group-hover:opacity-100">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* foot */}
      <div className="card-foot no-print">
        <button type="button" onClick={add} className="btn btn-add text-xs">
          <Plus className="w-3.5 h-3.5" /> افزودن هدف
        </button>
      </div>
    </div>
  );
};
