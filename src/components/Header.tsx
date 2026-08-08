import React, { useRef } from 'react';
import { formatPersianNumber } from '../utils/jalali';
import {
  Printer,
  RotateCcw,
  Volume2,
  VolumeX,
  Calendar,
  FileJson,
  CalendarDays,
  History,
  Upload,
  TrendingUp
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
  onPrint,
  onReset,
  onOpenHistory,
  onOpenCalendarModal,
  onOpenTemplates,
  onExportJSON,
  onImportJSON,
  soundEnabled,
  onToggleSound,
  completionPercentage,
}) => {
  const importInputRef = useRef<HTMLInputElement>(null);

  const handleImportChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onImportJSON(file);
    event.target.value = '';
  };

  return (
    <header className="w-full mb-6">
      {/* Toolbar */}
      <div className="no-print app-toolbar flex flex-wrap items-center justify-between gap-3 p-3 mb-5">
        {/* Left side: progress chip */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="progress-chip flex items-center gap-3 px-3 py-1.5 rounded-xl">
            {/* Circular progress */}
            <div className="relative w-9 h-9 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-purple-950"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-violet-400 transition-all duration-700 ease-out"
                  strokeDasharray={`${completionPercentage}, 100`}
                  strokeWidth="3"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[9px] font-black text-violet-200 leading-none">
                {formatPersianNumber(Math.round(completionPercentage))}٪
              </span>
            </div>
            <div className="text-right leading-tight">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3 text-violet-400" />
                <span className="text-xs font-bold text-slate-200">پیشرفت روزانه</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {completionPercentage === 100
                  ? '🎉 روز کامل شد!'
                  : `${formatPersianNumber(Math.round(completionPercentage))}٪ انجام شده`}
              </div>
            </div>
          </div>
        </div>

        {/* Right side: action buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenCalendarModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-violet-900/35 hover:bg-violet-800/55 border border-violet-500/25 hover:border-violet-400/45 text-violet-200 hover:text-white text-xs font-medium transition-all cursor-pointer"
            title="تقویم ماهانه"
          >
            <CalendarDays className="w-3.5 h-3.5 text-violet-300" />
            <span>تقویم</span>
          </button>

          <button
            type="button"
            onClick={onOpenTemplates}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-violet-900/25 hover:bg-violet-800/45 border border-violet-500/20 hover:border-violet-400/40 text-violet-200 hover:text-white text-xs font-medium transition-all cursor-pointer"
            title="قالب‌های آماده"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>قالب‌ها</span>
          </button>

          <button
            type="button"
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-violet-900/25 hover:bg-violet-800/45 border border-violet-500/20 hover:border-violet-400/40 text-violet-200 hover:text-white text-xs font-medium transition-all cursor-pointer"
            title="تاریخچه روزها"
          >
            <History className="w-3.5 h-3.5 text-sky-400" />
            <span>تاریخچه</span>
          </button>

          <div className="w-px h-5 bg-slate-700/60 mx-0.5" />

          <button
            type="button"
            onClick={onExportJSON}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-violet-900/25 hover:bg-violet-800/45 border border-violet-500/20 hover:border-violet-400/40 text-violet-200 hover:text-white text-xs font-medium transition-all cursor-pointer"
            title="خروجی پشتیبان JSON"
          >
            <FileJson className="w-3.5 h-3.5 text-emerald-400" />
            <span>خروجی</span>
          </button>

          <input
            ref={importInputRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            onChange={handleImportChange}
            aria-label="انتخاب فایل پشتیبان JSON"
          />
          <button
            type="button"
            onClick={() => importInputRef.current?.click()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-violet-900/25 hover:bg-violet-800/45 border border-violet-500/20 hover:border-violet-400/40 text-violet-200 hover:text-white text-xs font-medium transition-all cursor-pointer"
            title="بازیابی پشتیبان JSON"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-400" />
            <span>بازیابی</span>
          </button>

          <div className="w-px h-5 bg-slate-700/60 mx-0.5" />

          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'خاموش کردن صدا' : 'روشن کردن صدا'}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
              soundEnabled
                ? 'bg-violet-900/35 border-violet-500/35 text-violet-300 hover:text-white'
                : 'bg-slate-900/40 border-slate-700/40 text-slate-500 hover:text-slate-300'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={onPrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 border border-violet-400/30 text-white text-xs font-semibold shadow-lg shadow-violet-950/50 hover:shadow-violet-800/40 transition-all cursor-pointer"
            title="چاپ یا ذخیره PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>چاپ</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            aria-label="پاکسازی این روز"
            className="p-1.5 rounded-lg bg-slate-900/30 hover:bg-red-950/40 border border-slate-700/30 hover:border-red-500/40 text-slate-400 hover:text-red-400 transition-all cursor-pointer"
            title="پاکسازی اطلاعات این روز"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Brand / Title */}
      <div className="app-brand px-1 pt-1 pb-3">
        <div className="text-right">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight font-sans">
            برنامه‌ی روزانه
          </h1>
          <p className="mt-1.5 text-sm md:text-base font-medium text-slate-400 tracking-wide">
            هر روز یک قدم جلوتر به سوی اهدافت
          </p>
        </div>

        {/* Logo mark */}
        <div className="flex items-center gap-3 text-right">
          <div className="hidden sm:block">
            <div className="text-sm font-black text-slate-200">برنامه‌ریز صعود</div>
            <div className="text-[11px] font-medium text-slate-500">برنامه‌ریزی روزانه</div>
          </div>
          <div className="flex items-end gap-1 pb-0.5">
            <div className="w-2 h-6 rounded-full bg-gradient-to-b from-slate-200 via-violet-300 to-violet-600 shadow-[0_0_10px_rgba(139,92,246,0.6)]" />
            <div className="w-2 h-9 rounded-full bg-gradient-to-b from-slate-200 via-violet-300 to-violet-600 shadow-[0_0_10px_rgba(139,92,246,0.6)]" />
            <div className="w-2 h-6 rounded-full bg-gradient-to-b from-slate-200 via-violet-300 to-violet-600 shadow-[0_0_10px_rgba(139,92,246,0.6)]" />
          </div>
        </div>
      </div>
    </header>
  );
};
