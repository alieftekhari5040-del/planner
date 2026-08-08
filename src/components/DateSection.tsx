import React from 'react';
import { PERSIAN_WEEKDAYS } from '../utils/jalali';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface Props {
  selectedDayOfWeek: string;
  onSelectDayOfWeek: (day: string) => void;
  dateText: string;
  onChangeDateText: (t: string) => void;
  onPreviousDay: () => void;
  onNextDay: () => void;
  onGoToToday: () => void;
}

export const DateSection: React.FC<Props> = ({
  selectedDayOfWeek, onSelectDayOfWeek,
  dateText, onChangeDateText,
  onPreviousDay, onNextDay, onGoToToday,
}) => (
  <div className="card p-4 flex flex-col gap-3">
    {/* ردیف ۱: تاریخ + ناوبری */}
    <div className="flex flex-wrap items-center justify-between gap-3">
      {/* تاریخ */}
      <div className="flex items-center gap-2.5">
        <label htmlFor="date-inp" className="text-sm font-semibold text-slate-400 whitespace-nowrap">
          تاریخ:
        </label>
        <input
          id="date-inp"
          type="text"
          value={dateText}
          onChange={(e) => onChangeDateText(e.target.value)}
          placeholder="مثلاً: ۱۷ مرداد ۱۴۰۵"
          className="w-44 sm:w-56 px-3 py-1.5 text-sm rounded-lg outline-none text-right font-medium"
          style={{
            background: 'rgba(255,255,255,.04)',
            border: '1px solid rgba(255,255,255,.08)',
            color: 'var(--c-text)',
          }}
        />
      </div>

      {/* ناوبری روز */}
      <div className="no-print flex items-center gap-1.5">
        <button type="button" onClick={onPreviousDay} aria-label="روز قبل"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
          style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.07)' }}>
          <ChevronRight className="w-4 h-4" />
        </button>
        <button type="button" onClick={onGoToToday} aria-label="امروز"
          className="px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
          style={{
            background: 'rgba(139,92,246,.15)',
            border: '1px solid rgba(139,92,246,.3)',
            color: '#c4b5fd',
          }}>
          امروز
        </button>
        <button type="button" onClick={onNextDay} aria-label="روز بعد"
          className="p-1.5 rounded-lg text-slate-400 hover:text-white transition cursor-pointer"
          style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.07)' }}>
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>
    </div>

    {/* ردیف ۲: روزهای هفته */}
    <div className="flex flex-wrap items-center justify-center gap-2">
      {PERSIAN_WEEKDAYS.map((day) => {
        const sel = selectedDayOfWeek === day;
        return (
          <button key={day} type="button"
            onClick={() => onSelectDayOfWeek(day)}
            title={`رفتن به ${day}`}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer min-w-[3.5rem] text-center"
            style={sel ? {
              background: 'linear-gradient(135deg,#7c3aed,#5b21b6)',
              border: '1px solid rgba(196,181,253,.45)',
              color: '#fff',
              boxShadow: '0 0 16px rgba(139,92,246,.45)',
            } : {
              background: 'rgba(255,255,255,.04)',
              border: '1px solid rgba(255,255,255,.07)',
              color: 'var(--c-subtle)',
            }}>
            {day}
          </button>
        );
      })}
    </div>
  </div>
);
