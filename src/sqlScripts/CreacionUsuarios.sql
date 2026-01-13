USE tareas;
GO

--Server level user
CREATE LOGIN tareasUser
WITH PASSWORD = 'ReadOnlyPassword!';
GO
--Db Level User

CREATE USER tareasUser
FOR LOGIN tareasUser;
GO

ALTER ROLE db_datareader ADD MEMBER tareasUser;
GO