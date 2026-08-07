import React, { useState } from 'react';
import type { Habit } from '../../types/habits';
import {
  PERSIAN_WEEKDAYS,
  getTodayJalali,
  getDateKey,
  formatPersianNumber,
  addDaysToJalali
} from '../../utils/jalali';
import { Check, Plus, Trash2, Sparkles, Flame } from 'lucide-react';
import { calculateHabitStats } from '../../utils/habitStorage';

interface HabitWeeklyMatrixProps {
  habits: Habit[];
  onToggleCell: (habitId: string, dateKey: string) => void;
  onAddHabit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
  onUpdateHabitTitle: (habitId: string, name: string) => void;
}

export const HabitWeeklyMatrix: React.FC<HabitWeeklyMatrixProps> = ({
  habits,
  onToggleCell,
  onAddHabit,
  onDeleteHabit,
  onUpdateHabitTitle,
}) => {
  const today = getTodayJalali();
  const currentDayIndex = PERSIAN_WEEKDAYS.indexOf(today.dayName);
  const [newHabitText, setNewHabitText] = useState('');
  const [newHabitEmoji, setNewHabitEmoji] = useState('🔥');

  // Generate 7 days for the current Persian week (Saturday to Friday) with 100% mathematical accuracy
  const weekDays = PERSIAN_WEEKDAYS.map((name, idx) => {
    const diff = idx - currentDayIndex;
    const target = addDaysToJalali(today.jy, today.jm, today.jd, diff);
    const key = getDateKey(target.jy, target.jm, target.jd);

    return {
      name,
      dayNum: target.jd,
      dateKey: key,
      isToday: idx === currentDayIndex,
    };
  });

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitText.trim()) return;

    const todayKey = getDateKey(today.jy, today.jm, today.jd);
    const newHabit: Habit = {
      id: `h-${Date.now()}`,
      name: newHabitText.trim(),
      category: 'productivity',
      icon: newHabitEmoji,
      color: '#a855f7',
      targetType: 'numeric',
      targetValue: 1,
      unit: 'بار',
      frequency: 'daily',
      createdAt: todayKey,
      history: {},
    };

    onAddHabit(newHabit);
    setNewHabitText('');
  };

  const emojiChoices = ['🔥', '💧', '📚', '🏋️‍♂️', '🧘', '💻', '🌙', '🥗', '🎯', '✍️'];

  return (
    <div className="surface-card w-full p-4 sm:p-6 overflow-x-auto">
      {/* Matrix Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-purple-500/25">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-purple-950 border border-purple-500/30 text-amber-400">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
              <span>ماتریس هفتگی پیوستگی عادت‌ها</span>
            </h3>
            <p className="text-xs text-purple-300/80 mt-0.5">
              ردیابی و تیک زدن وضعیت عادت‌ها در تمام ۷ روز هفته جاری (شنبه تا جمعه)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-purple-950/70 border border-purple-500/30 text-purple-200">
            {formatPersianNumber(habits.length)} عادت فعال در ماتریس
          </span>
        </div>
      </div>

      {/* Table Matrix */}
      <div className="min-w-[700px]">
        {/* Days Header */}
        <div className="grid grid-cols-12 gap-2 pb-3 mb-3 border-b border-purple-500/30 text-xs font-bold text-purple-300 text-center items-center">
          <div className="col-span-4 text-right pr-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>عنوان عادت و روتین</span>
          </div>

          {weekDays.map((w) => (
            <div
              key={w.name}
              className={`col-span-1 py-1.5 px-1 rounded-xl flex flex-col items-center justify-center transition-all ${
                w.isToday
                  ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black border border-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.8)] scale-105'
                  : 'bg-purple-950/50 text-purple-300 border border-purple-500/20'
              }`}
            >
              <span className="text-[11px] font-bold">{w.name.slice(0, 4)}</span>
              <span className="text-[10px] text-purple-200/80">{formatPersianNumber(w.dayNum)}</span>
            </div>
          ))}

          <div className="col-span-1 text-center text-[11px]">پیشرفت</div>
        </div>

        {/* Rows for each habit */}
        <div className="space-y-3">
          {habits.map((habit) => {
            const todayKey = getDateKey(today.jy, today.jm, today.jd);
            const stats = calculateHabitStats(habit, todayKey);

            // Count completed in current week
            const weekDoneCount = weekDays.filter((w) => habit.history?.[w.dateKey]?.completed).length;

            return (
              <div
                key={habit.id}
                className="grid grid-cols-12 gap-2 items-center p-3 rounded-2xl bg-[#110a36]/70 border border-purple-500/25 hover:border-purple-400/50 transition group shadow-sm"
              >
                {/* Habit Title (Inline Editable) & Icon & Delete */}
                <div className="col-span-4 flex items-center gap-2.5 pr-1">
                  <span className="text-xl shrink-0">{habit.icon}</span>

                  <input
                    type="text"
                    value={habit.name}
                    onChange={(e) => onUpdateHabitTitle(habit.id, e.target.value)}
                    className="w-full text-xs sm:text-sm font-bold text-white bg-transparent focus:outline-none focus:border-b border-purple-400 transition"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`آیا از حذف عادت «${habit.name}» مطمئن هستید؟`)) {
                        onDeleteHabit(habit.id);
                      }
                    }}
                    className="no-print opacity-100 sm:opacity-0 sm:group-hover:opacity-100 p-1 text-purple-400 hover:text-rose-400 transition cursor-pointer shrink-0"
                    title="حذف از ماتریس"
                    aria-label={`حذف عادت ${habit.name}`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 7 Days Tactile Neon Rounded Checkboxes */}
                {weekDays.map((w) => {
                  const isChecked = !!habit.history?.[w.dateKey]?.completed;
                  return (
                    <div key={w.dateKey} className="col-span-1 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => onToggleCell(habit.id, w.dateKey)}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer ${
                          isChecked
                            ? 'bg-gradient-to-tr from-purple-600 via-purple-500 to-indigo-500 border-2 border-purple-200 text-white shadow-[0_0_12px_rgba(168,85,247,0.9)] scale-105'
                            : 'bg-[#160e3f] border-2 border-purple-400/40 hover:border-purple-300 text-transparent hover:shadow-[0_0_8px_rgba(168,85,247,0.4)]'
                        }`}
                        title={`${habit.name} - ${w.name}: ${isChecked ? 'انجام شد (کلیک برای لغو)' : 'تیک زدن'}`}
                        aria-pressed={isChecked}
                        aria-label={`${habit.name}، ${w.name}، ${isChecked ? 'لغو انجام' : 'ثبت انجام'}`}
                      >
                        <Check className={`w-4 h-4 stroke-[3] ${isChecked ? 'opacity-100' : 'opacity-0'}`} />
                      </button>
                    </div>
                  );
                })}

                {/* Week Done Badge & Streak */}
                <div className="col-span-1 flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-cyan-300 bg-purple-950/80 px-2 py-0.5 rounded-lg border border-purple-500/30">
                    {formatPersianNumber(weekDoneCount)}/۷
                  </span>
                  <span className="text-[10px] text-amber-400 mt-0.5 flex items-center gap-0.5">
                    <Flame className="w-2.5 h-2.5 fill-amber-400" />
                    {formatPersianNumber(stats.currentStreak)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Add Habit Row directly in Matrix */}
        <form onSubmit={handleQuickAdd} className="mt-4 pt-4 border-t border-purple-500/25 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-purple-950/60 border border-purple-500/30">
            {emojiChoices.slice(0, 6).map((em) => (
              <button
                key={em}
                type="button"
                onClick={() => setNewHabitEmoji(em)}
                className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center cursor-pointer transition ${
                  newHabitEmoji === em ? 'bg-purple-600 scale-110 shadow-md' : 'hover:bg-purple-900/50'
                }`}
              >
                {em}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={newHabitText}
            onChange={(e) => setNewHabitText(e.target.value)}
            placeholder="عنوان عادت جدید برای اضافه به ماتریس (مثلاً: پیاده‌روی، تمرین کدنویسی...)"
            className="flex-1 min-w-[220px] px-3.5 py-2 text-xs sm:text-sm text-purple-100 bg-[#120a3a]/80 border border-purple-500/40 rounded-xl focus:border-purple-300 focus:outline-none font-medium placeholder-purple-400/40"
          />

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md transition cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>افزودن به ماتریس</span>
          </button>
        </form>
      </div>
    </div>
  );
};
