import { desc, eq } from 'drizzle-orm';
import { useCallback, useEffect, useState } from 'react';
import { db } from '../db/client';
import { habitLogs } from '../db/schema';

export type HabitLog = {
  id: number;
  habitId: number;
  date: string;
  count: number;
  notes: string | null;
  completed: number;
};

type HabitLogInput = {
  habitId: number;
  date: string;
  count: number;
  notes: string | null;
  completed: number;
};

export function useLogs(habitId?: number) {
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const query = db.select().from(habitLogs);
      const rows = habitId
        ? await query.where(eq(habitLogs.habitId, habitId)).orderBy(desc(habitLogs.date))
        : await query.orderBy(desc(habitLogs.date));
      setLogs(rows);
    } finally {
      setLoading(false);
    }
  }, [habitId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addLog = useCallback(
    async (log: HabitLogInput) => {
      await db.insert(habitLogs).values(log);
      await refresh();
    },
    [refresh],
  );

  const updateLog = useCallback(
    async (id: number, updates: Partial<HabitLogInput>) => {
      await db.update(habitLogs).set(updates).where(eq(habitLogs.id, id));
      await refresh();
    },
    [refresh],
  );

  return { logs, addLog, updateLog, refresh, loading };
}
