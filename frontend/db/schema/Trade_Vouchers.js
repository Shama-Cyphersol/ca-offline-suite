const { sqliteTable, text } = require("drizzle-orm/sqlite-core");
const { transactions } = require("./Transactions");

export const trade_vouchers = sqliteTable("trade_vouchers", {
    id: text("id").primaryKey().notNull(),
    companyName: text("company_name").notNull(),
    accountingDate: text("accounting_date").notNull(),
    supplierInvoiceDate: text("supplier_invoice_date"), // Supplier invoice date
    invoiceNumber: text("invoice_number"), // Invoice number
    supplierName: text("supplier_name").notNull(), // Supplier name
    purchaseLedger: text("purchase_ledger").notNull(), // Purchase ledger or expense head
    taxableValue: real("taxable_value").notNull(), // Taxable value
    cgstPercent: real("cgst_percent"), // CGST percentage
    cgstAmount: real("cgst_amount"), // CGST amount
    sgstPercent: real("sgst_percent"), // SGST/UTGST percentage
    sgstAmount: real("sgst_amount"), // SGST/UTGST amount
    igstPercent: real("igst_percent"), // IGST percentage
    igstAmount: real("igst_amount"), // IGST amount
    totalBillingAmount: real("total_billing_amount").notNull(), // Total billing amount
    narration: text("narration"), // Optional narration
    status: text("status").notNull(), // Status of the invoice
  });
  