CREATE TABLE `items` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`image` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `pointItems` (
	`id` integer PRIMARY KEY NOT NULL,
	`pointId` integer NOT NULL,
	`itemId` integer NOT NULL,
	FOREIGN KEY (`pointId`) REFERENCES `points`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`itemId`) REFERENCES `items`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `points` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`image` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`latitude` real NOT NULL,
	`longitude` real NOT NULL,
	`city` text NOT NULL,
	`uf` text(2) NOT NULL
);
