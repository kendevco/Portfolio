# Database Restoration Script for Portfolio
# This script helps restore the database backup to a new MySQL database

Write-Host "Portfolio Database Restoration Script" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green

# Variables
$BackupFile = "C:\Data\Dev\Fullstack\Portfolio\portfolio\public\data\db_cluster-07-08-2024@07-16-32.backup.gz"
$ExtractedFile = "C:\Data\Dev\Fullstack\Portfolio\portfolio\public\data\db_cluster-07-08-2024@07-16-32.backup.sql"
$MySQLHost = "kendev.co"
$MySQLPort = "3306"
$ExistingUser = "discordant"
$ExistingPassword = "K3nD3v!discordant"
$NewDatabase = "portfolio"
$NewUser = "portfolio"
$NewPassword = "K3nD3v!portfolio"
$NewConnectionString = "mysql://portfolio:K3nD3v!portfolio@kendev.co:3306/portfolio"

Write-Host "`nStep 1: Extract the backup file" -ForegroundColor Yellow
Write-Host "You need to extract the .gz file. Options:" -ForegroundColor White
Write-Host "- Use 7-Zip: Right-click -> 7-Zip -> Extract Here" -ForegroundColor Cyan
Write-Host "- Use PowerShell (if you have tar): tar -xzf `"$BackupFile`"" -ForegroundColor Cyan
Write-Host "- Use WinRAR or other compression tool" -ForegroundColor Cyan

Write-Host "`nStep 2: Install MySQL Client (if not installed)" -ForegroundColor Yellow
Write-Host "Download and install MySQL client from:" -ForegroundColor White
Write-Host "https://dev.mysql.com/downloads/mysql/" -ForegroundColor Cyan
Write-Host "Or use MySQL Workbench for GUI access" -ForegroundColor Cyan

Write-Host "`nStep 3: Create Database and User" -ForegroundColor Yellow
Write-Host "Run the SQL script 'restore_database.sql' using one of these methods:" -ForegroundColor White
Write-Host "Method 1 - Command Line:" -ForegroundColor Cyan
Write-Host "mysql -h $MySQLHost -P $MySQLPort -u $ExistingUser -p < restore_database.sql" -ForegroundColor Gray
Write-Host "`nMethod 2 - MySQL Workbench:" -ForegroundColor Cyan
Write-Host "1. Connect to $MySQLHost with user '$ExistingUser'" -ForegroundColor Gray
Write-Host "2. Open and execute 'restore_database.sql'" -ForegroundColor Gray

Write-Host "`nStep 4: Restore the Database" -ForegroundColor Yellow
Write-Host "After extracting the backup and creating the database:" -ForegroundColor White
Write-Host "mysql -h $MySQLHost -P $MySQLPort -u $NewUser -p $NewDatabase < `"$ExtractedFile`"" -ForegroundColor Gray

Write-Host "`nStep 5: Update .env.local" -ForegroundColor Yellow
Write-Host "Add this connection string to your .env.local file:" -ForegroundColor White
Write-Host "DATABASE_URL='$NewConnectionString'" -ForegroundColor Green

Write-Host "`nStep 6: Test the Connection" -ForegroundColor Yellow
Write-Host "Test the new database connection:" -ForegroundColor White
Write-Host "mysql -h $MySQLHost -P $MySQLPort -u $NewUser -p $NewDatabase" -ForegroundColor Gray

Write-Host "`nFiles created:" -ForegroundColor Magenta
Write-Host "- restore_database.sql (SQL commands to create database and user)" -ForegroundColor White
Write-Host "- restore_database.ps1 (this instruction script)" -ForegroundColor White

Write-Host "`nBackup file location:" -ForegroundColor Magenta
Write-Host "$BackupFile" -ForegroundColor White

Read-Host "`nPress Enter to continue..." 