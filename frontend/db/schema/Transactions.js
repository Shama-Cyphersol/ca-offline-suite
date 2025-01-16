const { sqliteTable, text, real, integer } = require("drizzle-orm/sqlite-core");
const { statements } = require("./Statement");

const transactions = sqliteTable("transactions", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  statementId: text("statement_id")
    .notNull()
    .references(() => statements.id, { onDelete: "CASCADE" }),
  date: integer("date", { mode: "timestamp" }).notNull(),
  description: text("description").notNull(),
  amount: real("amount").notNull(),
  category: text("category").notNull(),
  type: text("type").notNull(),
  balance: real("balance").notNull(),
});

module.exports = { transactions };
