export type StreakLog = {
  habitId: number;
  date: string;
  count: number;
  completed: number;
};

export function calculateStreak(logs: StreakLog[], habitId: number): number {
  const relevant = logs.filter(
    (l) => l.habitId === habitId && (l.completed === 1 || l.count > 0),
  );
  if (relevant.length === 0) return 0;

  const byDate = new Map<string, boolean>();
  for (const l of relevant) {
    byDate.set(l.date, true);
  }

  const today = new Date();
  const fmt = (d: Date) => d.toISOString().slice(0, 10);

  let cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  let streak = 0;

  const has = (d: Date) => byDate.has(fmt(d));

  if (!has(cursor)) {
    cursor.setDate(cursor.getDate() - 1);
    if (!has(cursor)) {
      return 0;
    }
  }

  while (has(cursor)) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}
