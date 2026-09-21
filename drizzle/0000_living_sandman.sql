CREATE TABLE `attributes` (
	`id` varchar(36) NOT NULL,
	`type` enum('text','number') NOT NULL,
	`name` varchar(255) NOT NULL,
	CONSTRAINT `attributes_id` PRIMARY KEY(`id`),
	CONSTRAINT `attributes_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `attribute_options` (
	`id` int AUTO_INCREMENT NOT NULL,
	`attribute_id` varchar(36) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` varchar(255),
	`sort_order` int NOT NULL DEFAULT 0,
	CONSTRAINT `attribute_options_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `accounts` (
	`id` varchar(36) NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`userId` varchar(36) NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` timestamp(3),
	`refresh_token_expires_at` timestamp(3),
	`scope` text,
	`password` text,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `accounts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `passkeys` (
	`id` varchar(36) NOT NULL,
	`name` text,
	`public_key` text NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`credential_id` varchar(255) NOT NULL,
	`counter` int NOT NULL,
	`device_type` text NOT NULL,
	`backed_up` boolean NOT NULL,
	`transports` text,
	`created_at` timestamp(3),
	`aaguid` text,
	CONSTRAINT `passkeys_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` varchar(36) NOT NULL,
	`expires_at` timestamp(3) NOT NULL,
	`token` varchar(255) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`ip_address` text,
	`user_agent` text,
	`user_id` varchar(36) NOT NULL,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `sessions_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
CREATE TABLE `verifications` (
	`id` varchar(36) NOT NULL,
	`identifier` varchar(255) NOT NULL,
	`value` text NOT NULL,
	`expires_at` timestamp(3) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `verifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `callbacks` (
	`id` varchar(36) NOT NULL,
	`location_id` varchar(36),
	`status` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
	`name` varchar(255) NOT NULL,
	`phone_number` varchar(19) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	CONSTRAINT `callbacks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` varchar(36) NOT NULL,
	`parent_id` varchar(36),
	`slug` varchar(255) NOT NULL,
	`name` varchar(255) NOT NULL,
	`image` varchar(512) NOT NULL,
	`sort_order` int NOT NULL DEFAULT 0,
	`active` boolean NOT NULL DEFAULT true,
	`seo_title` varchar(50) NOT NULL,
	`seo_description` varchar(120) NOT NULL,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `locations` (
	`id` varchar(36) NOT NULL,
	`value` varchar(100) NOT NULL,
	`name` varchar(100) NOT NULL,
	`phone_number` varchar(19) NOT NULL,
	`main` boolean NOT NULL DEFAULT false,
	CONSTRAINT `locations_id` PRIMARY KEY(`id`),
	CONSTRAINT `locations_value_unique` UNIQUE(`value`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(36) NOT NULL,
	`role` enum('user','manager') NOT NULL DEFAULT 'user',
	`phone_number` varchar(19),
	`phone_number_verified` boolean NOT NULL DEFAULT false,
	`email` varchar(255) NOT NULL,
	`email_verified` boolean NOT NULL DEFAULT false,
	`name` varchar(255) NOT NULL,
	`image` text,
	`is_anonymous` boolean NOT NULL DEFAULT false,
	`created_at` timestamp(3) NOT NULL DEFAULT (now()),
	`updated_at` timestamp(3) NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_phone_number_unique` UNIQUE(`phone_number`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `attribute_options` ADD CONSTRAINT `attribute_options_attribute_id_attributes_id_fk` FOREIGN KEY (`attribute_id`) REFERENCES `attributes`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `accounts` ADD CONSTRAINT `accounts_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `passkeys` ADD CONSTRAINT `passkeys_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `sessions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `callbacks` ADD CONSTRAINT `callbacks_location_id_locations_id_fk` FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `categories` ADD CONSTRAINT `fk_category_parent_id` FOREIGN KEY (`parent_id`) REFERENCES `categories`(`id`) ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `attribute_option_attribute_id_sort_order_idx` ON `attribute_options` (`attribute_id`,`sort_order`);--> statement-breakpoint
CREATE INDEX `account_user_id_idx` ON `accounts` (`userId`);--> statement-breakpoint
CREATE INDEX `passkey_user_id_idx` ON `passkeys` (`user_id`);--> statement-breakpoint
CREATE INDEX `passkey_credential_id_idx` ON `passkeys` (`credential_id`);--> statement-breakpoint
CREATE INDEX `session_user_id_idx` ON `sessions` (`user_id`);--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verifications` (`identifier`);--> statement-breakpoint
CREATE INDEX `category_parent_id_sort_order_idx` ON `categories` (`parent_id`,`sort_order`);