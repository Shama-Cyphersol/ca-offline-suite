// src/db/schema.js
const { sqliteTable, text, integer } = require("drizzle-orm/sqlite-core");

// Users table
const users = sqliteTable("users", {
  id: integer("id").primaryKey().notNull(),
  name: text("name").notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  dateJoined: text("date_joined").notNull(),
});

module.exports = { users };
