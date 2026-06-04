CREATE DATABASE MedicareInventoryDB;

USE MedicareInventoryDB;

CREATE TABLE Admins (

admin_id INT PRIMARY KEY IDENTITY(1,1),
email VARCHAR(100),
password VARCHAR(100)

);

INSERT INTO Admins VALUES('admin@gmail.com','admin123');

CREATE TABLE Medicines (

medicine_id INT PRIMARY KEY IDENTITY(1,1),
name VARCHAR(100),
batch VARCHAR(50),
expiry_date DATE,
brand VARCHAR(100),
supplier VARCHAR(100),
quantity INT

);

CREATE TABLE DispenseHistory (

id INT PRIMARY KEY IDENTITY(1,1),
medicine_name VARCHAR(100),
batch VARCHAR(50),
patient_name VARCHAR(100),
quantity INT,
dispense_date DATETIME DEFAULT GETDATE()

);