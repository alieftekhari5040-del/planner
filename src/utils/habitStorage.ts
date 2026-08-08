import type { Habit, HabitStats } from '../types/habits';
import { getDateKey, getJalaliDateForOffset, getTodayJalali, parseDateKey } from './jalali';

const HABITS_STORAGE_KEY = 'ascent_pro_habits_data_v1';

function isStoredHabit(value: unknown): value is Habit {
  if (typeof value !== 'object' || value === null) return false;
  const habit = value as Partial<Habit>;
  return (
    typeof habit.id === 'string' &&
    typeof habit.name === 'string' &&
    typeof habit.category === 'string' &&
    typeof habit.icon === 'string' &&
    typeof habit.color === 'string' &&
    typeof habit.targetType === 'string' &&
    typeof habit.targetValue === 'number' &&
    typeof habit.unit === 'string' &&
    typeof habit.frequency === 'string' &&
    typeof habit.createdAt === 'string' &&
    typeof habit.history === 'object' &&
    habit.history !== null &&
    !Array.isArray(habit.history)
  );
}

export function getDefaultHabits(): Habit[] {
  // شروع با لیست خالی — کاربر خودش عادت‌ها را اضافه می‌کند
  return [];
}

export function loadHabits(): Habit[] {
  try {
    const raw = localStorage.getItem(HABITS_STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const validHabits = parsed.filter(isStoredHabit);
        if (validHabits.length > 0 || parsed.length === 0) return validHabits;
      }
    }
  } catch (e) {
    console.error('خطا در بارگذاری عادت‌ها', e);
  }
  const defaultList = getDefaultHabits();
  saveHabits(defaultList);
  return defaultList;
}

export function saveHabits(habits: Habit[]): void {
  try {
    localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
  } catch (e) {
    console.error('خطا در ذخیره‌سازی عادت‌ها', e);
  }
}

// Calculate streaks, completion rates, and strength metrics.
export function calculateHabitStats(habit: Habit, referenceDateKey?: string): HabitStats {
  const history = habit.history || {};
  const parsedReference = referenceDateKey ? parseDateKey(referenceDateKey) : null;
  const reference = parsedReference ?? getTodayJalali();
  let totalCompletions = 0;

  Object.values(history).forEach((entry) => {
    if (entry.completed) totalCompletions++;
  });

  const getEntryForOffset = (offset: number) => {
    const target = getJalaliDateForOffset(reference.jy, reference.jm, reference.jd, -offset);
    const key = getDateKey(target.jy, target.jm, target.jd);
    return {
      key,
      completed: history[key]?.completed === true,
      frozen: habit.freezeDays?.includes(key) === true,
    };
  };

  // A missing entry for the reference day does not break yesterday's streak.
  let currentStreak = 0;
  for (let offset = 0; offset < 90; offset++) {
    const entry = getEntryForOffset(offset);
    if (entry.completed) {
      currentStreak++;
    } else if (entry.frozen) {
      continue;
    } else if (offset === 0) {
      continue;
    } else {
      break;
    }
  }

  // Best streak is calculated over the same 90-day reporting window.
  let bestStreak = 0;
  let runningStreak = 0;
  for (let offset = 0; offset < 90; offset++) {
    const entry = getEntryForOffset(offset);
    if (entry.completed) {
      runningStreak++;
    } else if (!entry.frozen) {
      bestStreak = Math.max(bestStreak, runningStreak);
      runningStreak = 0;
    }
  }
  bestStreak = Math.max(bestStreak, runningStreak, currentStreak);

  // Monthly completion rate (the 30 days ending on the reference date).
  let monthChecked = 0;
  for (let offset = 0; offset < 30; offset++) {
    if (getEntryForOffset(offset).completed) monthChecked++;
  }

  const completionRateMonth = Math.round((monthChecked / 30) * 100);
  const completionRateAllTime = totalCompletions > 0 ? Math.min(100, Math.round((totalCompletions / 45) * 100)) : 0;
  const strengthScore = Math.min(100, Math.round(completionRateMonth * 0.7 + Math.min(currentStreak, 30)));

  return {
    totalCompletions,
    currentStreak,
    bestStreak,
    completionRateMonth,
    completionRateAllTime,
    strengthScore,
  };
}
