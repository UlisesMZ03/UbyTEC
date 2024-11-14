CREATE PROCEDURE InsertarComercio
    @Correo NVARCHAR(255),
    @Nombre NVARCHAR(255),
    @CedulaJuridica NVARCHAR(50),
    @NumeroSINPE NVARCHAR(50),
    @CorreoAdmin NVARCHAR(255),
    @TipoID INT
AS
BEGIN
    INSERT INTO Comercios (Correo, Nombre, CedulaJuridica, NumeroSINPE, CorreoAdmin, TipoID)
    VALUES (@Correo, @Nombre, @CedulaJuridica, @NumeroSINPE, @CorreoAdmin, @TipoID);
END;
;
go
;
CREATE PROCEDURE ActualizarComercio
    @Correo NVARCHAR(255),
    @Nombre NVARCHAR(255),
    @CedulaJuridica NVARCHAR(50),
    @NumeroSINPE NVARCHAR(50),
    @CorreoAdmin NVARCHAR(255),
    @TipoID INT
AS
BEGIN
    UPDATE Comercios
    SET Nombre = @Nombre, CedulaJuridica = @CedulaJuridica, NumeroSINPE = @NumeroSINPE,
        CorreoAdmin = @CorreoAdmin, TipoID = @TipoID
    WHERE Correo = @Correo;
END;
;
go
;

CREATE PROCEDURE EliminarComercio
    @Correo NVARCHAR(255)
AS
BEGIN
    DELETE FROM Comercios
    WHERE Correo = @Correo;
END;
