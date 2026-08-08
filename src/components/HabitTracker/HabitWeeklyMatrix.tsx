import React, { useState } from 'react';
import type { Habit } from '../../types/habits';
import {
  PERSIAN_WEEKDAYS, getTodayJalali, getDateKey,
  formatPersianNumber, addDaysToJalali
} from '../../utils/jalali';
import { Check, Plus, Trash2, Flame, Zap } from 'lucide-react';
import { calculateHabitStats } from '../../utils/habitStorage';

interface HabitWeeklyMatrixProps {
  habits: Habit[];
  onToggleCell: (habitId: string, dateKey: string) => void;
  onAddHabit: (habit: Habit) => void;
  onDeleteHabit: (habitId: string) => void;
  onUpdateHabitTitle: (habitId: string, name: string) => void;
}

const EMOJI_CHOICES = ['🔥','💧','📚','🏋️‍♂️','🧘','💻','🌙','🥗','🎯','✍️','🎵','🏃'];

export const HabitWeeklyMatrix: React.FC<HabitWeeklyMatrixProps> = ({
  habits, onToggleCell, onAddHabit, onDeleteHabit, onUpdateHabitTitle,
}) => {
  const today = getTodayJalali();
  const currentDayIndex = PERSIAN_WEEKDAYS.indexOf(today.dayName);
  const [newHabitText, setNewHabitText] = useState('');
  const [newHabitEmoji, setNewHabitEmoji] = useState('🔥');

  const weekDays = PERSIAN_WEEKDAYS.map((name, idx) => {
    const diff = idx - currentDayIndex;
    const target = addDaysToJalali(today.jy, today.jm, today.jd, diff);
    return {
      name, shortName: name.slice(0, 3),
      dayNum: target.jd,
      dateKey: getDateKey(target.jy, target.jm, target.jd),
      isToday: idx === currentDayIndex,
      isPast: idx < currentDayIndex,
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
      color: '#8b5cf6',
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

  return (
    <div className="surface-card w-full p-5 sm:p-6 overflow-x-auto">

      {/* هدر */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg,rgba(109,40,217,.4),rgba(67,56,202,.3))', border: '1px solid rgba(139,92,246,.35)' }}>
            <Flame className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">ماتریس هفتگی عادت‌ها</h3>
            <p className="text-xs text-slate-500 mt-0.5">ردیابی وضعیت عادت‌ها در ۷ روز هفته جاری</p>
          </div>
        </div>
        <span className="badge badge-violet">
          <Zap className="w-3 h-3" />
          {formatPersianNumber(habits.length)} عادت فعال
        </span>
      </div>

      {/* جدول */}
      <div className="min-w-[680px]">

        {/* سرستون‌ها */}
        <div className="grid grid-cols-12 gap-2 pb-3 mb-2 items-center"
          style={{ borderBottom: '1px solid rgba(139,92,246,.14)' }}>
          <div className="col-span-4 flex items-center gap-1.5 pr-2">
            <span className="text-xs font-bold text-slate-500">عادت / روتین</span>
          </div>
          {weekDays.map((w) => (
            <div key={w.name} className="col-span-1 flex flex-col items-center justify-center gap-0.5">
              <div className={`w-full py-1.5 px-1 rounded-xl flex flex-col items-center justify-center transition-all ${
                w.isToday
                  ? 'bg-gradient-to-b from-violet-600 to-violet-800 border border-violet-300/55 shadow-[0_0_14px_rgba(139,92,246,.6)]'
                  : w.isPast
                  ? 'bg-slate-900/40 border border-slate-700/30'
                  : 'bg-slate-900/25 border border-slate-700/20'
              }`}>
                <span className={`text-[10px] font-bold ${w.isToday ? 'text-white' : 'text-slate-500'}`}>{w.shortName}</span>
                <span className={`text-[11px] font-black ${w.isToday ? 'text-white' : 'text-slate-400'}`}>{formatPersianNumber(w.dayNum)}</span>
              </div>
            </div>
          ))}
          <div className="col-span-1 text-center">
            <span className="text-[11px] font-bold text-slate-600">هفته</span>
          </div>
        </div>

        {/* ردیف‌های عادت */}
        <div className="space-y-2.5">
          {habits.length === 0 && (
            <div className="py-12 text-center">
              <div className="text-4xl mb-3">🌱</div>
              <p className="text-slate-500 text-sm font-medium">هنوز عادتی ثبت نشده</p>
              <p className="text-slate-600 text-xs mt-1">اولین عادت خود را از فرم پایین اضافه کنید</p>
            </div>
          )}
          {habits.map((habit) => {
            const todayKey = getDateKey(today.jy, today.jm, today.jd);
            const stats = calculateHabitStats(habit, todayKey);
            const weekDoneCount = weekDays.filter((w) => habit.history?.[w.dateKey]?.completed).length;
            const weekPct = Math.round((weekDoneCount / 7) * 100);

            return (
              <div key={habit.id}
                className="grid grid-cols-12 gap-2 items-center px-3 py-2.5 rounded-xl border transition-all duration-200 group"
                style={{
                  background: 'rgba(18,24,46,.58)',
                  borderColor: 'rgba(139,92,246,.12)',
                }}>

                {/* نام عادت */}
                <div className="col-span-4 flex items-center gap-2.5 pr-1 min-w-0">
                  <span className="text-xl shrink-0 select-none">{habit.icon}</span>
                  <input
                    type="text"
                    value={habit.name}
                    onChange={(e) => onUpdateHabitTitle(habit.id, e.target.value)}
                    className="flex-1 text-xs sm:text-sm font-semibold text-slate-200 bg-transparent focus:outline-none focus:border-b border-violet-400/55 transition truncate"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`حذف «${habit.name}»؟`)) onDeleteHabit(habit.id);
                    }}
                    className="no-print opacity-0 group-hover:opacity-100 p-1 text-slate-600 hover:text-rose-400 transition cursor-pointer shrink-0 rounded-md hover:bg-rose-950/30"
                    aria-label={`حذف ${habit.name}`}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* سلول‌های ۷ روز */}
                {weekDays.map((w) => {
                  const isChecked = !!habit.history?.[w.dateKey]?.completed;
                  return (
                    <div key={w.dateKey} className="col-span-1 flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => onToggleCell(habit.id, w.dateKey)}
                        aria-pressed={isChecked}
                        title={`${habit.name} — ${w.name}: ${isChecked ? 'لغو' : 'تیک'}`}
                        className={`w-8 h-8 rounded-xl flex items-center justify-center border-2 transition-all duration-200 cursor-pointer ${
                          isChecked
                            ? 'scale-105 shadow-[0_0_12px_rgba(139,92,246,.75)]'
                            : w.isToday
                            ? 'hover:scale-108 hover:border-violet-400/70'
                            : 'hover:scale-105'
                        }`}
                        style={isChecked ? {
                          background: 'linear-gradient(135deg,#7c3aed,#5b21b6)',
                          borderColor: '#c4b5fd',
                        } : {
                          background: 'rgba(13,18,38,.85)',
                          borderColor: w.isToday ? 'rgba(139,92,246,.45)' : 'rgba(148,163,210,.18)',
                        }}>
                        <Check className={`w-4 h-4 stroke-[3] text-white transition-all ${isChecked ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`} />
                      </button>
                    </div>
                  );
                })}

                {/* ستون پیشرفت */}
                <div className="col-span-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-bold text-violet-300">{formatPersianNumber(weekDoneCount)}/۷</span>
                  {stats.currentStreak > 0 && (
                    <span className="text-[10px] text-amber-400 flex items-center gap-0.5 font-bold">
                      <Flame className="w-2.5 h-2.5 fill-amber-400" />
                      {formatPersianNumber(stats.currentStreak)}
                    </span>
                  )}
                  {/* نوار پیشرفت */}
                  <div className="w-full h-1 rounded-full bg-slate-800 overflow-hidden mt-0.5">
                    <div className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${weekPct}%`,
                        background: weekPct === 100
                          ? 'linear-gradient(to right,#059669,#34d399)'
                          : 'linear-gradient(to right,#5b21b6,#8b5cf6)',
                      }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* فرم افزودن عادت */}
        <form onSubmit={handleQuickAdd}
          className="mt-5 pt-5 flex flex-wrap items-center gap-3"
          style={{ borderTop: '1px solid rgba(139,92,246,.14)' }}>

          {/* انتخاب ایموجی */}
          <div className="flex items-center gap-1 p-1 rounded-xl"
            style={{ background: 'rgba(13,18,38,.72)', border: '1px solid rgba(139,92,246,.18)' }}>
            {EMOJI_CHOICES.slice(0, 8).map((em) => (
              <button key={em} type="button" onClick={() => setNewHabitEmoji(em)}
                className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center cursor-pointer transition-all ${
                  newHabitEmoji === em
                    ? 'scale-115 shadow-md'
                    : 'hover:bg-violet-900/45 opacity-65 hover:opacity-100'
                }`}
                style={newHabitEmoji === em ? {
                  background: 'linear-gradient(135deg,rgba(109,40,217,.7),rgba(67,56,202,.6))',
                  border: '1px solid rgba(196,181,253,.35)',
                } : undefined}>
                {em}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={newHabitText}
            onChange={(e) => setNewHabitText(e.target.value)}
            placeholder="نام عادت جدید..."
            className="flex-1 min-w-[180px] px-4 py-2 text-sm text-slate-200 rounded-xl focus:outline-none font-medium placeholder-slate-600"
            style={{
              background: 'rgba(13,18,38,.72)',
              border: '1px solid rgba(139,92,246,.22)',
            }}
          />

          <button type="submit" className="btn btn-primary">
            <Plus className="w-4 h-4" />
            <span>افزودن عادت</span>
          </button>
        </form>
      </div>
    </div>
  );
};
