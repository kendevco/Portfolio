-- Connect to MySQL server using the existing connection
-- Run this with: mysql -h kendev.co -P 3306 -u discordant -p

-- Create the new database
CREATE DATABASE IF NOT EXISTS portfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create the new user and grant privileges
CREATE USER IF NOT EXISTS 'portfolio'@'%' IDENTIFIED BY 'K3nD3v!portfolio';
GRANT ALL PRIVILEGES ON portfolio.* TO 'portfolio'@'%';

-- Also create user for localhost access if needed
CREATE USER IF NOT EXISTS 'portfolio'@'localhost' IDENTIFIED BY 'K3nD3v!portfolio';
GRANT ALL PRIVILEGES ON portfolio.* TO 'portfolio'@'localhost';

-- Flush privileges to ensure changes take effect
FLUSH PRIVILEGES;

-- Show the databases to confirm creation
SHOW DATABASES;

-- Show the user privileges
SHOW GRANTS FOR 'portfolio'@'%'; 