/**
 * Drizzle schema placeholder for checkpoint 1.
 * Full tables are defined in COMMIT CHECKPOINT 2.
 */
import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';

export const _schemaBootstrap = sqliteTable('_schema_bootstrap', {
  id: integer('id').primaryKey({ autoIncrement: true }),
});
