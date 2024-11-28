using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using System.Threading.Tasks;
using System.Data;
using System.Collections.Generic;
using System.Text.Json;

using System.Text;

public class ApplicationDbContext : DbContext
{
    private readonly HttpClient _httpClient;
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {

    }




    // Método para verificar login de cliente
public async Task<ClienteLoginDto> VerificarLoginClienteAsync(string correo, string password)
{
    // Parámetros de salida para almacenar los resultados
    var messageParam = new SqlParameter("@Message", SqlDbType.NVarChar, 255) { Direction = ParameterDirection.Output };
    var nombreParam = new SqlParameter("@Nombre", SqlDbType.NVarChar, 255) { Direction = ParameterDirection.Output };
    var apellido1Param = new SqlParameter("@Apellido1", SqlDbType.NVarChar, 255) { Direction = ParameterDirection.Output };
    var apellido2Param = new SqlParameter("@Apellido2", SqlDbType.NVarChar, 255) { Direction = ParameterDirection.Output };
    var telefonoParam = new SqlParameter("@Telefono", SqlDbType.NVarChar, 255) { Direction = ParameterDirection.Output };
    var usuarioParam = new SqlParameter("@Usuario", SqlDbType.NVarChar, 255) { Direction = ParameterDirection.Output };
    var cedulaParam = new SqlParameter("@Cedula", SqlDbType.NVarChar, 255) { Direction = ParameterDirection.Output };
    var provinciaParam = new SqlParameter("@Provincia", SqlDbType.NVarChar, 255) { Direction = ParameterDirection.Output };
    var cantonParam = new SqlParameter("@Canton", SqlDbType.NVarChar, 255) { Direction = ParameterDirection.Output };
    var distritoParam = new SqlParameter("@Distrito", SqlDbType.NVarChar, 255) { Direction = ParameterDirection.Output };

    try
    {
        // Ejecutar el procedimiento almacenado usando ExecuteSqlRawAsync
        await Database.ExecuteSqlRawAsync(
            "EXEC [dbo].[LoginCliente] @Correo = {0}, @Password = {1}, @Message = @Message OUTPUT, " +
            "@Nombre = @Nombre OUTPUT, @Apellido1 = @Apellido1 OUTPUT, @Apellido2 = @Apellido2 OUTPUT, " +
            "@Telefono = @Telefono OUTPUT, @Usuario = @Usuario OUTPUT, @Cedula = @Cedula OUTPUT, " +
            "@Provincia = @Provincia OUTPUT, @Canton = @Canton OUTPUT, @Distrito = @Distrito OUTPUT",
            correo, password,
            messageParam, nombreParam, apellido1Param, apellido2Param, telefonoParam,
            usuarioParam, cedulaParam, provinciaParam, cantonParam, distritoParam
        );

        // Verificar si el mensaje de salida es "Correo o contraseña incorrectos"
        if (messageParam.Value?.ToString() == "Correo o contraseña incorrectos")
        {
            return null; // Retornar null si las credenciales son incorrectas
        }

        // Imprimir los resultados recibidos de la base de datos (si se obtienen resultados)
        Console.WriteLine("Datos recibidos del procedimiento:");
        Console.WriteLine($"Message: {messageParam.Value?.ToString()}");
        Console.WriteLine($"Correo: {correo}");
        Console.WriteLine($"Nombre: {nombreParam.Value?.ToString()}");
        Console.WriteLine($"Apellido1: {apellido1Param.Value?.ToString()}");
        Console.WriteLine($"Apellido2: {apellido2Param.Value?.ToString()}");
        Console.WriteLine($"Telefono: {telefonoParam.Value?.ToString()}");
        Console.WriteLine($"Usuario: {usuarioParam.Value?.ToString()}");
        Console.WriteLine($"Cedula: {cedulaParam.Value?.ToString()}");
        Console.WriteLine($"Provincia: {provinciaParam.Value?.ToString()}");
        Console.WriteLine($"Canton: {cantonParam.Value?.ToString()}");
        Console.WriteLine($"Distrito: {distritoParam.Value?.ToString()}");

        // Mapear los resultados a un DTO
        return new ClienteLoginDto
        {
            Message = messageParam.Value?.ToString(),
            Correo = correo,
            Nombre = nombreParam.Value?.ToString(),
            Apellido1 = apellido1Param.Value?.ToString(),
            Apellido2 = apellido2Param.Value?.ToString(),
            Telefono = telefonoParam.Value?.ToString(),
            Usuario = usuarioParam.Value?.ToString(),
            Cedula = cedulaParam.Value?.ToString(),
            Provincia = provinciaParam.Value?.ToString(),
            Canton = cantonParam.Value?.ToString(),
            Distrito = distritoParam.Value?.ToString()
        };
    }
    catch (Exception ex)
    {
        // Manejo del error, en caso de que sea un login fallido
        Console.WriteLine($"Error in VerificarLoginClienteAsync: {ex.Message}");
        return null; // Retornar null si ocurre un error inesperado
    }
}





    // Método para verificar login de administrador
    public async Task<string> VerificarLoginAdminAsync(string Usuario, string password)
    {
        var messageParam = new SqlParameter("@Message", SqlDbType.NVarChar, 255)
        {
            Direction = ParameterDirection.Output
        };

        try
        {
            await Database.ExecuteSqlRawAsync(
                "EXEC LoginAdmin @Usuario = {0}, @Password = {1}, @Message = @Message OUTPUT",
                Usuario, 
                password,
                messageParam);
                
            return messageParam.Value?.ToString() ?? "Error desconocido";
        }
        catch (Exception ex)
        {
            // Log the error
            Console.WriteLine($"Error in VerificarLoginAdminAsync: {ex.Message}");
            return "Error en la verificación de login";
        }
    }

    // Método para verificar login de comercio admin
    public async Task<string> VerificarLoginAdminComAsync(string correo, string password)
    {
        var messageParam = new SqlParameter("@Message", SqlDbType.NVarChar, 255)
        {
            Direction = ParameterDirection.Output
        };

        try
        {
            await Database.ExecuteSqlRawAsync(
                "EXEC LoginAdminCom @Correo = {0}, @Password = {1}, @Message = @Message OUTPUT",
                correo, 
                password,
                messageParam);
                
            return messageParam.Value?.ToString() ?? "Error desconocido";
        }
        catch (Exception ex)
        {
            // Log the error
            Console.WriteLine($"Error in VerificarLoginAdminComAsync: {ex.Message}");
            return "Error en la verificación de login";
        }
    }

