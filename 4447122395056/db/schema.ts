import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  createdAt: text('created_at').notNull(),
});

export const categories = sqliteTable('categories', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  colour: text('colour').notNull(),
  icon: text('icon').notNull(),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
});

export const habits = sqliteTable('habits', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  description: text('description'),
  categoryId: integer('category_id')
    .notNull()
    .references(() => categories.id),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  createdAt: text('created_at').notNull(),
});

export const habitLogs = sqliteTable('habit_logs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  habitId: integer('habit_id')
    .notNull()
    .references(() => habits.id),
  date: text('date').notNull(),
  count: integer('count').notNull().default(1),
  notes: text('notes'),
  completed: integer('completed').notNull().default(1),
});

export const targets = sqliteTable('targets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  habitId: integer('habit_id').references(() => habits.id),
  userId: integer('user_id')
    .notNull()
    .references(() => users.id),
  type: text('type').notNull(),
  goal: integer('goal').notNull(),
  categoryId: integer('category_id'),
});
