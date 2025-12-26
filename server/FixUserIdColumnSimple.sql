-- Simple script to fix UserId column type
-- Run this in SQL Server Management Studio

USE CinemaDb;

-- Step 1: Drop foreign key if exists
IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Bookings_Users_UserId')
    ALTER TABLE Bookings DROP CONSTRAINT FK_Bookings_Users_UserId;

-- Step 2: Drop index if exists  
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Bookings_UserId' AND object_id = OBJECT_ID('Bookings'))
    DROP INDEX IX_Bookings_UserId ON Bookings;

-- Step 3: Delete invalid records
DELETE FROM Bookings WHERE ISNUMERIC(UserId) = 0 OR UserId IS NULL OR UserId = '';

-- Step 4: Add temporary column
IF NOT EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Bookings') AND name = 'UserId_temp')
    ALTER TABLE Bookings ADD UserId_temp INT NULL;

-- Step 5: Convert data
UPDATE Bookings SET UserId_temp = CAST(UserId AS INT) WHERE ISNUMERIC(UserId) = 1;

-- Step 6: Drop old column
ALTER TABLE Bookings DROP COLUMN UserId;

-- Step 7: Rename temp column
EXEC sp_rename 'Bookings.UserId_temp', 'UserId', 'COLUMN';

-- Step 8: Make NOT NULL
ALTER TABLE Bookings ALTER COLUMN UserId INT NOT NULL;

-- Step 9: Create index
CREATE INDEX IX_Bookings_UserId ON Bookings(UserId);

-- Step 10: Create foreign key
ALTER TABLE Bookings
ADD CONSTRAINT FK_Bookings_Users_UserId 
FOREIGN KEY (UserId) REFERENCES Users(Id) 
ON DELETE NO ACTION;

PRINT 'UserId column type successfully changed to INT';

