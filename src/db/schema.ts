import { sql } from "drizzle-orm";
import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const tasks = pgTable("tasks", {
  id: text()
    .notNull()
    .primaryKey()
    .default(sql`uuidv7()`),
  title: text().notNull(),
  completedAt: timestamp(),
  scheduledAt: timestamp(),
  retryNumber: integer().notNull().default(0),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
