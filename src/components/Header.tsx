import React, { useRef } from 'react';
import { formatPersianNumber } from '../utils/jalali';
import {
  Printer, RotateCcw, Volume2, VolumeX,
  Calendar, FileJson, CalendarDays, History,
  Upload, TrendingUp
} from 'lucide-react';

interface HeaderProps {
  onPrint: () => void;
  onReset: () => void;
  onOpenHistory: () => void;
  onOpenCalendarModal: () => void;
  onOpenTemplates: () => void;
  onExportJSON: () => void;
  onImportJSON: (file: File) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  completionPercentage: number;
}

export const Header: React.FC<HeaderProps> = ({
  onPrint, onReset, onOpenHistory, onOpenCalendarModal,
  onOpenTemplates, onExportJSON, onImportJSON,
  soundEnabled, onToggleSound, completionPercentage,
}) => {
  const importRef = useRef<HTMLInputElement>(null);
  const pct = Math.round(completionPercentage);
  const isDone = pct === 100;

  const strokeColor = isDone ? '#34d399' : '#a78bfa';
  const circumference = 2 * Math.PI * 15.9;
  const dashOffset = circumference - (completionPercentage / 100) * circumference;

  return (
    <header className="w-full mb-5">

      {/* ── تولبار ── */}
      <div className="no-print app-toolbar flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 mb-5">

        {/* progress chip */}
        <div className="progress-chip flex items-center gap-3 px-3.5 py-2">
          <div className="relative w-10 h-10 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none"
                stroke="rgba(109,40,217,.18)" strokeWidth="2.8" />
              <circle cx="18" cy="18" r="15.9" fill="none"
                stroke={strokeColor} strokeWidth="2.8" strokeLinecap="round"
                strokeDasharray={`${circumference}`}
                strokeDashoffset={dashOffset}
                className="transition-all duration-700 ease-out" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black leading-none"
              style={{ color: strokeColor }}>
              {formatPersianNumber(pct)}٪
            </span>
          </div>
          <div className="text-right leading-tight">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3 h-3 text-violet-400" />
              <span className="text-xs font-bold text-slate-200">پیشرفت روز</span>
            </div>
            <div className="text-[11px] mt-0.5 font-medium"
              style={{ color: isDone ? '#34d399' : '#6b7a99' }}>
              {isDone ? '🎉 روز کامل شد!' : `${formatPersianNumber(pct)}٪ انجام شده`}
            </div>
          </div>
        </div>

        {/* دکمه‌ها */}
        <div className="flex flex-wrap items-center gap-1.5">

          <button onClick={onOpenCalendarModal} type="button" className="btn btn-ghost" title="تقویم ماهانه">
            <CalendarDays className="w-3.5 h-3.5 text-violet-300" /><span>تقویم</span>
          </button>

          <button onClick={onOpenTemplates} type="button" className="btn btn-ghost" title="قالب‌های آماده">
            <Calendar className="w-3.5 h-3.5 text-amber-400" /><span>قالب‌ها</span>
          </button>

          <button onClick={onOpenHistory} type="button" className="btn btn-ghost" title="تاریخچه">
            <History className="w-3.5 h-3.5 text-sky-400" /><span>تاریخچه</span>
          </button>

          <div className="w-px h-5 bg-slate-700/55 mx-0.5" />

          <button onClick={onExportJSON} type="button" className="btn btn-ghost" title="خروجی JSON">
            <FileJson className="w-3.5 h-3.5 text-emerald-400" /><span>خروجی</span>
          </button>

          <input ref={importRef} type="file" accept="application/json,.json"
            className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) onImportJSON(f); e.target.value = ''; }}
            aria-label="انتخاب فایل پشتیبان" />
          <button onClick={() => importRef.current?.click()} type="button" className="btn btn-ghost" title="بازیابی">
            <Upload className="w-3.5 h-3.5 text-cyan-400" /><span>بازیابی</span>
          </button>

          <div className="w-px h-5 bg-slate-700/55 mx-0.5" />

          <button onClick={onToggleSound} type="button"
            className={`p-2 rounded-lg border transition-all cursor-pointer ${soundEnabled
              ? 'bg-violet-950/40 border-violet-500/28 text-violet-300 hover:text-white hover:border-violet-400/50'
              : 'bg-slate-900/35 border-slate-700/35 text-slate-500 hover:text-slate-300'}`}>
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button onClick={onPrint} type="button" className="btn btn-primary" title="چاپ / PDF">
            <Printer className="w-3.5 h-3.5" /><span>چاپ</span>
          </button>

          <button onClick={onReset} type="button"
            className="p-2 rounded-lg bg-transparent hover:bg-red-950/35 border border-slate-700/28 hover:border-red-500/38 text-slate-500 hover:text-red-400 transition-all cursor-pointer"
            title="پاکسازی این روز">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── برند ── */}
      <div className="app-brand px-1 pt-1 pb-2">
        <div className="text-right">
          <h1 className="text-4xl md:text-5xl font-black font-sans tracking-tight">
            برنامه‌ی روزانه
          </h1>
          <p className="mt-1.5 text-sm md:text-base font-medium text-slate-500">
            هر روز یک قدم جلوتر به سوی اهدافت
          </p>
        </div>

        {/* لوگو */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <div className="text-sm font-black text-slate-300 leading-tight">برنامه‌ریز صعود</div>
            <div className="text-[11px] font-medium text-slate-600">برنامه‌ریزی روزانه</div>
          </div>
          {/* bar chart لوگو */}
          <div className="flex items-end gap-[4px] pb-0.5">
            {([
              { h: 20, opacity: '.6'  },
              { h: 32, opacity: '.85' },
              { h: 26, opacity: '.7'  },
              { h: 38, opacity: '1'   },
              { h: 22, opacity: '.65' },
            ]).map((bar, i) => (
              <div key={i}
                style={{
                  height: `${bar.h}px`,
                  opacity: bar.opacity,
                  background: 'linear-gradient(to top, #7c3aed, #a78bfa)',
                  boxShadow: `0 0 8px rgba(139,92,246,${bar.opacity})`,
                }}
                className="w-[7px] rounded-sm"
              />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
