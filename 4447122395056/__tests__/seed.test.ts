/* eslint-disable no-var -- shared Jest mock handles assigned in factory */
import { categories as mockCategoriesTable, habits as mockHabitsTable } from '../db/schema';

var mockLimit: jest.Mock;
var mockValues: jest.Mock;
var mockDb: { select: jest.Mock; insert: jest.Mock };
var mockResetHabitsFromCount: () => void;

jest.mock('../db/client', () => {
  mockLimit = jest.fn();
  mockValues = jest.fn();

  const mockFourCats = [
    { id: 1, name: 'Fitness', colour: '#E74C3C', icon: '🏃', userId: 42 },
    { id: 2, name: 'Learning', colour: '#3498DB', icon: '📚', userId: 42 },
    { id: 3, name: 'Health', colour: '#2ECC71', icon: '🥗', userId: 42 },
    { id: 4, name: 'Mindfulness', colour: '#9B59B6', icon: '🧘', userId: 42 },
  ];

  const mockSixHabits = [
    { id: 10, name: 'Morning Run', description: 'x', categoryId: 1, userId: 42, createdAt: 't' },
    { id: 11, name: 'Strength Training', description: 'x', categoryId: 1, userId: 42, createdAt: 't' },
    { id: 12, name: 'Read for 30 minutes', description: 'x', categoryId: 2, userId: 42, createdAt: 't' },
    { id: 13, name: 'Hydration goal', description: 'x', categoryId: 3, userId: 42, createdAt: 't' },
    { id: 14, name: 'Meditation', description: 'x', categoryId: 4, userId: 42, createdAt: 't' },
    { id: 15, name: 'Evening journal', description: 'x', categoryId: 4, userId: 42, createdAt: 't' },
  ];

  let habitsFromCount = 0;
  mockResetHabitsFromCount = () => {
    habitsFromCount = 0;
  };

  mockDb = {
    select: jest.fn(() => ({
      from: jest.fn((table: unknown) => {
        if (table === mockHabitsTable) {
          habitsFromCount += 1;
          if (habitsFromCount === 1) {
            return {
              where: jest.fn(() => ({
                limit: mockLimit,
              })),
            };
          }
          return {
            where: jest.fn(() => Promise.resolve(mockSixHabits)),
          };
        }
        if (table === mockCategoriesTable) {
          return {
            where: jest.fn(() => Promise.resolve(mockFourCats)),
          };
        }
        return {
          where: jest.fn(() => Promise.resolve([])),
        };
      }),
    })),
    insert: jest.fn(() => ({
      values: mockValues,
    })),
  };

  return { db: mockDb };
});

import { seedIfEmpty } from '../db/seed';

describe('seedIfEmpty', () => {
  beforeEach(() => {
    mockResetHabitsFromCount();
    jest.clearAllMocks();
    mockValues.mockResolvedValue(undefined);
  });

  it('inserts into categories, habits, habit_logs, and targets when no habits exist', async () => {
    mockLimit.mockResolvedValueOnce([]);

    await seedIfEmpty(42);

    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockValues).toHaveBeenCalled();

    const payloads = mockValues.mock.calls.map((call) => call[0]);
    const categoriesPayload = payloads.find(
      (p) => Array.isArray(p) && p.length === 4 && p[0]?.name === 'Fitness',
    );
    const habitsPayload = payloads.find(
      (p) => Array.isArray(p) && p.length === 6 && p[0]?.name === 'Morning Run',
    );
    const logsPayload = payloads.find((p) => Array.isArray(p) && p.length === 84);
    const targetsPayload = payloads.find(
      (p) => Array.isArray(p) && p.length === 5 && p[0]?.type === 'weekly',
    );

    expect(categoriesPayload).toBeTruthy();
    expect(habitsPayload).toBeTruthy();
    expect(logsPayload).toBeTruthy();
    expect(targetsPayload).toBeTruthy();
  });

  it('returns early without inserting when habits already exist for the user', async () => {
    mockLimit.mockResolvedValueOnce([{ id: 1 }]);

    await seedIfEmpty(7);

    expect(mockDb.insert).not.toHaveBeenCalled();
    expect(mockValues).not.toHaveBeenCalled();
  });
});
