const { sqliteTable, text, integer } = require("drizzle-orm/sqlite-core");
const { users } = require("./User");

export const cases = sqliteTable("cases", {
  id: text("id").primaryKey().notNull(), // String-based primary key
  // title: text("title").notNull(), // Case title
  // description: text("description"), // Optional case description
  userId: integer("user_id") // Foreign key referencing users.id
    .notNull()
    .references(() => users.id, { onDelete: "CASCADE" }),
  status: text("status").notNull(),
  createdAt: integer("created_at").notNull(), // Timestamp of creation
});