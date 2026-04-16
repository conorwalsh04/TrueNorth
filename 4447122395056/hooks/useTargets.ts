import { asc, eq } from 'drizzle-orm';
import { useCallback, useEffect, useState } from 'react';
import { db } from '../db/client';
import { targets } from '../db/schema';

export type Target = {
  id: number;
  habitId: number | null;
  userId: number;
  type: 'weekly' | 'monthly';
  goal: number;
  categoryId: number | null;
};

type TargetInput = {
  habitId: number | null;
  userId: number;
  type: 'weekly' | 'monthly';
  goal: number;
  categoryId: number | null;
};

export function useTargets(userId: number) {
  const [targetsState, setTargets] = useState<Target[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) {
      setTargets([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const rows = await db
        .select()
        .from(targets)
        .where(eq(targets.userId, userId))
        .orderBy(asc(targets.type), asc(targets.goal));
      setTargets(rows as Target[]);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addTarget = useCallback(
    async (target: TargetInput) => {
      await db.insert(targets).values(target);
      await refresh();
    },
    [refresh],
  );

  const deleteTarget = useCallback(
    async (id: number) => {
      await db.delete(targets).where(eq(targets.id, id));
      await refresh();
    },
    [refresh],
  );

  return {
    targets: targetsState,
    addTarget,
    deleteTarget,
    refresh,
    loading,
  };
}
