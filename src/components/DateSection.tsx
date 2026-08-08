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
}) => (
  <div className="surface-card w-full p-4 md:p-5 relative overflow-hidden">
    <div className="absolute -top-10 right-1/3 w-64 h-32 bg-violet-600/8 blur-3xl pointer-events-none" />

    <div className="flex flex-col gap-4">

      {/* ردیف ۱: تاریخ + ناوبری */}
      <div className="flex flex-wrap items-center justify-between gap-3">

        <div className="flex items-center gap-2.5">
          <CalendarDays className="w-4 h-4 text-violet-400 shrink-0" />
          <span className="text-sm font-bold text-slate-400 whitespace-nowrap">تاریخ:</span>
          <input
            id="planner-date"
            type="text"
            value={dateText}
            onChange={(e) => onChangeDateText(e.target.value)}
            placeholder="مثلاً: ۱۷ مرداد ۱۴۰۵"
            className="w-40 sm:w-52 px-3 py-1.5 text-sm text-slate-200 rounded-xl focus:outline-none font-medium placeholder-slate-700 transition"
            style={{
              background: 'rgba(13,18,38,.65)',
              border: '1px solid rgba(139,92,246,.20)',
            }}
          />
        </div>

        {/* دکمه‌های ناوبری */}
        <div className="no-print flex items-center gap-1.5">
          <button type="button" onClick={onPreviousDay}
            className="p-1.5 rounded-xl border transition cursor-pointer text-slate-400 hover:text-white"
            style={{ background: 'rgba(13,18,38,.6)', borderColor: 'rgba(139,92,246,.18)' }}
            aria-label="روز قبل">
            <ChevronRight className="w-4 h-4" />
          </button>
          <button type="button" onClick={onGoToToday}
            className="px-3 py-1.5 rounded-xl border font-bold text-xs transition cursor-pointer"
            style={{
              background: 'linear-gradient(135deg,rgba(109,40,217,.35),rgba(67,56,202,.25))',
              borderColor: 'rgba(139,92,246,.32)',
              color: '#c4b5fd',
            }}
            aria-label="امروز">
            امروز
          </button>
          <button type="button" onClick={onNextDay}
            className="p-1.5 rounded-xl border transition cursor-pointer text-slate-400 hover:text-white"
            style={{ background: 'rgba(13,18,38,.6)', borderColor: 'rgba(139,92,246,.18)' }}
            aria-label="روز بعد">
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
              className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-220 cursor-pointer min-w-[3.6rem] text-center"
              style={isSelected ? {
                background: 'linear-gradient(135deg,#7c3aed,#5b21b6)',
                borderColor: '#c4b5fd',
                border: '1px solid #c4b5fd',
                color: '#fff',
                boxShadow: '0 0 18px rgba(139,92,246,.60)',
                transform: 'scale(1.06)',
              } : {
                background: 'rgba(13,18,38,.55)',
                border: '1px solid rgba(139,92,246,.15)',
                color: '#64748b',
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  </div>
);
