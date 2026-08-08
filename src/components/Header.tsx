import React, { useRef } from 'react';
import { formatPersianNumber } from '../utils/jalali';
import {
  Printer, RotateCcw, Volume2, VolumeX,
  Calendar, FileJson, CalendarDays, History, Upload, TrendingUp
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
  const importInputRef = useRef<HTMLInputElement>(null);
  const handleImportChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) onImportJSON(f);
    e.target.value = '';
  };

  const pct = Math.round(completionPercentage);
  const isDone = pct === 100;

  return (
    <header className="w-full mb-5">
      {/* ── تولبار ── */}
      <div className="no-print app-toolbar flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 mb-5">

        {/* سمت راست: progress */}
        <div className="progress-chip flex items-center gap-3 px-3 py-1.5">
          {/* دایره پیشرفت */}
          <div className="relative w-9 h-9 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(109,40,217,.22)" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15.9" fill="none"
                stroke={isDone ? '#34d399' : '#a78bfa'}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${completionPercentage} 100`}
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-violet-200 leading-none">
              {formatPersianNumber(pct)}٪
            </span>
          </div>
          <div className="text-right leading-tight">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-violet-400" />
              <span className="text-xs font-bold text-slate-200">پیشرفت روز</span>
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: isDone ? '#34d399' : '#94a3b8' }}>
              {isDone ? '🎉 روز کامل شد!' : `${formatPersianNumber(pct)}٪ انجام شده`}
            </div>
          </div>
        </div>

        {/* سمت چپ: دکمه‌ها */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button onClick={onOpenCalendarModal} type="button"
            className="btn btn-ghost" title="تقویم ماهانه">
            <CalendarDays className="w-3.5 h-3.5 text-violet-300" /><span>تقویم</span>
          </button>
          <button onClick={onOpenTemplates} type="button"
            className="btn btn-ghost" title="قالب‌های آماده">
            <Calendar className="w-3.5 h-3.5 text-amber-400" /><span>قالب‌ها</span>
          </button>
          <button onClick={onOpenHistory} type="button"
            className="btn btn-ghost" title="تاریخچه روزها">
            <History className="w-3.5 h-3.5 text-sky-400" /><span>تاریخچه</span>
          </button>

          <div className="w-px h-5 bg-slate-700/60 mx-0.5" />

          <button onClick={onExportJSON} type="button"
            className="btn btn-ghost" title="خروجی JSON">
            <FileJson className="w-3.5 h-3.5 text-emerald-400" /><span>خروجی</span>
          </button>
          <input ref={importInputRef} type="file" accept="application/json,.json"
            className="sr-only" onChange={handleImportChange} aria-label="انتخاب فایل پشتیبان" />
          <button onClick={() => importInputRef.current?.click()} type="button"
            className="btn btn-ghost" title="بازیابی JSON">
            <Upload className="w-3.5 h-3.5 text-cyan-400" /><span>بازیابی</span>
          </button>

          <div className="w-px h-5 bg-slate-700/60 mx-0.5" />

          <button onClick={onToggleSound} type="button"
            aria-label={soundEnabled ? 'خاموش کردن صدا' : 'روشن کردن صدا'}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${soundEnabled
              ? 'bg-violet-900/30 border-violet-500/30 text-violet-300 hover:text-white'
              : 'bg-slate-900/40 border-slate-700/40 text-slate-500 hover:text-slate-300'}`}>
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button onClick={onPrint} type="button"
            className="btn btn-primary" title="چاپ / PDF">
            <Printer className="w-3.5 h-3.5" /><span>چاپ</span>
          </button>
          <button onClick={onReset} type="button"
            aria-label="پاکسازی این روز"
            className="p-1.5 rounded-lg bg-slate-900/30 hover:bg-red-950/40 border border-slate-700/30 hover:border-red-500/40 text-slate-400 hover:text-red-400 transition-all cursor-pointer">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── برند / عنوان ── */}
      <div className="app-brand px-1 pt-1 pb-2">
        <div className="text-right">
          <h1 className="text-4xl md:text-5xl font-black font-sans">برنامه‌ی روزانه</h1>
          <p className="mt-1.5 text-sm md:text-base font-medium text-slate-400">
            هر روز یک قدم جلوتر به سوی اهدافت
          </p>
        </div>
        {/* لوگو */}
        <div className="flex items-center gap-3 text-right">
          <div className="hidden sm:block">
            <div className="text-sm font-black text-slate-200">برنامه‌ریز صعود</div>
            <div className="text-[11px] font-medium text-slate-500">برنامه‌ریزی روزانه</div>
          </div>
          <div className="flex items-end gap-[5px] pb-0.5">
            {[6, 9, 6].map((h, i) => (
              <div key={i}
                style={{ height: `${h * 4}px`, boxShadow: '0 0 10px rgba(139,92,246,.55)' }}
                className="w-[9px] rounded-full bg-gradient-to-b from-slate-200 via-violet-400 to-violet-700"
              />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
