import React, { useState, Suspense, lazy } from 'react';
import { TopNavTabs } from './components/layout';
import type { MainTabType } from './components/layout';
import { Header, Footer } from './components/layout';
import { DateSection, PrioritiesCard, GoalsCard, ScheduleCard, LessonsCard } from './components/planner';
import { CalendarModal, TemplatesModal, HistoryModal } from './components/modals';
import { useJalaliNavigation } from './hooks/useJalaliNavigation';
import { useHabits } from './hooks/useHabits';
import { usePlannerData } from './hooks/usePlannerData';
import { ErrorBoundary } from './components/ErrorBoundary';

// بهینه‌سازی نهایی لپ‌تاپ: صفحات سنگین به‌صورت lazy بارگذاری می‌شوند — ظاهر بدون تغییر، فقط پرفورمنس بهتر
const HabitTrackerPage = lazy(() =>
  import('./components/habits/HabitTrackerPage').then((m) => ({ default: m.HabitTrackerPage }))
);
const AnalyticsPage = lazy(() =>
  import('./components/analytics/AnalyticsPage').then((m) => ({ default: m.AnalyticsPage }))
);

const PageFallback: React.FC = () => (
  <div className="surface-card p-8 text-center animate-fadeIn">
    <div className="w-8 h-8 border-3 border-purple-500/30 border-t-purple-400 rounded-full animate-spin mx-auto mb-3" />
    <p className="text-sm text-purple-200/80">در حال بارگذاری بخش...</p>
  </div>
);

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<MainTabType>('planner');
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTemplatesOpen, setIsTemplatesOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const navigation = useJalaliNavigation(soundEnabled);
  const { habits, setHabits } = useHabits();

  const planner = usePlannerData({
    dateKey: navigation.dateKey,
    currentJy: navigation.currentJy,
    currentJm: navigation.currentJm,
    currentJd: navigation.currentJd,
    currentDayName: navigation.currentDayName,
    soundEnabled,
    habits,
    setHabits,
    setCurrentDateFromImport: navigation.setDateFromImport,
  });

  return (
    <ErrorBoundary>
      <div className="app-shell text-purple-100 selection:bg-purple-500 selection:text-white">
        <div className="fixed top-10 right-10 w-96 h-96 bg-purple-700/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
        <div className="fixed bottom-10 left-10 w-96 h-96 bg-indigo-700/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

        <div className="app-content">
          <TopNavTabs activeTab={activeTab} onChangeTab={setActiveTab} />

          <main className="app-frame p-4 sm:p-6 md:p-8 print-container relative">
            <Header
              onPrint={planner.handlePrint}
              onReset={planner.handleResetDay}
              onOpenHistory={() => setIsHistoryOpen(true)}
              onOpenCalendarModal={() => setIsCalendarOpen(true)}
              onOpenTemplates={() => setIsTemplatesOpen(true)}
              onExportJSON={planner.handleExportJSON}
              onImportJSON={planner.handleImportJSON}
              soundEnabled={soundEnabled}
              onToggleSound={() => setSoundEnabled(!soundEnabled)}
              completionPercentage={planner.completionStats.percent}
            />

            {activeTab === 'planner' && (
              <div className="space-y-6 animate-fadeIn">
                <DateSection
                  selectedDayOfWeek={planner.plannerData.selectedDayOfWeek}
                  onSelectDayOfWeek={navigation.handleSelectDayOfWeek}
                  dateText={planner.plannerData.customDateText}
                  onChangeDateText={planner.handleChangeDateText}
                  onPreviousDay={navigation.handlePreviousDay}
                  onNextDay={navigation.handleNextDay}
                  onGoToToday={navigation.handleGoToToday}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 items-stretch">
                  <div className="lg:col-span-5 flex flex-col gap-5 md:gap-6 justify-between">
                    <PrioritiesCard
                      priorities={planner.plannerData.priorities}
                      onChange={(priorities) => planner.setPlannerData((prev) => ({ ...prev, priorities }))}
                      onItemToggle={planner.handlePriorityToggle}
                    />

                    <GoalsCard
                      goals={planner.plannerData.goals}
                      onChange={(goals) => planner.setPlannerData((prev) => ({ ...prev, goals }))}
                      onGoalToggle={planner.handleGoalToggle}
                    />
                  </div>

                  <div className="lg:col-span-7 flex flex-col">
                    <ScheduleCard
                      schedule={planner.plannerData.schedule}
                      onChange={(schedule) => planner.setPlannerData((prev) => ({ ...prev, schedule }))}
                      onItemToggle={planner.handleScheduleToggle}
                      onApplyPresetTasks={planner.handleApplyPresetSchedule}
                    />
                  </div>
                </div>

                <LessonsCard
                  lessons={planner.plannerData.lessons}
                  onChange={(lessons) => planner.setPlannerData((prev) => ({ ...prev, lessons }))}
                />
              </div>
            )}

            {activeTab === 'habits' && (
              <div className="animate-fadeIn">
                <Suspense fallback={<PageFallback />}>
                  <HabitTrackerPage
                    habits={habits}
                    todayKey={navigation.dateKey}
                    onUpdateHabits={setHabits}
                    soundEnabled={soundEnabled}
                  />
                </Suspense>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="animate-fadeIn">
                <Suspense fallback={<PageFallback />}>
                  <AnalyticsPage habits={habits} plannerData={planner.plannerData} todayKey={navigation.dateKey} />
                </Suspense>
              </div>
            )}

            <Footer />
          </main>
        </div>

        <CalendarModal
          isOpen={isCalendarOpen}
          onClose={() => setIsCalendarOpen(false)}
          currentJy={navigation.currentJy}
          currentJm={navigation.currentJm}
          currentJd={navigation.currentJd}
          onSelectDate={navigation.handleSelectFromCalendar}
        />

        <TemplatesModal isOpen={isTemplatesOpen} onClose={() => setIsTemplatesOpen(false)} onApplyTemplate={planner.handleApplyTemplate} />

        <HistoryModal
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          onSelectDate={navigation.handleSelectHistoryDate}
          currentDateKey={navigation.dateKey}
        />
      </div>
    </ErrorBoundary>
  );
};

export default App;
