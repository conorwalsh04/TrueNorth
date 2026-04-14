import { useCallback, useEffect, useState } from 'react';

export type Habit = {
  id: number;
  name: string;
  description: string | null;
  categoryId: number;
  userId: number;
  createdAt: string;
};

export function useHabits(_userId: number) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    setHabits([]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addHabit = useCallback(async (_habit: Omit<Habit, 'id' | 'createdAt'>) => {
    await refresh();
  }, [refresh]);

  const updateHabit = useCallback(async (_id: number, _updates: Partial<Habit>) => {
    await refresh();
  }, [refresh]);

  const deleteHabit = useCallback(async (_id: number) => {
    await refresh();
  }, [refresh]);

  return { habits, addHabit, updateHabit, deleteHabit, refresh, loading };
}
