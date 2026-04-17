import type { Category } from '../hooks/useCategories';
import type { Habit } from '../hooks/useHabits';
import type { HabitLog } from '../hooks/useLogs';

export type InsightsPeriod = 'week' | 'month' | 'all';

export function parseYMD(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function formatYMD(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function enumerateDays(startKey: string, endKey: string): string[] {
  const out: string[] = [];
  const cur = parseYMD(startKey);
  const end = parseYMD(endKey);
  while (cur <= end) {
    out.push(formatYMD(new Date(cur)));
    cur.setDate(cur.getDate() + 1);
  }
  return out;
}

export function getPeriodBounds(period: InsightsPeriod): { startKey: string; endKey: string } {
  const today = new Date();
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endKey = formatYMD(end);

  if (period === 'week') {
    const start = new Date(end);
    start.setDate(start.getDate() - 6);
    return { startKey: formatYMD(start), endKey };
  }
  if (period === 'month') {
    const start = new Date(end.getFullYear(), end.getMonth(), 1);
    return { startKey: formatYMD(start), endKey };
  }
  const start = new Date(end.getFullYear(), end.getMonth() - 11, 1);
  return { startKey: formatYMD(start), endKey };
}

function sumForDay(logs: HabitLog[], habitIds: Set<number>, day: string): number {
  return logs
    .filter((l) => habitIds.has(l.habitId) && l.date === day)
    .reduce((s, l) => s + l.count, 0);
}

function shortWeekdayLabel(dateKey: string): string {
  return parseYMD(dateKey).toLocaleDateString(undefined, { weekday: 'short' });
}

function shortMonthDayLabel(dateKey: string): string {
  return parseYMD(dateKey).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function buildMonthlyBars(
  startKey: string,
  endKey: string,
  logs: HabitLog[],
  habitIds: Set<number>,
): { labels: string[]; data: number[] } {
  const start = parseYMD(startKey);
  const end = parseYMD(endKey);
  const cur = new Date(start.getFullYear(), start.getMonth(), 1);
  const endMonth = new Date(end.getFullYear(), end.getMonth(), 1);
  const labels: string[] = [];
  const data: number[] = [];
  while (cur <= endMonth) {
    const y = cur.getFullYear();
    const m = cur.getMonth() + 1;
    const prefix = `${y}-${String(m).padStart(2, '0')}`;
    labels.push(cur.toLocaleDateString(undefined, { month: 'short', year: '2-digit' }));
    const monthSum = logs
      .filter((l) => habitIds.has(l.habitId) && l.date.startsWith(prefix))
      .reduce((s, l) => s + l.count, 0);
    data.push(monthSum);
    cur.setMonth(cur.getMonth() + 1);
  }
  return { labels, data };
}

export function buildActivityBarData(
  period: InsightsPeriod,
  logs: HabitLog[],
  habitIds: Set<number>,
): { labels: string[]; data: number[] } {
  const { startKey, endKey } = getPeriodBounds(period);

  if (period === 'all') {
    return buildMonthlyBars(startKey, endKey, logs, habitIds);
  }

  const days = enumerateDays(startKey, endKey);

  if (period === 'week') {
    return {
      labels: days.map((k) => shortWeekdayLabel(k)),
      data: days.map((day) => sumForDay(logs, habitIds, day)),
    };
  }

  const maxBars = 6;
  if (days.length <= maxBars) {
    return {
      labels: days.map((k) => shortMonthDayLabel(k)),
      data: days.map((day) => sumForDay(logs, habitIds, day)),
    };
  }

  const bucketSize = Math.ceil(days.length / maxBars);
  const labels: string[] = [];
  const data: number[] = [];
  for (let i = 0; i < days.length; i += bucketSize) {
    const chunk = days.slice(i, i + bucketSize);
    const first = chunk[0]!;
    const last = chunk[chunk.length - 1]!;
    labels.push(`${shortMonthDayLabel(first)}–${shortMonthDayLabel(last)}`);
    let sum = 0;
    for (const day of chunk) {
      sum += sumForDay(logs, habitIds, day);
    }
    data.push(sum);
  }
  return { labels, data };
}

export function filterLogsForPeriod(
  logs: HabitLog[],
  habitIds: Set<number>,
  startKey: string,
  endKey: string,
): HabitLog[] {
  return logs.filter(
    (l) => habitIds.has(l.habitId) && l.date >= startKey && l.date <= endKey,
  );
}

export type PieSlice = {
  name: string;
  population: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
};

export function buildCategoryPieData(
  logs: HabitLog[],
  habits: Habit[],
  categories: Category[],
  habitIds: Set<number>,
  startKey: string,
  endKey: string,
  legendFontColor: string,
): PieSlice[] {
  const filtered = filterLogsForPeriod(logs, habitIds, startKey, endKey);
  const habitMap = new Map(habits.map((h) => [h.id, h]));
  const catTotals = new Map<number, number>();
  for (const l of filtered) {
    const h = habitMap.get(l.habitId);
    if (!h) continue;
    catTotals.set(h.categoryId, (catTotals.get(h.categoryId) ?? 0) + l.count);
  }
  return categories
    .map((c) => ({
      name: c.name,
      population: catTotals.get(c.id) ?? 0,
      color: c.colour,
      legendFontColor,
      legendFontSize: 12,
    }))
    .filter((x) => x.population > 0);
}
