CREATE TABLE `cases` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`status` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `finance_vouchers` (
	`id` text PRIMARY KEY NOT NULL,
	`company_name` text NOT NULL,
	`date` text NOT NULL,
	`effective_date` text NOT NULL,
	`bill_reference` text NOT NULL,
	`dr_ledger` text NOT NULL,
	`cr_ledger` text NOT NULL,
	`amount` real NOT NULL,
	`voucher_type` text NOT NULL,
	`narration` text,
	`status` text NOT NULL,
	`transaction_id` text NOT NULL,
	FOREIGN KEY (`transaction_id`) REFERENCES `transactions`(`id`) ON UPDATE no action ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `statements` (
	`id` text PRIMARY KEY NOT NULL,
	`case_id` text NOT NULL,
	`account_number` text NOT NULL,
	`customer_name` text NOT NULL,
	`ifsc_code` text,
	`bank_name` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON UPDATE no action ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `trade_vouchers` (
	`id` text PRIMARY KEY NOT NULL,
	`company_name` text NOT NULL,
	`accounting_date` text NOT NULL,
	`supplier_invoice_date` text,
	`invoice_number` text,
	`supplier_name` text NOT NULL,
	`purchase_ledger` text NOT NULL,
	`taxable_value` real NOT NULL,
	`cgst_percent` real,
	`cgst_amount` real,
	`sgst_percent` real,
	`sgst_amount` real,
	`igst_percent` real,
	`igst_amount` real,
	`total_billing_amount` real NOT NULL,
	`narration` text,
	`status` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`statement_id` text NOT NULL,
	`date` text NOT NULL,
	`description` text NOT NULL,
	`amount` real NOT NULL,
	`category` text NOT NULL,
	`type` text NOT NULL,
	FOREIGN KEY (`statement_id`) REFERENCES `statements`(`id`) ON UPDATE no action ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`date_joined` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);