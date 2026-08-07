import type {
  DailyPlannerData,
  GoalItem,
  PriorityItem,
  RoutineItem,
  ScheduleItem
} from '../types/planner';
import { getTodayJalali, getDateKey, formatPersianDateString } from './jalali';

export function createDefaultDayData(jy: number, jm: number, jd: number, dayName: string): DailyPlannerData {
  const dateKey = getDateKey(jy, jm, jd);
  const formattedDate = formatPersianDateString(jy, jm, jd);

  return {
    dateKey,
    selectedDayOfWeek: dayName,
    customDateText: formattedDate,
    daySubtitle: 'هر روز یک قدم جلوتر',
    mainFocus: '',
    quickNotes: '',
    waterGlasses: 0,
    priorities: [
      { id: 'p-1', text: '', completed: false },
      { id: 'p-2', text: '', completed: false },
      { id: 'p-3', text: '', completed: false },
      { id: 'p-4', text: '', completed: false },
      { id: 'p-5', text: '', completed: false },
    ],
    goals: [
      { id: 'g-1', text: '', completed: false },
      { id: 'g-2', text: '', completed: false },
      { id: 'g-3', text: '', completed: false },
      { id: 'g-4', text: '', completed: false },
    ],
    routines: [
      {
        id: 'r-reading',
        title: 'مطالعه',
        icon: 'book',
        completed: false,
        detail: '۲۰ تا ۳۰ صفحه کتاب تخصصی یا رشد فردی'
      },
      {
        id: 'r-growth',
        title: 'تسک رشد فردی',
        icon: 'play',
        completed: false,
        detail: 'مشاهده دوره آموزشی / پادکست عمیق'
      },
      {
        id: 'r-workout',
        title: 'تمرین / بدنسازی',
        icon: 'dumbbell',
        completed: false,
        detail: 'تمرینات قدرتی و کششی روزانه'
      }
    ],
    // 14 clean lined rows matching the image without hardcoded hours
    schedule: Array.from({ length: 14 }, (_, idx) => ({
      id: `s-${idx + 1}`,
      task: '',
      completed: false
    })),
    lessons: ['', '', '', ''],
  };
}

const STORAGE_PREFIX = 'ascent_planner_';
const HISTORY_STORAGE_KEY = 'ascent_planner_history_keys';

function readHistoryKeys(): string[] {
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) && parsed.every((key): key is string => typeof key === 'string')
      ? parsed
      : [];
  } catch {
    return [];
  }
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

export function loadPlannerData(dateKey: string, fallback?: DailyPlannerData): DailyPlannerData {
  try {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}${dateKey}`);
    if (saved) {
      const parsed = JSON.parse(saved) as Partial<DailyPlannerData>;
      const parts = dateKey.split('-');
      const defaultData = createDefaultDayData(
        parseInt(parts[0], 10) || 1405,
        parseInt(parts[1], 10) || 5,
        parseInt(parts[2], 10) || 17,
        parsed.selectedDayOfWeek || 'شنبه'
      );
      return {
        ...defaultData,
        ...parsed,
        dateKey,
        selectedDayOfWeek: typeof parsed.selectedDayOfWeek === 'string'
          ? parsed.selectedDayOfWeek
          : defaultData.selectedDayOfWeek,
        customDateText: typeof parsed.customDateText === 'string'
          ? parsed.customDateText
          : defaultData.customDateText,
        priorities: Array.isArray(parsed.priorities)
          ? parsed.priorities.filter(isPriorityItem)
          : defaultData.priorities,
        goals: Array.isArray(parsed.goals)
          ? parsed.goals.filter(isGoalItem)
          : defaultData.goals,
        routines: Array.isArray(parsed.routines)
          ? parsed.routines.filter(isRoutineItem)
          : defaultData.routines,
        schedule: Array.isArray(parsed.schedule)
          ? parsed.schedule.filter(isScheduleItem)
          : defaultData.schedule,
        lessons: Array.isArray(parsed.lessons)
          ? parsed.lessons.filter((lesson): lesson is string => typeof lesson === 'string')
          : defaultData.lessons,
      };
    }
  } catch (e) {
    console.error('خطا در بارگذاری اطلاعات از حافظه‌ی مرورگر', e);
  }

  if (fallback) return fallback;

  const today = getTodayJalali();
  return createDefaultDayData(today.jy, today.jm, today.jd, today.dayName);
}

export function savePlannerData(data: DailyPlannerData): void {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${data.dateKey}`, JSON.stringify(data));
    const historyList = readHistoryKeys();
    if (!historyList.includes(data.dateKey)) {
      historyList.unshift(data.dateKey);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(historyList.slice(0, 120)));
    }
  } catch (e) {
    console.error('خطا در ذخیره‌سازی اطلاعات در حافظه‌ی مرورگر', e);
  }
}

export function getAllSavedDates(): string[] {
  return readHistoryKeys();
}

export function checkDateHasData(dateKey: string): boolean {
  try {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}${dateKey}`);
    if (saved) {
      const data = JSON.parse(saved) as Partial<DailyPlannerData>;
      const hasPriorities = data.priorities?.some((item) => item.text?.trim() || item.completed);
      const hasSchedule = data.schedule?.some((item) => item.task?.trim() || item.completed);
      const hasGoals = data.goals?.some((item) => item.text?.trim() || item.completed);
      return Boolean(hasPriorities || hasSchedule || hasGoals);
    }
  } catch {
    // ignore
  }
  return false;
}
