import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Flame, Sparkles } from 'lucide-react';
import { playTimerDoneSound } from '../utils/audio';
import { formatPersianNumber } from '../utils/jalali';

interface PomodoroModalProps {
  isOpen: boolean;
  onClose: () => void;
  soundEnabled: boolean;
}

export const PomodoroModal: React.FC<PomodoroModalProps> = ({
  isOpen,
  onClose,
  soundEnabled,
}) => {
  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  useEffect(() => {
    if (mode === 'focus') setTimeLeft(25 * 60);
    if (mode === 'shortBreak') setTimeLeft(5 * 60);
    if (mode === 'longBreak') setTimeLeft(15 * 60);
    setIsActive(false);
  }, [mode]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      playTimerDoneSound(soundEnabled);
      setIsActive(false);
      if (mode === 'focus') {
        setSessionsCompleted((prev) => prev + 1);
        setMode('shortBreak');
      } else {
        setMode('focus');
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode, soundEnabled]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = formatPersianNumber(
    `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  );

  const totalTime = mode === 'focus' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 15 * 60;
  const progressPercent = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4" role="presentation">
      <div
        className="modal-card relative w-full max-w-md p-6 text-center"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pomodoro-modal-title"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="بستن تایمر"
          className="absolute top-4 left-4 p-2 rounded-xl bg-purple-950/60 hover:bg-purple-900 border border-purple-500/30 text-purple-300 hover:text-white transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center justify-center gap-2 mb-2">
          <Flame className="w-5 h-5 text-rose-500" />
          <h3 id="pomodoro-modal-title" className="text-xl font-bold text-white">تایمر تمرکز پومودورو</h3>
        </div>
        <p className="text-xs text-purple-300/70 mb-6">
          ۲۵ دقیقه کار عمیق و بدون حواس‌پرتی روی مهم‌ترین تسک روز
        </p>

        {/* Mode selector */}
        <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-purple-950/70 border border-purple-500/30 mb-8">
          <button
            type="button"
            onClick={() => setMode('focus')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              mode === 'focus'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-900/50'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            تمرکز عمیق (۲۵ د)
          </button>
          <button
            type="button"
            onClick={() => setMode('shortBreak')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              mode === 'shortBreak'
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-900/50'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            استراحت کوتاه (۵ د)
          </button>
          <button
            type="button"
            onClick={() => setMode('longBreak')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              mode === 'longBreak'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-900/50'
                : 'text-purple-300 hover:text-white'
            }`}
          >
            استراحت بلند (۱۵ د)
          </button>
        </div>

        {/* Circular Visual Timer */}
        <div className="relative w-48 h-48 mx-auto mb-8 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-purple-950"
              strokeWidth="6"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-purple-500 transition-all duration-300"
              strokeWidth="6"
              strokeDasharray={276}
              strokeDashoffset={276 - (276 * progressPercent) / 100}
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-black text-white font-mono tracking-widest drop-shadow-[0_0_15px_rgba(168,85,247,0.7)]">
              {formattedTime}
            </span>
            <span className="text-[11px] text-purple-300/80 mt-1">
              {mode === 'focus' ? '🎯 حالت کار عمیق' : '☕ زمان ریکاوری و نفس عمیق'}
            </span>
          </div>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setIsActive(!isActive)}
            className={`px-8 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg transition cursor-pointer ${
              isActive
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950/60'
                : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white shadow-purple-950/60'
            }`}
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isActive ? 'توقف موقت' : 'شروع تمرکز'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setIsActive(false);
              setTimeLeft(mode === 'focus' ? 25 * 60 : mode === 'shortBreak' ? 5 * 60 : 15 * 60);
            }}
            className="p-3 rounded-2xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/30 text-purple-300 hover:text-white transition cursor-pointer"
            title="ریست تایمر"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Session counter */}
        <div className="mt-6 pt-4 border-t border-purple-500/20 flex items-center justify-center gap-2 text-xs text-purple-300/80">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>پومودوروهای تکمیل‌شده امروز: <strong className="text-white">{formatPersianNumber(sessionsCompleted)}</strong> دور</span>
        </div>
      </div>
    </div>
  );
};
