const { sqliteTable, text, real } = require("drizzle-orm/sqlite-core");
const { transactions } = require("./Transactions");

export const finance_vouchers = sqliteTable("finance_vouchers", {
  id: text("id").primaryKey().notNull(),
  companyName: text("company_name").notNull(),
  date: text("date").notNull(),
  effectiveDate: text("effective_date").notNull(),
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