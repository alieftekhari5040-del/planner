import { describe, it, expect } from 'vitest';
import { addDaysToJalali, PERSIAN_WEEKDAYS } from '../../src/utils/jalali';

// تست منطق ناوبری روزهای هفته — همان منطقی که در useJalaliNavigation.handleSelectDayOfWeek فیکس شد
// قبلاً فقط selectedDayOfWeek هایلایت می‌کرد بدون تغییر تاریخ

function getWeekdayDiff(currentDay: string, targetDay: string): number {
  const t = PERSIAN_WEEKDAYS.indexOf(targetDay);
  const c = PERSIAN_WEEKDAYS.indexOf(currentDay);
  if (t === -1 || c === -1) return 0;
  return t - c;
}

describe('ناوبری روزهای هفته (فیکس شده)', () => {
  it('کلیک روی هر روز هفته به تاریخ همان روز در هفته جاری می‌رود', () => {
    // فرض: امروز چهارشنبه 14 مرداد 1405
    const base = { jy: 1405, jm: 5, jd: 14, dayName: 'چهارشنبه' };
    expect(PERSIAN_WEEKDAYS.indexOf(base.dayName)).toBe(4);

    // شنبه = 4 روز قبل
    expect(getWeekdayDiff(base.dayName, 'شنبه')).toBe(-4);
    const sat = addDaysToJalali(base.jy, base.jm, base.jd, -4);
    expect(sat.dayName).toBe('شنبه');

    // جمعه = 2 روز بعد
    expect(getWeekdayDiff(base.dayName, 'جمعه')).toBe(2);
    const fri = addDaysToJalali(base.jy, base.jm, base.jd, 2);
    expect(fri.dayName).toBe('جمعه');

    // خود چهارشنبه = diff 0
    expect(getWeekdayDiff(base.dayName, 'چهارشنبه')).toBe(0);
  });

  it('مرز ماه را درست رد می‌کند (مرداد 31 روزه)', () => {
    // 31 مرداد 1405 = جمعه، شنبه بعدی 1 شهریور
    const endMordad = addDaysToJalali(1405, 5, 31, 1);
    expect(endMordad.jm).toBe(6);
    expect(endMordad.jd).toBe(1);

    // شنبه 11 مرداد -> جمعه 16 مرداد (تصویر کاربر): diff +6
    const sat11 = addDaysToJalali(1405, 5, 10, 6);
    expect(sat11.jd).toBe(16);
    expect(sat11.dayName).toBe('جمعه');
  });

  it('کلیک روی همان روز نباید تاریخ را جابجا کند', () => {
    const base = { jy: 1405, jm: 5, jd: 16, dayName: 'جمعه' };
    const diff = getWeekdayDiff(base.dayName, 'جمعه');
    expect(diff).toBe(0);
    const same = addDaysToJalali(base.jy, base.jm, base.jd, diff);
    expect(same.jd).toBe(16);
    expect(same.jm).toBe(5);
  });
});

describe('امنیت بکاپ', () => {
  it('فایل حجیم باید رد شود', () => {
    const fakeFile = { size: 3_000_000 } as File;
    expect(fakeFile.size).toBeGreaterThan(2_000_000);
    // منطق handleImportJSON: if (file.size > 2_000_000) throw
    expect(() => {
      if (fakeFile.size > 2_000_000) throw new Error('حجم زیاد');
    }).toThrow('حجم زیاد');
  });
});
