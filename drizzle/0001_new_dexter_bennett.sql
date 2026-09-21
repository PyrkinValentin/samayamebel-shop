CREATE TABLE `units` (
	`id` varchar(36) NOT NULL,
	`short_name` varchar(20) NOT NULL,
	`name` varchar(100) NOT NULL,
	CONSTRAINT `units_id` PRIMARY KEY(`id`),
	CONSTRAINT `units_short_name_unique` UNIQUE(`short_name`),
	CONSTRAINT `units_name_unique` UNIQUE(`name`)
);
