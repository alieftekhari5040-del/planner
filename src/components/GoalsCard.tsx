import React from 'react';
import type { GoalItem } from '../types/planner';
import { Plus, Trash2, Check } from 'lucide-react';
import { formatPersianNumber } from '../utils/jalali';

interface GoalsCardProps {
  goals: GoalItem[];
  onChange: (goals: GoalItem[]) => void;
  onGoalToggle: (id: string) => void;
}

export const GoalsCard: React.FC<GoalsCardProps> = ({
  goals,
  onChange,
  onGoalToggle,
}) => {
  const handleTextChange = (id: string, text: string) => {
    onChange(
      goals.map((item) => (item.id === id ? { ...item, text } : item))
    );
  };

  const handleAdd = () => {
    const newItem: GoalItem = {
      id: `g-${Date.now()}`,
      text: '',
      completed: false,
    };
    onChange([...goals, newItem]);
  };

  const handleRemove = (id: string) => {
    if (goals.length <= 1) return;
    onChange(goals.filter((item) => item.id !== id));
  };

  const completedCount = goals.filter((g) => g.completed && g.text.trim()).length;
  const totalCount = goals.filter((g) => g.text.trim()).length;

  return (
    <div className="surface-card w-full p-4 md:p-5 relative overflow-hidden flex flex-col justify-between">
      {/* Glow highlight */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-600/15 blur-3xl pointer-events-none" />

      <div>
        {/* Header with Red/Coral Accent Bar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-rose-500 to-red-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
            <h2 className="text-base md:text-lg font-bold text-white tracking-wide">
              اهداف امروز
            </h2>
          </div>

          {totalCount > 0 && (
            <span className="text-[11px] font-semibold text-purple-200 bg-purple-950/70 px-2.5 py-0.5 rounded-full border border-purple-500/30">
              {formatPersianNumber(completedCount)} از {formatPersianNumber(totalCount)} هدف محقق شد
            </span>
          )}
        </div>

        {/* Lined Note Box matching the original lined design */}
        <div className="surface-inset p-3 rounded-2xl space-y-2.5">
          {goals.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2.5 group">
              {/* Tactile Checkbox for Goals */}
              <button
                type="button"
                onClick={() => onGoalToggle(item.id)}
                className={`w-5 h-5 rounded-md flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer ${
                  item.completed
                    ? 'bg-purple-500 border border-purple-200 text-white shadow-[0_0_8px_rgba(168,85,247,0.8)]'
                    : 'bg-[#150e38] border border-purple-400/50 hover:border-purple-300 text-transparent'
                }`}
                title={item.completed ? 'هدف محقق شد' : 'تیک زدن تحقق هدف'}
                aria-pressed={item.completed}
                aria-label={item.completed ? 'لغو تحقق هدف' : 'تحقق هدف'}
              >
                <Check className={`w-3.5 h-3.5 stroke-[3] ${item.completed ? 'opacity-100' : 'opacity-0'}`} />
              </button>

              <span className="text-xs font-bold text-purple-400/60 w-4 text-center">
                {formatPersianNumber(index + 1)}
              </span>

              <input
                type="text"
                value={item.text}
                onChange={(e) => handleTextChange(item.id, e.target.value)}
                placeholder={`هدف شماره ${formatPersianNumber(index + 1)}...`}
                className={`w-full py-1 text-sm md:text-base text-purple-100 bg-transparent border-b border-purple-500/30 focus:border-purple-300 focus:outline-none transition placeholder-purple-400/30 ${
                  item.completed ? 'line-through text-purple-400/60' : ''
                }`}
              />

              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="no-print opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1 text-purple-400 hover:text-rose-400 transition cursor-pointer"
                title="حذف این هدف"
                aria-label="حذف این هدف"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Add Button */}
      <div className="no-print mt-3.5 pt-2 flex items-center justify-between border-t border-purple-500/20">
        <button
          type="button"
          onClick={handleAdd}
          className="flex items-center gap-1.5 text-xs font-semibold text-purple-300/80 hover:text-purple-100 px-2.5 py-1 rounded-lg bg-purple-900/30 hover:bg-purple-800/50 border border-purple-500/20 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>افزودن هدف جدید</span>
        </button>

        <span className="text-[10px] text-purple-400/50">
          امکان تیک زدن و ویرایش متن
        </span>
      </div>
    </div>
  );
};
