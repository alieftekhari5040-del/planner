import React, { useRef } from 'react';
import { formatPersianNumber } from '../utils/jalali';
import {
  Printer, RotateCcw, Volume2, VolumeX,
  Calendar, FileJson, CalendarDays, History, Upload,
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
  const C = 2 * Math.PI * 15.9;
  const dash = C - (completionPercentage / 100) * C;

  return (
    <header className="w-full mb-5">
      {/* ── تولبار ── */}
      <div className="no-print app-toolbar mb-5">
        {/* progress */}
        <div className="progress-chip">
          <div className="relative w-9 h-9 shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.9" fill="none" strokeWidth="2.5"
                stroke="rgba(139,92,246,.15)" />
              <circle cx="18" cy="18" r="15.9" fill="none" strokeWidth="2.5"
                strokeLinecap="round"
                stroke={isDone ? '#34d399' : '#8b5cf6'}
                strokeDasharray={C}
                strokeDashoffset={dash}
                className="transition-all duration-700" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[9px] font-black"
              style={{ color: isDone ? '#34d399' : '#a78bfa' }}>
              {formatPersianNumber(pct)}٪
            </span>
          </div>
          <div className="leading-tight">
            <p className="text-xs font-bold text-slate-300">پیشرفت روز</p>
            <p className="text-[11px] mt-0.5" style={{ color: isDone ? '#34d399' : 'var(--c-muted)' }}>
              {isDone ? '🎉 روز کامل!' : `${formatPersianNumber(pct)}٪ انجام شده`}
            </p>
          </div>
        </div>

        {/* دکمه‌ها */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button onClick={onOpenCalendarModal} type="button" className="btn btn-ghost text-xs">
            <CalendarDays className="w-3.5 h-3.5" /> تقویم
          </button>
          <button onClick={onOpenTemplates} type="button" className="btn btn-ghost text-xs">
            <Calendar className="w-3.5 h-3.5 text-amber-400" /> قالب‌ها
          </button>
          <button onClick={onOpenHistory} type="button" className="btn btn-ghost text-xs">
            <History className="w-3.5 h-3.5 text-sky-400" /> تاریخچه
          </button>

          <div className="w-px h-4 bg-white/10 mx-0.5" />

          <button onClick={onExportJSON} type="button" className="btn btn-ghost text-xs">
            <FileJson className="w-3.5 h-3.5 text-emerald-400" /> خروجی
          </button>
          <input ref={importRef} type="file" accept=".json" className="sr-only"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onImportJSON(f); e.target.value = ''; }} />
          <button onClick={() => importRef.current?.click()} type="button" className="btn btn-ghost text-xs">
            <Upload className="w-3.5 h-3.5 text-cyan-400" /> بازیابی
          </button>

          <div className="w-px h-4 bg-white/10 mx-0.5" />

          <button onClick={onToggleSound} type="button" aria-label="صدا"
            className={`p-2 rounded-lg border cursor-pointer transition ${
              soundEnabled
                ? 'border-violet-500/25 text-violet-400 hover:text-white bg-violet-950/30'
                : 'border-white/08 text-slate-600 hover:text-slate-400 bg-transparent'
            }`}>
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
          <button onClick={onPrint} type="button" className="btn btn-primary text-xs">
            <Printer className="w-3.5 h-3.5" /> چاپ
          </button>
          <button onClick={onReset} type="button" className="btn btn-danger text-xs" title="پاکسازی روز">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── برند ── */}
      <div className="app-brand">
        <div>
          <h1>برنامه‌ی روزانه</h1>
          <p className="text-sm text-slate-500 mt-1">هر روز یک قدم جلوتر به سوی اهدافت</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-black text-slate-300">برنامه‌ریز صعود</p>
            <p className="text-xs text-slate-600">برنامه‌ریزی روزانه</p>
          </div>
          <div className="flex items-end gap-[3px]">
            {[16, 24, 20, 30, 18].map((h, i) => (
              <div key={i} className="w-[6px] rounded-sm"
                style={{
                  height: h, opacity: .5 + i * .1,
                  background: 'linear-gradient(to top,#6d28d9,#a78bfa)',
                  boxShadow: '0 0 6px rgba(139,92,246,.4)',
                }} />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
