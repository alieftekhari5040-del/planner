import { useEffect, useState } from 'react';
import type { Habit } from '../types/habits';
import { loadHabits, saveHabits } from '../utils/habitStorage';

/**
 * مدیریت وضعیت عادت‌ها همراه با بارگذاری اولیه و ذخیره‌سازی خودکار
 */
export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>(() => loadHabits());

  useEffect(() => {
    if (habits) {
      saveHabits(habits);
    }
  }, [habits]);

  return {
    habits,
    setHabits,
  };
}

export type HabitsState = ReturnType<typeof useHabits>;
