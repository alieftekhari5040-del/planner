import React, { useEffect, useState } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Calendar as CalendarIcon
} from 'lucide-react';
import {
  PERSIAN_MONTHS,
  PERSIAN_WEEKDAYS,
  formatPersianNumber,
  getDateKey,
  getDaysInJalaliMonth,
  getJalaliDateForOffset,
  getTodayJalali
} from '../utils/jalali';
import { checkDateHasData } from '../utils/storage';

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentJy: number;
  currentJm: number;
  currentJd: number;
  onSelectDate: (jy: number, jm: number, jd: number, dayName: string) => void;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  onClose,
  currentJy,
  currentJm,
  currentJd,
  onSelectDate,
}) => {
  const [viewYear, setViewYear] = useState(currentJy);
  const [viewMonth, setViewMonth] = useState(currentJm);

  useEffect(() => {
    if (isOpen) {
      setViewYear(currentJy);
      setViewMonth(currentJm);
    }
  }, [currentJm, currentJy, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const today = getTodayJalali();
  const maxDaysInMonth = getDaysInJalaliMonth(viewYear, viewMonth);

  const handlePrevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const handleGoTodayMonth = () => {
    setViewYear(today.jy);
    setViewMonth(today.jm);
  };

  // Start the grid on the correct Persian weekday instead of placing day ۱ arbitrarily.
  const firstDay = getJalaliDateForOffset(viewYear, viewMonth, 1, 0);
  const firstDayIndex = PERSIAN_WEEKDAYS.indexOf(firstDay.dayName);
  const monthDays = Array.from({ length: maxDaysInMonth }, (_, i) => i + 1);
  const calendarCells: Array<number | null> = [
    ...Array.from({ length: Math.max(0, firstDayIndex) }, () => null),
    ...monthDays
  ];

  return (
    <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4" role="presentation">
      <div
        className="modal-card relative w-full max-w-lg p-6 text-right"
        role="dialog"
        aria-modal="true"
        aria-labelledby="calendar-modal-title"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="بستن تقویم"
          className="absolute top-4 left-4 p-2 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-500/30 text-purple-300 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-2 rounded-xl bg-purple-950 border border-purple-500/30 text-purple-300">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 id="calendar-modal-title" className="text-xl font-bold text-white">تقویم شمسی و جابجایی بین روزها</h3>
            <p className="text-xs text-purple-300/70">
              روی هر روز کلیک کنید تا اطلاعات ذخیره‌شده آن روز در لپ‌تاپ بارگذاری شود
            </p>
          </div>
        </div>

        {/* Month Selector Bar */}
        <div className="flex items-center justify-between p-2 rounded-2xl bg-purple-950/60 border border-purple-500/30 my-5">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg bg-purple-900/40 hover:bg-purple-800 border border-purple-500/20 text-purple-200 hover:text-white transition cursor-pointer flex items-center gap-1 text-xs"
            title="ماه قبل"
          >
            <ChevronRight className="w-4 h-4" />
            <span>ماه قبل</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white">
              {PERSIAN_MONTHS[viewMonth - 1]} {formatPersianNumber(viewYear)}
            </span>
            <button
              type="button"
              onClick={handleGoTodayMonth}
              className="px-2 py-0.5 rounded-md bg-purple-900/60 hover:bg-purple-700 text-[10px] text-purple-300 hover:text-white border border-purple-500/30 cursor-pointer"
            >
              برو به ماه جاری
            </button>
          </div>

          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg bg-purple-900/40 hover:bg-purple-800 border border-purple-500/20 text-purple-200 hover:text-white transition cursor-pointer flex items-center gap-1 text-xs"
            title="ماه بعد"
          >
            <span>ماه بعد</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Month Days Grid */}
        <div className="grid grid-cols-7 gap-2 text-center mb-6">
          {PERSIAN_WEEKDAYS.map((day) => (
            <span key={day} className="py-1 text-[10px] font-bold text-purple-400/80">
              {day.slice(0, 3)}
            </span>
          ))}
          {calendarCells.map((dayNum, cellIndex) => {
            if (dayNum === null) {
              return <span key={`empty-${cellIndex}`} aria-hidden="true" />;
            }

            const dateKey = getDateKey(viewYear, viewMonth, dayNum);
            const hasData = checkDateHasData(dateKey);
            const isCurrentSelected =
              viewYear === currentJy && viewMonth === currentJm && dayNum === currentJd;
            const isToday =
              viewYear === today.jy && viewMonth === today.jm && dayNum === today.jd;

            return (
              <button
                key={dayNum}
                type="button"
                onClick={() => {
                  const dayName = 'روز ' + formatPersianNumber(dayNum);
                  onSelectDate(viewYear, viewMonth, dayNum, dayName);
                  onClose();
                }}
                className={`h-11 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 relative group cursor-pointer ${
                  isCurrentSelected
                    ? 'bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-black border border-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.8)] scale-105'
                    : hasData
                    ? 'bg-[#180e46] border border-purple-400/60 text-purple-100 hover:border-purple-300'
                    : 'bg-purple-950/40 border border-purple-500/20 hover:border-purple-400/50 text-purple-300/80 hover:text-white'
                } ${isToday && !isCurrentSelected ? 'ring-2 ring-amber-400/80' : ''}`}
              >
                <span className="text-xs sm:text-sm font-bold">{formatPersianNumber(dayNum)}</span>

                {/* Has Data Dot */}
                {hasData && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,1)] mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="pt-3 border-t border-purple-500/20 flex flex-wrap items-center justify-between text-xs text-purple-300/70">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,1)]" />
            <span>روزهای ثبت‌شده در حافظه مرورگر</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded ring-1 ring-amber-400 bg-transparent" />
            <span>امروز</span>
          </div>
        </div>
      </div>
    </div>
  );
};