    // Método para buscar comercios por zona
    public async Task<List<ComercioZona>> BuscarComerciosPorZonaAsync(string provincia, string canton)
    {
        try
        {
            Console.WriteLine($"Buscando comercios en Provincia: {provincia}, Canton: {canton}");

            var result = await Set<ComercioZona>()
                .FromSqlRaw("SELECT * FROM dbo.BuscarComerciosPorZona(@Provincia, @Canton)", 
                    new SqlParameter("@Provincia", provincia),
                    new SqlParameter("@Canton", canton))
                .ToListAsync();

            Console.WriteLine($"Se encontraron {result.Count} comercios en la zona especificada.");

            return result;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error al buscar comercios: {ex.Message}");
            return new List<ComercioZona>();  // Retornar una lista vacía en caso de error
        }
    }

    // Configuración de modelo y entidades keyless
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configurar ComercioZona como una entidad sin clave primaria (keyless)
        modelBuilder.Entity<ComercioZona>().HasNoKey();

        // Configurar ProductosConFoto como una entidad sin clave primaria (keyless)
        modelBuilder.Entity<ProductosConFoto>().HasNoKey();
        modelBuilder.Entity<ProductoCarritoDto>().HasNoKey();
        modelBuilder.Entity<PedidoDto>().HasNoKey();
        modelBuilder.Entity<ClienteLoginDto>().HasNoKey();
        modelBuilder.Entity<SolicitudComercioDto>().HasNoKey();
        modelBuilder.Entity<AdministradorDto>().HasNoKey();
        modelBuilder.Entity<ComercioDto>().HasNoKey();
        modelBuilder.Entity<AdministradorAfiliadoDto>().HasNoKey();
        modelBuilder.Entity<TipoDeComercioDto>().HasNoKey();
        modelBuilder.Entity<ComentarioRechazo>().HasNoKey();
        modelBuilder.Entity<RepartidorRequest>().HasNoKey();
        modelBuilder.Entity<Repartidor>().HasNoKey();
        modelBuilder.Entity<AdministradorAfiliado>().HasNoKey();
        modelBuilder.Entity<ProductoDto>().HasNoKey();
        modelBuilder.Entity<ProductoRequest>().HasNoKey();
        }
    // Método para obtener productos con fotos
    public async Task<List<ProductosConFoto>> ObtenerProductosConFotosAsync(string correoComercio)
    {
        try
        {
            // Depuración: mostrar el correo del comercio
            Console.WriteLine($"Obteniendo productos con fotos para el comercio: {correoComercio}");

            // Ejecutar la consulta SQL
            var result = await Set<ProductosConFoto>()
                .FromSqlRaw("SELECT * FROM dbo.ObtenerProductosConFotos(@CorreoComercio)", 
                    new SqlParameter("@CorreoComercio", correoComercio))
                .ToListAsync();

            // Depuración: mostrar la cantidad de productos obtenidos
            Console.WriteLine($"Se obtuvieron {result.Count} productos con fotos para el comercio {correoComercio}");

            return result;
        }
        catch (Exception ex)
        {
            // Depuración: mostrar el error detallado
            Console.WriteLine($"Error al obtener productos con fotos para el comercio {correoComercio}: {ex.Message}");
            return new List<ProductosConFoto>();  // Retornar una lista vacía en caso de error
        }
    }


public async Task ActualizarCarritoAsync(string correoCliente, List<ProductoCarrito> productos)
{
    try
    {
        // Verifica que la lista de productos no esté vacía
        if (productos == null || productos.Count == 0)
        {
            throw new ArgumentException("La lista de productos está vacía.");
        }

        // Imprimir los productos para ver si se están deserializando correctamente
        foreach (var producto in productos)
        {
            Console.WriteLine($"ProductoID: {producto.ProductoID}, Cantidad: {producto.Cantidad}");
        }

        // Serializa la lista de productos a una cadena JSON
        string productosJson = JsonSerializer.Serialize(productos);

        // Verifica que el string no esté vacío ni sea nulo
        if (string.IsNullOrEmpty(productosJson))
        {
            throw new ArgumentException("La cadena JSON de productos está vacía.");
        }

        // Imprime el JSON generado para depuración
        Console.WriteLine($"Productos JSON: {productosJson}");

        // Ejecutar el procedimiento almacenado en la base de datos
        await Database.ExecuteSqlRawAsync(
            "EXEC [dbo].[ActualizarCarrito] @CorreoCliente = {0}, @Productos = {1}",
            correoCliente,  // Primer parámetro: el correo del cliente
            productosJson  // Segundo parámetro: la cadena JSON de los productos
        );
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error al actualizar el carrito: {ex.Message}");
    }
}
public async Task<List<ProductoCarritoDto>> ObtenerCarritoPorCorreoAsync(string correoCliente)
{
    try
    {
        // Depuración: mostrar el correo del cliente
        Console.WriteLine($"Obteniendo productos del carrito para el cliente: {correoCliente}");

        // Ejecutar la consulta SQL para obtener los productos, cantidades, precios, nombres y el nombre del comercio
        var result = await Set<ProductoCarritoDto>()
            .FromSqlRaw("SELECT ProductoID, Cantidad, Precio, NombreProducto, NombreComercio FROM dbo.ObtenerCarritoPorCorreo(@CorreoCliente)", 
                new SqlParameter("@CorreoCliente", correoCliente))
            .ToListAsync();

        // Depuración: mostrar la cantidad de productos obtenidos
        Console.WriteLine($"Se obtuvieron {result.Count} productos en el carrito para el cliente {correoCliente}");

        return result;
    }
    catch (Exception ex)
    {
        // Depuración: mostrar el error detallado
        Console.WriteLine($"Error al obtener productos del carrito para el cliente {correoCliente}: {ex.Message}");
        return new List<ProductoCarritoDto>();  // Retornar una lista vacía en caso de error
    }
}



