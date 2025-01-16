const { sqliteTable, text, integer, real } = require("drizzle-orm/sqlite-core");
const { cases } = require("./Cases");

const statements = sqliteTable("statements", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  caseId: text("case_id")
    .notNull()
    .references(() => cases.id, { onDelete: "CASCADE" }),
  accountNumber: text("account_number").notNull(),
  customerName: text("customer_name").notNull(),
  ifscCode: text("ifsc_code"),
  bankName: text("bank_name"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

module.exports = { statements };
