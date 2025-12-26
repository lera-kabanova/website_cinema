# Script to fix UserId column type in Bookings table
Write-Host "Fixing UserId column type in Bookings table..." -ForegroundColor Cyan

$sqlFile = Join-Path $PSScriptRoot "FixUserIdColumn.sql"

if (Test-Path $sqlFile) {
    Write-Host "Executing SQL script..." -ForegroundColor Yellow
    sqlcmd -S "(localdb)\MSSQLLocalDB" -d "CinemaDb" -i $sqlFile -b
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Success! UserId column type changed to INT" -ForegroundColor Green
    } else {
        Write-Host "Error executing SQL script. Please run FixUserIdColumn.sql manually in SSMS" -ForegroundColor Red
    }
} else {
    Write-Host "SQL file not found: $sqlFile" -ForegroundColor Red
    Write-Host "Please run FixUserIdColumn.sql manually in SQL Server Management Studio" -ForegroundColor Yellow
}

