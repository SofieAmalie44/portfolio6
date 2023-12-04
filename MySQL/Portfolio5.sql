USE myDB;


-- Createing cafes table:
CREATE TABLE cafes (
    cafe_id INT PRIMARY KEY AUTO_INCREMENT,
    cafe_name VARCHAR(255) NOT NULL,
    city VARCHAR(100),
	price_level VARCHAR(50),
    noice_level INT
);

SELECT *
FROM cafes;


-- Creating users table:
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    postalcode DECIMAL(10),
    age DECIMAL(3)
);

SELECT *
FROM users;

ALTER TABLE users
ADD age DECIMAL(3);

UPDATE users
SET age = 22
WHERE user_id = 10;

INSERT INTO users
values (1, "sof123", "sof@gmail.com", "2010", 12345678),
		(2, "emi123", "emi@gmail.com", "2020", 23456789),
        (3, "mal123", "mal@gmail.com", "2022", 34567890),
        (4, "and123", "and@gmail.com", "2024", 45678901),
        (5, "chr123", "chr@gmail.com", "2000", 56789012),
        (6, "luc123", "luc@gmail.com", "2510", 67890123),
        (7, "ras123", "ras@gmail.com", "2450", 78901234),
        (8, "nat123", "nat@gmail.com", "2025", 89012345),
        (9, "ben123", "ben@gmail.com", "2560", 90123456),
        (10, "nic123", "nic@gmail.com", "2422", 01234567);

-- Creating favorites table with Foreign Keys
CREATE TABLE favorites (
    favorite_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    cafe_id INT,
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (cafe_id) REFERENCES cafes(cafe_id)
);


SELECT *
FROM favorites;


INSERT INTO favorites 
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
        