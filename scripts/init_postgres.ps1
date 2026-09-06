# init_postgres.ps1 - Initializes dedicated local PostgreSQL cluster
$pgBin = "C:\Program Files\PostgreSQL\18\bin"
$pgData = "D:\Razorpay\pgdata"

Write-Host "Initializing PostgreSQL cluster in $pgData on port 5433..." -ForegroundColor Cyan

if (-not (Test-Path $pgData)) {
    & "$pgBin\initdb.exe" -D $pgData -U postgres -A trust --encoding=UTF8
    Write-Host "PostgreSQL cluster initialized." -ForegroundColor Green
} else {
    Write-Host "PostgreSQL data directory already exists." -ForegroundColor Yellow
}

# Ensure postgres is running
& "$PSScriptRoot\start_postgres.ps1"

# Create database if not exists
Start-Sleep -Seconds 2
$dbExists = & "$pgBin\psql.exe" -p 5433 -U postgres -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='payrevive'"
if ($dbExists -ne "1") {
    Write-Host "Creating database 'payrevive'..." -ForegroundColor Cyan
    & "$pgBin\createdb.exe" -p 5433 -U postgres payrevive
    Write-Host "Database 'payrevive' created successfully." -ForegroundColor Green
} else {
    Write-Host "Database 'payrevive' already exists." -ForegroundColor Green
}