public async Task<int> AgregarPedidoConProductosAsync(PedidoRequest request)
{
    var connection = (SqlConnection)Database.GetDbConnection();
    await connection.OpenAsync();

    Console.WriteLine("Conexión abierta con la base de datos.");

    using (var command = connection.CreateCommand())
    {
        // Definir el procedimiento almacenado y sus parámetros
        command.CommandText = "EXEC [dbo].[AgregarPedidoConProductosDesdeJSON] @Estado, @CorreoCliente, @CorreoComercio, @CorreoMensajero, @Provincia, @Canton, @Distrito, @Productos";
        command.CommandType = CommandType.Text;

        // Depuración: Imprimir los valores de los parámetros antes de enviarlos
        Console.WriteLine("Parametros enviados:");
        Console.WriteLine($"Estado: {request.Estado}");
        Console.WriteLine($"CorreoCliente: {request.CorreoCliente}");
        Console.WriteLine($"CorreoComercio: {request.CorreoComercio}");
        Console.WriteLine($"CorreoMensajero: {request.CorreoMensajero ?? "No proporcionado"}");
        Console.WriteLine($"Provincia: {request.Provincia}");
        Console.WriteLine($"Canton: {request.Canton}");
        Console.WriteLine($"Distrito: {request.Distrito}");
        Console.WriteLine($"Productos: {request.Productos}");

        // Agregar los parámetros al comando
        command.Parameters.AddWithValue("@Estado", request.Estado);
        command.Parameters.AddWithValue("@CorreoCliente", request.CorreoCliente);
        command.Parameters.AddWithValue("@CorreoComercio", DBNull.Value);
        command.Parameters.AddWithValue("@CorreoMensajero", DBNull.Value);  // Pasar NULL si no se usa
        command.Parameters.AddWithValue("@Provincia", request.Provincia);
        command.Parameters.AddWithValue("@Canton", request.Canton);
        command.Parameters.AddWithValue("@Distrito", request.Distrito);
        command.Parameters.AddWithValue("@Productos", request.Productos);  // JSON de productos

        try
        {
            // Ejecutar el procedimiento y obtener el ID del pedido recién insertado
            var result = await command.ExecuteScalarAsync();
            
            // Depuración: Imprimir el resultado después de ejecutar el procedimiento
            Console.WriteLine("Procedimiento ejecutado con éxito. ID del pedido: " + result);
            return (int)result;  // Retorna el ID del pedido creado
        }
        catch (Exception ex)
        {
            // Depuración: Si hay un error, imprimir el mensaje
            Console.WriteLine("Error al ejecutar el procedimiento: " + ex.Message);
            throw;
        }
    }
}


public async Task EliminarProductosCarritoAsync(string correoCliente, string productIdsJson)
{
    // Ejecutar el procedimiento almacenado con el JSON de los productos
    await Database.ExecuteSqlRawAsync(
        "EXEC [dbo].[EliminarCarrito] @CorreoCliente = {0}, @ProductIDs = {1}",
        correoCliente,  // Primer parámetro: el correo del cliente
        productIdsJson  // Segundo parámetro: el JSON de los ProductIDs
    );
}
public async Task<PedidoClienteDto> ObtenerPedidosPorCorreoClienteAsync(string correoCliente)
{
    try
    {
        Console.WriteLine($"[INFO] Buscando pedidos para el cliente con correo: {correoCliente}");

        var pedidos = new List<PedidoDto>();
        var productos = new List<PedidoProductoDto>();
        var comercios = new List<ComercioPedidoDto>();

        var connection = (SqlConnection)Database.GetDbConnection();
        await connection.OpenAsync();

        using (var command = connection.CreateCommand())
        {
            command.CommandText = "EXEC [dbo].[ObtenerPedidosPorCorreoCliente] @CorreoCliente";
            command.Parameters.Add(new SqlParameter("@CorreoCliente", correoCliente));
            command.CommandType = CommandType.Text;

            using (var reader = await command.ExecuteReaderAsync())
            {
                // Leer el primer conjunto de resultados (Pedidos)
                if (reader.HasRows)
                {
                    while (await reader.ReadAsync())
                    {
                        pedidos.Add(new PedidoDto
                        {
                            PedidoID = reader.GetInt32(reader.GetOrdinal("PedidoID")),
                            Total = reader.IsDBNull(reader.GetOrdinal("Total")) ? (decimal?)null : reader.GetDecimal(reader.GetOrdinal("Total")),
                            CorreoMensajero = reader.IsDBNull(reader.GetOrdinal("CorreoMensajero")) ? null : reader.GetString(reader.GetOrdinal("CorreoMensajero")),
                            FechaCreacion = reader.IsDBNull(reader.GetOrdinal("FechaCreacion")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("FechaCreacion")),
                            CorreoComercio = reader.IsDBNull(reader.GetOrdinal("CorreoComercio")) ? null : reader.GetString(reader.GetOrdinal("CorreoComercio")),
                            Estado = reader.IsDBNull(reader.GetOrdinal("Estado")) ? null : reader.GetString(reader.GetOrdinal("Estado"))  // Añadido para leer el Estado
                        });
                    }
                }
                await reader.NextResultAsync();

                // Leer el segundo conjunto de resultados (Productos)
                if (reader.HasRows)
                {
                    while (await reader.ReadAsync())
                    {
                        productos.Add(new PedidoProductoDto
                        {
                            PedidoID = reader.GetInt32(reader.GetOrdinal("PedidoID")),
                            ProductID = reader.GetInt32(reader.GetOrdinal("ProductID")),
                            ProductoNombre = reader.GetString(reader.GetOrdinal("ProductoNombre")),
                            Cantidad = reader.GetInt32(reader.GetOrdinal("Cantidad")),
                            Precio = reader.GetDecimal(reader.GetOrdinal("Precio")),
                            TotalProducto = reader.GetDecimal(reader.GetOrdinal("TotalProducto"))
                        });
                    }
                }
                await reader.NextResultAsync();

                // Leer el tercer conjunto de resultados (Comercios)
                if (reader.HasRows)
                {
                    while (await reader.ReadAsync())
                    {
                        comercios.Add(new ComercioPedidoDto
                        {
                            PedidoID = reader.GetInt32(reader.GetOrdinal("PedidoID")),
                            ComercioNombre = reader.GetString(reader.GetOrdinal("ComercioNombre")),
                            ComercioImagen = reader.IsDBNull(reader.GetOrdinal("ComercioImagen")) ? null : reader.GetString(reader.GetOrdinal("ComercioImagen"))
                        });
                    }
                }
            }
        }

        return new PedidoClienteDto
        {
            Pedidos = pedidos,
            Productos = productos,
            Comercios = comercios
        };
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[ERROR] Error al obtener los pedidos: {ex.Message}");
        return null;
    }
}











    // Método para insertar un administrador afiliado
    public async Task<string> InsertarAdministradorAfiliadoAsync(AdministradorAfiliadoRequest request, string password)
    {
        try
        {
            await Database.ExecuteSqlRawAsync(
                "EXEC [dbo].[RegistrarAdministradorAfiliado] @Correo = {0}, @Nombre = {1}, @Apellido1 = {2}, @Apellido2 = {3}, @Usuario = {4}, @Password = {5}, @Provincia = {6}, @Canton = {7}, @Distrito = {8}",
                request.Correo,
                request.Nombre,
                request.Apellido1,
                request.Apellido2,
                request.Usuario,
                password,
                request.Provincia,
                request.Canton,
                request.Distrito
            );
            
            return "Administrador afiliado insertado con éxito.";
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error al insertar el administrador afiliado: {ex.Message}");
            return "Error al insertar el administrador afiliado.";
        }
    }

