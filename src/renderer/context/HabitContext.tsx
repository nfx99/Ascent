import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Habit, HabitCompletion, validateHabit, MAX_HABITS, MAX_COMPLETIONS_PER_HABIT, HabitStats } from '../types/habit';

interface HabitContextType {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'createdAt' | 'completions' | 'updatedAt'>) => void;
  toggleHabitCompletion: (habitId: string, date: string, quantity?: number, notes?: string) => void;
  deleteHabit: (habitId: string) => void;
  archiveHabit: (habitId: string) => void;
  getHabitStats: (habitId: string) => HabitStats | null;
  error: string | null;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

const STORAGE_KEY = 'habits';

export const HabitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const savedHabits = localStorage.getItem(STORAGE_KEY);
      if (!savedHabits) return [];
      
      const parsedHabits = JSON.parse(savedHabits);
      if (!Array.isArray(parsedHabits)) {
        console.error('Invalid habits data in localStorage');
        return [];
      }
      
      // Migrate old data if needed
      return parsedHabits.map((habit: Habit) => ({
        ...habit,
        updatedAt: habit.updatedAt || habit.createdAt,
        archived: habit.archived || false,
        completions: habit.completions.map(completion => ({
          ...completion,
          completedAt: completion.completedAt || new Date(completion.date).toISOString(),
        })),
      }));
    } catch (error) {
      console.error('Error loading habits from localStorage:', error);
      return [];
    }
  });

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    } catch (error) {
      console.error('Error saving habits to localStorage:', error);
      setError('Failed to save habits. Please try again.');
    }
  }, [habits]);

  const addHabit = useCallback((habit: Omit<Habit, 'id' | 'createdAt' | 'completions' | 'updatedAt'>) => {
    setError(null);
    
    try {
      if (habits.length >= MAX_HABITS) {
        setError(`You can't create more than ${MAX_HABITS} habits.`);
        return;
      }
  
      if (habits.some(h => h.name.toLowerCase() === habit.name.toLowerCase())) {
        setError('A habit with this name already exists.');
        return;
      }
  
      const validationErrors = validateHabit(habit);
      if (validationErrors.length > 0) {
        setError(validationErrors[0].message);
        return;
      }
  
      const now = new Date().toISOString();
      const newHabit: Habit = {
        ...habit,
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: now,
        updatedAt: now,
        completions: [],
        archived: false,
      };
  
      // Use a timeout to allow any UI animations to complete before updating state
      setTimeout(() => {
        setHabits(prev => [...prev, newHabit]);
      }, 0);
    } catch (error) {
      console.error('Error adding habit:', error);
      setError('Failed to add habit. Please try again.');
    }
  }, [habits]);

  const toggleHabitCompletion = useCallback((habitId: string, date: string, quantity?: number, notes?: string) => {
    setError(null);

    if (!habitId || !date) {
      setError('Invalid habit or date.');
      return;
    }

    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        const existingCompletion = habit.completions.find(c => c.date === date);
        let newCompletions: HabitCompletion[];

        if (existingCompletion) {
          // Remove completion if it exists
          newCompletions = habit.completions.filter(c => c.date !== date);
        } else {
          // Add new completion
          if (habit.completions.length >= MAX_COMPLETIONS_PER_HABIT) {
            setError('Maximum number of completions reached for this habit.');
            return habit;
          }

          const completion: HabitCompletion = {
            date,
            completedAt: new Date().toISOString(),
          };

          if (habit.trackQuantity && typeof quantity === 'number') {
            completion.quantity = quantity;
          }

          if (notes?.trim()) {
            completion.notes = notes.trim();
          }

          newCompletions = [...habit.completions, completion];
        }

        return { 
          ...habit, 
          completions: newCompletions,
          updatedAt: new Date().toISOString(),
        };
      }
      return habit;
    }));
  }, []);

  const deleteHabit = useCallback((habitId: string) => {
    setError(null);

    if (!habitId) {
      setError('Invalid habit ID.');
      return;
    }

    setHabits(prev => {
      const habitExists = prev.some(h => h.id === habitId);
      if (!habitExists) {
        setError('Habit not found.');
        return prev;
      }
      return prev.filter(habit => habit.id !== habitId);
    });
  }, []);

  const archiveHabit = useCallback((habitId: string) => {
    setError(null);

    if (!habitId) {
      setError('Invalid habit ID.');
      return;
    }

    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        return {
          ...habit,
          archived: true,
          updatedAt: new Date().toISOString(),
        };
      }
      return habit;
    }));
  }, []);

  const getHabitStats = useCallback((habitId: string): HabitStats | null => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return null;

    const completions = habit.completions;
    const totalCompletions = completions.length;
    
    // Calculate streaks
    let currentStreak = 0;
    let longestStreak = 0;
    let currentCount = 0;
    
    // Sort completions by date
    const sortedDates = completions
      .map(c => new Date(c.date))
      .sort((a, b) => b.getTime() - a.getTime());

    if (sortedDates.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      let currentDate = new Date(sortedDates[0]);
      currentDate.setHours(0, 0, 0, 0);

      // Calculate current streak
      while (currentDate <= today) {
        const hasCompletion = sortedDates.some(date => 
          date.getFullYear() === currentDate.getFullYear() &&
          date.getMonth() === currentDate.getMonth() &&
          date.getDate() === currentDate.getDate()
        );

        if (hasCompletion) {
          currentCount++;
        } else {
          break;
        }

        currentDate.setDate(currentDate.getDate() - 1);
      }

      currentStreak = currentCount;
      longestStreak = currentCount;

      // Calculate longest streak
      currentCount = 0;
      for (let i = 0; i < sortedDates.length - 1; i++) {
        const date1 = sortedDates[i];
        const date2 = sortedDates[i + 1];
        const diffDays = Math.round((date1.getTime() - date2.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          currentCount++;
          longestStreak = Math.max(longestStreak, currentCount);
        } else {
          currentCount = 0;
        }
      }
    }

    // Calculate completion rate
    const daysSinceCreation = Math.ceil(
      (new Date().getTime() - new Date(habit.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );
    const completionRate = (totalCompletions / daysSinceCreation) * 100;

    // Calculate quantity stats if applicable
    let averageQuantity: number | undefined;
    let totalQuantity: number | undefined;

    if (habit.trackQuantity) {
      const quantities = completions
        .map(c => c.quantity)
        .filter((q): q is number => typeof q === 'number');

      if (quantities.length > 0) {
        totalQuantity = quantities.reduce((sum, q) => sum + q, 0);
        averageQuantity = totalQuantity / quantities.length;
      }
    }

    return {
      totalCompletions,
      currentStreak,
      longestStreak,
      completionRate,
      averageQuantity,
      totalQuantity,
      lastCompletionDate: completions.length > 0 ? completions[completions.length - 1].date : undefined,
    };
  }, [habits]);

  const value = React.useMemo(() => ({
    habits,
    addHabit,
    toggleHabitCompletion,
    deleteHabit,
    archiveHabit,
    getHabitStats,
    error,
  }), [habits, addHabit, toggleHabitCompletion, deleteHabit, archiveHabit, getHabitStats, error]);

  return (
    <HabitContext.Provider value={value}>
      {children}
    </HabitContext.Provider>
  );
};

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error('useHabits must be used within a HabitProvider');
  }
  return context;
}; 