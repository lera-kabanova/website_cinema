-- Final script to fix UserId column type from nvarchar to int
USE CinemaDb;

-- Check current type
SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Bookings' AND COLUMN_NAME = 'UserId';

-- Step 1: Drop foreign key if exists
IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_Bookings_Users_UserId')
BEGIN
    ALTER TABLE Bookings DROP CONSTRAINT FK_Bookings_Users_UserId;
    PRINT 'Foreign key dropped';
END

-- Step 2: Drop index if exists
IF EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Bookings_UserId' AND object_id = OBJECT_ID('Bookings'))
BEGIN
    DROP INDEX IX_Bookings_UserId ON Bookings;
    PRINT 'Index dropped';
END

-- Step 3: Delete invalid records
DELETE FROM Bookings WHERE ISNUMERIC(UserId) = 0 OR UserId IS NULL OR LTRIM(RTRIM(UserId)) = '';
PRINT 'Invalid records deleted';

-- Step 4: Check if temp column exists, drop if needed
IF EXISTS (SELECT * FROM sys.columns WHERE object_id = OBJECT_ID('Bookings') AND name = 'UserId_temp')
BEGIN
    ALTER TABLE Bookings DROP COLUMN UserId_temp;
    PRINT 'Temp column dropped';
END

-- Step 5: Add temporary column
ALTER TABLE Bookings ADD UserId_temp INT NULL;
PRINT 'Temp column added';

-- Step 6: Convert data from string to int
UPDATE Bookings 
SET UserId_temp = CAST(UserId AS INT) 
WHERE ISNUMERIC(UserId) = 1 AND UserId IS NOT NULL AND LTRIM(RTRIM(UserId)) != '';
PRINT 'Data converted';

-- Step 7: Drop old column
ALTER TABLE Bookings DROP COLUMN UserId;
PRINT 'Old column dropped';

-- Step 8: Rename temp column
EXEC sp_rename 'Bookings.UserId_temp', 'UserId', 'COLUMN';
PRINT 'Column renamed';

-- Step 9: Make NOT NULL
ALTER TABLE Bookings ALTER COLUMN UserId INT NOT NULL;
PRINT 'Column set to NOT NULL';

-- Step 10: Create index
CREATE INDEX IX_Bookings_UserId ON Bookings(UserId);
PRINT 'Index created';

-- Step 11: Create foreign key
ALTER TABLE Bookings
ADD CONSTRAINT FK_Bookings_Users_UserId 
FOREIGN KEY (UserId) REFERENCES Users(Id) 
ON DELETE NO ACTION;
PRINT 'Foreign key created';

-- Verify
SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'Bookings' AND COLUMN_NAME = 'UserId';
PRINT 'UserId column type successfully changed to INT';