public async Task<string> InsertarRepartidorAsync(RepartidorRequest request, string password)
{
    try
    {
        await Database.ExecuteSqlRawAsync(
            "EXEC [dbo].[RegistrarRepartidor] @Correo = {0}, @Nombre = {1}, @Apellido1 = {2}, @Apellido2 = {3}, @Usuario = {4}, @Password = {5}, @Provincia = {6}, @Canton = {7}, @Distrito = {8}, @Estado = {9}",
            request.Correo,
            request.Nombre,
            request.Apellido1,
            request.Apellido2,
            request.Usuario,
            password,
            request.Provincia,
            request.Canton,
            request.Distrito,
            request.Estado
        );

        return "Repartidor registrado con éxito.";
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error al insertar el repartidor: {ex.Message}");
        return "Error al insertar el repartidor.";
    }
}

public async Task InsertarSolicitudComercioAsync(SolicitudComercioRequest solicitud)
{
    await Database.ExecuteSqlRawAsync(
        "EXEC InsertarSolicitudComercio @Correo = {0}, @Nombre = {1}, @CedulaJuridica = {2}, @NumeroSINPE = {3}, @CorreoAdmin = {4}, @TipoID = {5}, @Provincia = {6}, @Canton = {7}, @Distrito = {8}, @Imagen = {9}",
        solicitud.Correo,
        solicitud.Nombre,
        solicitud.CedulaJuridica,
        solicitud.NumeroSINPE,
        solicitud.CorreoAdmin,
        solicitud.TipoID,
        solicitud.Provincia,
        solicitud.Canton,
        solicitud.Distrito,
        solicitud.Imagen
    );
}
public async Task<List<SolicitudComercioDto>> ObtenerSolicitudesComercioAsync()
{
    try
    {
        Console.WriteLine("Buscando solicitudes de comercio...");

        // Aquí usamos SqlParameter para asegurar que los parámetros se pasan correctamente
        var result = await Set<SolicitudComercioDto>()
            .FromSqlRaw(
                "EXEC [dbo].[ObtenerSolicitudesComercio]"
            )
            .ToListAsync();

        Console.WriteLine($"Se encontraron {result.Count} solicitudes de comercio.");

        return result;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error al obtener las solicitudes de comercio: {ex.Message}");
        return new List<SolicitudComercioDto>();  // Retorna una lista vacía en caso de error
    }
}


public async Task<List<AdministradorDto>> ObtenerAdministradoresAsync()
{
    try
    {
        // Ejecutar el procedimiento almacenado para obtener los administradores
        var result = await Set<AdministradorDto>()
            .FromSqlRaw("EXEC [dbo].[ObtenerAdministradores]")
            .ToListAsync();

        return result;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error al obtener los administradores: {ex.Message}");
        return new List<AdministradorDto>();  // Retorna una lista vacía en caso de error
    }
}


public async Task<string> InsertarAdministradorAsync(AdministradorRequest request)
{
    try
    {
        // Ejecutar el procedimiento almacenado para insertar un administrador
        var result = await Database.ExecuteSqlRawAsync(
            "EXEC [dbo].[InsertarAdministrador] @Cedula = {0}, @Nombre = {1}, @Apellido1 = {2}, @Apellido2 = {3}, @Usuario = {4}, @Password = {5}, @Provincia = {6}, @Canton = {7}, @Distrito = {8}",
            request.Cedula,
            request.Nombre,
            request.Apellido1,
            request.Apellido2,
            request.Usuario,
            request.Password,
            request.Provincia,
            request.Canton,
            request.Distrito
        );

        return "Administrador insertado correctamente.";
    }
    catch (Exception ex)
    {
        // Manejo de error en caso de que falle la inserción
        Console.WriteLine($"Error al insertar administrador: {ex.Message}");
        return "Error al insertar administrador.";
    }
}

