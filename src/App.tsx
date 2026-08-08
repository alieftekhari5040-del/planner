import React, { useState, useEffect, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import type {
  DailyPlannerData,
  PriorityItem,
  GoalItem,
  RoutineItem,
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
  // Navigation tab
  const [activeTab, setActiveTab] = useState<MainTabType>('planner');

  // Initialize date
  const todayInfo = useMemo(() => getTodayJalali(), []);
  const [currentJy, setCurrentJy] = useState(todayInfo.jy);
  const [currentJm, setCurrentJm] = useState(todayInfo.jm);
  const [currentJd, setCurrentJd] = useState(todayInfo.jd);
  const [currentDayName, setCurrentDayName] = useState(todayInfo.dayName);

  // Active planner date key
  const dateKey = useMemo(() => getDateKey(currentJy, currentJm, currentJd), [currentJy, currentJm, currentJd]);

  // Track active key to prevent save race conditions
  const isLoadedRef = useRef(false);
  const celebratedDateRef = useRef<string | null>(null);

  const [plannerData, setPlannerData] = useState<DailyPlannerData>(() => {
    return loadPlannerData(dateKey, createDefaultDayData(currentJy, currentJm, currentJd, currentDayName));
  });

  // Habit Tracker state
  const [habits, setHabits] = useState<Habit[]>(() => loadHabits());

  // UI state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Load planner data safely whenever dateKey changes
  useEffect(() => {
    isLoadedRef.current = false;
    const loaded = loadPlannerData(dateKey, createDefaultDayData(currentJy, currentJm, currentJd, currentDayName));
    setPlannerData(loaded);
    isLoadedRef.current = true;
  }, [dateKey, currentJy, currentJm, currentJd, currentDayName]);

  // Auto-save safely whenever plannerData updates
  useEffect(() => {
    if (plannerData && plannerData.dateKey === dateKey && isLoadedRef.current) {
      savePlannerData(plannerData);
    }
  }, [plannerData, dateKey]);

  // Auto-save habits whenever habits list updates
  useEffect(() => {
    if (habits) {
      saveHabits(habits);
    }
  }, [habits]);

  // Completion calculation
  const completionStats = useMemo(() => {
    let total = 0;
    let completed = 0;

    plannerData.priorities?.forEach((p) => {
      if (p.text.trim()) {
        total++;
        if (p.completed) completed++;
      }
    });

    plannerData.schedule?.forEach((s) => {
      if (s.task.trim()) {
        total++;
        if (s.completed) completed++;
      }
    });

    const percent = total > 0 ? (completed / total) * 100 : 0;
    return { total, completed, percent };
  }, [plannerData]);

  // Trigger one celebration per completed day instead of repeating on every re-render.
  useEffect(() => {
    if (completionStats.percent < 100 || completionStats.total < 4) {
      if (celebratedDateRef.current === dateKey) celebratedDateRef.current = null;
      return;
    }

    if (celebratedDateRef.current === dateKey) return;
    celebratedDateRef.current = dateKey;
    playSuccessSound(soundEnabled);
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b']
      });
    } catch {
      // ignore confetti errors
    }
  }, [completionStats.percent, completionStats.total, dateKey, soundEnabled]);

  // Handlers
  const handleSelectDayOfWeek = (day: string) => {
    playTickSound(soundEnabled);
    // پیدا کردن نزدیک‌ترین روز هفته (در ۷ روز آینده و گذشته)
    const targetIdx = PERSIAN_WEEKDAYS.indexOf(day);
    const currentIdx = PERSIAN_WEEKDAYS.indexOf(currentDayName);
    if (targetIdx === -1) return;
    // offset: کمترین فاصله بین روز فعلی تا روز هدف در همان هفته
    let delta = targetIdx - currentIdx;
    // نگه داشتن توی بازه -3 تا +3 (نزدیک‌ترین روز)
    if (delta > 3) delta -= 7;
    if (delta < -3) delta += 7;
    const target = addDaysToJalali(currentJy, currentJm, currentJd, delta);
    setCurrentJy(target.jy);
    setCurrentJm(target.jm);
    setCurrentJd(target.jd);
    setCurrentDayName(target.dayName);
  };

  const handleChangeDateText = (text: string) => {
    setPlannerData((prev) => ({ ...prev, customDateText: text }));
  };

  const handlePreviousDay = () => {
    playTickSound(soundEnabled);
    const target = addDaysToJalali(currentJy, currentJm, currentJd, -1);
    setCurrentJy(target.jy);
    setCurrentJm(target.jm);
    setCurrentJd(target.jd);
    setCurrentDayName(target.dayName);
  };

  const handleNextDay = () => {
    playTickSound(soundEnabled);
    const target = addDaysToJalali(currentJy, currentJm, currentJd, 1);
    setCurrentJy(target.jy);
    setCurrentJm(target.jm);
    setCurrentJd(target.jd);
    setCurrentDayName(target.dayName);
  };

  const handleGoToToday = () => {
    playTickSound(soundEnabled);
    const t = getTodayJalali();
    setCurrentJy(t.jy);
    setCurrentJm(t.jm);
    setCurrentJd(t.jd);
    setCurrentDayName(t.dayName);
  };

  const handleSelectFromCalendar = (jy: number, jm: number, jd: number, _dayName: string) => {
    playTickSound(soundEnabled);
    const target = addDaysToJalali(jy, jm, jd, 0);
    setCurrentJy(target.jy);
    setCurrentJm(target.jm);
    setCurrentJd(target.jd);
    setCurrentDayName(target.dayName);
    // The date effect loads the selected day's saved data or a correctly dated default.
    // Avoid mutating the previous day's state before that load completes.
  };

  const handlePriorityToggle = (id: string) => {
    playTickSound(soundEnabled);
    setPlannerData((prev) => ({
      ...prev,
      priorities: prev.priorities.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ),
    }));
  };

  const handleGoalToggle = (id: string) => {
    playTickSound(soundEnabled);
    setPlannerData((prev) => ({
      ...prev,
      goals: prev.goals.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ),
    }));
  };



  const handleScheduleToggle = (id: string) => {
    playTickSound(soundEnabled);
    setPlannerData((prev) => ({
      ...prev,
      schedule: prev.schedule.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      ),
    }));
  };

  const handleApplyPresetSchedule = () => {
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
  };

  const handleApplyTemplate = (template: Partial<DailyPlannerData>) => {
    playSuccessSound(soundEnabled);
    setPlannerData((prev) => ({
      ...prev,
      ...template,
      priorities: (template.priorities as PriorityItem[]) || prev.priorities,
      goals: (template.goals as GoalItem[]) || prev.goals,
      routines: (template.routines as RoutineItem[]) || prev.routines,
    }));
  };

  const handleResetDay = () => {
    if (window.confirm('آیا از پاکسازی اطلاعات این روز مطمئن هستید؟')) {
      playTickSound(soundEnabled);
      const fresh = createDefaultDayData(currentJy, currentJm, currentJd, currentDayName);
      setPlannerData(fresh);
    }
  };

  const handlePrint = () => {
    playTickSound(soundEnabled);
    window.print();
  };

  const handleExportJSON = () => {
    const backupObject = createPlannerBackup(plannerData, habits);
    const backupBlob = new Blob([JSON.stringify(backupObject, null, 2)], {
      type: 'application/json;charset=utf-8'
    });
    const downloadUrl = URL.createObjectURL(backupBlob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = downloadUrl;
    downloadAnchor.download = `ascent-backup-${plannerData.dateKey}.json`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(downloadUrl);
  };

  const handleImportJSON = async (file: File) => {
    try {
      const backup = parsePlannerBackup(await file.text());
      savePlannerData(backup.planner);
      saveHabits(backup.habits);
      setHabits(backup.habits);

      const importedDate = parseDateKey(backup.planner.dateKey);
      if (importedDate) {
        if (backup.planner.dateKey === dateKey) {
          setPlannerData(loadPlannerData(dateKey, backup.planner));
        } else {
          const target = getJalaliDateForOffset(importedDate.jy, importedDate.jm, importedDate.jd, 0);
          setCurrentJy(target.jy);
          setCurrentJm(target.jm);
          setCurrentJd(target.jd);
          setCurrentDayName(target.dayName);
        }
      }

      window.alert('پشتیبان با موفقیت بازیابی شد.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'بازیابی پشتیبان انجام نشد.';
      window.alert(message);
    }
  };

  const handleSelectHistoryDate = (dateKeyToLoad: string) => {
    const parsedDate = parseDateKey(dateKeyToLoad);
    if (!parsedDate) return;

    const target = addDaysToJalali(parsedDate.jy, parsedDate.jm, parsedDate.jd, 0);
    setCurrentJy(target.jy);
    setCurrentJm(target.jm);
    setCurrentJd(target.jd);
    setCurrentDayName(target.dayName);
  };

  return (
    <div className="app-shell selection:bg-purple-500 selection:text-white">
      {/* لایه‌های دکوراتیو */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-violet-700/8 rounded-full blur-[120px] pointer-events-none" aria-hidden="true" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-indigo-700/8 rounded-full blur-[100px] pointer-events-none" aria-hidden="true" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-violet-900/5 rounded-full blur-[140px] pointer-events-none" aria-hidden="true" />

      <div className="app-content">
        {/* Top Navigation Tabs */}
        <TopNavTabs activeTab={activeTab} onChangeTab={setActiveTab} />

        {/* Main application frame */}
        <main className="app-frame p-4 sm:p-6 md:p-8 print-container relative">
        {/* Top Header */}
        <Header
          onPrint={handlePrint}
          onReset={handleResetDay}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenCalendarModal={() => setIsCalendarOpen(true)}
          onOpenTemplates={() => setIsTemplatesOpen(true)}
          onExportJSON={handleExportJSON}
          onImportJSON={handleImportJSON}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
          completionPercentage={completionStats.percent}
        />

        {/* TAB 1: DAILY PLANNER (ORIGINAL BLUEPRINT POSTER) */}
        {activeTab === 'planner' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Date & Weekday Ribbon */}
            <DateSection
              selectedDayOfWeek={plannerData.selectedDayOfWeek}
              onSelectDayOfWeek={handleSelectDayOfWeek}
              dateText={plannerData.customDateText}
              onChangeDateText={handleChangeDateText}
              onPreviousDay={handlePreviousDay}
              onNextDay={handleNextDay}
              onGoToToday={handleGoToToday}
            />

            {/* ردیف بالا: برنامه روز (تمام عرض) */}
            <ScheduleCard
              schedule={plannerData.schedule}
              onChange={(schedule) => setPlannerData((prev) => ({ ...prev, schedule }))}
              onItemToggle={handleScheduleToggle}
              onApplyPresetTasks={handleApplyPresetSchedule}
            />

            {/* ردیف پایین: اولویت‌ها و اهداف کنار هم */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
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

            {/* Bottom Full-Width Card: درس‌هایی که امروز گرفتم */}
            <LessonsCard
              lessons={plannerData.lessons}
              onChange={(lessons) => setPlannerData((prev) => ({ ...prev, lessons }))}
            />
          </div>
        )}

        {/* TAB 2: PRO HABIT OS (DEDICATED ADVANCED HABIT TRACKER - MATRIX ONLY) */}
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

        {/* TAB 3: ANALYTICS & INSIGHTS */}
        {activeTab === 'analytics' && (
          <div className="animate-fadeIn">
            <AnalyticsPage
              habits={habits}
              plannerData={plannerData}
              todayKey={dateKey}
            />
          </div>
        )}

          {/* Footer */}
          <Footer />
        </main>
      </div>

      {/* Modals */}
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
