// Jalali / Shamsi Date Conversion & Mathematical Engine
export interface JalaliDate {
  jy: number;
  jm: number;
  jd: number;
  dayName: string;
  monthName: string;
}

export const PERSIAN_WEEKDAYS = [
  'شنبه',
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنج‌شنبه',
  'جمعه'
];

export const PERSIAN_MONTHS = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند'
];

// Check Jalali leap year using 33-year cycle
export function isJalaliLeapYear(jy: number): boolean {
  const breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
  let jp = breaks[0];
  let jump = 0;
  for (let i = 1; i < breaks.length; i++) {
    const jm = breaks[i];
    jump = jm - jp;
    if (jy < jm) break;
    jp = jm;
  }
  let n = jy - jp;
  if (jump - n < 6) n = n - jump + (Math.floor((jump + 4) / 33) * 33);
  let leap = ((((n + 1) % 33) - 1) % 4);
  if (leap === -1) leap = 4;
  return leap === 0;
}

export function getDaysInJalaliMonth(jy: number, jm: number): number {
  if (!Number.isInteger(jm) || jm < 1 || jm > 12) {
    throw new RangeError(`ماه جلالی باید بین ۱ و ۱۲ باشد: ${jm}`);
  }

  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  return isJalaliLeapYear(jy) ? 30 : 29;
}

// Convert Gregorian to Jalali
export function gregorianToJalali(gy: number, gm: number, gd: number): [number, number, number] {
  const gregorianDaysInMonth = new Date(Date.UTC(gy, gm, 0)).getUTCDate();
  if (
    !Number.isInteger(gy) ||
    !Number.isInteger(gm) ||
    !Number.isInteger(gd) ||
    gm < 1 ||
    gm > 12 ||
    gd < 1 ||
    gd > gregorianDaysInMonth
  ) {
    throw new RangeError(`تاریخ میلادی معتبر نیست: ${gy}-${gm}-${gd}`);
  }

  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    355666 +
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) +
    gd +
    g_d_m[gm - 1];
  let jy = -1595 + 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let jm: number;
  let jd: number;
  if (days < 186) {
    jm = 1 + Math.floor(days / 31);
    jd = 1 + (days % 31);
  } else {
    jm = 7 + Math.floor((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }
  return [jy, jm, jd];
}

// Convert Jalali to Gregorian.
export function jalaliToGregorian(jy: number, jm: number, jd: number): [number, number, number] {
  const daysInMonth = getDaysInJalaliMonth(jy, jm);
  if (!Number.isInteger(jy) || jy < 1 || jd < 1 || jd > daysInMonth) {
    throw new RangeError(`روز جلالی برای ماه انتخاب‌شده معتبر نیست: ${jy}-${jm}-${jd}`);
  }

  let gy = jy > 979 ? 1600 : 621;
  let normalizedJy = jy > 979 ? jy - 979 : jy;
  let days =
    365 * normalizedJy +
    Math.floor(normalizedJy / 33) * 8 +
    Math.floor(((normalizedJy % 33) + 3) / 4) +
    78 +
    jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);

  gy += 400 * Math.floor(days / 146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    gy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }

  const gregorianMonthDays = [
    0,
    31,
    (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31
  ];
  let gm = 0;
  while (gm < 13 && days >= gregorianMonthDays[gm]) {
    days -= gregorianMonthDays[gm];
    gm++;
  }
  return [gy, gm, days + 1];
}

// Add/subtract days safely across months and years
export function addDaysToJalali(jy: number, jm: number, jd: number, deltaDays: number): { jy: number; jm: number; jd: number; dayName: string } {
  if (!Number.isInteger(deltaDays)) {
    throw new TypeError(`تعداد روز باید عدد صحیح باشد: ${deltaDays}`);
  }

  const [gy, gm, gd] = jalaliToGregorian(jy, jm, jd);
  // UTC prevents daylight-saving transitions from changing a one-day offset.
  const targetDate = new Date(Date.UTC(gy, gm - 1, gd + deltaDays));
  const [newJy, newJm, newJd] = gregorianToJalali(
    targetDate.getUTCFullYear(),
    targetDate.getUTCMonth() + 1,
    targetDate.getUTCDate()
  );
  const persianDayIdx = (targetDate.getUTCDay() + 1) % 7;

  return {
    jy: newJy,
    jm: newJm,
    jd: newJd,
    dayName: PERSIAN_WEEKDAYS[persianDayIdx]
  };
}

export function getJalaliDateForOffset(jy: number, jm: number, jd: number, deltaDays: number): JalaliDate {
  const target = addDaysToJalali(jy, jm, jd, deltaDays);
  return {
    ...target,
    monthName: PERSIAN_MONTHS[target.jm - 1]
  };
}

export function getTodayJalali(): JalaliDate {
  const now = new Date();
  const [jy, jm, jd] = gregorianToJalali(now.getFullYear(), now.getMonth() + 1, now.getDate());
  const gDay = now.getDay();
  const persianDayIdx = (gDay + 1) % 7;

  return {
    jy,
    jm,
    jd,
    dayName: PERSIAN_WEEKDAYS[persianDayIdx],
    monthName: PERSIAN_MONTHS[jm - 1]
  };
}

export function formatPersianNumber(num: number | string): string {
  const pDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(num).replace(/[0-9]/g, (w) => pDigits[+w]);
}

export function formatPersianDateString(jy: number, jm: number, jd: number, dayName?: string): string {
  const dStr = formatPersianNumber(jd);
  const yStr = formatPersianNumber(jy);
  const mName = PERSIAN_MONTHS[jm - 1];
  if (dayName) {
    return `${dayName}، ${dStr} ${mName} ${yStr}`;
  }
  return `${dStr} ${mName} ${yStr}`;
}

export function getDateKey(jy: number, jm: number, jd: number): string {
  if (!Number.isInteger(jy) || jy < 1 || !Number.isInteger(jd) || jd < 1 || jd > getDaysInJalaliMonth(jy, jm)) {
    throw new RangeError(`تاریخ جلالی معتبر نیست: ${jy}-${jm}-${jd}`);
  }

  return `${jy}-${String(jm).padStart(2, '0')}-${String(jd).padStart(2, '0')}`;
}

export function parseDateKey(dateKey: string): { jy: number; jm: number; jd: number } | null {
  const match = /^(\d{3,4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (!match) return null;

  const jy = Number(match[1]);
  const jm = Number(match[2]);
  const jd = Number(match[3]);
  try {
    if (getDateKey(jy, jm, jd) !== dateKey) return null;
  } catch {
    return null;
  }

  return { jy, jm, jd };
}
