import { describe, expect, it } from 'vitest';
import {
  addDaysToJalali,
  formatPersianDateString,
  formatPersianNumber,
  getDateKey,
  getDaysInJalaliMonth,
  getJalaliDateForOffset,
  gregorianToJalali,
  parseDateKey,
  isJalaliLeapYear,
  jalaliToGregorian
} from '../../src/utils/jalali';

describe('منطق تقویم شمسی', () => {
  it('تاریخ‌های شناخته‌شده را بین دو تقویم تبدیل می‌کند', () => {
    expect(gregorianToJalali(2024, 3, 20)).toEqual([1403, 1, 1]);
    expect(jalaliToGregorian(1403, 1, 1)).toEqual([2024, 3, 20]);
  });

  it('سال کبیسه و تعداد روزهای اسفند را درست محاسبه می‌کند', () => {
    expect(isJalaliLeapYear(1403)).toBe(true);
    expect(getDaysInJalaliMonth(1403, 12)).toBe(30);
    expect(getDaysInJalaliMonth(1402, 12)).toBe(29);
    expect(getDaysInJalaliMonth(1405, 6)).toBe(31);
    expect(getDaysInJalaliMonth(1405, 7)).toBe(30);
  });

  it('جابجایی روز را در مرز ماه و سال درست انجام می‌دهد', () => {
    expect(addDaysToJalali(1402, 12, 29, 1)).toMatchObject({ jy: 1403, jm: 1, jd: 1 });
    expect(addDaysToJalali(1403, 12, 30, 1)).toMatchObject({ jy: 1404, jm: 1, jd: 1 });
    expect(getJalaliDateForOffset(1403, 1, 1, -1)).toMatchObject({ jy: 1402, jm: 12, jd: 29 });
  });

  it('اعداد، تاریخ و کلید ذخیره‌سازی را فارسی و پایدار قالب‌بندی می‌کند', () => {
    expect(formatPersianNumber(1405)).toBe('۱۴۰۵');
    expect(formatPersianDateString(1405, 5, 17, 'شنبه')).toBe('شنبه، ۱۷ مرداد ۱۴۰۵');
    expect(getDateKey(1405, 5, 17)).toBe('1405-05-17');
    expect(parseDateKey('1405-05-17')).toEqual({ jy: 1405, jm: 5, jd: 17 });
    expect(parseDateKey('1405-12-31')).toBeNull();
  });

  it('برای تاریخ نامعتبر جلالی یا میلادی خطای قابل فهم می‌دهد', () => {
    expect(() => getDaysInJalaliMonth(1405, 13)).toThrow(RangeError);
    expect(() => gregorianToJalali(2024, 2, 30)).toThrow(RangeError);
  });
});
