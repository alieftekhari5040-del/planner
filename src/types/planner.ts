export interface PriorityItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface GoalItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface RoutineItem {
  id: string;
  title: string;
  icon: 'book' | 'play' | 'dumbbell' | 'water' | 'sleep' | 'custom';
  completed: boolean;
  detail: string;
}

export interface ScheduleItem {
  id: string;
  task: string;
  completed: boolean;
  notes?: string;
}

export interface DailyPlannerData {
  dateKey: string;
  selectedDayOfWeek: string;
  customDateText: string;
  priorities: PriorityItem[];
  goals: GoalItem[];
  routines: RoutineItem[];
  schedule: ScheduleItem[];
  lessons: string[];
  daySubtitle?: string;
  quickNotes?: string;
  mainFocus?: string;
  waterGlasses?: number; // 0 - 8 glasses
}

export type ThemeMode = 'cyber-purple' | 'matrix-cyan' | 'crimson-neon' | 'midnight-dark' | 'paper-print';
