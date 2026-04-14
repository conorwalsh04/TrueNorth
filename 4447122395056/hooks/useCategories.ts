import { useCallback, useEffect, useState } from 'react';

export type Category = {
  id: number;
  name: string;
  colour: string;
  icon: string;
  userId: number;
};

export function useCategories(_userId: number) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    setCategories([]);
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addCategory = useCallback(async (_category: Omit<Category, 'id'>) => {
    await refresh();
  }, [refresh]);

  const updateCategory = useCallback(async (_id: number, _updates: Partial<Category>) => {
    await refresh();
  }, [refresh]);

  const deleteCategory = useCallback(async (_id: number) => {
    await refresh();
  }, [refresh]);

  return { categories, addCategory, updateCategory, deleteCategory, refresh, loading };
}
