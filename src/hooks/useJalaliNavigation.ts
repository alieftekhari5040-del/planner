import { useMemo, useState, useCallback } from 'react';
import { addDaysToJalali, getDateKey, getJalaliDateForOffset, getTodayJalali, PERSIAN_WEEKDAYS } from '../utils/jalali';
import { playTickSound } from '../utils/audio';

/**
 * مدیریت تاریخ فعال جلالی و جابه‌جایی بین روزها
 * این هوک وضعیت تاریخ فعلی، کلید ذخیره‌سازی و هندلرهای ناوبری را جدا می‌کند
 * تا App.tsx سبک‌تر و تست‌پذیرتر شود.
 */
export function useJalaliNavigation(soundEnabled: boolean) {
  const todayInfo = useMemo(() => getTodayJalali(), []);

  const [currentJy, setCurrentJy] = useState(todayInfo.jy);
  const [currentJm, setCurrentJm] = useState(todayInfo.jm);
  const [currentJd, setCurrentJd] = useState(todayInfo.jd);
  const [currentDayName, setCurrentDayName] = useState(todayInfo.dayName);

  const dateKey = useMemo(() => getDateKey(currentJy, currentJm, currentJd), [currentJy, currentJm, currentJd]);

  const handlePreviousDay = useCallback(() => {
    playTickSound(soundEnabled);
    const target = addDaysToJalali(currentJy, currentJm, currentJd, -1);
    setCurrentJy(target.jy);
    setCurrentJm(target.jm);
    setCurrentJd(target.jd);
    setCurrentDayName(target.dayName);
  }, [currentJy, currentJm, currentJd, soundEnabled]);

  const handleNextDay = useCallback(() => {
    playTickSound(soundEnabled);
    const target = addDaysToJalali(currentJy, currentJm, currentJd, 1);
    setCurrentJy(target.jy);
    setCurrentJm(target.jm);
    setCurrentJd(target.jd);
    setCurrentDayName(target.dayName);
  }, [currentJy, currentJm, currentJd, soundEnabled]);

  const handleGoToToday = useCallback(() => {
    playTickSound(soundEnabled);
    const t = getTodayJalali();
    setCurrentJy(t.jy);
    setCurrentJm(t.jm);
    setCurrentJd(t.jd);
    setCurrentDayName(t.dayName);
  }, [soundEnabled]);

  const handleSelectFromCalendar = useCallback((jy: number, jm: number, jd: number, _dayName: string) => {
    playTickSound(soundEnabled);
    const target = addDaysToJalali(jy, jm, jd, 0);
    setCurrentJy(target.jy);
    setCurrentJm(target.jm);
    setCurrentJd(target.jd);
    setCurrentDayName(target.dayName);
  }, [soundEnabled]);

  // دکمه‌های روزهای هفته (شنبه تا جمعه) — اکنون واقعاً به تاریخ آن روز می‌رود، نه فقط هایلایت
  const handleSelectDayOfWeek = useCallback((day: string) => {
    playTickSound(soundEnabled);
    const targetIndex = PERSIAN_WEEKDAYS.indexOf(day);
    const currentIndex = PERSIAN_WEEKDAYS.indexOf(currentDayName);
    if (targetIndex === -1 || currentIndex === -1) {
      setCurrentDayName(day);
      return;
    }
    const diff = targetIndex - currentIndex;
    // اگر اختلاف 0 بود، یعنی همین امروز — فقط صدا و هایلایت
    if (diff === 0) return;
    const target = addDaysToJalali(currentJy, currentJm, currentJd, diff);
    setCurrentJy(target.jy);
    setCurrentJm(target.jm);
    setCurrentJd(target.jd);
    setCurrentDayName(target.dayName);
  }, [currentJy, currentJm, currentJd, currentDayName, soundEnabled]);

  const handleSelectHistoryDate = useCallback((dateKeyToLoad: string) => {
    // تاریخ انتخاب‌شده از تاریخچه را به فرمت جلالی تجزیه و اعمال می‌کند
    const parts = dateKeyToLoad.split('-').map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) return;
    const [jy, jm, jd] = parts;
    const target = addDaysToJalali(jy, jm, jd, 0);
    setCurrentJy(target.jy);
    setCurrentJm(target.jm);
    setCurrentJd(target.jd);
    setCurrentDayName(target.dayName);
  }, []);

  const setDateFromImport = useCallback((jy: number, jm: number, jd: number) => {
    const target = getJalaliDateForOffset(jy, jm, jd, 0);
    setCurrentJy(target.jy);
    setCurrentJm(target.jm);
    setCurrentJd(target.jd);
    setCurrentDayName(target.dayName);
  }, []);

  return {
    todayInfo,
    currentJy,
    currentJm,
    currentJd,
    currentDayName,
    dateKey,
    setCurrentJy,
    setCurrentJm,
    setCurrentJd,
    setCurrentDayName,
    handlePreviousDay,
    handleNextDay,
    handleGoToToday,
    handleSelectFromCalendar,
    handleSelectHistoryDate,
    handleSelectDayOfWeek,
    setDateFromImport,
  };
}

export type JalaliNavigation = ReturnType<typeof useJalaliNavigation>;
