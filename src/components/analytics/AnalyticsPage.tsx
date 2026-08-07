import React from 'react';
import type { Habit } from '../../types/habits';
import type { DailyPlannerData } from '../../types/planner';
import {
  Flame,
  BarChart3,
  Trophy,
  Target,
  CheckCircle2,
  Calendar,
  Award
} from 'lucide-react';
import {
  formatPersianNumber,
  PERSIAN_WEEKDAYS,
  getDateKey,
  getJalaliDateForOffset,
  getTodayJalali
} from '../../utils/jalali';
import { calculateHabitStats } from '../../utils/habitStorage';
import { loadPlannerData } from '../../utils/storage';

interface AnalyticsPageProps {
  habits: Habit[];
  plannerData: DailyPlannerData;
  todayKey: string;
}

const AnalyticsPageComponent: React.FC<AnalyticsPageProps> = ({
  habits,
  plannerData,
  todayKey,
}) => {
  const today = getTodayJalali();
  const currentDayIndex = PERSIAN_WEEKDAYS.indexOf(today.dayName);

  // 1. Calculate Today's Stats
  const prioritiesTotal = plannerData.priorities?.filter((p) => p.text.trim()).length || 0;
  const prioritiesDone = plannerData.priorities?.filter((p) => p.completed && p.text.trim()).length || 0;
  const prioritiesPercent = prioritiesTotal > 0 ? Math.round((prioritiesDone / prioritiesTotal) * 100) : 0;

  const goalsTotal = plannerData.goals?.filter((goal) => goal.text.trim()).length || 0;
  const goalsDone = plannerData.goals?.filter((goal) => goal.completed && goal.text.trim()).length || 0;

  const scheduleTotal = plannerData.schedule?.filter((s) => s.task.trim()).length || 0;
  const scheduleDone = plannerData.schedule?.filter((s) => s.completed && s.task.trim()).length || 0;
  const schedulePercent = scheduleTotal > 0 ? Math.round((scheduleDone / scheduleTotal) * 100) : 0;

  // بخش «اولویت امروز (عادت‌های کلیدی)» حذف شد — دیگر در آمار لحاظ نمی‌شود
  const habitsTotal = habits.length;
  const habitsDone = habits.filter((h) => h.history?.[todayKey]?.completed).length;
  const habitsPercent = habitsTotal > 0 ? Math.round((habitsDone / habitsTotal) * 100) : 0;

  const totalActions = prioritiesTotal + goalsTotal + scheduleTotal + habitsTotal;
  const totalCompleted = prioritiesDone + goalsDone + scheduleDone + habitsDone;
  const overallTodayScore = totalActions > 0 ? Math.round((totalCompleted / totalActions) * 100) : 0;

  // 2. Calculate Weekly Trend (Past 7 Days data from LocalStorage)
  const weeklyDays = PERSIAN_WEEKDAYS.map((name, idx) => {
    const diff = idx - currentDayIndex;
    const target = getJalaliDateForOffset(today.jy, today.jm, today.jd, diff);
    const key = getDateKey(target.jy, target.jm, target.jd);
    const dayData = key === plannerData.dateKey ? plannerData : loadPlannerData(key);

    // Calculate that day's score (روتین‌ها حذف شد)
    const pTotal = dayData.priorities?.filter((p) => p.text?.trim()).length || 0;
    const pDone = dayData.priorities?.filter((p) => p.completed && p.text?.trim()).length || 0;
    const gTotal = dayData.goals?.filter((goal) => goal.text?.trim()).length || 0;
    const gDone = dayData.goals?.filter((goal) => goal.completed && goal.text?.trim()).length || 0;
    const sTotal = dayData.schedule?.filter((s) => s.task?.trim()).length || 0;
    const sDone = dayData.schedule?.filter((s) => s.completed && s.task?.trim()).length || 0;

    const hDone = habits.filter((h) => h.history?.[key]?.completed).length;

    const tTotal = pTotal + gTotal + sTotal + habits.length;
    const tDone = pDone + gDone + sDone + hDone;
    const score = tTotal > 0 ? Math.min(100, Math.round((tDone / tTotal) * 100)) : 0;

    return {
      name,
      dayNum: target.jd,
      dateKey: key,
      isToday: idx === currentDayIndex,
      score,
      completedItems: tDone,
    };
  });

  // 3. Compare the planner sections — روتین‌ها حذف شد
  const sectionStats = [
    { name: 'اولویت‌ها', completed: prioritiesDone, total: prioritiesTotal, color: 'from-purple-500 to-indigo-500' },
    { name: 'هدف‌ها', completed: goalsDone, total: goalsTotal, color: 'from-rose-500 to-pink-500' },
    { name: 'برنامه‌ی امروز', completed: scheduleDone, total: scheduleTotal, color: 'from-cyan-500 to-blue-500' },
  ].map((section) => ({
    ...section,
    percent: section.total > 0 ? Math.round((section.completed / section.total) * 100) : 0,
  }));

  // 4. Streaks Leaderboard
  const sortedHabits = [...habits].sort((a, b) => {
    const sA = calculateHabitStats(a, todayKey);
    const sB = calculateHabitStats(b, todayKey);
    return sB.currentStreak - sA.currentStreak;
  });

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="surface-card flex flex-wrap items-center justify-between gap-3 p-4 md:p-5">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
            <span className="w-2.5 h-6 rounded-full bg-gradient-to-b from-cyan-500 to-blue-500 shadow-[0_0_12px_rgba(6,182,212,0.8)]" />
            داشبورد آمار و شاخص‌های بهره‌وری
          </h2>
          <p className="text-xs text-purple-300/80 mt-1">
            تحلیل عملکرد واقعی و الگوهای پیشرفت شما در بخش‌های مختلف برنامه
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-purple-950/70 border border-purple-500/30">
          <Calendar className="w-4 h-4 text-purple-300" />
          <span className="text-xs font-bold text-white">
            تاریخ انتخاب‌شده: {plannerData.customDateText || todayKey}
          </span>
        </div>
      </div>

      {/* 4 KPI Progress Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 md:gap-4">
        {/* Metric 1: Overall Today Score */}
        <div className="surface-card p-4 md:p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-purple-300">امتیاز کلی روز</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl md:text-4xl font-black text-white">
            {formatPersianNumber(overallTodayScore)}<span className="text-lg font-normal text-purple-300">٪</span>
          </div>
          <div className="w-full bg-purple-950 h-2 rounded-full mt-3 overflow-hidden border border-purple-500/20">
            <div
              className="bg-gradient-to-r from-purple-500 to-indigo-400 h-full transition-all duration-500"
              style={{ width: `${overallTodayScore}%` }}
            />
          </div>
          <div className="text-[10px] text-purple-400/70 mt-1.5">
            {formatPersianNumber(totalCompleted)} مورد از {formatPersianNumber(totalActions)} مورد انجام شد
          </div>
        </div>

        {/* Metric 2: Priorities Completion */}
        <div className="surface-card p-4 md:p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-purple-300">تحقق اولویت‌ها</span>
            <Target className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl md:text-4xl font-black text-rose-300">
            {formatPersianNumber(prioritiesDone)}<span className="text-sm font-normal text-purple-300"> / {formatPersianNumber(prioritiesTotal)}</span>
          </div>
          <div className="w-full bg-purple-950 h-2 rounded-full mt-3 overflow-hidden border border-purple-500/20">
            <div
              className="bg-gradient-to-r from-rose-500 to-red-400 h-full transition-all duration-500"
              style={{ width: `${prioritiesPercent}%` }}
            />
          </div>
          <div className="text-[10px] text-purple-400/70 mt-1.5">
            نرخ تحقق: {formatPersianNumber(prioritiesPercent)}٪
          </div>
        </div>

        {/* Metric 3: Habits Checked */}
        <div className="surface-card p-4 md:p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-purple-300">عادت‌های انجام‌شده</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl md:text-4xl font-black text-amber-300">
            {formatPersianNumber(habitsDone)}<span className="text-sm font-normal text-purple-300"> / {formatPersianNumber(habitsTotal)}</span>
          </div>
          <div className="w-full bg-purple-950 h-2 rounded-full mt-3 overflow-hidden border border-purple-500/20">
            <div
              className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full transition-all duration-500"
              style={{ width: `${habitsPercent}%` }}
            />
          </div>
          <div className="text-[10px] text-purple-400/70 mt-1.5">
            پیوستگی روتین‌ها: {formatPersianNumber(habitsPercent)}٪
          </div>
        </div>

        {/* Metric 4: Tasks Completed */}
        <div className="surface-card p-4 md:p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-purple-300">تسک‌های برنامه‌ی امروز</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl md:text-4xl font-black text-emerald-300">
            {formatPersianNumber(scheduleDone)}<span className="text-sm font-normal text-purple-300"> / {formatPersianNumber(scheduleTotal)}</span>
          </div>
          <div className="w-full bg-purple-950 h-2 rounded-full mt-3 overflow-hidden border border-purple-500/20">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-500"
              style={{ width: `${schedulePercent}%` }}
            />
          </div>
          <div className="text-[10px] text-purple-400/70 mt-1.5">
            تکمیل جدول: {formatPersianNumber(schedulePercent)}٪
          </div>
        </div>
      </div>

      {/* Main Visual Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Chart 1: Weekly Productivity Bar Chart (7 Days of the Week) */}
        <div className="surface-card lg:col-span-7 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                روند بهره‌وری هفته جاری (شنبه تا جمعه)
              </h3>
              <span className="text-xs text-purple-300/70">
                نرخ کل فعالیت‌های انجام‌شده
              </span>
            </div>

            {/* Visual Bar Chart */}
            <div className="grid grid-cols-7 gap-2 pt-6 pb-2 items-end min-h-[180px]">
              {weeklyDays.map((w) => (
                <div key={w.name} className="flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-purple-200">
                    {formatPersianNumber(w.score)}٪
                  </span>

                  <div className="w-full max-w-[32px] bg-purple-950/80 rounded-t-xl overflow-hidden h-36 flex items-end border border-purple-500/20 group-hover:border-purple-400 transition">
                    <div
                      className={`w-full transition-all duration-500 rounded-t-lg ${
                        w.isToday
                          ? 'bg-gradient-to-t from-purple-600 via-purple-500 to-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)]'
                          : w.score >= 70
                          ? 'bg-gradient-to-t from-emerald-600 to-teal-400'
                          : w.score > 0
                          ? 'bg-gradient-to-t from-purple-700 to-indigo-500'
                          : 'bg-purple-900/30'
                      }`}
                      style={{ height: `${Math.max(8, w.score)}%` }}
                    />
                  </div>

                  <div className="text-center">
                    <div className={`text-xs font-bold ${w.isToday ? 'text-cyan-300' : 'text-purple-300'}`}>
                      {w.name.slice(0, 4)}
                    </div>
                    <div className="text-[10px] text-purple-400/60">
                      {formatPersianNumber(w.dayNum)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-purple-500/20 flex items-center justify-between text-xs text-purple-300/70">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,1)]" />
              <span>روز جاری شما</span>
            </div>
            <span>محاسبه خودکار بر مبنای تسک‌ها و اولویت‌های هر روز</span>
          </div>
        </div>

        {/* Chart 2: Planner Sections */}
        <div className="surface-card lg:col-span-5 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-purple-400" />
                نمای کلی بخش‌های امروز
              </h3>
            </div>

            <div className="space-y-4">
              {sectionStats.map((section) => (
                <div key={section.name} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3 text-xs text-purple-200">
                    <span>{section.name}</span>
                    <strong className="text-white font-mono">
                      {formatPersianNumber(section.completed)} از {formatPersianNumber(section.total)} مورد
                    </strong>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-full border border-purple-500/20 bg-purple-950">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${section.color} transition-all duration-500`}
                      style={{ width: `${section.total > 0 ? Math.max(4, section.percent) : 0}%` }}
                    />
                  </div>
                  <div className="text-left text-[10px] text-purple-400/70">
                    {formatPersianNumber(section.percent)}٪ تکمیل
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-purple-500/20 text-[11px] text-purple-300/70">
            درصدها بر اساس مواردی محاسبه می‌شوند که برای امروز متن یا وضعیت ثبت‌شده دارند.
          </div>
        </div>
      </div>

      {/* Habit Streak Leaderboard */}
      <div className="surface-card p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="text-base sm:text-lg font-bold text-white">
              رتبه‌بندی پیوستگی عادت‌ها
            </h3>
          </div>
          <span className="text-xs text-purple-300/70">
            مرتب‌شده بر اساس روزهای متوالی پایبندی
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {sortedHabits.map((habit, rank) => {
            const stats = calculateHabitStats(habit, todayKey);
            return (
              <div
                key={habit.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#120a3a]/70 border border-purple-500/25 hover:border-purple-400/50 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-xl bg-purple-950 flex items-center justify-center text-xs font-black text-purple-300 border border-purple-500/30">
                    {formatPersianNumber(rank + 1)}
                  </div>
                  <span className="text-xl">{habit.icon}</span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate max-w-[180px]">
                      {habit.name}
                    </h4>
                    <span className="text-[10px] text-purple-400/80">
                      بهترین رکورد: {formatPersianNumber(stats.bestStreak)} روز
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-amber-400 font-bold text-xs sm:text-sm">
                    <Flame className="w-4 h-4 fill-amber-400" />
                    <span>{formatPersianNumber(stats.currentStreak)} روز</span>
                  </div>

                  <span className="text-xs px-2.5 py-1 rounded-xl bg-purple-950 font-bold text-cyan-300 border border-purple-500/30">
                    {formatPersianNumber(stats.strengthScore)}٪
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const AnalyticsPage = React.memo(AnalyticsPageComponent);
AnalyticsPage.displayName = 'AnalyticsPage';
