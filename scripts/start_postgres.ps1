# start_postgres.ps1 - Starts the dedicated PostgreSQL cluster
$pgBin = "C:\Program Files\PostgreSQL\18\bin"
$pgData = "D:\Razorpay\pgdata"

$status = & "$pgBin\pg_ctl.exe" -D $pgData status 2>&1
if ($status -like "*server is running*") {
    Write-Host "PostgreSQL is already running on port 5433." -ForegroundColor Green
} else {
    Write-Host "Starting PostgreSQL server on port 5433..." -ForegroundColor Cyan
    & "$pgBin\pg_ctl.exe" -D $pgData -l "$pgData\logfile.log" -o "-p 5433" start
    Start-Sleep -Seconds 2
    Write-Host "PostgreSQL server started successfully." -ForegroundColor Green
}
