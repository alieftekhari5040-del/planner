import { describe, expect, it } from 'vitest';
import { createDefaultDayData } from '../src/utils/storage';
import { createPlannerBackup, parsePlannerBackup } from '../src/utils/backup';
import { getDefaultHabits } from '../src/utils/habitStorage';

describe('پشتیبان برنامه', () => {
  it('پشتیبان معتبر را می‌سازد و بازیابی می‌کند', () => {
    const planner = createDefaultDayData(1405, 5, 17, 'شنبه');
    const habits = getDefaultHabits();
    const backup = createPlannerBackup(planner, habits);
    const restored = parsePlannerBackup(JSON.stringify(backup));

    expect(restored.version).toBe('1.0.0');
    expect(restored.planner.dateKey).toBe('1405-05-17');
    expect(restored.habits).toHaveLength(habits.length);
  });

  it('فایل JSON خراب یا ساختار نامعتبر را رد می‌کند', () => {
    expect(() => parsePlannerBackup('{')).toThrow('JSON معتبر نیست');
    expect(() => parsePlannerBackup(JSON.stringify({ planner: {} }))).toThrow('ساختار فایل پشتیبان');
  });
});