public async Task<List<ComercioDto>> ObtenerComerciosAsync()
{
    try
    {
        // Ejecutar el procedimiento almacenado para obtener los comercios
        var result = await Set<ComercioDto>()
            .FromSqlRaw("EXEC [dbo].[ObtenerComercios]")
            .ToListAsync();

        return result;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error al obtener los comercios: {ex.Message}");
        return new List<ComercioDto>();  // Retorna una lista vacía en caso de error
    }
}
public async Task<string> InsertarComercioAsync(ComercioRequest request)
{
    try
    {
        // Ejecutar el procedimiento almacenado para insertar un comercio
        var result = await Database.ExecuteSqlRawAsync(
            "EXEC [dbo].[InsertarComercio] @Correo = {0}, @Nombre = {1}, @CedulaJuridica = {2}, @NumeroSINPE = {3}, @CorreoAdmin = {4}, @TipoID = {5}, @Provincia = {6}, @Canton = {7}, @Distrito = {8}, @Imagen = {9}",
            request.Correo,
            request.Nombre,
            request.CedulaJuridica,
            request.NumeroSINPE,
            request.CorreoAdmin,
            request.TipoID,
            request.Provincia,
            request.Canton,
            request.Distrito,
            request.Imagen
        );

        return "Comercio insertado correctamente.";
    }
    catch (Exception ex)
    {
        // Manejo de error en caso de que falle la inserción
        Console.WriteLine($"Error al insertar comercio: {ex.Message}");
        return "Error al insertar comercio.";
    }
}
// Método para obtener los administradores afiliados
public async Task<List<AdministradorAfiliadoDto>> ObtenerAdministradoresAfiliadosAsync()
{
    try
    {
        Console.WriteLine("Buscando administradores afiliados...");

        // Ejecutar la consulta SQL para obtener los administradores afiliados
        var result = await Set<AdministradorAfiliadoDto>()
            .FromSqlRaw("EXEC [dbo].[ObtenerAdministradoresAfiliados]") // Aquí puedes usar el procedimiento almacenado si es necesario
            .ToListAsync();

        Console.WriteLine($"Se encontraron {result.Count} administradores afiliados.");

        return result;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error al obtener los administradores afiliados: {ex.Message}");
        return new List<AdministradorAfiliadoDto>(); // Retornar una lista vacía en caso de error
    }
}



    public async Task<List<ReporteConsolidadoVentas>> ObtenerReporteConsolidadoVentasAsync()
    {
        var connection = Database.GetDbConnection();
        var reporte = new List<ReporteConsolidadoVentas>();

        try
        {
            await connection.OpenAsync();

            using (var command = connection.CreateCommand())
            {
                command.CommandText = "SELECT * FROM [dbo].[ReporteConsolidadoVentas]";
                command.CommandType = CommandType.Text;

                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        reporte.Add(new ReporteConsolidadoVentas
                        {
                            Cliente = reader.GetString(0),
                            Afiliado = reader.GetString(1),
                            Conductor = reader.GetString(2),
                            Compras = reader.GetInt32(3),
                            MontoTotal = reader.GetDecimal(4),
                            MontoServicio = reader.GetDecimal(5)
                        });
                    }
                }
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error al obtener el reporte consolidado: {ex.Message}");
        }
        finally
        {
            await connection.CloseAsync();
        }

        return reporte;
    }


    // Método para obtener el reporte de ventas por afiliado
    public async Task<List<ReporteVentasPorAfiliado>> ObtenerReporteVentasPorAfiliadoAsync()
    {
        var connection = Database.GetDbConnection();
        var reporte = new List<ReporteVentasPorAfiliado>();

        try
        {
            await connection.OpenAsync();

            using (var command = connection.CreateCommand())
            {
                // Consulta directa a la vista
                command.CommandText = "SELECT * FROM [dbo].[ReporteVentasPorAfiliado]";
                command.CommandType = System.Data.CommandType.Text;

                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        reporte.Add(new ReporteVentasPorAfiliado
                        {
                            Afiliado = reader.GetString(0),
                            Compras = reader.GetInt32(1),
                            MontoTotal = reader.GetDecimal(2),
                            MontoServicio = reader.GetDecimal(3)
                        });
                    }
                }
            }
        }
        finally
        {
            await connection.CloseAsync();
        }

        return reporte;
    }



    public async Task<string> CrearTipoDeComercioAsync(string nombre)
{
    try
    {
        // Ejecutar el procedimiento almacenado para crear un tipo de comercio
        var result = await Database.ExecuteSqlRawAsync(
            "EXEC [dbo].[CrearTipoDeComercio] @Nombre = {0}", nombre);

        return "Tipo de comercio creado correctamente.";
    }
    catch (Exception ex)
    {
        // Manejo de error en caso de que falle la creación
        Console.WriteLine($"Error al crear tipo de comercio: {ex.Message}");
        return "Error al crear tipo de comercio.";
    }
}
public async Task<string> EditarTipoDeComercioAsync(int id, string nombre)
{
    try
    {
        // Ejecutar el procedimiento almacenado para editar el tipo de comercio
        var result = await Database.ExecuteSqlRawAsync(
            "EXEC [dbo].[EditarTipoDeComercio] @ID = {0}, @Nombre = {1}", id, nombre);

        return "Tipo de comercio actualizado correctamente.";
    }
    catch (Exception ex)
    {
        // Manejo de error en caso de que falle la actualización
        Console.WriteLine($"Error al editar tipo de comercio: {ex.Message}");
        return "Error al editar tipo de comercio.";
    }
}
public async Task<string> EliminarTipoDeComercioAsync(int id)
{
    try
    {
        // Ejecutar el procedimiento almacenado para eliminar un tipo de comercio
        var result = await Database.ExecuteSqlRawAsync(
            "EXEC [dbo].[EliminarTipoDeComercio] @ID = {0}", id);

        return "Tipo de comercio eliminado correctamente.";
    }
    catch (Exception ex)
    {
        // Manejo de error en caso de que falle la eliminación
        Console.WriteLine($"Error al eliminar tipo de comercio: {ex.Message}");
        return "Error al eliminar tipo de comercio.";
    }
}

public async Task<List<TipoDeComercioDto>> ObtenerTiposDeComercioAsync()
{
    try
    {
        // Ejecutar la consulta SQL para obtener todos los tipos de comercio
        var result = await Set<TipoDeComercioDto>()
            .FromSqlRaw("EXEC [dbo].[ObtenerTiposDeComercio]")
            .ToListAsync();

        return result;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error al obtener los tipos de comercio: {ex.Message}");
        return new List<TipoDeComercioDto>();  // Retornar una lista vacía en caso de error
    }
}
public async Task<string> InsertarComercioDesdeSolicitudAsync(int solicitudId)
{
    try
    {
        // Llamar al procedimiento almacenado que inserta el comercio y actualiza el estado de la solicitud
        var result = await Database.ExecuteSqlRawAsync(
            "EXEC [dbo].[InsertarComercioDesdeSolicitud] @SolicitudId = {0}",
            solicitudId
        );

        return "Comercio insertado y solicitud aceptada correctamente.";
    }
    catch (Exception ex)
    {
        // Lanza el error para ser manejado por el controlador
        throw new Exception(ex.Message);
    }
}

public async Task<string> RechazarSolicitudAsync(int solicitudId, string comentario)
{
    try
    {
        // Llamar al procedimiento almacenado que agrega el comentario y actualiza el estado de la solicitud
        var result = await Database.ExecuteSqlRawAsync(
            "EXEC [dbo].[RechazarSolicitud] @SolicitudId = {0}, @Comentario = {1}",
            solicitudId, comentario
        );

        return "Solicitud rechazada correctamente con el comentario.";
    }
    catch (Exception ex)
    {
        // Lanza el error para ser manejado por el controlador
        throw new Exception(ex.Message);
    }
}

