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
  const today = getTodayJalali();
  const todayKey = getDateKey(today.jy, today.jm, today.jd);

  // Generate realistic history for a first launch without assuming every month has 30 days.
  const generateMockHistory = (completionProbability: number) => {
    const history: Record<string, { completed: boolean; value?: number }> = {};
    for (let i = 28; i >= 0; i--) {
      const target = getJalaliDateForOffset(today.jy, today.jm, today.jd, -i);
      const key = getDateKey(target.jy, target.jm, target.jd);
      // Keep starter data deterministic so the first screen is reproducible and testable.
      const score = (i * 47 + Math.round(completionProbability * 100)) % 100;
      if (score < completionProbability * 100) {
        history[key] = { completed: true, value: 1 };
      }
    }
    return history;
  };

  return [
    {
      id: 'h-water',
      name: 'نوشیدن ۲ لیتر آب روزانه',
      category: 'health',
      icon: '💧',
      color: '#38bdf8', // Neon Sky Blue
      targetType: 'numeric',
      targetValue: 2000,
      unit: 'میلی‌لیتر',
      frequency: 'daily',
      timeOfDay: 'anytime',
      atomicCue: 'بلافاصله بعد از بیدار شدن و قبل از هر وعده غذایی یک لیوان بزرگ آب می‌نوشم.',
      atomicReward: 'احساس شادابی پوست و افزایش تمرکز مغز',
      createdAt: todayKey,
      history: generateMockHistory(0.85),
    },
    {
      id: 'h-reading',
      name: 'مطالعه کتاب تخصصی و رشد فردی',
      category: 'learning',
      icon: '📚',
      color: '#a855f7', // Neon Purple
      targetType: 'timer',
      targetValue: 30,
      unit: 'دقیقه',
      frequency: 'daily',
      timeOfDay: 'evening',
      atomicCue: 'ساعت ۲۱:۰۰ بعد از شام، کتاب را روی میز کنار تخت باز می‌کنم.',
      atomicReward: 'افزایش دانش و آرامش قبل از خواب عمیق',
      createdAt: todayKey,
      history: generateMockHistory(0.75),
    },
    {
      id: 'h-workout',
      name: 'ورزش، باشگاه یا پیاده‌روی سریع',
      category: 'fitness',
      icon: '🏋️‍♂️',
      color: '#f43f5e', // Neon Rose
      targetType: 'timer',
      targetValue: 45,
      unit: 'دقیقه',
      frequency: 'daily',
      timeOfDay: 'afternoon',
      atomicCue: 'ساعت ۱۷:۳۰ لباس ورزشی را می‌پوشم و کفش‌ها را جفت می‌کنم.',
      atomicReward: 'تخلیه استرس کاری و ساخت فیزیک بدنی متناسب',
      createdAt: todayKey,
      history: generateMockHistory(0.7),
    },
    {
      id: 'h-deepwork',
      name: 'بلاک کار عمیق و برنامه‌نویسی',
      category: 'productivity',
      icon: '⚡',
      color: '#fbbf24', // Neon Amber
      targetType: 'numeric',
      targetValue: 4,
      unit: 'بلاک ۹۰ دقیقه‌ای',
      frequency: 'weekdays',
      timeOfDay: 'morning',
      atomicCue: 'بستن تمام تب‌های شبکه‌های اجتماعی و روشن کردن حالت فوکوس پومودورو.',
      atomicReward: 'پیشرفت چشمگیر در تسک‌های پیچیده فنی',
      createdAt: todayKey,
      history: generateMockHistory(0.8),
    },
    {
      id: 'h-meditation',
      name: 'مدیتیشن و تنفس عمیق آگاهانه',
      category: 'mind',
      icon: '🧘',
      color: '#34d399', // Neon Emerald
      targetType: 'timer',
      targetValue: 10,
      unit: 'دقیقه',
      frequency: 'daily',
      timeOfDay: 'morning',
      atomicCue: 'صبح‌ها بعد از مرتب کردن تخت، ۵ دقیقه در سکوت چشم‌ها را می‌بندم.',
      atomicReward: 'کاهش اضطراب روزمره و تسلط بر احساسات',
      createdAt: todayKey,
      history: generateMockHistory(0.6),
    },
    {
      id: 'h-sleep',
      name: 'خاموشی صفحات نمایش و خواب قبل ۲۳:۳۰',
      category: 'lifestyle',
      icon: '🌙',
      color: '#818cf8', // Neon Indigo
      targetType: 'boolean',
      targetValue: 1,
      unit: 'بار',
      frequency: 'daily',
      timeOfDay: 'evening',
      atomicCue: 'ساعت ۲۳:۰۰ گوشی را در حالت خواب در خارج از اتاق خواب قرار می‌دهم.',
      atomicReward: 'بیدار شدن با نشاط بالا در ساعت ۶:۰۰ صبح',
      createdAt: todayKey,
      history: generateMockHistory(0.7),
    }
  ];
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
