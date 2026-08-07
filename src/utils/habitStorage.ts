import type { Habit, HabitStats } from '../types/habits';
import { getDateKey, getJalaliDateForOffset, getTodayJalali, parseDateKey } from './jalali';
import { z } from 'zod';

const HABITS_STORAGE_KEY = 'ascent_pro_habits_data_v3';
const LEGACY_HABITS_KEY = 'ascent_pro_habits_data_v1';
const LEGACY_HABITS_KEY_V2 = 'ascent_pro_habits_data_v2';

// SECURITY: Fixed B01 — جایگزینی isStoredHabit دستی با zod برای ولیدیشن عمیق history
// قبلاً history: {completed:"yes"} از فیلتر عبور می‌کرد، اکنون با Zod رد می‌شود
const HabitLogEntrySchema = z.object({
  completed: z.boolean(),
  value: z.number().optional(),
  notes: z.string().max(500).optional(),
  timestamp: z.number().optional(),
});

const HabitSchema = z.object({
  id: z.string().min(1).max(100),
  name: z.string().min(1).max(100),
  category: z.enum(['health', 'mind', 'productivity', 'learning', 'fitness', 'lifestyle']),
  icon: z.string().min(1).max(10),
  color: z.string().min(4).max(20),
  targetType: z.enum(['boolean', 'numeric', 'timer']),
  targetValue: z.number().min(0).max(100000),
  unit: z.string().min(1).max(20),
  frequency: z.enum(['daily', 'weekdays', 'weekends', '3_times_week', '5_times_week']),
  timeOfDay: z.enum(['morning', 'afternoon', 'evening', 'anytime']).optional(),
  atomicCue: z.string().max(500).optional(),
  atomicReward: z.string().max(500).optional(),
  history: z.record(z.string().regex(/^\d{3,4}-\d{2}-\d{2}$/), HabitLogEntrySchema),
  createdAt: z.string().regex(/^\d{3,4}-\d{2}-\d{2}$/),
  isArchived: z.boolean().optional(),
  freezeDays: z.array(z.string().regex(/^\d{3,4}-\d{2}-\d{2}$/)).optional(),
  currentValue: z.number().optional(),
});

function isStoredHabit(value: unknown): value is Habit {
  return HabitSchema.safeParse(value).success;
}

// تمام نمونه‌های نمایشی پاک شد — تاریخچه اکنون واقعی و خالی است
// ماتریس دیگر با روزهای واقعی همگام است: هر سلول = یک کلید جلالی واقعی (YYYY-MM-DD) در localStorage
export function getDefaultHabits(): Habit[] {
  const today = getTodayJalali();
  const todayKey = getDateKey(today.jy, today.jm, today.jd);

  return [
    {
      id: 'h-water',
      name: 'نوشیدن ۲ لیتر آب روزانه',
      category: 'health',
      icon: '💧',
      color: '#38bdf8',
      targetType: 'numeric',
      targetValue: 2000,
      unit: 'میلی‌لیتر',
      frequency: 'daily',
      timeOfDay: 'anytime',
      atomicCue: 'بلافاصله بعد از بیدار شدن و قبل از هر وعده غذایی یک لیوان بزرگ آب می‌نوشم.',
      atomicReward: 'احساس شادابی پوست و افزایش تمرکز مغز',
      createdAt: todayKey,
      history: {}, // واقعی: خالی تا کاربر تیک بزند
    },
    {
      id: 'h-reading',
      name: 'مطالعه کتاب تخصصی و رشد فردی',
      category: 'learning',
      icon: '📚',
      color: '#a855f7',
      targetType: 'timer',
      targetValue: 30,
      unit: 'دقیقه',
      frequency: 'daily',
      timeOfDay: 'evening',
      atomicCue: 'ساعت ۲۱:۰۰ بعد از شام، کتاب را روی میز کنار تخت باز می‌کنم.',
      atomicReward: 'افزایش دانش و آرامش قبل از خواب عمیق',
      createdAt: todayKey,
      history: {},
    },
    {
      id: 'h-workout',
      name: 'ورزش، باشگاه یا پیاده‌روی سریع',
      category: 'fitness',
      icon: '🏋️‍♂️',
      color: '#f43f5e',
      targetType: 'timer',
      targetValue: 45,
      unit: 'دقیقه',
      frequency: 'daily',
      timeOfDay: 'afternoon',
      atomicCue: 'ساعت ۱۷:۳۰ لباس ورزشی را می‌پوشم و کفش‌ها را جفت می‌کنم.',
      atomicReward: 'تخلیه استرس کاری و ساخت فیزیک بدنی متناسب',
      createdAt: todayKey,
      history: {},
    },
    {
      id: 'h-deepwork',
      name: 'بلاک کار عمیق و برنامه‌نویسی',
      category: 'productivity',
      icon: '⚡',
      color: '#fbbf24',
      targetType: 'numeric',
      targetValue: 4,
      unit: 'بلاک ۹۰ دقیقه‌ای',
      frequency: 'weekdays',
      timeOfDay: 'morning',
      atomicCue: 'بستن تمام تب‌های شبکه‌های اجتماعی و روشن کردن حالت فوکوس پومودورو.',
      atomicReward: 'پیشرفت چشمگیر در تسک‌های پیچیده فنی',
      createdAt: todayKey,
      history: {},
    },
    {
      id: 'h-meditation',
      name: 'مدیتیشن و تنفس عمیق آگاهانه',
      category: 'mind',
      icon: '🧘',
      color: '#34d399',
      targetType: 'timer',
      targetValue: 10,
      unit: 'دقیقه',
      frequency: 'daily',
      timeOfDay: 'morning',
      atomicCue: 'صبح‌ها بعد از مرتب کردن تخت، ۵ دقیقه در سکوت چشم‌ها را می‌بندم.',
      atomicReward: 'کاهش اضطراب روزمره و تسلط بر احساسات',
      createdAt: todayKey,
      history: {},
    },
    {
      id: 'h-sleep',
      name: 'خاموشی صفحات نمایش و خواب قبل ۲۳:۳۰',
      category: 'lifestyle',
      icon: '🌙',
      color: '#818cf8',
      targetType: 'boolean',
      targetValue: 1,
      unit: 'بار',
      frequency: 'daily',
      timeOfDay: 'evening',
      atomicCue: 'ساعت ۲۳:۰۰ گوشی را در حالت خواب در خارج از اتاق خواب قرار می‌دهم.',
      atomicReward: 'بیدار شدن با نشاط بالا در ساعت ۶:۰۰ صبح',
      createdAt: todayKey,
      history: {},
    }
  ];
}

export function loadHabits(): Habit[] {
  try {
    // پاکسازی کامل نمونه‌های قبلی تا سایت بدون تیک و واقعی شروع شود (v1 و v2 هر دو نمایشی بودند)
    for (const k of [LEGACY_HABITS_KEY, LEGACY_HABITS_KEY_V2]) {
      if (localStorage.getItem(k)) {
        try {
          localStorage.removeItem(k);
        } catch {}
      }
    }

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
