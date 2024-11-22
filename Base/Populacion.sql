INSERT INTO [dbo].[Administrador] (
    [Cedula],
    [Nombre],
    [Apellido1],
    [Apellido2],
    [Usuario],
    [Password],
    [Provincia],
    [Canton],
    [Distrito]
)
VALUES
    ('101010101', 'Ulises', 'Mendez', 'Segura', 'UlisesM', '1234', 'San José', 'Central', 'Carmen'),
    ('202020202', 'Sebas', 'Hernandez', 'Bonilla', 'sebashb', '5678', 'San José', 'Central', 'Escazú');
GO
INSERT INTO [dbo].[Productos] (
    [ID],
    [Precio],
    [Categoria],
    [Nombre],
    [CorreoComercio]
)
VALUES
    (2, 5.99, 'Hamburguesas', 'Big Mac', 'mcdonalds@example.com'),
    (3, 15.50, 'Sopa', 'Sopa de Acelga', 'correo_restaurante_satay@ejemplo.com'),
    (4, 18.75, 'Plato Principal', 'Arroz Frito con Pollo', 'correo_restaurante_satay@ejemplo.com'),
    (5, 12.00, 'Entrante', 'Rollos de Primavera', 'correo_restaurante_satay@ejemplo.com'),
    (6, 10.50, 'Bebida', 'Té Verde', 'correo_restaurante_satay@ejemplo.com');
GO
INSERT INTO [dbo].[Comercios] (
    [Correo],
    [Nombre],
    [CedulaJuridica],
    [NumeroSINPE],
    [CorreoAdmin],
    [TipoID],
    [Provincia],
    [Canton],
    [Distrito],
    [Imagen]
)
VALUES
    ('correo_restaurante_satay@ejemplo.com', 'Restaurante Satay', '987654321', '987-654-321', 'sebastian@restaurantesatay.com', 1, 'San José', 'Central', 'Escazú', 'https://paseodelasflores.com/wp-content/uploads/2023/12/SATAY-500x500.png'),
    ('mcdonalds@example.com', 'McDonalds', '1234567890', '1-234-567890', 'holaa@xd.com', 1, 'San José', 'Central', 'Carmen', 'https://www.civisanalytics.com/wp-content/uploads/2019/12/symbol-McDonalds.jpg'),
    ('ulises.restaurant@example.com', 'UlisesRestaurant', '123456789', '987654321', 'ulises.mendez@example.com', 1, 'Cartago', 'Cartago', 'Cartago', 'https://grupocontrasa.es/wp-content/uploads/2022/07/Reformamos-tu-negocio-de-hosteleria-1.jpg');
GO
INSERT INTO [dbo].[TipoDeComercio] (
    [ID],
    [Nombre]
)
VALUES
    (1, 'Restaurante'),
    (2, 'Supermercado'),
    (3, 'Farmacia'),
    (4, 'Dulceria');
GO
INSERT INTO [dbo].[Mensajeros] (
    [Correo],
    [Nombre],
    [Apellido1],
    [Apellido2],
    [Usuario],
    [Password],
    [Provincia],
    [Canton],
    [Distrito],
    [Estado]
)
VALUES
    ('mensajero@ejemplo.com', 'Juan', 'Perez', 'Gomez', 'juanperez', 'contraseña123', 'San José', 'Central', 'Mata Redonda', 'Disponible'),
    ('repartidor1@example.com', 'Juan', 'Perez', 'Gomez', 'No disponible', 'password123', 'Cartago', 'Cartago', 'Cartago', 'Disponible'),
    ('repartidor2@example.com', 'Maria', 'Lopez', 'Rodriguez', 'marialopez', 'password456', 'Cartago', 'Cartago', 'Guadalupe', 'Disponible'),
    ('repartidor3@example.com', 'Luis', 'Fernandez', 'Soto', 'luisfernandez', 'password789', 'Cartago', 'Cartago', 'Carmen', 'Disponible'),
    ('repartidor4@example.com', 'Ana', 'Ramirez', 'Castro', 'anaramirez', 'password321', 'Cartago', 'Tejar', 'Abedules', 'No disponible'),
    ('repartidor6@example.com', 'Sofia', 'Jimenez', 'Chavez', 'No disponible', 'password987', 'Cartago', 'Cartago', 'Cartago', 'No disponible'),
    ('repartidor8@example.com', 'Laura', 'Mora', 'Sanchez', 'lauramora', 'password222', 'San José', 'Central', 'Cartago', 'Disponible'),
    ('repartidor9@example.com', 'Roberto', 'Campos', 'Vega', 'robertocampos', 'password333', 'Cartago', 'Cartago', 'Cartago', 'No disponible'),
    ('repartidorulises@gmail.com', 'Ulises', 'Mendez', 'Zuniga', 'ulisesmz123', 'rPlFLqhR6Ta', 'Limón', 'Siquirres', 'La alegria', 'disponible');
GO

INSERT INTO [dbo].[AdministradorAfiliado] (
    [Correo],
    [Nombre],
    [Apellido1],
    [Apellido2],
    [Usuario],
    [Password],
    [Provincia],
    [Canton],
    [Distrito]
)
VALUES
    ('sebastian@restaurantesatay.com', 'Sebastian', 'González', 'López', 'sebastian_satay', 'password_seguro', 'San José', 'Central', 'Escazú'),
    ('holaa@xd.com', 'Juan', 'Perez', 'Rodriguez','JuanLol', 'password123', 'San José', 'Central', 'Escazú'),
    ('ulises.mendez@example.com', 'Ulises', 'Mendez', 'Segura', 'ulisesmendez', 'eu4fQpW6w7Cv', 'Cartago', 'Cartago', 'Cartago');
GO
