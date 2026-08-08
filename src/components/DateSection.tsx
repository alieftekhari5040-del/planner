import React from 'react';
import { PERSIAN_WEEKDAYS } from '../utils/jalali';
import { ChevronRight, ChevronLeft, CalendarDays } from 'lucide-react';

interface DateSectionProps {
  selectedDayOfWeek: string;
  onSelectDayOfWeek: (day: string) => void;
  dateText: string;
  onChangeDateText: (text: string) => void;
  onPreviousDay: () => void;
  onNextDay: () => void;
  onGoToToday: () => void;
}

export const DateSection: React.FC<DateSectionProps> = ({
  selectedDayOfWeek, onSelectDayOfWeek, dateText,
  onChangeDateText, onPreviousDay, onNextDay, onGoToToday,
}) => {
  return (
    <div className="surface-card w-full p-4 md:p-5 relative overflow-hidden">
      {/* glow */}
      <div className="absolute -top-8 right-1/3 w-56 h-28 bg-violet-600/10 blur-3xl pointer-events-none" />

      <div className="flex flex-col gap-4">
        {/* ردیف ۱: تاریخ + ناوبری */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <CalendarDays className="w-4 h-4 text-violet-400 shrink-0" />
            <label htmlFor="planner-date" className="text-sm font-bold text-slate-300 whitespace-nowrap">
              تاریخ:
            </label>
            <input
              id="planner-date"
              type="text"
              value={dateText}
              onChange={(e) => onChangeDateText(e.target.value)}
              placeholder="مثلاً: ۱۷ مرداد ۱۴۰۵"
              className="w-40 sm:w-52 px-3 py-1 text-sm text-violet-100 bg-violet-950/35 hover:bg-violet-950/55 focus:bg-violet-900/45 border border-violet-500/25 focus:border-violet-400/70 focus:outline-none transition rounded-lg text-right font-medium placeholder-slate-600"
            />
          </div>

          {/* دکمه‌های قبل/امروز/بعد */}
          <div className="no-print flex items-center gap-1.5">
            <button type="button" onClick={onPreviousDay}
              className="p-1.5 rounded-lg bg-violet-900/28 hover:bg-violet-800/50 border border-violet-500/22 hover:border-violet-400/45 text-violet-300 hover:text-white transition cursor-pointer"
              title="روز قبل" aria-label="روز قبل">
              <ChevronRight className="w-4 h-4" />
            </button>
            <button type="button" onClick={onGoToToday}
              className="px-3 py-1 rounded-lg bg-violet-700/35 hover:bg-violet-600/55 border border-violet-400/28 text-violet-200 hover:text-white font-semibold text-xs transition cursor-pointer"
              aria-label="امروز">
              امروز
            </button>
            <button type="button" onClick={onNextDay}
              className="p-1.5 rounded-lg bg-violet-900/28 hover:bg-violet-800/50 border border-violet-500/22 hover:border-violet-400/45 text-violet-300 hover:text-white transition cursor-pointer"
              title="روز بعد" aria-label="روز بعد">
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ردیف ۲: دکمه‌های روز هفته */}
        <div className="flex items-center justify-center flex-wrap gap-2">
          {PERSIAN_WEEKDAYS.map((day) => {
            const isSelected = selectedDayOfWeek === day;
            return (
              <button
                key={day} type="button"
                onClick={() => onSelectDayOfWeek(day)}
                title={`رفتن به ${day}`}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-220 cursor-pointer min-w-[3.8rem] text-center ${
                  isSelected
                    ? 'bg-gradient-to-b from-violet-500 to-violet-700 text-white border border-violet-300/55 shadow-[0_0_18px_rgba(139,92,246,.65)] scale-[1.06]'
                    : 'bg-violet-950/38 hover:bg-violet-900/65 text-slate-400 hover:text-violet-100 border border-violet-500/18 hover:border-violet-400/45'
                }`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
