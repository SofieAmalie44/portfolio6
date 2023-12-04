-- ----------------------------------
-- Creating the studie_cafe database
-- ----------------------------------

CREATE DATABASE IF NOT EXISTS studie_cafe;

USE studie_cafe;

-- Create area table
CREATE TABLE area (
    area_id INT PRIMARY KEY AUTO_INCREMENT,
    area VARCHAR(100)
);

-- Create cafes table:
CREATE TABLE cafes (
    cafe_id INT PRIMARY KEY AUTO_INCREMENT,
    cafe_name VARCHAR(255) NOT NULL,
	price_level ENUM('low', 'low-medium', 'medium', 'medium-high', 'high' ),
    noise_level INT,
    available_wifi BOOLEAN,
    offer_food BOOLEAN,
    area_id INT,
    FOREIGN KEY (area_id) REFERENCES area(area_id)
);

-- Creating users table:
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    postalcode DECIMAL(10),
    phone_number INT,
    date_of_birth DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creating favorites table with Foreign Keys
CREATE TABLE favorites (
    favorite_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    cafe_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (cafe_id) REFERENCES cafes(cafe_id)
);

-- -------------------------------------------
-- Select all queries ------------------------
-- -------------------------------------------

SELECT * FROM area;

SELECT * FROM cafes;

SELECT * FROM favorites;

SELECT * FROM users;
        
-- -------------------------------------------
-- Inserting dummy data ----------------------
-- -------------------------------------------

-- Area data
INSERT INTO area (area)
values ("center"),
		("Nørrebro"),
        ("Nørrebro"),
        ("Center"),
        ("Østerbro"),
        ("Østerbro"),
        ("Center"),
        ("Nørrebro"),
        ("Vesterbro"),
        ("Center"),
        ("Nørrebro"),
        ("Nørrebro");
        
-- Cafe data
INSERT INTO cafes (cafe_name, price_level, noise_level, available_wifi, offer_food, area_id)
values ("Democratic Coffee", "medium-high", 3, true, false, 1),
		("The Living Room", "low-medium", 3, true, true, 2),
        ("Original Coffee", "medium", 4, true, true, 3),
        ("Atelier September", "high", 2, true, false, 4),
		("Paludan Bogcafé", "high", 3, true, true, 5),
        ("Rist Kaffebar", "medium", 2, true, false, 6),
        ("Meyers Bageri", "medium", 3, false, true, 7),
		("Coffee Collective", "medium-high", 4, true, false, 8),
		("Granola", "medium", 3, true, true, 9),
        ("Kalaset", "medium", 3, true, true, 10),
        ("Minas", "low", 3, true, true, 11);

-- Users data
INSERT INTO users (username, email, password, postalcode, phone_number, date_of_birth)
values ( "sof123", "sof@gmail.com", "password123", "2010", 12345678, "2000-10-10"),
		( "emi123", "emi@gmail.com","password123", "2020", 23456789, "2001-12-01"),
        ( "mal123", "mal@gmail.com","password123", "2022", 34567890, "2000-02-13"),
        ( "and123", "and@gmail.com","password123", "2024", 45678901, "1999-05-14"),
        ( "chr123", "chr@gmail.com","password123", "2000", 56789012, "2001-11-07"),
        ( "luc123", "luc@gmail.com","password123", "2510", 67890123, "2000-12-18"),
        ( "ras123", "ras@gmail.com","password123", "2450", 78901234, "1998-12-18"),
        ( "nat123", "nat@gmail.com","password123", "2025", 89012345, "1999-11-11"),
        ( "ben123", "ben@gmail.com","password123", "2560", 90123456, "2000-06-17"),
        ( "nic123", "nic@gmail.com","password123", "2422", 01234567, "2001-04-11");
        
-- Favorites data
INSERT INTO favorites (favorite_id, user_id, cafe_id)
values (1, 1, 1),
		(2, 9, 2),
        (3, 7, 3),
		(4, 6, 1),
		(5, 1, 6),
		(6, 2, 2),
		(7, 3, 5),
		(8, 8, 9),
		(9, 5, 7),
		(10, 2, 10),
        (11, 4, 5);
