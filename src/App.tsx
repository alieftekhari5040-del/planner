import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import type {
  DailyPlannerData,
  PriorityItem,
  GoalItem,
  ScheduleItem
} from './types/planner';
import type { Habit } from './types/habits';
import {
  getTodayJalali,
  getDateKey,
  parseDateKey,
  getJalaliDateForOffset,
  addDaysToJalali,
  PERSIAN_WEEKDAYS
} from './utils/jalali';
import {
  loadPlannerData,
  savePlannerData,
  createDefaultDayData
} from './utils/storage';
import { loadHabits, saveHabits } from './utils/habitStorage';
import { createPlannerBackup, parsePlannerBackup } from './utils/backup';
import { playTickSound, playSuccessSound } from './utils/audio';

import { TopNavTabs } from './components/TopNavTabs';
import type { MainTabType } from './components/TopNavTabs';
import { Header } from './components/Header';
import { DateSection } from './components/DateSection';
import { PrioritiesCard } from './components/PrioritiesCard';
import { GoalsCard } from './components/GoalsCard';
import { ScheduleCard } from './components/ScheduleCard';
import { LessonsCard } from './components/LessonsCard';
import { Footer } from './components/Footer';
import { HabitTrackerPage } from './components/HabitTracker/HabitTrackerPage';
import { AnalyticsPage } from './components/Analytics/AnalyticsPage';
import { CalendarModal } from './components/CalendarModal';
import { TemplatesModal } from './components/TemplatesModal';
import { HistoryModal } from './components/HistoryModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MainTabType>('planner');

  // ── تاریخ جاری ──
  const todayInfo = useMemo(() => getTodayJalali(), []);
  const [currentJy, setCurrentJy] = useState(todayInfo.jy);
  const [currentJm, setCurrentJm] = useState(todayInfo.jm);
  const [currentJd, setCurrentJd] = useState(todayInfo.jd);
  const [currentDayName, setCurrentDayName] = useState(todayInfo.dayName);

  const dateKey = useMemo(
    () => getDateKey(currentJy, currentJm, currentJd),
    [currentJy, currentJm, currentJd]
  );

  // ── refs برای جلوگیری از race condition ──
  // از ref برای نگه داشتن dateKey هنگام save استفاده می‌کنیم
  // تا مطمئن بشیم داده روز قبلی رو overwrite نمی‌کنیم
  const activeDateKeyRef = useRef(dateKey);
  const celebratedDateRef = useRef<string | null>(null);

  const [plannerData, setPlannerData] = useState<DailyPlannerData>(() =>
    loadPlannerData(dateKey, createDefaultDayData(currentJy, currentJm, currentJd, currentDayName))
  );
  const [habits, setHabits] = useState<Habit[]>(() => loadHabits());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // ── بارگذاری داده هنگام تغییر روز ──
  useEffect(() => {
    activeDateKeyRef.current = dateKey;
    const loaded = loadPlannerData(
      dateKey,
      createDefaultDayData(currentJy, currentJm, currentJd, currentDayName)
    );
    setPlannerData(loaded);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateKey]);

  // ── ذخیره خودکار — فقط اگر dateKey مطابقت داشته باشه ──
  useEffect(() => {
    if (
      plannerData &&
      plannerData.dateKey === dateKey &&
      plannerData.dateKey === activeDateKeyRef.current
    ) {
      savePlannerData(plannerData);
    }
  }, [plannerData, dateKey]);

  // ── ذخیره خودکار عادت‌ها ──
  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  // ── محاسبه پیشرفت (بدون routines) ──
  const completionStats = useMemo(() => {
    let total = 0;
    let completed = 0;

    plannerData.priorities?.forEach((p) => {
      if (p.text.trim()) { total++; if (p.completed) completed++; }
    });
    plannerData.goals?.forEach((g) => {
      if (g.text.trim()) { total++; if (g.completed) completed++; }
    });
    plannerData.schedule?.forEach((s) => {
      if (s.task.trim()) { total++; if (s.completed) completed++; }
    });

    const percent = total > 0 ? (completed / total) * 100 : 0;
    return { total, completed, percent };
  }, [plannerData]);

  // ── جشن تکمیل روز ──
  useEffect(() => {
    if (completionStats.percent < 100 || completionStats.total < 3) {
      if (celebratedDateRef.current === dateKey) celebratedDateRef.current = null;
      return;
    }
    if (celebratedDateRef.current === dateKey) return;
    celebratedDateRef.current = dateKey;
    playSuccessSound(soundEnabled);
    try {
      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#38bdf8', '#34d399', '#f59e0b', '#f43f5e'],
      });
    } catch { /* noop */ }
  }, [completionStats.percent, completionStats.total, dateKey, soundEnabled]);

  // ── helper برای تغییر روز ──
  const goToDate = useCallback((jy: number, jm: number, jd: number, dayName: string) => {
    setCurrentJy(jy);
    setCurrentJm(jm);
    setCurrentJd(jd);
    setCurrentDayName(dayName);
  }, []);

  // ── handler های روز ──
  const handleSelectDayOfWeek = useCallback((day: string) => {
    playTickSound(soundEnabled);
    const targetIdx = PERSIAN_WEEKDAYS.indexOf(day);
    const currentIdx = PERSIAN_WEEKDAYS.indexOf(currentDayName);
    if (targetIdx === -1) return;
    let delta = targetIdx - currentIdx;
    if (delta > 3) delta -= 7;
    if (delta < -3) delta += 7;
    const t = addDaysToJalali(currentJy, currentJm, currentJd, delta);
    goToDate(t.jy, t.jm, t.jd, t.dayName);
  }, [soundEnabled, currentDayName, currentJy, currentJm, currentJd, goToDate]);

  const handlePreviousDay = useCallback(() => {
    playTickSound(soundEnabled);
    const t = addDaysToJalali(currentJy, currentJm, currentJd, -1);
    goToDate(t.jy, t.jm, t.jd, t.dayName);
  }, [soundEnabled, currentJy, currentJm, currentJd, goToDate]);

  const handleNextDay = useCallback(() => {
    playTickSound(soundEnabled);
    const t = addDaysToJalali(currentJy, currentJm, currentJd, 1);
    goToDate(t.jy, t.jm, t.jd, t.dayName);
  }, [soundEnabled, currentJy, currentJm, currentJd, goToDate]);

  const handleGoToToday = useCallback(() => {
    playTickSound(soundEnabled);
    const t = getTodayJalali();
    goToDate(t.jy, t.jm, t.jd, t.dayName);
  }, [soundEnabled, goToDate]);

  const handleSelectFromCalendar = useCallback((jy: number, jm: number, jd: number) => {
    playTickSound(soundEnabled);
    const t = addDaysToJalali(jy, jm, jd, 0);
    goToDate(t.jy, t.jm, t.jd, t.dayName);
  }, [soundEnabled, goToDate]);

  const handleChangeDateText = useCallback((text: string) => {
    setPlannerData((prev) => ({ ...prev, customDateText: text }));
  }, []);

  // ── handler های planner ──
  const handlePriorityToggle = useCallback((id: string) => {
    playTickSound(soundEnabled);
    setPlannerData((prev) => ({
      ...prev,
      priorities: prev.priorities.map((p) => p.id === id ? { ...p, completed: !p.completed } : p),
    }));
  }, [soundEnabled]);

  const handleGoalToggle = useCallback((id: string) => {
    playTickSound(soundEnabled);
    setPlannerData((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => g.id === id ? { ...g, completed: !g.completed } : g),
    }));
  }, [soundEnabled]);

  const handleScheduleToggle = useCallback((id: string) => {
    playTickSound(soundEnabled);
    setPlannerData((prev) => ({
      ...prev,
      schedule: prev.schedule.map((s) => s.id === id ? { ...s, completed: !s.completed } : s),
    }));
  }, [soundEnabled]);

  const handleApplyPresetSchedule = useCallback(() => {
    playTickSound(soundEnabled);
    const tasks: ScheduleItem[] = [
      { id: 's-1',  task: 'بیدارباش، نوشیدن آب و روتین صبحگاهی',              completed: false },
      { id: 's-2',  task: 'صبحانه سالم و آماده‌سازی محیط کار',               completed: false },
      { id: 's-3',  task: 'بلاک کار عمیق ۱ (سخت‌ترین تسک روز)',              completed: false },
      { id: 's-4',  task: 'استراحت فعال، چای و کشش عضلات',                   completed: false },
      { id: 's-5',  task: 'بلاک کار عمیق ۲ (توسعه فیچرهای اصلی)',            completed: false },
      { id: 's-6',  task: 'ناهار سبک و استراحت کوتاه بدون صفحه',             completed: false },
      { id: 's-7',  task: 'پاسخ به ایمیل‌ها، هماهنگی‌ها و جلسات',           completed: false },
      { id: 's-8',  task: 'مطالعه تخصصی و یادگیری دوره جدید',                completed: false },
      { id: 's-9',  task: 'تمرین بدنسازی / پیاده‌روی هوازی',                 completed: false },
      { id: 's-10', task: 'شام و وقت با کیفیت با خانواده',                    completed: false },
      { id: 's-11', task: 'مرور درس‌های امروز و برنامه‌ریزی فردا',           completed: false },
      { id: 's-12', task: 'مطالعه کتاب و خاموشی صفحات نمایش',                completed: false },
    ];
    setPlannerData((prev) => ({ ...prev, schedule: tasks }));
  }, [soundEnabled]);

  const handleApplyTemplate = useCallback((template: Partial<DailyPlannerData>) => {
    playSuccessSound(soundEnabled);
    setPlannerData((prev) => ({
      ...prev,
      ...template,
      // فیلدهای آرایه‌ای را با type safe اعمال می‌کنیم
      priorities: Array.isArray(template.priorities)
        ? (template.priorities as PriorityItem[])
        : prev.priorities,
      goals: Array.isArray(template.goals)
        ? (template.goals as GoalItem[])
        : prev.goals,
      schedule: Array.isArray(template.schedule)
        ? (template.schedule as ScheduleItem[])
        : prev.schedule,
      // routines رو نادیده می‌گیریم چون UI ندارن
      routines: prev.routines,
    }));
  }, [soundEnabled]);

  const handleResetDay = useCallback(() => {
    if (!window.confirm('آیا از پاکسازی اطلاعات این روز مطمئن هستید؟')) return;
    playTickSound(soundEnabled);
    setPlannerData(createDefaultDayData(currentJy, currentJm, currentJd, currentDayName));
  }, [soundEnabled, currentJy, currentJm, currentJd, currentDayName]);

  const handlePrint = useCallback(() => {
    playTickSound(soundEnabled);
    window.print();
  }, [soundEnabled]);

  const handleExportJSON = useCallback(() => {
    const blob = new Blob(
      [JSON.stringify(createPlannerBackup(plannerData, habits), null, 2)],
      { type: 'application/json;charset=utf-8' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ascent-backup-${plannerData.dateKey}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [plannerData, habits]);

  const handleImportJSON = useCallback(async (file: File) => {
    try {
      const backup = parsePlannerBackup(await file.text());
      savePlannerData(backup.planner);
      saveHabits(backup.habits);
      setHabits(backup.habits);

      const imported = parseDateKey(backup.planner.dateKey);
      if (imported) {
        if (backup.planner.dateKey === dateKey) {
          setPlannerData(loadPlannerData(dateKey, backup.planner));
        } else {
          const t = getJalaliDateForOffset(imported.jy, imported.jm, imported.jd, 0);
          goToDate(t.jy, t.jm, t.jd, t.dayName);
        }
      }
      window.alert('پشتیبان با موفقیت بازیابی شد.');
    } catch (err) {
      window.alert(err instanceof Error ? err.message : 'بازیابی انجام نشد.');
    }
  }, [dateKey, goToDate]);

  const handleSelectHistoryDate = useCallback((key: string) => {
    const parsed = parseDateKey(key);
    if (!parsed) return;
    const t = addDaysToJalali(parsed.jy, parsed.jm, parsed.jd, 0);
    goToDate(t.jy, t.jm, t.jd, t.dayName);
  }, [goToDate]);

  // ── render ──
  return (
    <div className="app-shell selection:bg-purple-500 selection:text-white">
      {/* لایه‌های دکوراتیو */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-violet-700/8 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-indigo-700/8 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />

      <div className="app-content">
        <TopNavTabs activeTab={activeTab} onChangeTab={setActiveTab} />

        <main className="app-frame p-4 sm:p-6 md:p-8 print-container">
          <Header
            onPrint={handlePrint}
            onReset={handleResetDay}
            onOpenHistory={() => setIsHistoryOpen(true)}
            onOpenCalendarModal={() => setIsCalendarOpen(true)}
            onOpenTemplates={() => setIsTemplatesOpen(true)}
            onExportJSON={handleExportJSON}
            onImportJSON={handleImportJSON}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled((s) => !s)}
            completionPercentage={completionStats.percent}
          />

          {/* تب ۱: برنامه‌ریزی روزانه */}
          {activeTab === 'planner' && (
            <div className="space-y-5 animate-fadeIn">
              <DateSection
                selectedDayOfWeek={currentDayName}
                onSelectDayOfWeek={handleSelectDayOfWeek}
                dateText={plannerData.customDateText}
                onChangeDateText={handleChangeDateText}
                onPreviousDay={handlePreviousDay}
                onNextDay={handleNextDay}
                onGoToToday={handleGoToToday}
              />

              <ScheduleCard
                schedule={plannerData.schedule}
                onChange={(schedule) => setPlannerData((prev) => ({ ...prev, schedule }))}
                onItemToggle={handleScheduleToggle}
                onApplyPresetTasks={handleApplyPresetSchedule}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <PrioritiesCard
                  priorities={plannerData.priorities}
                  onChange={(priorities) => setPlannerData((prev) => ({ ...prev, priorities }))}
                  onItemToggle={handlePriorityToggle}
                />
                <GoalsCard
                  goals={plannerData.goals}
                  onChange={(goals) => setPlannerData((prev) => ({ ...prev, goals }))}
                  onGoalToggle={handleGoalToggle}
                />
              </div>

              <LessonsCard
                lessons={plannerData.lessons}
                onChange={(lessons) => setPlannerData((prev) => ({ ...prev, lessons }))}
              />
            </div>
          )}

          {/* تب ۲: ردیاب عادت‌ها */}
          {activeTab === 'habits' && (
            <div className="animate-fadeIn">
              <HabitTrackerPage
                habits={habits}
                todayKey={dateKey}
                onUpdateHabits={setHabits}
                soundEnabled={soundEnabled}
              />
            </div>
          )}

          {/* تب ۳: داشبورد */}
          {activeTab === 'analytics' && (
            <div className="animate-fadeIn">
              <AnalyticsPage
                habits={habits}
                plannerData={plannerData}
                todayKey={dateKey}
              />
            </div>
          )}

          <Footer />
        </main>
      </div>

      {/* مودال‌ها */}
      <CalendarModal
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        currentJy={currentJy}
        currentJm={currentJm}
        currentJd={currentJd}
        onSelectDate={handleSelectFromCalendar}
      />
      <TemplatesModal
        isOpen={isTemplatesOpen}
        onClose={() => setIsTemplatesOpen(false)}
        onApplyTemplate={handleApplyTemplate}
      />
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onSelectDate={handleSelectHistoryDate}
        currentDateKey={dateKey}
      />
    </div>
  );
};

export default App;
