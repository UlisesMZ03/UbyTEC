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
go;

CREATE FUNCTION BuscarComerciosPorZona(
    @Provincia NVARCHAR(255),
    @Canton NVARCHAR(255)
)
RETURNS TABLE
AS
RETURN
(
    SELECT 
        Nombre,
        Correo,
        NumeroSINPE AS SINPE,
        TipoID,
        CONCAT(Provincia, ', ', Canton, ', ', Distrito) AS Direccion
    FROM Comercios
    WHERE Provincia = @Provincia AND Canton = @Canton
);
go
;

ALTER FUNCTION BuscarComerciosPorZona(
    @Provincia NVARCHAR(255),
    @Canton NVARCHAR(255)
)
RETURNS TABLE
AS
RETURN
(
    SELECT 
        Nombre,
        Correo,
        NumeroSINPE AS SINPE,
        TipoID,
        CONCAT(Provincia, ', ', Canton, ', ', Distrito) AS Direccion,
        Imagen
    FROM Comercios
    WHERE Provincia = @Provincia AND Canton = @Canton
);
go
;


CREATE FUNCTION ObtenerProductosConFotos(@CorreoComercio NVARCHAR(255))
RETURNS TABLE
AS
RETURN
(
    SELECT 
        P.ID AS ProductoID,
        P.Precio,
        P.Categoria,
        P.Nombre AS NombreProducto,
        P.CorreoComercio,
        F.Foto AS FotoProducto
    FROM Productos P
    LEFT JOIN FotosProducto F
        ON P.ID = F.ProductID
    WHERE P.CorreoComercio = @CorreoComercio
);