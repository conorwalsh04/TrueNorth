import { asc, eq } from 'drizzle-orm';
import { useCallback, useEffect, useState } from 'react';
import { db } from '../db/client';
import { habitLogs, habits } from '../db/schema';

export type Habit = {
  id: number;
  name: string;
  description: string | null;
  categoryId: number;
  userId: number;
  createdAt: string;
};

type HabitInput = {
  name: string;
  description: string | null;
  categoryId: number;
  userId: number;
};

export function useHabits(userId: number) {
  const [habitsState, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) {
      setHabits([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const rows = await db
        .select()
        .from(habits)
        .where(eq(habits.userId, userId))
        .orderBy(asc(habits.name));
      setHabits(rows);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addHabit = useCallback(
    async (habit: HabitInput) => {
      await db.insert(habits).values({
        ...habit,
        createdAt: new Date().toISOString(),
      });
      await refresh();
    },
    [refresh],
  );

  const updateHabit = useCallback(
    async (id: number, updates: Partial<HabitInput>) => {
      await db.update(habits).set(updates).where(eq(habits.id, id));
      await refresh();
    },
    [refresh],
  );

  const deleteHabit = useCallback(
    async (id: number) => {
      await db.delete(habitLogs).where(eq(habitLogs.habitId, id));
      await db.delete(habits).where(eq(habits.id, id));
      await refresh();
    },
    [refresh],
  );

  return {
    habits: habitsState,
    addHabit,
    updateHabit,
    deleteHabit,
    refresh,
    loading,
  };
}
