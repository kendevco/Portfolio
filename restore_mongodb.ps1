# MongoDB Atlas Database Restoration Script for Portfolio
# This script helps restore the MongoDB backup to Atlas

Write-Host "Portfolio MongoDB Restoration Script" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green

# Variables
$BackupFile = "C:\Data\Dev\Fullstack\Portfolio\portfolio\public\data\db_cluster-07-08-2024@07-16-32.backup.gz"
$ExtractedDir = "C:\Data\Dev\Fullstack\Portfolio\portfolio\public\data\extracted"
$DatabaseName = "portfolio"

Write-Host "`nMongoDB Atlas Cluster Status: PAUSED" -ForegroundColor Red
Write-Host "Backup File: $BackupFile" -ForegroundColor White

Write-Host "`nOption 1: Resume Existing Cluster" -ForegroundColor Yellow
Write-Host "1. Go to your MongoDB Atlas dashboard" -ForegroundColor White
Write-Host "2. Click 'Connect' or look for 'Resume' button on Cluster0" -ForegroundColor White
Write-Host "3. Wait for cluster to resume (2-3 minutes)" -ForegroundColor White

Write-Host "`nOption 2: Create New Cluster" -ForegroundColor Yellow
Write-Host "1. In Atlas dashboard, click '+ Create' button" -ForegroundColor White
Write-Host "2. Choose 'Database' -> 'Create Cluster'" -ForegroundColor White
Write-Host "3. Select M0 (Free tier) or appropriate size" -ForegroundColor White
Write-Host "4. Name it 'portfolio-cluster'" -ForegroundColor White

Write-Host "`nStep 1: Install MongoDB Tools" -ForegroundColor Cyan
Write-Host "Download MongoDB Database Tools from:" -ForegroundColor White
Write-Host "https://www.mongodb.com/try/download/database-tools" -ForegroundColor Green
Write-Host "This includes mongorestore, mongodump, etc." -ForegroundColor Gray

Write-Host "`nStep 2: Extract the Backup" -ForegroundColor Cyan
Write-Host "The .gz file likely contains a MongoDB dump. Extract it using:" -ForegroundColor White
Write-Host "- 7-Zip: Right-click -> Extract to folder" -ForegroundColor Gray
Write-Host "- PowerShell: tar -xzf `"$BackupFile`" -C `"$ExtractedDir`"" -ForegroundColor Gray

Write-Host "`nStep 3: Get Connection String" -ForegroundColor Cyan
Write-Host "From Atlas dashboard:" -ForegroundColor White
Write-Host "1. Click 'Connect' on your cluster" -ForegroundColor Gray
Write-Host "2. Choose 'Connect your application'" -ForegroundColor Gray
Write-Host "3. Copy the connection string" -ForegroundColor Gray
Write-Host "4. Replace <password> with your actual password" -ForegroundColor Gray

Write-Host "`nStep 4: Restore Database" -ForegroundColor Cyan
Write-Host "Use mongorestore to restore the backup:" -ForegroundColor White
Write-Host "mongorestore --uri `"your_connection_string`" --db $DatabaseName `"$ExtractedDir`"" -ForegroundColor Gray

Write-Host "`nStep 5: Update .env.local" -ForegroundColor Cyan
Write-Host "Your connection string should look like:" -ForegroundColor White
Write-Host "DATABASE_URL=`"mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority`"" -ForegroundColor Green

Write-Host "`nCommon MongoDB Connection String Format:" -ForegroundColor Magenta
Write-Host "mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority" -ForegroundColor White

Read-Host "`nPress Enter to continue..." 