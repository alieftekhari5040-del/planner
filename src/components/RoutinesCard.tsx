import React from 'react';
import type { RoutineItem } from '../types/planner';
import { BookOpen, PlaySquare, Dumbbell, Sparkles, Check, Plus, Trash2, Droplets, Moon } from 'lucide-react';

interface RoutinesCardProps {
  routines: RoutineItem[];
  onChange: (routines: RoutineItem[]) => void;
  onItemToggle: (id: string) => void;
}

export const RoutinesCard: React.FC<RoutinesCardProps> = ({
  routines,
  onChange,
  onItemToggle,
}) => {
  const handleDetailChange = (id: string, detail: string) => {
    onChange(
      routines.map((item) => (item.id === id ? { ...item, detail } : item))
    );
  };

  const handleTitleChange = (id: string, title: string) => {
    onChange(
      routines.map((item) => (item.id === id ? { ...item, title } : item))
    );
  };

  const handleAddRoutine = () => {
    const newRoutine: RoutineItem = {
      id: `r-${Date.now()}`,
      title: 'عادت جدید',
      icon: 'custom',
      completed: false,
      detail: 'توضیحات و مقدار هدف...'
    };
    onChange([...routines, newRoutine]);
  };

  const handleDeleteRoutine = (id: string) => {
    if (routines.length <= 1) return;
    onChange(routines.filter((r) => r.id !== id));
  };

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'book':
        return <BookOpen className="w-4 h-4 text-purple-300" />;
      case 'play':
        return <PlaySquare className="w-4 h-4 text-purple-300" />;
      case 'dumbbell':
        return <Dumbbell className="w-4 h-4 text-purple-300" />;
      case 'water':
        return <Droplets className="w-4 h-4 text-cyan-300" />;
      case 'sleep':
        return <Moon className="w-4 h-4 text-indigo-300" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-300" />;
    }
  };

  return (
    <div className="surface-card w-full p-4 md:p-5 relative overflow-hidden flex flex-col justify-between">
      {/* Header with Red/Coral Accent Bar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-5 rounded-full bg-gradient-to-b from-rose-500 to-red-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
          <h2 className="text-base md:text-lg font-bold text-white tracking-wide">
            اولویت امروز (عادت‌های کلیدی)
          </h2>
        </div>
      </div>

      {/* Routines Rows with full editing & deleting */}
      <div className="space-y-3.5">
        {routines.map((item) => (
          <div
            key={item.id}
            className={`surface-row flex items-center justify-between gap-3 p-2.5 rounded-2xl transition-all duration-200 group ${
              item.completed ? 'is-complete' : ''
            }`}
          >
            {/* Right side in RTL: Upgraded Tactile Rounded Rectangle Checkbox */}
            <button
              type="button"
              onClick={() => onItemToggle(item.id)}
              className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer ${
                item.completed
                  ? 'bg-gradient-to-tr from-purple-600 to-purple-400 border-2 border-purple-200 text-white shadow-[0_0_12px_rgba(168,85,247,0.9)] scale-105'
                  : 'bg-[#150e38] border-2 border-purple-400/50 hover:border-purple-300 text-transparent hover:shadow-[0_0_8px_rgba(168,85,247,0.4)]'
              }`}
              title={item.completed ? 'عادت انجام شد' : 'ثبت انجام این روتین'}
              aria-pressed={item.completed}
              aria-label={item.completed ? 'لغو انجام روتین' : 'ثبت انجام روتین'}
            >
              <Check className={`w-4 h-4 stroke-[3] ${item.completed ? 'opacity-100' : 'opacity-0'}`} />
            </button>

            {/* Middle: Dashed input line for detail / notes */}
            <div className="flex-1 px-2">
              <input
                type="text"
                value={item.detail}
                onChange={(e) => handleDetailChange(item.id, e.target.value)}
                placeholder="توضیحات، تعداد صفحه یا ست..."
                className={`w-full text-center text-xs md:text-sm text-purple-200 bg-transparent border-b border-dashed border-purple-400/40 focus:border-purple-300 focus:outline-none transition placeholder-purple-400/25 ${
                  item.completed ? 'line-through text-purple-400/60' : ''
                }`}
              />
            </div>

            {/* Left side in RTL: Title (Editable) & Icon */}
            <div className="flex items-center gap-2 shrink-0">
              <input
                type="text"
                value={item.title}
                onChange={(e) => handleTitleChange(item.id, e.target.value)}
                className={`w-28 text-left text-xs md:text-sm font-bold tracking-tight bg-transparent focus:outline-none focus:border-b border-purple-400 ${
                  item.completed ? 'text-purple-300 line-through' : 'text-white'
                }`}
              />
              <div className="p-1 rounded-lg bg-purple-900/50 border border-purple-500/30">
                {getIcon(item.icon)}
              </div>
              <button
                type="button"
                onClick={() => handleDeleteRoutine(item.id)}
                className="no-print opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1 text-purple-400 hover:text-rose-400 transition cursor-pointer"
                title="حذف روتین"
                aria-label="حذف روتین"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Routine button */}
      <div className="no-print mt-3.5 pt-2 flex items-center justify-between border-t border-purple-500/20">
        <button
          type="button"
          onClick={handleAddRoutine}
          className="flex items-center gap-1.5 text-xs font-semibold text-purple-300/80 hover:text-purple-100 px-2.5 py-1 rounded-lg bg-purple-900/30 hover:bg-purple-800/50 border border-purple-500/20 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>افزودن روتین دلخواه</span>
        </button>

        <span className="text-[10px] text-purple-400/50">
          امکان تغییر نام، متن و حذف
        </span>
      </div>
    </div>
  );
};
