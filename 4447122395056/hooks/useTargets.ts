import { useCallback, useEffect, useState } from 'react';

export type Target = {
  id: number;
  habitId: number | null;
  userId: number;
  type: 'weekly' | 'monthly';
  goal: number;
  categoryId: number | null;
};

export function useTargets(_userId: number) {
  const [targets, setTargets] = useState<Target[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    setTargets([]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addTarget = useCallback(async (_target: Omit<Target, 'id'>) => {
    await refresh();
  }, [refresh]);

  const deleteTarget = useCallback(async (_id: number) => {
    await refresh();
  }, [refresh]);

  return { targets, addTarget, deleteTarget, refresh, loading };
}
