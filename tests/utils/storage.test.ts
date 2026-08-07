import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { DailyPlannerData } from '../../src/types/planner';
import {
  checkDateHasData,
  createDefaultDayData,
  getAllSavedDates,
  loadPlannerData,
  savePlannerData
} from '../../src/utils/storage';

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();

  get length(): number {
    return this.values.size;
  }

  clear(): void {
    this.values.clear();
  }

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  key(index: number): string | null {
    return [...this.values.keys()][index] ?? null;
  }

  removeItem(key: string): void {
    this.values.delete(key);
  }

  setItem(key: string, value: string): void {
    this.values.set(key, String(value));
  }
}

const localStorageMock = new MemoryStorage();
vi.stubGlobal('localStorage', localStorageMock);

describe('ذخیره‌سازی برنامه', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('داده‌ی ذخیره‌شده را با مقدارهای پیش‌فرض ادغام می‌کند', () => {
    const data = createDefaultDayData(1405, 5, 17, 'شنبه');
    data.priorities[0].text = 'مرور برنامه‌ی امروز';
    data.quickNotes = 'یادداشت آزمایشی';

    savePlannerData(data);
    const loaded = loadPlannerData(data.dateKey);

    expect(loaded.dateKey).toBe('1405-05-17');
    expect(loaded.priorities[0].text).toBe('مرور برنامه‌ی امروز');
    expect(loaded.quickNotes).toBe('یادداشت آزمایشی');
    expect(loaded.routines).toHaveLength(3);
  });

  it('تاریخ را فقط یک‌بار در تاریخچه ثبت می‌کند و داده‌دار بودن را تشخیص می‌دهد', () => {
    const data = createDefaultDayData(1405, 5, 17, 'شنبه');
    savePlannerData(data);
    savePlannerData(data);

    expect(getAllSavedDates()).toEqual(['1405-05-17']);
    expect(checkDateHasData('1405-05-17')).toBe(false);

    const populated: DailyPlannerData = {
      ...data,
      priorities: data.priorities.map((item, index) =>
        index === 0 ? { ...item, text: 'یک اولویت' } : item
      )
    };
    savePlannerData(populated);

    expect(checkDateHasData('1405-05-17')).toBe(true);
  });

  it('در نبود داده، fallback را برمی‌گرداند', () => {
    const fallback = createDefaultDayData(1405, 5, 18, 'یکشنبه');
    expect(loadPlannerData(fallback.dateKey, fallback)).toBe(fallback);
  });
});
