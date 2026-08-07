import React from 'react';
import type { Habit } from '../../types/habits';
import { HabitWeeklyMatrix } from './HabitWeeklyMatrix';
import { playTickSound, playSuccessSound } from '../../utils/audio';

interface HabitTrackerPageProps {
  habits: Habit[];
  todayKey: string;
  onUpdateHabits: (habits: Habit[]) => void;
  soundEnabled: boolean;
}

const HabitTrackerPageComponent: React.FC<HabitTrackerPageProps> = ({
  habits,
  onUpdateHabits,
  soundEnabled,
}) => {
  const handleToggleHistoryDate = (habitId: string, dateKey: string) => {
    playTickSound(soundEnabled);
    const updated = habits.map((h) => {
      if (h.id === habitId) {
        const isDone = !!h.history?.[dateKey]?.completed;
        const newHistory = { ...h.history };
        if (isDone) {
          delete newHistory[dateKey];
        } else {
          newHistory[dateKey] = { completed: true, value: h.targetValue || 1 };
        }
        return { ...h, history: newHistory };
      }
      return h;
    });
    onUpdateHabits(updated);
  };

  const handleDeleteHabit = (habitId: string) => {
    playTickSound(soundEnabled);
    const updated = habits.filter((h) => h.id !== habitId);
    onUpdateHabits(updated);
  };

  const handleAddHabit = (newHabit: Habit) => {
    playSuccessSound(soundEnabled);
    onUpdateHabits([...habits, newHabit]);
  };

  const handleUpdateHabitTitle = (habitId: string, name: string) => {
    const updated = habits.map((h) => (h.id === habitId ? { ...h, name } : h));
    onUpdateHabits(updated);
  };

  return (
    <div className="w-full animate-fadeIn space-y-4">
      {/* Habit Matrix only, as requested */}
      <HabitWeeklyMatrix
        habits={habits}
        onToggleCell={handleToggleHistoryDate}
        onAddHabit={handleAddHabit}
        onDeleteHabit={handleDeleteHabit}
        onUpdateHabitTitle={handleUpdateHabitTitle}
      />
    </div>
  );
};

export const HabitTrackerPage = React.memo(HabitTrackerPageComponent);
HabitTrackerPage.displayName = 'HabitTrackerPage';
