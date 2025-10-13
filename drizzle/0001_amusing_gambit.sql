CREATE TABLE `sales` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`hash` text(36) NOT NULL,
	`customer_id` text(36) NOT NULL,
	`combo_id` text(36),
	`combo_name` text(256),
	`product_id` text(36) NOT NULL,
	`product_name` text(256) NOT NULL,
	`product_unit` text(36) NOT NULL,
	`payment_method` text(36) NOT NULL,
	`product_unit_sell_price` real NOT NULL,
	`quantity` real NOT NULL,
	`total_amount` real NOT NULL,
	`sale_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