public async Task<ComentarioRechazo> ObtenerComentarioRechazoAsync(int solicitudId)
{
    try
    {
        Console.WriteLine($"Iniciando la ejecución de ObtenerComentarioRechazoAsync para SolicitudId: {solicitudId}");

        // Ejecutar el procedimiento almacenado que obtiene el comentario de rechazo y la fecha
        var comentarioRechazo = await Set<ComentarioRechazo>()
            .FromSqlRaw("EXEC [dbo].[ObtenerComentarioRechazo] @SolicitudId = {0}", solicitudId)
            .ToListAsync(); // Usamos ToListAsync para ejecutar la consulta correctamente

        // Si no se encontró un comentario, retornar null
        if (comentarioRechazo == null || comentarioRechazo.Count == 0)
        {
            Console.WriteLine($"No se encontró comentario de rechazo para SolicitudId: {solicitudId}");
            return null; // No se encontró el comentario
        }

        // Si se encontró un comentario, se regresa el primer resultado
        var comentario = comentarioRechazo.FirstOrDefault();
        Console.WriteLine($"Comentario encontrado para SolicitudId: {solicitudId}, Comentario: {comentario.Comentario}, Fecha de Rechazo: {comentario.FechaRechazo}");

        return comentario;
    }
    catch (Exception ex)
    {
        // Captura cualquier error y lo imprime
        Console.WriteLine($"Error en ObtenerComentarioRechazoAsync para SolicitudId: {solicitudId}. Detalles del error: {ex.Message}");
        throw new Exception($"Error al obtener el comentario de rechazo: {ex.Message}");
    }
}

public async Task<List<Repartidor>> ObtenerRepartidoresAsync()
{
    try
    {
        var result = await Set<Repartidor>()
            .FromSqlRaw("EXEC [dbo].[ObtenerRepartidores]")
            .ToListAsync();

        Console.WriteLine($"Se obtuvieron {result.Count} repartidores.");
        return result;
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error al obtener repartidores: {ex.Message}");
        return new List<Repartidor>(); // Retorna una lista vacía en caso de error
    }
}

public async Task<string> EditarRepartidorAsync(string correo, RepartidorRequest repartidor)
{
    try
    {
        await Database.ExecuteSqlRawAsync(
            "EXEC [dbo].[EditarRepartidor] @Correo = {0}, @Nombre = {1}, @Apellido1 = {2}, @Apellido2 = {3}, @Provincia = {4}, @Canton = {5}, @Distrito = {6}, @Usuario = {7}, @Estado = {8}",
            correo,
            repartidor.Nombre,
            repartidor.Apellido1,
            repartidor.Apellido2,
            repartidor.Provincia,
            repartidor.Canton,
            repartidor.Distrito,
            repartidor.Usuario,
            repartidor.Estado
        );

        return "Repartidor actualizado con éxito.";
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error al editar repartidor: {ex.Message}");
        return "Error al editar repartidor.";
    }
}
public async Task<string> EliminarRepartidorAsync(string correo)
{
    try
    {
        await Database.ExecuteSqlRawAsync(
            "EXEC [dbo].[EliminarRepartidor] @Correo = {0}",
            correo
        );

        return "Repartidor eliminado con éxito.";
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error al eliminar repartidor: {ex.Message}");
        return "Error al eliminar repartidor.";
    }
}

public async Task<AdministradorAfiliado?> ObtenerAdministradorPorComercioAsync(string correoComercio)
{
    try
    {
        Console.WriteLine($"[INFO] Iniciando método ObtenerAdministradorPorComercioAsync para correoComercio: {correoComercio}");

        // Crear la conexión
        using var connection = (SqlConnection)Database.GetDbConnection();
        await connection.OpenAsync();
        Console.WriteLine("[INFO] Conexión a la base de datos abierta correctamente.");

        using var command = connection.CreateCommand();
        command.CommandText = "EXEC ObtenerAdministradorPorComercio @CorreoComercio";
        command.Parameters.AddWithValue("@CorreoComercio", correoComercio);
        Console.WriteLine($"[INFO] Comando configurado: {command.CommandText} con parámetro @CorreoComercio = {correoComercio}");

        using var reader = await command.ExecuteReaderAsync();
        Console.WriteLine("[INFO] Ejecución del procedimiento almacenado completada.");

        if (await reader.ReadAsync())
        {
            Console.WriteLine("[INFO] Resultados encontrados. Mapeando datos del administrador.");

            // Mapear manualmente los resultados
            var administrador = new AdministradorAfiliado
            {
                Correo = reader.GetString(reader.GetOrdinal("Correo")),
                Nombre = reader.GetString(reader.GetOrdinal("Nombre")),
                Apellido1 = reader.GetString(reader.GetOrdinal("Apellido1")),
                Apellido2 = reader.GetString(reader.GetOrdinal("Apellido2")),
                Usuario = reader.GetString(reader.GetOrdinal("Usuario")),
                Provincia = reader.GetString(reader.GetOrdinal("Provincia")),
                Canton = reader.GetString(reader.GetOrdinal("Canton")),
                Distrito = reader.GetString(reader.GetOrdinal("Distrito"))
            };

            Console.WriteLine($"[INFO] Datos mapeados: {administrador.Correo}, {administrador.Nombre} {administrador.Apellido1} {administrador.Apellido2}");
            return administrador;
        }

        Console.WriteLine("[INFO] No se encontraron resultados para el correoComercio proporcionado.");
        return null; // Si no se encontraron resultados
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[ERROR] Error en ObtenerAdministradorPorComercioAsync: {ex.Message}");
        throw new Exception("Error al ejecutar el procedimiento almacenado ObtenerAdministradorPorComercio", ex);
    }
}

public async Task<string> AgregarProductoAsync(ProductoRequest request)
{
    try
    {
        await Database.ExecuteSqlRawAsync(
            "EXEC AgregarProducto @Precio = {0}, @Categoria = {1}, @Nombre = {2}, @CorreoComercio = {3}",
            request.Precio, request.Categoria, request.Nombre, request.CorreoComercio
        );

        return "Producto agregado correctamente.";
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error al agregar producto: {ex.Message}");
        return "Error al agregar producto.";
    }
}

public async Task<string> EditarProductoAsync(ProductoRequest request)
{
    try
    {
        await Database.ExecuteSqlRawAsync(
            "EXEC EditarProducto @ID = {0}, @Precio = {1}, @Categoria = {2}, @Nombre = {3}, @CorreoComercio = {4}",
            request.ID, request.Precio, request.Categoria, request.Nombre, request.CorreoComercio
        );

        return "Producto editado correctamente.";
    }
    catch (SqlException sqlEx)
    {
        Console.WriteLine($"Error SQL al editar producto: {sqlEx.Message}");
        return $"Error SQL al editar producto: {sqlEx.Message}";
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error general al editar producto: {ex.Message}");
        return "Error general al editar producto.";
    }
}


public async Task<string> EliminarProductoAsync(int id, string correoComercio)
{
    try
    {
        await Database.ExecuteSqlRawAsync(
            "EXEC EliminarProducto @ID = {0}, @CorreoComercio = {1}",
            id, correoComercio
        );

        return "Producto eliminado correctamente.";
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error al eliminar producto: {ex.Message}");
        return "Error al eliminar producto.";
    }
}

