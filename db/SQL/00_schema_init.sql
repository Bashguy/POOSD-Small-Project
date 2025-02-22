CREATE DATABASE IF NOT EXISTS ContactManager;

USE ContactManager;

CREATE TABLE IF NOT EXISTS logins (

    ID INT NOT NULL AUTO_INCREMENT,
    DateCreated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    DateLastLoggedIn DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FirstName VARCHAR(50) NOT NULL DEFAULT '',
    LastName VARCHAR(50) NOT NULL DEFAULT '',
    Logged VARCHAR(50) NOT NULL DEFAULT '',
    Pass VARCHAR(50) NOT NULL DEFAULT '',
    PRIMARY KEY (ID)

) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS contacts (

    ID INT NOT NULL AUTO_INCREMENT,
    DateCreated DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FirstName VARCHAR(50) NOT NULL DEFAULT '',
    LastName VARCHAR(50) NOT NULL DEFAULT '',
    PhoneNumber VARCHAR(50) NOT NULL DEFAULT '',
    Email VARCHAR(50) NOT NULL DEFAULT '',
    IDnum INT NOT NULL DEFAULT 0,
    PRIMARY KEY (ID)

) ENGINE = InnoDB;

INSERT INTO logins (FirstName, LastName, Logged, Pass) VALUES
('Ameer', 'Ashir', 'Ashguy', 'Aro'),
('Bameer', 'Bashir', 'Bashguy', 'Bro'),
('Cameer', 'Cashir', 'Cashguy', 'Cro');

INSERT INTO contacts (FirstName, LastName, PhoneNumber, Email, IDnum) VALUES
('Ameer', 'Ashir', '1111111111', 'shir@gmail.com', '1'),
('b', 'c', '2222222222', 'd@gmail.com', '2'),
('d', 'e', '3333333333', 'f@gmail.com', '3'),
('f', 'g', '4444444444', 'h@gmail.com', '4'),
('h', 'i', '5555555555', 'j@gmail.com', '5');