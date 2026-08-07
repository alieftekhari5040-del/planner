import type { Habit } from '../types/habits';
import type {
  DailyPlannerData,
  GoalItem,
  PriorityItem,
  RoutineItem,
  ScheduleItem
} from '../types/planner';
import { parseDateKey } from './jalali';

export interface PlannerBackup {
  version: string;
  exportedAt: string;
  planner: DailyPlannerData;
  habits: Habit[];
}

export function createPlannerBackup(planner: DailyPlannerData, habits: Habit[]): PlannerBackup {
  return {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    planner,
    habits,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isPriorityItem(value: unknown): value is PriorityItem {
  if (!isRecord(value)) return false;
  return typeof value.id === 'string' && typeof value.text === 'string' && typeof value.completed === 'boolean';
}

function isGoalItem(value: unknown): value is GoalItem {
  return isPriorityItem(value);
}

function isRoutineItem(value: unknown): value is RoutineItem {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    ['book', 'play', 'dumbbell', 'water', 'sleep', 'custom'].includes(value.icon as string) &&
    typeof value.completed === 'boolean' &&
    typeof value.detail === 'string'
  );
}

function isScheduleItem(value: unknown): value is ScheduleItem {
  if (!isRecord(value)) return false;
  return typeof value.id === 'string' && typeof value.task === 'string' && typeof value.completed === 'boolean';
}

function isPlannerData(value: unknown): value is DailyPlannerData {
  if (!isRecord(value)) return false;

  return (
    typeof value.dateKey === 'string' &&
    parseDateKey(value.dateKey) !== null &&
    typeof value.selectedDayOfWeek === 'string' &&
    typeof value.customDateText === 'string' &&
    Array.isArray(value.priorities) && value.priorities.every(isPriorityItem) &&
    Array.isArray(value.goals) && value.goals.every(isGoalItem) &&
    Array.isArray(value.routines) && value.routines.every(isRoutineItem) &&
    Array.isArray(value.schedule) && value.schedule.every(isScheduleItem) &&
    Array.isArray(value.lessons) && value.lessons.every((lesson) => typeof lesson === 'string')
  );
}

function isHabit(value: unknown): value is Habit {
  if (!isRecord(value)) return false;

  return (
    typeof value.id === 'string' &&
    typeof value.name === 'string' &&
    typeof value.category === 'string' &&
    typeof value.icon === 'string' &&
    typeof value.color === 'string' &&
    typeof value.targetType === 'string' &&
    typeof value.targetValue === 'number' &&
    typeof value.unit === 'string' &&
    typeof value.frequency === 'string' &&
    typeof value.createdAt === 'string' &&
    isRecord(value.history) &&
    !Array.isArray(value.history)
  );
}

export function parsePlannerBackup(serializedBackup: string): PlannerBackup {
  let parsed: unknown;
  try {
    parsed = JSON.parse(serializedBackup);
  } catch {
    throw new Error('فایل انتخاب‌شده JSON معتبر نیست.');
  }

  if (!isRecord(parsed) || !isPlannerData(parsed.planner)) {
    throw new Error('ساختار فایل پشتیبان برنامه معتبر نیست.');
  }

  const habits = parsed.habits === undefined ? [] : parsed.habits;
  if (!Array.isArray(habits) || !habits.every(isHabit)) {
    throw new Error('اطلاعات عادت‌ها در فایل پشتیبان معتبر نیست.');
  }

  return {
    version: typeof parsed.version === 'string' ? parsed.version : 'نامشخص',
    exportedAt: typeof parsed.exportedAt === 'string' ? parsed.exportedAt : '',
    planner: parsed.planner,
    habits,
  };
}
