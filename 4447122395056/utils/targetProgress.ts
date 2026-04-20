import type { HabitLog } from '../hooks/useLogs';

export type TargetForProgress = {
  habitId: number | null;
  type: 'weekly' | 'monthly';
  categoryId: number | null;
  goal: number;
};

export function startOfWeekISO(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + 1;
  const monday = new Date(d.getFullYear(), d.getMonth(), diff);
  return monday.toISOString().slice(0, 10);
}

export function startOfMonthISO(): string {
  const d = new Date();
  const first = new Date(d.getFullYear(), d.getMonth(), 1);
  return first.toISOString().slice(0, 10);
}

export function progressForTarget(
  target: TargetForProgress,
  logs: HabitLog[],
  habits: { id: number; categoryId: number }[],
  today: string,
  weekStart: string,
  monthStart: string,
): { count: number; ratio: number } {
  const start = target.type === 'weekly' ? weekStart : monthStart;
  let relevantLogs = logs.filter((log) => log.date >= start && log.date <= today);

  if (target.habitId != null) {
    relevantLogs = relevantLogs.filter((log) => log.habitId === target.habitId);
  } else if (target.categoryId != null) {
    const habitIds = habits.filter((h) => h.categoryId === target.categoryId).map((h) => h.id);
    relevantLogs = relevantLogs.filter((log) => habitIds.includes(log.habitId));
  } else {
    const habitIds = habits.map((h) => h.id);
    relevantLogs = relevantLogs.filter((log) => habitIds.includes(log.habitId));
  }

  const count = relevantLogs.reduce((sum, log) => sum + log.count, 0);
  const ratio = target.goal > 0 ? count / target.goal : 0;
  return { count, ratio };
}
