CREATE TABLE `cases` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`status` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `finance_vouchers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
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
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`case_id` text NOT NULL,
	`account_number` text NOT NULL,
	`customer_name` text NOT NULL,
	`ifsc_code` text,
	`bank_name` text,
	`created_at` text NOT NULL,
	FOREIGN KEY (`case_id`) REFERENCES `cases`(`id`) ON UPDATE no action ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`statement_id` text NOT NULL,
	`date` text NOT NULL,
	`description` text NOT NULL,
	`amount` real NOT NULL,
	`category` text NOT NULL,
	`type` text NOT NULL,
	`balance` real NOT NULL,
	FOREIGN KEY (`statement_id`) REFERENCES `statements`(`id`) ON UPDATE no action ON DELETE CASCADE
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`date_joined` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);