public async Task<List<ProductoDto>> ObtenerProductosPorComercioAsync(string correoComercio)
{
    try
    {
        return await Set<ProductoDto>()
            .FromSqlRaw("EXEC ObtenerProductosPorComercio @CorreoComercio = {0}", correoComercio)
            .ToListAsync();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error al obtener productos: {ex.Message}");
        return new List<ProductoDto>();
    }
}

// Método para verificar login de mensajero
public async Task<MensajeroLoginDto> VerificarLoginMensajeroAsync(string correo, string password)
{
    // Parámetros de salida para almacenar los resultados
    var messageParam = new SqlParameter("@Message", SqlDbType.NVarChar, 255) { Direction = ParameterDirection.Output };
    var nombreParam = new SqlParameter("@Nombre", SqlDbType.NVarChar, 255) { Direction = ParameterDirection.Output };
    var apellido1Param = new SqlParameter("@Apellido1", SqlDbType.NVarChar, 255) { Direction = ParameterDirection.Output };
    var apellido2Param = new SqlParameter("@Apellido2", SqlDbType.NVarChar, 255) { Direction = ParameterDirection.Output };
    var usuarioParam = new SqlParameter("@Usuario", SqlDbType.NVarChar, 255) { Direction = ParameterDirection.Output };
    var provinciaParam = new SqlParameter("@Provincia", SqlDbType.NVarChar, 255) { Direction = ParameterDirection.Output };
    var cantonParam = new SqlParameter("@Canton", SqlDbType.NVarChar, 255) { Direction = ParameterDirection.Output };
    var distritoParam = new SqlParameter("@Distrito", SqlDbType.NVarChar, 255) { Direction = ParameterDirection.Output };
    var estadoParam = new SqlParameter("@Estado", SqlDbType.NVarChar, 255) { Direction = ParameterDirection.Output };

    try
    {
        // Ejecutar el procedimiento almacenado usando ExecuteSqlRawAsync
        await Database.ExecuteSqlRawAsync(
            "EXEC [dbo].[LoginMensajero] @Correo = {0}, @Password = {1}, @Message = @Message OUTPUT, " +
            "@Nombre = @Nombre OUTPUT, @Apellido1 = @Apellido1 OUTPUT, @Apellido2 = @Apellido2 OUTPUT, " +
            "@Usuario = @Usuario OUTPUT, @Provincia = @Provincia OUTPUT, @Canton = @Canton OUTPUT, " +
            "@Distrito = @Distrito OUTPUT, @Estado = @Estado OUTPUT",
            correo, password,
            messageParam, nombreParam, apellido1Param, apellido2Param,
            usuarioParam, provinciaParam, cantonParam, distritoParam, estadoParam
        );

        // Verificar si el mensaje de salida es "Correo o contraseña incorrectos"
        if (messageParam.Value?.ToString() == "Correo o contraseña incorrectos")
        {
            return null; // Retornar null si las credenciales son incorrectas
        }

        // Crear un objeto de respuesta con los resultados obtenidos
        return new MensajeroLoginDto
        {
            Message = messageParam.Value?.ToString(),
            Correo = correo,
            Nombre = nombreParam.Value?.ToString(),
            Apellido1 = apellido1Param.Value?.ToString(),
            Apellido2 = apellido2Param.Value?.ToString(),
            Usuario = usuarioParam.Value?.ToString(),
            Provincia = provinciaParam.Value?.ToString(),
            Canton = cantonParam.Value?.ToString(),
            Distrito = distritoParam.Value?.ToString(),
            Estado = estadoParam.Value?.ToString()
        };
    }
    catch (Exception ex)
    {
        // Manejo de excepciones
        Console.WriteLine($"Error al verificar el login: {ex.Message}");
        return null;
    }
}

public async Task<PedidosComercioDto> ObtenerPedidosPorCorreoComercioAsync(string correoComercio)
{
    try
    {
        Console.WriteLine($"[INFO] Buscando pedidos para el comercio con correo: {correoComercio}");

        var pedidos = new List<PedidoDto2>();
        var productos = new List<PedidoProductoDto>();
        var clientes = new List<ClientePedidoDto>();

        var connection = (SqlConnection)Database.GetDbConnection();
        await connection.OpenAsync();

        using (var command = connection.CreateCommand())
        {
            command.CommandText = "EXEC [dbo].[ObtenerPedidosPorCorreoComercio] @CorreoComercio";
            command.Parameters.Add(new SqlParameter("@CorreoComercio", correoComercio));
            command.CommandType = CommandType.Text;

            using (var reader = await command.ExecuteReaderAsync())
            {
                // Leer el primer conjunto de resultados (Pedidos)
                if (reader.HasRows)
                {
                    while (await reader.ReadAsync())
                    {
                        pedidos.Add(new PedidoDto2
                        {
                            PedidoID = reader.GetInt32(reader.GetOrdinal("PedidoID")),
                            Total = reader.IsDBNull(reader.GetOrdinal("Total")) ? (decimal?)null : reader.GetDecimal(reader.GetOrdinal("Total")),
                            CorreoMensajero = reader.IsDBNull(reader.GetOrdinal("CorreoMensajero")) ? null : reader.GetString(reader.GetOrdinal("CorreoMensajero")),
                            FechaCreacion = reader.IsDBNull(reader.GetOrdinal("FechaCreacion")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("FechaCreacion")),
                            CorreoCliente = reader.IsDBNull(reader.GetOrdinal("CorreoCliente")) ? null : reader.GetString(reader.GetOrdinal("CorreoCliente")),
                            Estado = reader.IsDBNull(reader.GetOrdinal("Estado")) ? null : reader.GetString(reader.GetOrdinal("Estado"))
                        });
                    }
                }
                await reader.NextResultAsync();

                // Leer el segundo conjunto de resultados (Productos)
                if (reader.HasRows)
                {
                    while (await reader.ReadAsync())
                    {
                        productos.Add(new PedidoProductoDto
                        {
                            PedidoID = reader.GetInt32(reader.GetOrdinal("PedidoID")),
                            ProductID = reader.GetInt32(reader.GetOrdinal("ProductID")),
                            ProductoNombre = reader.GetString(reader.GetOrdinal("ProductoNombre")),
                            Cantidad = reader.GetInt32(reader.GetOrdinal("Cantidad")),
                            Precio = reader.GetDecimal(reader.GetOrdinal("Precio")),
                            TotalProducto = reader.GetDecimal(reader.GetOrdinal("TotalProducto"))
                        });
                    }
                }
                await reader.NextResultAsync();

                // Leer el tercer conjunto de resultados (Clientes)
                if (reader.HasRows)
                {
                    while (await reader.ReadAsync())
                    {
                        clientes.Add(new ClientePedidoDto
                        {
                            PedidoID = reader.GetInt32(reader.GetOrdinal("PedidoID")),
                            ClienteNombre = reader.GetString(reader.GetOrdinal("ClienteNombre")),
                           
                        });
                    }
                }
            }
        }

        return new PedidosComercioDto
        {
            Pedidos = pedidos,
            Productos = productos,
            Clientes = clientes
        };
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[ERROR] Error al obtener los pedidos: {ex.Message}");
        return null;
    }
}
public async Task<int> CambiarEstadoPedidoAsync(int pedidoID, string nuevoEstado)
{
    try
    {
        // Ejecutamos el procedimiento almacenado y obtenemos el número de filas afectadas
        var result = await Database.ExecuteSqlRawAsync(
            "EXEC [dbo].[CambiarEstadoPedido] @PedidoID = {0}, @NuevoEstado = {1}",
            pedidoID, nuevoEstado);

        return result; // Devuelve el número de filas afectadas (int)
    }
    catch (Exception ex)
    {
        // En caso de error, logueamos y retornamos 0
        Console.WriteLine($"Error al ejecutar el procedimiento: {ex.Message}");
        return 0;
    }
}


}



