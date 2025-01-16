const { sqliteTable, text, real, integer } = require("drizzle-orm/sqlite-core");
const { transactions } = require("./Transactions");

const finance_vouchers = sqliteTable("finance_vouchers", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  companyName: text("company_name").notNull(),
  date: integer("date", { mode: "timestamp" }).notNull(),
  effectiveDate: integer("effective_date",{ mode: "timestamp" }).notNull(),
  billReference: text("bill_reference").notNull(),
  drLedger: text("dr_ledger").notNull(),
  crLedger: text("cr_ledger").notNull(),
  amount: real("amount").notNull(),
  voucherType: text("voucher_type").notNull(),
  narration: text("narration"),
  status: text("status").notNull(),
  transactionId: text("transaction_id")
    .notNull()
    .references(() => transactions.id, { onDelete: "CASCADE" }),
});

module.exports = { finance_vouchers };
