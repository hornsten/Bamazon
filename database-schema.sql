CREATE DATABASE Bamazon;

use Bamazon;

CREATE TABLE products (
item_id INT auto_increment NOT NULL,
product_name VARCHAR(250) NULL,
department_name VARCHAR(250) NULL,
price DECIMAL(10,2) NOT NULL DEFAULT 0,
stock_quantity INT NULL,
PRIMARY KEY (item_id)
);

CREATE TABLE departments (
department_id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY_KEY,
department_name VARCHAR(250) NOT NULL,
over_head_costs DECIMAL(10,2),
total_sales DECIMAL(10,2) DEFAULT 0
);