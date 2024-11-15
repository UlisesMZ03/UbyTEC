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
go
;
CREATE PROCEDURE InsertarAdministradorAfiliado
    @Correo NVARCHAR(255),
    @Cedula NVARCHAR(50),
    @Nombre NVARCHAR(255),
    @Apellido1 NVARCHAR(255),
    @Apellido2 NVARCHAR(255),
    @Usuario NVARCHAR(255),
    @Password NVARCHAR(255),
    @Provincia NVARCHAR(255),
    @Canton NVARCHAR(255),
    @Distrito NVARCHAR(255)
AS
BEGIN
    INSERT INTO AdministradorAfiliado (
        Correo, Cedula, Nombre, Apellido1, Apellido2, Usuario, Password, Provincia, Canton, Distrito
    )
    VALUES (
        @Correo, @Cedula, @Nombre, @Apellido1, @Apellido2, @Usuario, @Password, @Provincia, @Canton, @Distrito
    );
END;
go
;
CREATE PROCEDURE EliminarAdministradorAfiliado
    @Correo NVARCHAR(255),
    @NuevoCorreoAdmin NVARCHAR(255)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Reasignar los comercios a un nuevo administrador
        UPDATE Comercios
        SET CorreoAdmin = @NuevoCorreoAdmin
        WHERE CorreoAdmin = @Correo;

        -- Eliminar el administrador
        DELETE FROM AdministradorAfiliado
        WHERE Correo = @Correo;

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH;
END;

go
;
CREATE PROCEDURE ActualizarAdministradorAfiliado
    @Correo NVARCHAR(255),
    @Cedula NVARCHAR(50),
    @Nombre NVARCHAR(255),
    @Apellido1 NVARCHAR(255),
    @Apellido2 NVARCHAR(255),
    @Usuario NVARCHAR(255),
    @Password NVARCHAR(255),
    @Provincia NVARCHAR(255),
    @Canton NVARCHAR(255),
    @Distrito NVARCHAR(255)
AS
BEGIN
    UPDATE AdministradorAfiliado
    SET
        Cedula = @Cedula,
        Nombre = @Nombre,
        Apellido1 = @Apellido1,
        Apellido2 = @Apellido2,
        Usuario = @Usuario,
        Password = @Password,
        Provincia = @Provincia,
        Canton = @Canton,
        Distrito = @Distrito
    WHERE Correo = @Correo;
END;
;go;

CREATE PROCEDURE InsertarCliente
    @Correo NVARCHAR(255),
    @Nombre NVARCHAR(255),
    @Apellido1 NVARCHAR(255),
    @Apellido2 NVARCHAR(255),
    @Telefono NVARCHAR(15),
    @Usuario NVARCHAR(255),
    @Password NVARCHAR(255),
    @Cedula NVARCHAR(50),
    @Provincia NVARCHAR(255),
    @Canton NVARCHAR(255),
    @Distrito NVARCHAR(255)
AS
BEGIN
    INSERT INTO Cliente (
        Correo, Nombre, Apellido1, Apellido2, Telefono, Usuario, Password, Cedula, Provincia, Canton, Distrito
    )
    VALUES (
        @Correo, @Nombre, @Apellido1, @Apellido2, @Telefono, @Usuario, @Password, @Cedula, @Provincia, @Canton, @Distrito
    );
END;
;
go
;

CREATE PROCEDURE EliminarCliente
    @Correo NVARCHAR(255)
AS
BEGIN
    DELETE FROM Cliente
    WHERE Correo = @Correo;
END;
;
go;
CREATE PROCEDURE VerificarCorreoYPasswordAdministrador
    @Usuario NVARCHAR(255),
    @Password NVARCHAR(255)
AS
BEGIN
    IF EXISTS (
        SELECT 1
        FROM Administrador
        WHERE Usuario = @Usuario AND Password = @Password
    )
    BEGIN
        SELECT 'Credenciales válidas' AS Resultado;
    END
    ELSE
    BEGIN
        SELECT 'Credenciales inválidas' AS Resultado;
    END
END;
go
;

CREATE PROCEDURE AgregarAdministradorConTelefono
    @Cedula NVARCHAR(50),
    @Nombre NVARCHAR(255),
    @Apellido1 NVARCHAR(255),
    @Apellido2 NVARCHAR(255),
    @Usuario NVARCHAR(255),
    @Password NVARCHAR(255),
    @Provincia NVARCHAR(255),
    @Canton NVARCHAR(255),
    @Distrito NVARCHAR(255),
    @Telefono NVARCHAR(15)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;

        -- Inserta el nuevo administrador
        INSERT INTO Administrador (
            Cedula, Nombre, Apellido1, Apellido2, Usuario, Password, Provincia, Canton, Distrito
        )
        VALUES (
            @Cedula, @Nombre, @Apellido1, @Apellido2, @Usuario, @Password, @Provincia, @Canton, @Distrito
        );

        -- Inserta el teléfono asociado al administrador
        INSERT INTO TelefonosAdministradores (
            CedulaAdmin, Telefono
        )
        VALUES (
            @Cedula, @Telefono
        );

        -- Confirma la transacción
        COMMIT TRANSACTION;

        SELECT 'Administrador y teléfono agregados correctamente' AS Resultado;
    END TRY
    BEGIN CATCH
        -- Revierte la transacción en caso de error
        ROLLBACK TRANSACTION;

        -- Lanza el mensaje de error
        DECLARE @ErrorMensaje NVARCHAR(4000) = ERROR_MESSAGE();
        THROW 50000, @ErrorMensaje, 1;
    END CATCH;
END;
