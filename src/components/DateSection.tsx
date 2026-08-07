import React from 'react';
import { PERSIAN_WEEKDAYS } from '../utils/jalali';
import { ChevronRight, ChevronLeft } from 'lucide-react';

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
    <div className="surface-card w-full mb-6 p-3.5 md:p-4 relative overflow-hidden">
      {/* Subtle background glow effect */}
      <div className="absolute top-0 right-1/4 w-48 h-20 bg-purple-600/15 blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Left (in RTL): Date input & quick day switcher */}
        <div className="w-full lg:w-auto flex flex-wrap items-center gap-2 justify-between lg:justify-start">
          <div className="flex items-center gap-2">
            <label htmlFor="planner-date" className="text-sm md:text-base font-bold text-purple-100 whitespace-nowrap">
              تاریخ:
            </label>
            <div className="relative flex-1 sm:w-64">
              <input
                id="planner-date"
                type="text"
                value={dateText}
                onChange={(e) => onChangeDateText(e.target.value)}
                placeholder="مثلاً: ۱۷ مرداد ۱۴۰۵"
                className="w-full px-3 py-1.5 text-sm md:text-base text-purple-100 bg-purple-950/40 hover:bg-purple-950/60 focus:bg-purple-900/50 border-b-2 border-purple-400/50 focus:border-purple-300 focus:outline-none transition rounded-t-lg text-right font-medium tracking-wide placeholder-purple-400/40"
              />
            </div>
          </div>

          {/* Quick Date Shift Buttons (no-print) */}
          <div className="no-print flex items-center gap-1">
            <button
              type="button"
              onClick={onPreviousDay}
              aria-label="رفتن به روز قبل"
              className="p-1.5 rounded-lg bg-purple-900/30 hover:bg-purple-800/60 border border-purple-500/30 text-purple-200 hover:text-white transition text-xs cursor-pointer"
              title="روز قبل"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onGoToToday}
              aria-label="رفتن به امروز"
              className="px-2.5 py-1 rounded-lg bg-purple-900/40 hover:bg-purple-700/60 border border-purple-500/30 text-purple-200 hover:text-white font-medium text-xs transition cursor-pointer"
            >
              امروز
            </button>
            <button
              type="button"
              onClick={onNextDay}
              aria-label="رفتن به روز بعد"
              className="p-1.5 rounded-lg bg-purple-900/30 hover:bg-purple-800/60 border border-purple-500/30 text-purple-200 hover:text-white transition text-xs cursor-pointer"
              title="روز بعد"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right (in RTL): Weekday pills matching the image layout */}
        <div className="w-full lg:w-auto flex flex-wrap items-center justify-center lg:justify-end gap-1.5 sm:gap-2">
          {PERSIAN_WEEKDAYS.map((day) => {
            const isSelected = selectedDayOfWeek === day;
            return (
              <button
                type="button"
                key={day}
                onClick={() => onSelectDayOfWeek(day)}
                className={`px-3 py-1.5 md:px-3.5 md:py-1.5 rounded-xl text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-b from-purple-500 to-purple-700 text-white shadow-[0_0_18px_rgba(168,85,247,0.8)] border border-purple-300 scale-105'
                    : 'bg-[#150e38]/70 hover:bg-purple-950/80 text-purple-300/80 hover:text-purple-100 border border-purple-500/30 hover:border-purple-400/60'
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
