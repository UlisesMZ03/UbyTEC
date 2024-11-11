CREATE TABLE AdministradorAfiliado (
    Correo NVARCHAR(255) PRIMARY KEY,
	Cedula NVARCHAR(50),
    Nombre NVARCHAR(255),
    Apellido1 NVARCHAR(255),
    Apellido2 NVARCHAR(255),
    Usuario NVARCHAR(255),
    Password NVARCHAR(255),
    Provincia NVARCHAR(255),
    Canton NVARCHAR(255),
    Distrito NVARCHAR(255)
);

CREATE TABLE TelefonosAdminAfi (
    ID INT PRIMARY KEY IDENTITY(1,1),
    CorreoAdmin NVARCHAR(255),
    Telefono NVARCHAR(15),
    FOREIGN KEY (CorreoAdmin) REFERENCES AdministradorAfiliado(Correo)
);

CREATE TABLE TipoDeComercio (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Nombre NVARCHAR(255)
);

CREATE TABLE Comercios (
    Correo NVARCHAR(255) PRIMARY KEY,
    Nombre NVARCHAR(255),
    CedulaJuridica NVARCHAR(50),
    NumeroSINPE NVARCHAR(50),
    CorreoAdmin NVARCHAR(255),
    TipoID INT,
    FOREIGN KEY (CorreoAdmin) REFERENCES AdministradorAfiliado(Correo),
    FOREIGN KEY (TipoID) REFERENCES TipoDeComercio(ID)
);

CREATE TABLE TelefonosComercio (
    ID INT PRIMARY KEY IDENTITY(1,1),
    CorreoComercio NVARCHAR(255),
    Telefono NVARCHAR(15),
    FOREIGN KEY (CorreoComercio) REFERENCES Comercios(Correo)
);

CREATE TABLE Cliente (
    Correo NVARCHAR(255) PRIMARY KEY,
    Nombre NVARCHAR(255),
    Apellido1 NVARCHAR(255),
    Apellido2 NVARCHAR(255),
    Telefono NVARCHAR(15),
    Usuario NVARCHAR(255),
    Password NVARCHAR(255),
    Cedula NVARCHAR(50),
    Provincia NVARCHAR(255),
    Canton NVARCHAR(255),
    Distrito NVARCHAR(255)
);

CREATE TABLE Mensajeros (
    Correo NVARCHAR(255) PRIMARY KEY,
    Nombre NVARCHAR(255),
    Apellido1 NVARCHAR(255),
    Apellido2 NVARCHAR(255),
    Usuario NVARCHAR(255),
    Password NVARCHAR(255),
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
    Precio DECIMAL(10, 2),
    Categoria NVARCHAR(255),
    Nombre NVARCHAR(255),
    CorreoComercio NVARCHAR(255),
    FOREIGN KEY (CorreoComercio) REFERENCES Comercios(Correo)
);

CREATE TABLE FotosProducto (
    ID INT PRIMARY KEY IDENTITY(1,1),
    ProductID INT,
    Foto NVARCHAR(255),
    FOREIGN KEY (ProductID) REFERENCES Productos(ID)
);


CREATE TABLE Pedido (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Estado NVARCHAR(50),
    Total DECIMAL(10, 2),
    CorreoCliente NVARCHAR(255),
    CorreoComercio NVARCHAR(255),
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
    Cedula NVARCHAR(50) PRIMARY KEY,
    Nombre NVARCHAR(255),
    Apellido1 NVARCHAR(255),
    Apellido2 NVARCHAR(255),
    Usuario NVARCHAR(255),
    Password NVARCHAR(255),
    Provincia NVARCHAR(255),
    Canton NVARCHAR(255),
    Distrito NVARCHAR(255)
);


CREATE TABLE TelefonosAdministradores (
    ID INT PRIMARY KEY IDENTITY(1,1),
    CedulaAdmin NVARCHAR(50),
    Telefono NVARCHAR(15),
    FOREIGN KEY (CedulaAdmin) REFERENCES Administrador(Cedula)
);







