import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schema';

const expo = openDatabaseSync('tasks.db');

expo.execSync(
  `CREATE TABLE IF NOT EXISTS _schema_bootstrap (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL
  );`,
);

export const db = drizzle(expo, { schema });
