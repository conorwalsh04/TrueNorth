import { eq } from 'drizzle-orm';
import { db } from './client';
import { categories, habitLogs, habits, targets } from './schema';

function formatYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export async function seedIfEmpty(userId: number): Promise<void> {
  const existing = await db.select().from(habits).where(eq(habits.userId, userId)).limit(1);
  if (existing.length > 0) {
    return;
  }

  const createdAt = new Date().toISOString();

  await db.insert(categories).values([
    { name: 'Fitness', colour: '#E74C3C', icon: '🏃', userId },
    { name: 'Learning', colour: '#3498DB', icon: '📚', userId },
    { name: 'Health', colour: '#2ECC71', icon: '🥗', userId },
    { name: 'Mindfulness', colour: '#9B59B6', icon: '🧘', userId },
  ]);

  const catRows = await db.select().from(categories).where(eq(categories.userId, userId));
  const catId = (name: string): number => {
    const row = catRows.find((c) => c.name === name);
    if (!row) {
      throw new Error(`Seed: missing category ${name}`);
    }
    return row.id;
  };

  await db.insert(habits).values([
    {
      name: 'Morning Run',
      description: 'At least 20 minutes outdoors',
      categoryId: catId('Fitness'),
      userId,
      createdAt,
    },
    {
      name: 'Strength Training',
      description: 'Lift or bodyweight session',
      categoryId: catId('Fitness'),
      userId,
      createdAt,
    },
    {
      name: 'Read for 30 minutes',
      description: 'Books or long-form articles',
      categoryId: catId('Learning'),
      userId,
      createdAt,
    },
    {
      name: 'Hydration goal',
      description: '2L water across the day',
      categoryId: catId('Health'),
      userId,
      createdAt,
    },
    {
      name: 'Meditation',
      description: '10 minutes mindfulness',
      categoryId: catId('Mindfulness'),
      userId,
      createdAt,
    },
    {
      name: 'Evening journal',
      description: 'Three gratitudes',
      categoryId: catId('Mindfulness'),
      userId,
      createdAt,
    },
  ]);

  const habitRows = await db.select().from(habits).where(eq(habits.userId, userId));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const logRows: {
    habitId: number;
    date: string;
    count: number;
    notes: string | null;
    completed: number;
  }[] = [];

  for (const habit of habitRows) {
    for (let dayIdx = 0; dayIdx < 14; dayIdx += 1) {
      const d = new Date(today);
      d.setDate(today.getDate() - (13 - dayIdx));
      const miss = (habit.id + dayIdx * 2) % 6 === 0;
      if (miss) {
        logRows.push({
          habitId: habit.id,
          date: formatYmd(d),
          count: 0,
          notes: 'Missed',
          completed: 0,
        });
      } else {
        const count = 1 + (dayIdx % 3);
        logRows.push({
          habitId: habit.id,
          date: formatYmd(d),
          count,
          notes: dayIdx % 5 === 0 ? 'Great session' : null,
          completed: 1,
        });
      }
    }
  }

  await db.insert(habitLogs).values(logRows);

  const ordered = [...habitRows].sort((a, b) => a.id - b.id);
  const first = ordered[0];
  const second = ordered[1];

  await db.insert(targets).values([
    {
      habitId: null,
      userId,
      type: 'weekly',
      goal: 18,
      categoryId: null,
    },
    {
      habitId: first.id,
      userId,
      type: 'weekly',
      goal: 6,
      categoryId: null,
    },
    {
      habitId: null,
      userId,
      type: 'monthly',
      goal: 90,
      categoryId: null,
    },
    {
      habitId: second.id,
      userId,
      type: 'monthly',
      goal: 24,
      categoryId: null,
    },
  ]);
}
