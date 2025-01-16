const { sqliteTable, text, real } = require("drizzle-orm/sqlite-core");
const { statements } = require("./Statement");

const transactions = sqliteTable("transactions", {
  id: text("id").primaryKey().notNull(),
  statementId: text("statement_id")
  .notNull()
  .references(() => statements.id, { onDelete: "CASCADE" }),
  date: text("date").notNull(),
  description: text("description").notNull(),
  amount: real("amount").notNull(),
  category: text("category").notNull(),
  type: text("type").notNull(),
});

module.exports = { transactions };