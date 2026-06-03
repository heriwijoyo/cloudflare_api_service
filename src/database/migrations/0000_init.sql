-- create users table
CREATE TABLE IF NOT EXISTS `users` (
    `user_id` TEXT NOT NULL PRIMARY KEY,
    `name` TEXT NOT NULL,
    `email` TEXT NOT NULL
);

-- initialize dummy data
INSERT INTO `users` (`user_id`, `name`, `email`) VALUES
('019db4e98b8478928e527f75d01a6895', 'John Doe', 'john.doe@example.com'),
('019db4e98b947c6a90ad8c52f7c0094f', 'Jane Smith', 'jane.smith@example.com');

-- create products table
CREATE TABLE IF NOT EXISTS `products` (
    `product_id` TEXT NOT NULL PRIMARY KEY,
    `name` TEXT NOT NULL,
    `price` REAL NOT NULL
);

-- initialize dummy data
INSERT INTO `products` (`product_id`, `name`, `price`) VALUES
('019db4e98bb478928e527f75d01a6895', 'Product 1', 10.0),
('019db4e98bb478928e527f75d01a6896', 'Product 2', 20.0);

-- create orders table
CREATE TABLE IF NOT EXISTS `orders` (
    `order_id` TEXT NOT NULL PRIMARY KEY,
    `user_id` TEXT NOT NULL,
    `order_date` TEXT,
    `total_items` INTEGER NOT NULL,
    `total_amount` REAL NOT NULL
);

-- create order items table
CREATE TABLE IF NOT EXISTS `order_items` (
    `order_item_id` TEXT NOT NULL PRIMARY KEY,
    `order_id` TEXT NOT NULL,
    `product_id` TEXT NOT NULL,
    `quantity` INTEGER NOT NULL,
    `price` REAL NOT NULL
);

-- create counter table
CREATE TABLE IF NOT EXISTS `counters` (
    `counter_name` TEXT NOT NULL PRIMARY KEY,
    `counter_value` INTEGER NOT NULL
);

-- initialize dummy data
INSERT INTO `counters` (`counter_name`, `counter_value`) VALUES
('order_counter', 0);

-- create business accumulation table
CREATE TABLE IF NOT EXISTS `biz_accumulation` (
    `biz_accumulation_id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    `accumulation_key` TEXT NOT NULL,
    `accumulation_cycle` TEXT NOT NULL,
    `accumulation_cycle_id` TEXT NOT NULL,
    `accumulation_value` REAL NOT NULL
);