public class CambiarEstadoPedidoRequest
{
    public int PedidoID { get; set; }
    public string NuevoEstado { get; set; }
}
public class MensajeroLoginDto
{
    public string Message { get; set; }
    public string Correo { get; set; }
    public string Nombre { get; set; }
    public string Apellido1 { get; set; }
    public string Apellido2 { get; set; }
    public string Usuario { get; set; }
    public string Provincia { get; set; }
    public string Canton { get; set; }
    public string Distrito { get; set; }
    public string Estado { get; set; }
}


public class EliminarCarritoRequest
{
    public required string CorreoCliente { get; set; }
    public required List<int> ProductIDs { get; set; }
}

public class PedidoRequest
{
    public string Estado { get; set; }
    public string CorreoCliente { get; set; }
    public string? CorreoComercio { get; set; }  // Hacer este campo opcional, puede ser null
    public string? CorreoMensajero { get; set; }  // Hacer este campo opcional, puede ser null
    public string Provincia { get; set; }
    public string Canton { get; set; }
    public string Distrito { get; set; }
    public string Productos { get; set; }  // El JSON con los productos
    public decimal Total { get; set; }  // El total con IVA
}

public class Pedido
{
    public int ID { get; set; }
    public string Estado { get; set; }
    public decimal Total { get; set; }
    public string CorreoCliente { get; set; }
    public string CorreoComercio { get; set; }
    public string CorreoMensajero { get; set; }
    public string Provincia { get; set; }
    public string Canton { get; set; }
    public string Distrito { get; set; }
}



public class ProductoCarritoDto
{
    public int ProductoID { get; set; }  // ID del producto
    public int Cantidad { get; set; }    // Cantidad del producto en el carrito
    public decimal Precio { get; set; }  // Precio del producto
    public string NombreProducto { get; set; }  // Nombre del producto
    public string NombreComercio { get; set; }  // Nombre del comercio
}




// Clase ComercioZona, que es usada para representar el resultado de la función BuscarComerciosPorZona
public class ComercioZona
{
    public string Nombre { get; set; }
    public string Correo { get; set; }
    public string CedulaJuridica { get; set; }
    public string Provincia { get; set; }
    public string Canton { get; set; }
    public string Distrito { get; set; }
    public string NumeroSINPE { get; set; }
    public string Imagen { get; set; }
}
public class ProductosConFoto
{
    public int ProductoID { get; set; }
    public decimal Precio { get; set; }
    public string Categoria { get; set; }
    public string NombreProducto { get; set; }
    public string CorreoComercio { get; set; }
    public string FotoProducto { get; set; }
}
public class ProductoCarrito
{
    public int ProductoID { get; set; }
    public int Cantidad { get; set; }
}



public class PedidoDto
{
    public int PedidoID { get; set; }
    public decimal? Total { get; set; } // Nullable para manejar valores NULL
    public string? CorreoMensajero { get; set; }
    public DateTime? FechaCreacion { get; set; }
    public string? CorreoComercio { get; set; }
    public string? Estado { get; set; }  // Añadido el campo 'Estado'
}
public class PedidoDto2
{
    public int PedidoID { get; set; }
    public decimal? Total { get; set; }
    public string CorreoMensajero { get; set; }
    public DateTime? FechaCreacion { get; set; }
    public string CorreoCliente { get; set; }
    public string Estado { get; set; }
}

// Model for representing Products (Productos)
public class PedidoProductoDto
{
    public int PedidoID { get; set; }
    public int ProductID { get; set; }
    public string ProductoNombre { get; set; }
    public int Cantidad { get; set; }
    public decimal Precio { get; set; }
    public decimal TotalProducto { get; set; }
}


// Model for representing Commerce information (Comercios)
public class ComercioPedidoDto
{
    public int PedidoID { get; set; }
    public string ComercioNombre { get; set; }
    public string ComercioImagen { get; set; }
}

// Model for combining Orders, Products, and Commerce into a DTO
public class PedidoClienteDto
{
    public List<PedidoDto> Pedidos { get; set; }
    public List<PedidoProductoDto> Productos { get; set; }
    public List<ComercioPedidoDto> Comercios { get; set; }
}


public class ClienteLoginDto
{
    public string Message { get; set; }
    public string Correo { get; set; }
    public string Nombre { get; set; }
    public string Apellido1 { get; set; }
    public string Apellido2 { get; set; }
    public string Telefono { get; set; }
    public string Usuario { get; set; }
    public string Cedula { get; set; }
    public string Provincia { get; set; }
    public string Canton { get; set; }
    public string Distrito { get; set; }
}
public class PedidosComercioDto
{
    public List<PedidoDto2> Pedidos { get; set; }
    public List<PedidoProductoDto> Productos { get; set; }
    public List<ClientePedidoDto> Clientes { get; set; }
}

public class ClientePedidoDto
{
    public int PedidoID { get; set; }
    public string ClienteNombre { get; set; }

}