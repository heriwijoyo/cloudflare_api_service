CREATE TABLE `queue_mail_send` (
    `queue_mail_send_id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `trace_id` TEXT NOT NULL,
    `scenario` TEXT NOT NULL,
    `priority` INTEGER NOT NULL,
    `sender` TEXT NOT NULL,
    `receiver` TEXT NOT NULL,
    `template_subject` TEXT NOT NULL,
    `template_content_html` TEXT NOT NULL,
    `template_content_text` TEXT NOT NULL,
    `variables` TEXT NOT NULL,
    `status` INTEGER NOT NULL,
    `retry_count` INTEGER NOT NULL,
    `max_retry_count` INTEGER NOT NULL
);

CREATE INDEX `idx_queue_mail_send_status_priority` ON `queue_mail_send` (`status`, `priority`);