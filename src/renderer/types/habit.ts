export type HabitFrequency = 'daily' | 'weekly' | 'monthly';

export interface HabitCompletion {
  /** ISO date string (YYYY-MM-DD) */
  date: string;
  /** Optional quantity value for habits that track numbers */
  quantity?: number;
  /** Optional notes for the completion */
  notes?: string;
  /** Timestamp when this completion was recorded */
  completedAt: string;
}

export interface Habit {
  /** Unique identifier for the habit */
  id: string;
  /** Name of the habit (1-50 characters) */
  name: string;
  /** Optional description of the habit (0-200 characters) */
  description: string;
  /** How often the habit should be tracked */
  frequency: HabitFrequency;
  /** List of all completions for this habit */
  completions: HabitCompletion[];
  /** ISO timestamp when the habit was created */
  createdAt: string;
  /** Color used for the habit's UI elements (hex format) */
  color: string;
  /** Whether this habit tracks numeric quantities */
  trackQuantity: boolean;
  /** Unit for quantity tracking (1-20 characters) */
  unit?: string;
  /** Optional target value for quantity-based habits */
  target?: {
    /** The target value to achieve */
    value: number;
    /** The time period for the target */
    period: HabitFrequency;
  };
  /** Whether the habit is archived */
  archived?: boolean;
  /** Timestamp when the habit was last modified */
  updatedAt: string;
}

export interface HabitStats {
  /** Total number of completions */
  totalCompletions: number;
  /** Current streak (consecutive completions) */
  currentStreak: number;
  /** Longest streak achieved */
  longestStreak: number;
  /** Completion rate as a percentage */
  completionRate: number;
  /** Average quantity per completion (for quantity-based habits) */
  averageQuantity?: number;
  /** Total quantity accumulated (for quantity-based habits) */
  totalQuantity?: number;
  /** Last completion date */
  lastCompletionDate?: string;
}

export interface HabitValidationError {
  field: keyof Habit;
  message: string;
}

export const MAX_HABITS = 100;
export const MAX_NAME_LENGTH = 50;
export const MAX_DESCRIPTION_LENGTH = 200;
export const MAX_UNIT_LENGTH = 20;
export const MAX_COMPLETIONS_PER_HABIT = 1000;

export function validateHabit(habit: Partial<Habit>): HabitValidationError[] {
  const errors: HabitValidationError[] = [];

  if (!habit.name?.trim()) {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (habit.name.length > MAX_NAME_LENGTH) {
    errors.push({ field: 'name', message: `Name must be less than ${MAX_NAME_LENGTH} characters` });
  }

  if (habit.description && habit.description.length > MAX_DESCRIPTION_LENGTH) {
    errors.push({ field: 'description', message: `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters` });
  }

  if (habit.trackQuantity && !habit.unit?.trim()) {
    errors.push({ field: 'unit', message: 'Unit is required when tracking quantity' });
  } else if (habit.unit && habit.unit.length > MAX_UNIT_LENGTH) {
    errors.push({ field: 'unit', message: `Unit must be less than ${MAX_UNIT_LENGTH} characters` });
  }

  if (habit.target) {
    if (habit.target.value <= 0) {
      errors.push({ field: 'target', message: 'Target value must be greater than 0' });
    }
    if (!['daily', 'weekly', 'monthly'].includes(habit.target.period)) {
      errors.push({ field: 'target', message: 'Invalid target period' });
    }
  }

  return errors;
} 