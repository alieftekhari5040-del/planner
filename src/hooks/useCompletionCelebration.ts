import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { playSuccessSound } from '../utils/audio';

interface CompletionStats {
  total: number;
  completed: number;
  percent: number;
}

/**
 * وقتی درصد تکمیل روزانه به ۱۰۰٪ رسید، یک‌بار افکت تشویقی و صدای موفقیت را اجرا می‌کند
 * جلوگیری از تکرار افکت در هر رندر با نگهداری کلید تاریخ جشن‌گرفته‌شده انجام می‌شود.
 */
export function useCompletionCelebration(
  completionStats: CompletionStats,
  dateKey: string,
  soundEnabled: boolean,
) {
  const celebratedDateRef = useRef<string | null>(null);

  useEffect(() => {
    if (completionStats.percent < 100 || completionStats.total < 4) {
      if (celebratedDateRef.current === dateKey) celebratedDateRef.current = null;
      return;
    }

    if (celebratedDateRef.current === dateKey) return;
    celebratedDateRef.current = dateKey;
    playSuccessSound(soundEnabled);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b'],
      });
    } catch {
      // ignore confetti errors
    }
  }, [completionStats.percent, completionStats.total, dateKey, soundEnabled]);
}
