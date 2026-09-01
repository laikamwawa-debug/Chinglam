CREATE TABLE `registrations` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`parent_name` text NOT NULL,
	`child_name` text NOT NULL,
	`child_age` integer NOT NULL,
	`contact_phone` text NOT NULL,
	`contact_email` text,
	`course` text NOT NULL,
	`availability` text NOT NULL,
	`support_needs` text,
	`message` text,
	`consent` integer DEFAULT false NOT NULL,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_registrations_status` ON `registrations` (`status`);--> statement-breakpoint
CREATE INDEX `idx_registrations_created_at` ON `registrations` (`created_at`);
