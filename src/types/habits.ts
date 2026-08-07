export type HabitCategory = 'health' | 'mind' | 'productivity' | 'learning' | 'fitness' | 'lifestyle';

export type HabitTargetType = 'boolean' | 'numeric' | 'timer';

export type HabitFrequency = 'daily' | 'weekdays' | 'weekends' | '3_times_week' | '5_times_week';

export interface HabitLogEntry {
  completed: boolean;
  value?: number;
  notes?: string;
  timestamp?: number;
}

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  icon: string;
  color: string; // Tailwind glow / border color token
  targetType: HabitTargetType;
  targetValue: number; // e.g. 2000 for ml, 30 for minutes, 1 for boolean
  currentValue?: number;
  unit: string; // e.g. 'لیتر', 'دقیقه', 'صفحه', 'بار'
  frequency: HabitFrequency;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'anytime';
  atomicCue?: string; // قانون عادت‌های اتمی: نشانه و تریگر
  atomicReward?: string; // پاداش پس از انجام
  history: Record<string, HabitLogEntry>; // key: YYYY-MM-DD or Jalali key
  createdAt: string;
  isArchived?: boolean;
  freezeDays?: string[]; // روزهای مرخصی / توقف موقت بدون شکستن استریک
}

export interface HabitStats {
  totalCompletions: number;
  currentStreak: number;
  bestStreak: number;
  completionRateMonth: number;
  completionRateAllTime: number;
  strengthScore: number; // 0 - 100%
}
