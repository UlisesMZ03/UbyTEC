CREATE FUNCTION ObtenerComerciosyNombreTipo()
RETURNS TABLE
AS
RETURN
(
    SELECT 
        C.Correo,
        C.Nombre,
        C.CedulaJuridica,
        C.NumeroSINPE,
        C.CorreoAdmin,
        C.TipoID,
        T.Nombre AS NombreTipo
    FROM Comercios C
    INNER JOIN TipoDeComercio T ON C.TipoID = T.ID
);
;
go
;
CREATE FUNCTION ObtenerTelefonosPorComercio(@Correo NVARCHAR(255))
RETURNS TABLE
AS
RETURN
(
    SELECT 
        T.Telefono
    FROM TelefonosComercio T
    WHERE T.CorreoComercio = @Correo
);
go
;

CREATE FUNCTION ObtenerCorreoYPasswordCliente(@Correo NVARCHAR(255))
RETURNS TABLE
AS
RETURN
(
    SELECT 
        Correo, 
        Password
    FROM Cliente
    WHERE Correo = @Correo
);
