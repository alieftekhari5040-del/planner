import React, { useRef } from 'react';
import { formatPersianNumber } from '../../utils/jalali';
import {
  Printer,
  RotateCcw,
  Volume2,
  VolumeX,
  Calendar,
  FileJson,
  CalendarDays,
  Upload
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

const HeaderComponent: React.FC<HeaderProps> = ({
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
      {/* Interactive Controls Bar (Top Toolbar) */}
      <div className="no-print app-toolbar flex flex-wrap items-center justify-between gap-3 p-3.5 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Info & Completion Progress */}
          <div className="progress-chip flex items-center gap-3 px-3 py-1.5 rounded-xl">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-purple-950"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-purple-400 transition-all duration-500"
                  strokeDasharray={`${completionPercentage}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <span className="absolute text-[10px] font-bold text-purple-200">
                {formatPersianNumber(Math.round(completionPercentage))}٪
              </span>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold text-purple-200">پیشرفت روزانه</div>
              <div className="text-[11px] text-purple-400/80">
                {completionPercentage === 100
                  ? '🎉 تکمیل کامل روز!'
                  : `${formatPersianNumber(Math.round(completionPercentage))} درصد انجام شده`}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">

          {/* Month Calendar Drawer & Day Navigator */}
          <button
            type="button"
            onClick={onOpenCalendarModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-900/40 hover:bg-purple-800/60 border border-purple-500/30 text-purple-200 text-xs font-medium transition cursor-pointer"
            title="تقویم ماهانه و جابجایی بین روزها"
          >
            <CalendarDays className="w-3.5 h-3.5 text-purple-300" />
            <span>تقویم ماهانه</span>
          </button>

          {/* Templates */}
          <button
            type="button"
            onClick={onOpenTemplates}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-900/30 hover:bg-purple-800/50 border border-purple-500/20 text-purple-200 text-xs font-medium transition cursor-pointer"
            title="قالب‌های آماده روزانه"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>قالب‌ها</span>
          </button>

          {/* History */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-900/30 hover:bg-purple-800/50 border border-purple-500/20 text-purple-200 text-xs font-medium transition cursor-pointer"
            title="تاریخچه روزهای ثبت شده"
          >
            <span>تاریخچه</span>
          </button>

          {/* Backup JSON */}
          <button
            type="button"
            onClick={onExportJSON}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-900/30 hover:bg-purple-800/50 border border-purple-500/20 text-purple-200 text-xs font-medium transition cursor-pointer"
            title="دانلود بک‌آپ JSON"
          >
            <FileJson className="w-3.5 h-3.5 text-purple-300" />
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
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-900/30 hover:bg-purple-800/50 border border-purple-500/20 text-purple-200 text-xs font-medium transition cursor-pointer"
            title="بازیابی پشتیبان JSON"
          >
            <Upload className="w-3.5 h-3.5 text-cyan-300" />
            <span>بازیابی</span>
          </button>

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'خاموش کردن صدا' : 'روشن کردن صدا'}
            className={`p-1.5 rounded-lg border transition cursor-pointer ${
              soundEnabled
                ? 'bg-purple-900/40 border-purple-500/40 text-purple-300'
                : 'bg-zinc-900/50 border-zinc-700/50 text-zinc-500'
            }`}
            title={soundEnabled ? 'صدا روشن است' : 'صدا خاموش است'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Print / PDF */}
          <button
            type="button"
            onClick={onPrint}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600/80 hover:bg-purple-500 border border-purple-400/40 text-white text-xs font-semibold shadow-md shadow-purple-950/50 transition cursor-pointer"
            title="چاپ یا ذخیره PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>چاپ / PDF</span>
          </button>

          {/* Reset */}
          <button
            type="button"
            onClick={onReset}
            aria-label="پاکسازی اطلاعات این روز"
            className="p-1.5 rounded-lg bg-purple-900/20 hover:bg-red-950/40 border border-purple-500/20 hover:border-red-500/40 text-purple-300 hover:text-red-300 text-xs transition cursor-pointer"
            title="پاکسازی اطلاعات این روز"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Poster Header (Faithful 1:1 reproduction of the image header) */}
      <div className="app-brand flex items-start justify-between px-2 pt-2 pb-3">
        {/* Right side in Persian (Left side visually in RTL): Title & Subtitle */}
        <div className="text-right">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white drop-shadow-[0_0_20px_rgba(168,85,247,0.75)] font-sans">
            برنامه‌ی روزانه
          </h1>
          <p className="mt-1.5 text-sm md:text-base font-normal text-purple-300/80 tracking-wide">
            هر روز یک قدم جلوتر
          </p>
        </div>

        {/* نشان فارسی برنامه */}
        <div className="flex items-center gap-3.5 text-right">
          <div>
            <div className="text-xs md:text-sm font-black text-white/90">
              برنامه‌ریز صعود
            </div>
            <div className="text-[10px] md:text-xs font-bold text-purple-300/80">
              برنامه‌ریزی روزانه
            </div>
          </div>
          {/* Pill / Capsule 3-bar icon matching the top right logo */}
          <div className="flex items-center gap-1.5 pl-1">
            <div className="w-2.5 h-9 rounded-full bg-gradient-to-b from-white via-purple-200 to-purple-400 shadow-[0_0_12px_rgba(255,255,255,0.7)]" />
            <div className="w-2.5 h-9 rounded-full bg-gradient-to-b from-white via-purple-200 to-purple-400 shadow-[0_0_12px_rgba(255,255,255,0.7)]" />
            <div className="w-2.5 h-9 rounded-full bg-gradient-to-b from-white via-purple-200 to-purple-400 shadow-[0_0_12px_rgba(255,255,255,0.7)]" />
          </div>
        </div>
      </div>
    </header>
  );
};

export const Header = React.memo(HeaderComponent);
Header.displayName = 'Header';
