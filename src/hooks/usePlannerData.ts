import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import type { DailyPlannerData, GoalItem, PriorityItem, RoutineItem, ScheduleItem } from '../types/planner';
import type { Habit } from '../types/habits';
import { parseDateKey } from '../utils/jalali';
import { createDefaultDayData, loadPlannerData, savePlannerData } from '../utils/storage';
import { saveHabits } from '../utils/habitStorage';
import { createPlannerBackup, parsePlannerBackup } from '../utils/backup';
import { playSuccessSound, playTickSound } from '../utils/audio';
import { useCompletionCelebration } from './useCompletionCelebration';

interface UsePlannerDataOptions {
  dateKey: string;
  currentJy: number;
  currentJm: number;
  currentJd: number;
  currentDayName: string;
  soundEnabled: boolean;
  habits: Habit[];
  setHabits: (habits: Habit[]) => void;
  setCurrentDateFromImport: (jy: number, jm: number, jd: number) => void;
}

/**
 * هوک اصلی مدیریت داده‌ی روزانه
 * بارگذاری، ذخیره‌سازی، محاسبه درصد تکمیل، جشن تکمیل، و تمام هندلرهای ویرایش را در یک جا جمع می‌کند
 */
export function usePlannerData(options: UsePlannerDataOptions) {
  const { dateKey, currentJy, currentJm, currentJd, currentDayName, soundEnabled, habits, setHabits, setCurrentDateFromImport } = options;

  const isLoadedRef = useRef(false);

  const [plannerData, setPlannerData] = useState<DailyPlannerData>(() =>
    loadPlannerData(dateKey, createDefaultDayData(currentJy, currentJm, currentJd, currentDayName)),
  );

  // بارگذاری ایمن داده هر بار که کلید تاریخ تغییر می‌کند
  useEffect(() => {
    isLoadedRef.current = false;
    const loaded = loadPlannerData(dateKey, createDefaultDayData(currentJy, currentJm, currentJd, currentDayName));
    setPlannerData(loaded);
    isLoadedRef.current = true;
  }, [dateKey, currentJy, currentJm, currentJd, currentDayName]);

  // ذخیره خودکار هنگام تغییر داده
  useEffect(() => {
    if (plannerData && plannerData.dateKey === dateKey && isLoadedRef.current) {
      savePlannerData(plannerData);
    }
  }, [plannerData, dateKey]);

  const completionStats = useMemo(() => {
    let total = 0;
    let completed = 0;

    plannerData.priorities?.forEach((p) => {
      if (p.text.trim()) {
        total++;
        if (p.completed) completed++;
      }
    });

    // بخش «اولویت امروز (عادت‌های کلیدی)» حذف شد — دیگر در محاسبه پیشرفت لحاظ نمی‌شود
    // plannerData.routines دیگر شمرده نمی‌شود تا درصد با آنچه کاربر می‌بیند همگام باشد

    plannerData.schedule?.forEach((s) => {
      if (s.task.trim()) {
        total++;
        if (s.completed) completed++;
      }
    });

    const percent = total > 0 ? (completed / total) * 100 : 0;
    return { total, completed, percent };
  }, [plannerData]);

  useCompletionCelebration(completionStats, dateKey, soundEnabled);

  const handleChangeDateText = useCallback((text: string) => {
    setPlannerData((prev) => ({ ...prev, customDateText: text }));
  }, []);

  const handlePriorityToggle = useCallback((id: string) => {
    playTickSound(soundEnabled);
    setPlannerData((prev) => ({
      ...prev,
      priorities: prev.priorities.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)),
    }));
  }, [soundEnabled]);

  const handleGoalToggle = useCallback((id: string) => {
    playTickSound(soundEnabled);
    setPlannerData((prev) => ({
      ...prev,
      goals: prev.goals.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)),
    }));
  }, [soundEnabled]);

  const handleScheduleToggle = useCallback((id: string) => {
    playTickSound(soundEnabled);
    setPlannerData((prev) => ({
      ...prev,
      schedule: prev.schedule.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)),
    }));
  }, [soundEnabled]);

  const handleApplyPresetSchedule = useCallback(() => {
    playTickSound(soundEnabled);
    const smartTasks: ScheduleItem[] = [
      { id: 's-1', task: 'بیدارباش، نوشیدن آب و روتین صبحگاهی', completed: false },
      { id: 's-2', task: 'صبحانه سالم و آماده‌سازی محیط کار', completed: false },
      { id: 's-3', task: 'بلاک کار عمیق ۱ (سخت‌ترین تسک فنی روز)', completed: false },
      { id: 's-4', task: 'استراحت فعال، چای و کشش عضلات', completed: false },
      { id: 's-5', task: 'بلاک کار عمیق ۲ (توسعه فیچرهای اصلی پروژه)', completed: false },
      { id: 's-6', task: 'ناهار سبک و استراحت کوتاه بدون صفحه نمایش', completed: false },
      { id: 's-7', task: 'پاسخ به ایمیل‌ها، هماهنگی‌ها و جلسات کوتاه', completed: false },
      { id: 's-8', task: 'مطالعه تخصصی و یادگیری دوره جدید', completed: false },
      { id: 's-9', task: 'تمرین بدنسازی / پیاده‌روی هوازی', completed: false },
      { id: 's-10', task: 'شام و وقت با کیفیت با خانواده و دوستان', completed: false },
      { id: 's-11', task: 'مرور درس‌های امروز و برنامه‌ریزی فردا', completed: false },
      { id: 's-12', task: 'مطالعه کتاب و خاموشی صفحات نمایش', completed: false },
      { id: 's-13', task: 'خواب عمیق و بازسازی انرژی برای فردا', completed: false },
      { id: 's-14', task: 'مدیتیشن و تنفس عمیق قبل خواب', completed: false },
    ];
    setPlannerData((prev) => ({ ...prev, schedule: smartTasks }));
  }, [soundEnabled]);

  const handleApplyTemplate = useCallback((template: Partial<DailyPlannerData>) => {
    playSuccessSound(soundEnabled);
    setPlannerData((prev) => ({
      ...prev,
      ...template,
      priorities: (template.priorities as PriorityItem[]) || prev.priorities,
      goals: (template.goals as GoalItem[]) || prev.goals,
      routines: (template.routines as RoutineItem[]) || prev.routines,
    }));
  }, [soundEnabled]);

  const handleResetDay = useCallback(() => {
    if (window.confirm('آیا از پاکسازی اطلاعات این روز مطمئن هستید؟')) {
      playTickSound(soundEnabled);
      const fresh = createDefaultDayData(currentJy, currentJm, currentJd, currentDayName);
      setPlannerData(fresh);
    }
  }, [currentJy, currentJm, currentJd, currentDayName, soundEnabled]);

  const handlePrint = useCallback(() => {
    playTickSound(soundEnabled);
    window.print();
  }, [soundEnabled]);

  const handleExportJSON = useCallback(() => {
    const backupObject = createPlannerBackup(plannerData, habits);
    const backupBlob = new Blob([JSON.stringify(backupObject, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const downloadUrl = URL.createObjectURL(backupBlob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = downloadUrl;
    downloadAnchor.download = `ascent-backup-${plannerData.dateKey}.json`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(downloadUrl);
  }, [habits, plannerData]);

  const handleImportJSON = useCallback(async (file: File) => {
    try {
      if (file.size > 2_000_000) {
        throw new Error('حجم فایل پشتیبان بیش از حد مجاز است (حداکثر ۲ مگابایت)');
      }
      const backup = parsePlannerBackup(await file.text());
      savePlannerData(backup.planner);
      saveHabits(backup.habits);
      setHabits(backup.habits);

      const importedDate = parseDateKey(backup.planner.dateKey);
      if (importedDate) {
        if (backup.planner.dateKey === dateKey) {
          setPlannerData(loadPlannerData(dateKey, backup.planner));
        } else {
          setCurrentDateFromImport(importedDate.jy, importedDate.jm, importedDate.jd);
        }
      }

      window.alert('پشتیبان با موفقیت بازیابی شد.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'بازیابی پشتیبان انجام نشد.';
      window.alert(message);
    }
  }, [dateKey, setCurrentDateFromImport, setHabits]);

  return {
    plannerData,
    setPlannerData,
    completionStats,
    handleChangeDateText,
    handlePriorityToggle,
    handleGoalToggle,
    handleScheduleToggle,
    handleApplyPresetSchedule,
    handleApplyTemplate,
    handleResetDay,
    handlePrint,
    handleExportJSON,
    handleImportJSON,
  };
}

export type PlannerDataState = ReturnType<typeof usePlannerData>;
