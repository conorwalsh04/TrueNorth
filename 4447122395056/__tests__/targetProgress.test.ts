import { progressForTarget, startOfMonthISO, startOfWeekISO } from '../utils/targetProgress';

describe('targetProgress', () => {
  it('computes ratio for global target from habit logs in period', () => {
    const target = {
      habitId: null as number | null,
      type: 'weekly' as const,
      categoryId: null as number | null,
      goal: 10,
    };
    const habits = [
      { id: 1, categoryId: 1 },
      { id: 2, categoryId: 1 },
    ];
    const weekStart = startOfWeekISO();
    const logs = [
      { habitId: 1, date: weekStart, count: 4, id: 1, notes: null, completed: 1 },
      { habitId: 2, date: weekStart, count: 6, id: 2, notes: null, completed: 1 },
    ];
    const { count, ratio } = progressForTarget(target, logs, habits, weekStart, weekStart, startOfMonthISO());
    expect(count).toBe(10);
    expect(ratio).toBe(1);
  });
});
