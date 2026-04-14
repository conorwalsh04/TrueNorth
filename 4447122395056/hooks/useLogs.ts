import { useCallback, useEffect, useState } from 'react';

export type HabitLog = {
  id: number;
  habitId: number;
  date: string;
  count: number;
  notes: string | null;
  completed: number;
};

export function useLogs(_habitId?: number) {
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    setLogs([]);
    setLoading(false);
  }, [_habitId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addLog = useCallback(async (_log: Omit<HabitLog, 'id'>) => {
    await refresh();
  }, [refresh]);

  const updateLog = useCallback(async (_id: number, _updates: Partial<HabitLog>) => {
    await refresh();
  }, [refresh]);

  return { logs, addLog, updateLog, refresh, loading };
}
