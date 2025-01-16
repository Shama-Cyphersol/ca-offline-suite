PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_cases` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`status` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE CASCADE
);
--> statement-breakpoint
INSERT INTO `__new_cases`("id", "user_id", "status", "created_at") SELECT "id", "user_id", "status", "created_at" FROM `cases`;--> statement-breakpoint
DROP TABLE `cases`;--> statement-breakpoint
ALTER TABLE `__new_cases` RENAME TO `cases`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_finance_vouchers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`company_name` text NOT NULL,
	`date` integer NOT NULL,
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
INSERT INTO `__new_finance_vouchers`("id", "company_name", "date", "effective_date", "bill_reference", "dr_ledger", "cr_ledger", "amount", "voucher_type", "narration", "status", "transaction_id") SELECT "id", "company_name", "date", "effective_date", "bill_reference", "dr_ledger", "cr_ledger", "amount", "voucher_type", "narration", "status", "transaction_id" FROM `finance_vouchers`;--> statement-breakpoint
DROP TABLE `finance_vouchers`;--> statement-breakpoint
ALTER TABLE `__new_finance_vouchers` RENAME TO `finance_vouchers`;--> statement-breakpoint
CREATE TABLE `__new_statements` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`case_id` text NOT NULL,
	`account_number` text NOT NULL,
	`customer_name` text NOT NULL,
	`ifsc_code` text,
	`bank_name` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON UPDATE no action ON DELETE CASCADE
);
--> statement-breakpoint
INSERT INTO `__new_statements`("id", "case_id", "account_number", "customer_name", "ifsc_code", "bank_name", "created_at") SELECT "id", "case_id", "account_number", "customer_name", "ifsc_code", "bank_name", "created_at" FROM `statements`;--> statement-breakpoint
DROP TABLE `statements`;--> statement-breakpoint
ALTER TABLE `__new_statements` RENAME TO `statements`;--> statement-breakpoint
CREATE TABLE `__new_transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`statement_id` text NOT NULL,
	`date` integer NOT NULL,
	`description` text NOT NULL,
	`amount` real NOT NULL,
	`category` text NOT NULL,
	`type` text NOT NULL,
	`balance` real NOT NULL,
	FOREIGN KEY (`statement_id`) REFERENCES `statements`(`id`) ON UPDATE no action ON DELETE CASCADE
);
--> statement-breakpoint
INSERT INTO `__new_transactions`("id", "statement_id", "date", "description", "amount", "category", "type", "balance") SELECT "id", "statement_id", "date", "description", "amount", "category", "type", "balance" FROM `transactions`;--> statement-breakpoint
DROP TABLE `transactions`;--> statement-breakpoint
ALTER TABLE `__new_transactions` RENAME TO `transactions`;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`date_joined` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "name", "email", "password", "date_joined") SELECT "id", "name", "email", "password", "date_joined" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);