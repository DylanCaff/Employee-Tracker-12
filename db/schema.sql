DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

CREATE TABLE department (
    id: INT PRIMARY KEY AUTO_INCREMENT,
    name: VARCHAR(30) NOT NULL
);