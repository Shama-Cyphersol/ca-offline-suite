// src/db/schema.js
const { sqliteTable, text, integer } = require("drizzle-orm/sqlite-core");

// Users table
export const users = sqliteTable("users", {
  id: integer("id").primaryKey().notNull(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  createdAt: integer("created_at").notNull(),
});
