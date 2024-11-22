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

    // Método para insertar comercio
    public async Task InsertarComercioAsync(ComercioRequest comercio)
    {
        await Database.ExecuteSqlRawAsync(
            "EXEC InsertarComercio @Correo = {0}, @Nombre = {1}, @CedulaJuridica = {2}, @NumeroSINPE = {3}, @CorreoAdmin = {4}, @TipoID = {5}",
            comercio.Correo,
            comercio.Nombre,
            comercio.CedulaJuridica,
            comercio.NumeroSINPE,
            comercio.CorreoAdmin,
            comercio.TipoID
        );
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
