import { asc, eq } from 'drizzle-orm';
import { useCallback, useEffect, useState } from 'react';
import { db } from '../db/client';
import { categories } from '../db/schema';

export type Category = {
  id: number;
  name: string;
  colour: string;
  icon: string;
  userId: number;
};

type CategoryInput = {
  name: string;
  colour: string;
  icon: string;
  userId: number;
};

export function useCategories(userId: number) {
  const [categoriesState, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!userId) {
      setCategories([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const rows = await db
        .select()
        .from(categories)
        .where(eq(categories.userId, userId))
        .orderBy(asc(categories.name));
      setCategories(rows);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const addCategory = useCallback(
    async (category: CategoryInput) => {
      await db.insert(categories).values(category);
      await refresh();
    },
    [refresh],
  );

  const updateCategory = useCallback(
    async (id: number, updates: Partial<CategoryInput>) => {
      await db.update(categories).set(updates).where(eq(categories.id, id));
      await refresh();
    },
    [refresh],
  );

  const deleteCategory = useCallback(
    async (id: number) => {
      await db.delete(categories).where(eq(categories.id, id));
      await refresh();
    },
    [refresh],
  );

  return {
    categories: categoriesState,
    addCategory,
    updateCategory,
    deleteCategory,
    refresh,
    loading,
  };
}
