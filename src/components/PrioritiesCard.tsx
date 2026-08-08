import React from 'react';
import type { PriorityItem } from '../types/planner';
import { Check, Plus, Trash2, Star } from 'lucide-react';
import { formatPersianNumber } from '../utils/jalali';

interface Props {
  priorities: PriorityItem[];
  onChange: (p: PriorityItem[]) => void;
  onItemToggle: (id: string) => void;
}

export const PrioritiesCard: React.FC<Props> = ({ priorities, onChange, onItemToggle }) => {
  const set = (id: string, text: string) =>
    onChange(priorities.map((p) => (p.id === id ? { ...p, text } : p)));
  const add = () =>
    onChange([...priorities, { id: `p-${Date.now()}`, text: '', completed: false }]);
  const del = (id: string) =>
    priorities.length > 1 && onChange(priorities.filter((p) => p.id !== id));

  const done  = priorities.filter((p) => p.completed && p.text.trim()).length;
  const total = priorities.filter((p) => p.text.trim()).length;

  return (
    <div className="card flex flex-col">
      {/* head */}
      <div className="card-head">
        <div className="card-head-left">
          <span className="accent accent-v" />
          <Star className="w-3.5 h-3.5 text-violet-400" />
          <span className="card-title">اولویت کارها</span>
        </div>
        {total > 0 && (
          <span className="badge badge-v">{formatPersianNumber(done)}/{formatPersianNumber(total)}</span>
        )}
      </div>

      {/* body */}
      <div className="card-body flex-1 space-y-0.5 py-2">
        {priorities.map((item, i) => (
          <div key={item.id} className={`row-item group ${item.completed ? 'done' : ''}`}>
            <button type="button" onClick={() => onItemToggle(item.id)} aria-pressed={item.completed}
              className={`cb ${item.completed ? 'on' : ''}`}>
              <Check className={`w-3.5 h-3.5 stroke-[3] text-white ${item.completed ? 'opacity-100' : 'opacity-0'}`} />
            </button>
            <span className="num">{formatPersianNumber(i + 1)}</span>
            <input
              type="text" value={item.text}
              onChange={(e) => set(item.id, e.target.value)}
              placeholder={`اولویت ${formatPersianNumber(i + 1)}...`}
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
          <Plus className="w-3.5 h-3.5" /> افزودن اولویت
        </button>
      </div>
    </div>
  );
};
