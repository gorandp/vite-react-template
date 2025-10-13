CREATE TABLE `products` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`name` text(256) NOT NULL,
	`primary_products` text(256) NOT NULL,
	`unit` text(36) NOT NULL,
	`active` integer DEFAULT 1 NOT NULL,
	`buy_price` real NOT NULL,
	`sell_price` real NOT NULL,
	`profit_margin` real DEFAULT 0 NOT NULL,
	`stock` real DEFAULT 0 NOT NULL,
	`last_update` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `products_price_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product_id` text(36) NOT NULL,
	`buy_price` real NOT NULL,
	`sell_price` real NOT NULL,
	`profit_margin` real DEFAULT 0 NOT NULL,
	`inserted_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`name` text(64) NOT NULL,
	`email` text(128) NOT NULL,
	`password_hash` text(256) NOT NULL,
	`roles` text(32) DEFAULT 'user' NOT NULL,
	`active` integer DEFAULT 1 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`last_update` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`last_login` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);