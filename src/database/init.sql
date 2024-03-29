DROP DATABASE IF EXISTS HexEditor;
CREATE DATABASE HexEditor;
USE HexEditor;

CREATE TABLE User(
    id          INT UNSIGNED AUTO_INCREMENT,
    username    VARCHAR(25) UNIQUE NOT NULL,
    password    CHAR(43) NOT NULL,
    admin       BOOL DEFAULT FALSE
    PRIMARY KEY (id)
);