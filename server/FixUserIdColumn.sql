-- Скрипт для исправления типа колонки UserId в таблице Bookings
-- Выполните этот скрипт в SQL Server Management Studio или через sqlcmd

USE CinemaDb;
GO

-- Проверяем текущий тип колонки
SELECT COLUMN_NAME, DATA_TYPE, CHARACTER_MAXIMUM_LENGTH
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'Bookings' AND COLUMN_NAME = 'UserId';
GO

-- Шаг 1: Удаляем внешний ключ, если он существует
IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Bookings_Users_UserId')
BEGIN
    ALTER TABLE Bookings DROP CONSTRAINT FK_Bookings_Users_UserId;
    PRINT 'Внешний ключ FK_Bookings_Users_UserId удален';
END
GO

-- Шаг 2: Удаляем индекс, если он существует
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Bookings_UserId')
BEGIN
    DROP INDEX IX_Bookings_UserId ON Bookings;
    PRINT 'Индекс IX_Bookings_UserId удален';
END
GO

-- Шаг 3: Удаляем записи с некорректными UserId (которые не могут быть преобразованы в int)
-- Это безопасно, так как пользователь сказал, что таких записей нет
DELETE FROM Bookings 
WHERE ISNUMERIC(UserId) = 0 OR UserId IS NULL OR UserId = '';
GO

-- Шаг 4: Создаем временную колонку с правильным типом
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Bookings') AND name = 'UserId_temp')
BEGIN
    ALTER TABLE Bookings ADD UserId_temp INT NULL;
    PRINT 'Временная колонка UserId_temp создана';
END
GO

-- Шаг 5: Конвертируем данные из строки в int
UPDATE Bookings 
SET UserId_temp = CASE 
    WHEN ISNUMERIC(UserId) = 1 THEN CAST(UserId AS INT)
    ELSE NULL
END;
GO

-- Шаг 6: Удаляем старую колонку
ALTER TABLE Bookings DROP COLUMN UserId;
GO

-- Шаг 7: Переименовываем временную колонку
EXEC sp_rename 'Bookings.UserId_temp', 'UserId', 'COLUMN';
GO

-- Шаг 8: Делаем колонку NOT NULL
ALTER TABLE Bookings ALTER COLUMN UserId INT NOT NULL;
GO

-- Шаг 9: Создаем индекс
CREATE INDEX IX_Bookings_UserId ON Bookings(UserId);
GO

-- Шаг 10: Создаем внешний ключ
ALTER TABLE Bookings
ADD CONSTRAINT FK_Bookings_Users_UserId 
FOREIGN KEY (UserId) REFERENCES Users(Id) 
ON DELETE RESTRICT;
GO

PRINT 'Тип колонки UserId успешно изменен на INT';
GO













