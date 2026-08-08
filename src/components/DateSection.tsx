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
  selectedDayOfWeek,
  onSelectDayOfWeek,
  dateText,
  onChangeDateText,
  onPreviousDay,
  onNextDay,
  onGoToToday,
}) => {
  return (
    <div className="surface-card w-full p-4 md:p-5 relative overflow-hidden">
      <div className="absolute top-0 right-1/4 w-64 h-24 bg-violet-600/10 blur-3xl pointer-events-none" />

      <div className="flex flex-col gap-4">
        {/* ردیف بالا: تاریخ + دکمه‌های جابه‌جایی */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* تاریخ */}
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
              className="w-44 sm:w-56 px-3 py-1 text-sm text-violet-100 bg-violet-950/40 hover:bg-violet-950/60 focus:bg-violet-900/50 border border-violet-500/30 focus:border-violet-400 focus:outline-none transition rounded-lg text-right font-medium placeholder-slate-600"
            />
          </div>

          {/* دکمه‌های قبل/بعد/امروز */}
          <div className="no-print flex items-center gap-1.5">
            <button
              type="button"
              onClick={onPreviousDay}
              aria-label="روز قبل"
              className="p-1.5 rounded-lg bg-violet-900/30 hover:bg-violet-800/55 border border-violet-500/25 hover:border-violet-400/50 text-violet-300 hover:text-white transition cursor-pointer"
              title="روز قبل"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onGoToToday}
              aria-label="امروز"
              className="px-3 py-1 rounded-lg bg-violet-700/40 hover:bg-violet-600/60 border border-violet-400/30 text-violet-200 hover:text-white font-semibold text-xs transition cursor-pointer"
            >
              امروز
            </button>
            <button
              type="button"
              onClick={onNextDay}
              aria-label="روز بعد"
              className="p-1.5 rounded-lg bg-violet-900/30 hover:bg-violet-800/55 border border-violet-500/25 hover:border-violet-400/50 text-violet-300 hover:text-white transition cursor-pointer"
              title="روز بعد"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ردیف پایین: دکمه‌های روزهای هفته */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {PERSIAN_WEEKDAYS.map((day) => {
            const isSelected = selectedDayOfWeek === day;
            return (
              <button
                type="button"
                key={day}
                onClick={() => onSelectDayOfWeek(day)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer min-w-[4rem] text-center ${
                  isSelected
                    ? 'bg-gradient-to-b from-violet-500 to-violet-700 text-white shadow-[0_0_16px_rgba(139,92,246,0.75)] border border-violet-300/70 scale-105'
                    : 'bg-violet-950/40 hover:bg-violet-900/70 text-slate-400 hover:text-violet-100 border border-violet-500/20 hover:border-violet-400/50'
                }`}
                title={`رفتن به ${day}`}
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
