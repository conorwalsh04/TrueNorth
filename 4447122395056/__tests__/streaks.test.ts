import { calculateStreak } from '../utils/streaks';

describe('calculateStreak', () => {
  it('returns 0 for empty logs', () => {
    expect(calculateStreak([], 9)).toBe(0);
  });

  it('returns 0 when no logs for habit', () => {
    const logs = [{ habitId: 2, date: '2026-04-10', count: 1, completed: 1 }];
    expect(calculateStreak(logs, 1)).toBe(0);
  });

  it('returns 0 when activity is not counted (zero count and not completed)', () => {
    const logs = [{ habitId: 1, date: '2026-04-10', count: 0, completed: 0 }];
    expect(calculateStreak(logs, 1)).toBe(0);
  });

  it('counts consecutive days ending today', () => {
    jest.useFakeTimers();
    try {
      jest.setSystemTime(new Date(2026, 3, 17, 15, 0, 0));

      const dayKey = (y: number, m0: number, d: number) =>
        new Date(y, m0, d).toISOString().slice(0, 10);

      const logs = [
        { habitId: 1, date: dayKey(2026, 3, 17), count: 1, completed: 1 },
        { habitId: 1, date: dayKey(2026, 3, 16), count: 1, completed: 1 },
        { habitId: 1, date: dayKey(2026, 3, 15), count: 1, completed: 1 },
      ];

      expect(calculateStreak(logs, 1)).toBe(3);
    } finally {
      jest.useRealTimers();
    }
  });
});
