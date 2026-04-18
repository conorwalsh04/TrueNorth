import type { HabitLog } from '../hooks/useLogs';
import {
  buildActivityBarData,
  enumerateDays,
  formatYMD,
  parseYMD,
} from '../utils/insightsData';

describe('insightsData', () => {
  it('enumerateDays is inclusive', () => {
    expect(enumerateDays('2026-01-01', '2026-01-03')).toEqual([
      '2026-01-01',
      '2026-01-02',
      '2026-01-03',
    ]);
  });

  it('parseYMD and formatYMD round-trip', () => {
    expect(formatYMD(parseYMD('2024-06-15'))).toBe('2024-06-15');
  });

  it('buildActivityBarData week yields seven bars for empty logs', () => {
    const habitIds = new Set([1]);
    const { labels, data } = buildActivityBarData('week', [] as HabitLog[], habitIds);
    expect(labels).toHaveLength(7);
    expect(data).toHaveLength(7);
    expect(data.every((n) => n === 0)).toBe(true);
  });
});
