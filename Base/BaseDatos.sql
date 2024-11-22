CREATE DATABASE ProyectoUbyTec;
GO
;
USE ProyectoUbyTec;
GO;


CREATE TABLE AdministradorAfiliado (
    Correo NVARCHAR(255) PRIMARY KEY NOT NULL,
	Cedula NVARCHAR(50) NOT NULL,
    Nombre NVARCHAR(255) NOT NULL,
    Apellido1 NVARCHAR(255) NOT NULL,
    Apellido2 NVARCHAR(255),
    Usuario NVARCHAR(255) NOT NULL,
    Password NVARCHAR(255) NOT NULL,
    Provincia NVARCHAR(255),
    Canton NVARCHAR(255),
    Distrito NVARCHAR(255)
);

CREATE TABLE TelefonosAdminAfi (
    ID INT PRIMARY KEY IDENTITY(1,1),
    CorreoAdmin NVARCHAR(255) NOT NULL,
    Telefono NVARCHAR(15) NOT NULL,
    FOREIGN KEY (CorreoAdmin) REFERENCES AdministradorAfiliado(Correo)
);

CREATE TABLE TipoDeComercio (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(255) NOT NULL
);

CREATE TABLE Comercios (
    Correo NVARCHAR(255) PRIMARY KEY NOT NULL,
    Nombre NVARCHAR(255) NOT NULL,
    CedulaJuridica NVARCHAR(50) NOT NULL,
    NumeroSINPE NVARCHAR(50) NOT NULL,
    CorreoAdmin NVARCHAR(255) NOT NULL,
    TipoID INT NOT NULL,
	Provincia NVARCHAR(255) NOT NULL,
    Canton NVARCHAR(255) NOT NULL,
    Distrito NVARCHAR(255) NOT NULL,
	Imagen NVARCHAR(500),
    FOREIGN KEY (CorreoAdmin) REFERENCES AdministradorAfiliado(Correo),
    FOREIGN KEY (TipoID) REFERENCES TipoDeComercio(ID)
);


CREATE TABLE TelefonosComercio (
    ID INT PRIMARY KEY IDENTITY(1,1),
    CorreoComercio NVARCHAR(255) NOT NULL,
    Telefono NVARCHAR(15) NOT NULL,
    FOREIGN KEY (CorreoComercio) REFERENCES Comercios(Correo)
);

CREATE TABLE Cliente (
    Correo NVARCHAR(255) PRIMARY KEY NOT NULL,
    Nombre NVARCHAR(255) NOT NULL,
    Apellido1 NVARCHAR(255) NOT NULL,
    Apellido2 NVARCHAR(255),
    Telefono NVARCHAR(15),
    Usuario NVARCHAR(255) NOT NULL,
    Password NVARCHAR(255) NOT NULL,
    Cedula NVARCHAR(50) NOT NULL,
    Provincia NVARCHAR(255),
    Canton NVARCHAR(255),
    Distrito NVARCHAR(255)
);

CREATE TABLE Mensajeros (
    Correo NVARCHAR(255) PRIMARY KEY NOT NULL,
    Nombre NVARCHAR(255) NOT NULL,
    Apellido1 NVARCHAR(255) NOT NULL,
    Apellido2 NVARCHAR(255),
    Usuario NVARCHAR(255) NOT NULL,
    Password NVARCHAR(255) NOT NULL,
    Provincia NVARCHAR(255),
    Canton NVARCHAR(255),
    Distrito NVARCHAR(255)
);

CREATE TABLE TelefonosMensajeros (
    ID INT PRIMARY KEY IDENTITY(1,1),
    CorreoMensajero NVARCHAR(255),
    Telefono NVARCHAR(15),
    FOREIGN KEY (CorreoMensajero) REFERENCES Mensajeros(Correo)
);



CREATE TABLE Productos (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Precio DECIMAL(10, 2) NOT NULL,
    Categoria NVARCHAR(255),
    Nombre NVARCHAR(255) NOT NULL,
    CorreoComercio NVARCHAR(255),
    FOREIGN KEY (CorreoComercio) REFERENCES Comercios(Correo)
);

CREATE TABLE FotosProducto (
    ID INT PRIMARY KEY IDENTITY(1,1),
    ProductID INT,
    Foto NVARCHAR(500),
    FOREIGN KEY (ProductID) REFERENCES Productos(ID)
);

CREATE TABLE Pedido (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Estado NVARCHAR(50),
    Total DECIMAL(10, 2),
    CorreoCliente NVARCHAR(255) NOT NULL,
    CorreoComercio NVARCHAR(255) NOT NULL,
    CorreoMensajero NVARCHAR(255),
    FOREIGN KEY (CorreoCliente) REFERENCES Cliente(Correo),
    FOREIGN KEY (CorreoComercio) REFERENCES Comercios(Correo),
    FOREIGN KEY (CorreoMensajero) REFERENCES Mensajeros(Correo)
);

CREATE TABLE ProductosPedidos (
    PedidoID INT,
    ProductID INT,
    Cantidad INT,
    PRIMARY KEY (PedidoID, ProductID),
    FOREIGN KEY (PedidoID) REFERENCES Pedido(ID),
    FOREIGN KEY (ProductID) REFERENCES Productos(ID)
);

CREATE TABLE CarritoDeCompras (
    CorreoCliente NVARCHAR(255),
    ProductID INT,
    Cantidad INT,
    PRIMARY KEY (CorreoCliente, ProductID),
    FOREIGN KEY (CorreoCliente) REFERENCES Cliente(Correo),
    FOREIGN KEY (ProductID) REFERENCES Productos(ID)
);


CREATE TABLE Administrador (
    Cedula NVARCHAR(50) PRIMARY KEY NOT NULL,
    Nombre NVARCHAR(255) NOT NULL,
    Apellido1 NVARCHAR(255) NOT NULL,
    Apellido2 NVARCHAR(255) NOT NULL,
    Usuario NVARCHAR(255) NOT NULL,
    Password NVARCHAR(255) NOT NULL,
    Provincia NVARCHAR(255),
    Canton NVARCHAR(255),
    Distrito NVARCHAR(255)
);


CREATE TABLE TelefonosAdministradores (
    ID INT PRIMARY KEY IDENTITY(1,1),
    CedulaAdmin NVARCHAR(50) NOT NULL,
    Telefono NVARCHAR(15) NOT NULL,
    FOREIGN KEY (CedulaAdmin) REFERENCES Administrador(Cedula)
);

CREATE TABLE Pedido_Auditoria (
	PedidoID INT PRIMARY KEY NOT NULL,
	FechaCreacion datetime
);

CREATE TABLE SolicitudesComercio (
	Id INT PRIMARY KEY NOT NULL,
    Correo VARCHAR(255) NOT NULL,
    Nombre VARCHAR(255) NOT NULL,
    CedulaJuridica VARCHAR(20) NOT NULL,
    NumeroSINPE VARCHAR(20) NOT NULL,
    CorreoAdmin VARCHAR(255) NOT NULL,
    TipoID VARCHAR(20) NOT NULL,
	Provincia VARCHAR(100) NOT NULL,
    Canton VARCHAR(100) NOT NULL,
    Distrito VARCHAR(100) NOT NULL,
	Imagen VARCHAR(255),
	Estado INT,
	FechaSolicitud datetime
);







