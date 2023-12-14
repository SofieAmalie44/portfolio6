
-- -----------------------------------------------------
-- Schema studie_cafe
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `studie_cafe` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `studie_cafe` ;

-- -----------------------------------------------------
-- Table `studie_cafe`.`area`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `studie_cafe`.`area` (
  `area_id` INT NOT NULL AUTO_INCREMENT,
  `area` VARCHAR(100) NULL DEFAULT NULL,
  PRIMARY KEY (`area_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 13
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `studie_cafe`.`cafes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `studie_cafe`.`cafes` (
  `cafe_id` INT NOT NULL AUTO_INCREMENT,
  `cafe_name` VARCHAR(255) NOT NULL,
  `price_level` ENUM('low', 'low-medium', 'medium', 'medium-high', 'high') NULL DEFAULT NULL,
  `noise_level` INT NULL DEFAULT NULL,
  `available_wifi` TINYINT(1) NULL DEFAULT NULL,
  `offer_food` TINYINT(1) NULL DEFAULT NULL,
  `description` VARCHAR(300) NULL DEFAULT NULL,
  `area_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`cafe_id`),
  INDEX `area_id` (`area_id` ASC) VISIBLE,
  CONSTRAINT `cafes_ibfk_1`
    FOREIGN KEY (`area_id`)
    REFERENCES `studie_cafe`.`area` (`area_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 12
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `studie_cafe`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `studie_cafe`.`users` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(100) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `postalcode` DECIMAL(10,0) NULL DEFAULT NULL,
  `phone_number` INT NULL DEFAULT NULL,
  `date_of_birth` DATE NOT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 12
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `studie_cafe`.`favorites`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `studie_cafe`.`favorites` (
  `favorite_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NULL DEFAULT NULL,
  `cafe_id` INT NULL DEFAULT NULL,
  PRIMARY KEY (`favorite_id`),
  UNIQUE INDEX `user_id` (`user_id` ASC, `cafe_id` ASC) VISIBLE,
  INDEX `cafe_id` (`cafe_id` ASC) VISIBLE,
  CONSTRAINT `favorites_ibfk_1`
    FOREIGN KEY (`user_id`)
    REFERENCES `studie_cafe`.`users` (`user_id`),
  CONSTRAINT `favorites_ibfk_2`
    FOREIGN KEY (`cafe_id`)
    REFERENCES `studie_cafe`.`cafes` (`cafe_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 41
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

