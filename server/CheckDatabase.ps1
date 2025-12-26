# Скрипт для проверки базы данных SQL Server
Write-Host "Проверка подключения к SQL Server LocalDB..." -ForegroundColor Cyan

# Проверка LocalDB
$localdbStatus = sqllocaldb info MSSQLLocalDB 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ LocalDB запущен" -ForegroundColor Green
} else {
    Write-Host "✗ LocalDB не запущен. Запускаем..." -ForegroundColor Yellow
    sqllocaldb start MSSQLLocalDB
}

# Проверка подключения к базе данных
Write-Host "`nПроверка базы данных CinemaDb..." -ForegroundColor Cyan

$connectionString = "Server=(localdb)\MSSQLLocalDB;Database=CinemaDb;Trusted_Connection=True;TrustServerCertificate=True;Connection Timeout=5"

try {
    # Используем sqlcmd для проверки
    $query = "SELECT COUNT(*) as TableCount FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE'"
    $result = sqlcmd -S "(localdb)\MSSQLLocalDB" -d "CinemaDb" -Q $query -h -1 -W 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        $tableCount = ($result | Select-String -Pattern '\d+').Matches.Value
        Write-Host "✓ База данных CinemaDb существует" -ForegroundColor Green
        Write-Host "  Количество таблиц: $tableCount" -ForegroundColor Gray
        
        # Проверка данных
        Write-Host "`nПроверка данных в таблицах..." -ForegroundColor Cyan
        
        $tables = @("Movies", "Users", "Halls", "Zones", "Schedules", "Bookings")
        foreach ($table in $tables) {
            $countQuery = "SELECT COUNT(*) FROM $table"
            $countResult = sqlcmd -S "(localdb)\MSSQLLocalDB" -d "CinemaDb" -Q $countQuery -h -1 -W 2>&1
            if ($LASTEXITCODE -eq 0) {
                $count = ($countResult | Select-String -Pattern '\d+').Matches.Value
                Write-Host "  $table : $count записей" -ForegroundColor $(if ([int]$count -gt 0) { "Green" } else { "Yellow" })
            }
        }
    } else {
        Write-Host "✗ База данных CinemaDb не найдена или недоступна" -ForegroundColor Red
        Write-Host "  Возможно, нужно запустить приложение для создания базы" -ForegroundColor Yellow
    }
} catch {
    Write-Host "✗ Ошибка при проверке: $_" -ForegroundColor Red
}

Write-Host "`nДля детальной проверки откройте файл CheckDatabase.sql в SSMS" -ForegroundColor Cyan



