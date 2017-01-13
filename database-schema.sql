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
department_id INT UNSIGNED NOT NULL AUTO_INCREMENT,
department_name VARCHAR(250) NOT NULL,
over_head_costs DECIMAL(10,2),
total_sales DECIMAL(10,2) DEFAULT 0,
PRIMARY KEY (department_id)
);

INSERT INTO products(product_name,department_name,price,stock_quantity) VALUES("Perforated Baguette Pan","Home & Kitchen",14.99,15),
("Ugly Christmas Sweater","Women's Clothing",40.00,20),
("Princess Leia Action Figure","Toys",75.00,5),
("Ironic Beard and Nose Hair Trimmer","Hipster Grooming",30.00,30),
("Weird Al's Greatest Hits","Music",15.00,40),
("Desktop Centrifuge","Industrial & Scientific", 126.99,10),
("Sloth Upcycled Vintage Art Print", "Handmade", 500.80,150),
("Octopus Upcycled Vintage Art Print", "Handmade", 26.00,150),
("Non-smoking Jacket","Men's Clothing", 125.00,50);

INSERT INTO departments(department_name,over_head_costs) VALUES
('Books',100.54),
('Costumes & Novelty',250.25),
('Handmade',200.93),
('Hipster Grooming',1000.45),
('Home & Kitchen',300.45),
('Industrial & Scientific',2000.22),
('Men\'s Clothing',500.32),
('Music',200.53),
('Toys',600.24),
('Women\'s Clothing',500.55);