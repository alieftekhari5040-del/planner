import { describe, expect, it } from 'vitest';
import { calculateHabitStats, getDefaultHabits } from '../../src/utils/habitStorage';

describe('آمار و پیوستگی عادت‌ها', () => {
  it('برای یک تاریخ مرجع مشخص، پیوستگی روزهای قبل را درست حساب می‌کند', () => {
    const habit = {
      ...getDefaultHabits()[0],
      history: {
        '1405-05-16': { completed: true },
        '1405-05-15': { completed: true },
      },
    };

    const stats = calculateHabitStats(habit, '1405-05-17');

    expect(stats.currentStreak).toBe(2);
    expect(stats.bestStreak).toBe(2);
    expect(stats.totalCompletions).toBe(2);
  });

  it('روز مرخصی را بدون افزایش عدد، حافظ پیوستگی می‌کند', () => {
    const habit = {
      ...getDefaultHabits()[0],
      history: {
        '1405-05-16': { completed: true },
        '1405-05-14': { completed: true },
      },
      freezeDays: ['1405-05-15'],
    };

    const stats = calculateHabitStats(habit, '1405-05-16');

    expect(stats.currentStreak).toBe(2);
    expect(stats.bestStreak).toBe(2);
  });
});
