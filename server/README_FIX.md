# Исправление типа колонки UserId

## Проблема
Колонка `UserId` в таблице `Bookings` имела тип `nvarchar`, хотя в модели C# она определена как `int`. Это вызывало ошибки при работе с бронированиями.

## Решение
Тип колонки был изменен с `nvarchar` на `int` в базе данных SQL Server.

## Что было сделано:
1. ✅ Удален внешний ключ `FK_Bookings_Users_UserId`
2. ✅ Удален индекс `IX_Bookings_UserId`
3. ✅ Удалены некорректные записи (если были)
4. ✅ Создана временная колонка `UserId_temp` типа INT
5. ✅ Данные конвертированы из строки в int
6. ✅ Старая колонка `UserId` удалена
7. ✅ Временная колонка переименована в `UserId`
8. ✅ Колонка установлена как NOT NULL
9. ✅ Создан индекс `IX_Bookings_UserId`
10. ✅ Создан внешний ключ `FK_Bookings_Users_UserId`

## Проверка
Выполните для проверки:
```sql
SELECT COLUMN_NAME, DATA_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Bookings' AND COLUMN_NAME = 'UserId';
```

Должно быть: `DATA_TYPE = int`

## Файлы
- `FixUserIdColumn.sql` - Полный SQL скрипт с GO командами (для SSMS)
- `FixUserIdColumnSimple.sql` - Упрощенный скрипт
- `FixUserIdColumnFinal.sql` - Финальный скрипт
- `FixUserIdColumn.ps1` - PowerShell скрипт для автоматизации

## Важно
После исправления типа колонки перезапустите приложение, чтобы изменения вступили в силу.

