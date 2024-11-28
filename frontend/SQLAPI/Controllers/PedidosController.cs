using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class PedidosController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PedidosController(ApplicationDbContext context)
    {
        _context = context;
    }

    

[HttpPost("realizar")]
public async Task<IActionResult> RealizarPago([FromBody] PedidoRequest request)
{
    Console.WriteLine("Iniciando el proceso de realizar pago...");

    if (request == null || string.IsNullOrEmpty(request.CorreoCliente) || string.IsNullOrEmpty(request.Productos))
    {
        Console.WriteLine("Datos incompletos recibidos. Retornando error de solicitud.");
        return BadRequest("Datos incompletos.");
    }

    try
    {
        // Depuración: Imprimir los datos recibidos en la solicitud
        Console.WriteLine("Datos recibidos para realizar el pago:");
        Console.WriteLine($"Estado: {request.Estado}");
        Console.WriteLine($"CorreoCliente: {request.CorreoCliente}");
        Console.WriteLine($"CorreoComercio: {request.CorreoComercio ?? "No proporcionado"}");
        Console.WriteLine($"CorreoMensajero: {request.CorreoMensajero ?? "No proporcionado"}");
        Console.WriteLine($"Provincia: {request.Provincia}");
        Console.WriteLine($"Canton: {request.Canton}");
        Console.WriteLine($"Distrito: {request.Distrito}");
        Console.WriteLine($"Productos: {request.Productos}");

        // Si el campo 'CorreoMensajero' es nulo, no lo enviamos al procedimiento
        if (string.IsNullOrEmpty(request.CorreoMensajero))
        {
            request.CorreoMensajero = null; // Asegurarse de que sea null
        }

        // Si el campo 'CorreoComercio' es nulo, no lo enviamos al procedimiento
        if (string.IsNullOrEmpty(request.CorreoComercio))
        {
            request.CorreoComercio = null; // Asegurarse de que sea null
        }

        // Llamamos al método que ejecuta el procedimiento almacenado en la base de datos
        Console.WriteLine("Llamando al método para agregar pedido y productos...");
        var pedidoId = await _context.AgregarPedidoConProductosAsync(request);

        // Confirmación del éxito
        Console.WriteLine($"Pedido creado exitosamente con ID: {pedidoId}");

        // Retornamos el ID del pedido como respuesta
        return Ok(new { PedidoID = pedidoId });
    }
    catch (Exception ex)
    {
        // Manejo de errores
        Console.WriteLine($"Ocurrió un error al realizar el pedido: {ex.Message}");
        return StatusCode(500, new { error = $"Error al realizar el pedido: {ex.Message}" });
    }
    finally
    {
        Console.WriteLine("Finalizando el proceso de realizar pago.");
    }
}
[HttpGet("obtenerPorCorreo")]
public async Task<IActionResult> ObtenerPedidosPorCorreoCliente([FromQuery] string correoCliente)
{
    Console.WriteLine($"[INFO] Iniciando búsqueda de pedidos para el cliente con correo: {correoCliente}");

    if (string.IsNullOrEmpty(correoCliente))
    {
        Console.WriteLine("[ERROR] El correo del cliente es requerido y está vacío.");
        return BadRequest(new { error = "Correo del cliente es requerido" });
    }

    try
    {
        Console.WriteLine("[INFO] Llamando al método ObtenerPedidosPorCorreoClienteAsync...");
        var pedidoClienteDto = await _context.ObtenerPedidosPorCorreoClienteAsync(correoCliente);

        // Verifica si el DTO está vacío
        if (pedidoClienteDto == null || 
            (pedidoClienteDto.Pedidos.Count == 0 && pedidoClienteDto.Productos.Count == 0 && pedidoClienteDto.Comercios.Count == 0))
        {
            Console.WriteLine($"[INFO] No se encontraron pedidos para el cliente con correo: {correoCliente}");
            return NotFound(new { error = "No se encontraron pedidos para este cliente" });
        }

        // Mostrar cantidad de pedidos, productos y comercios encontrados
        Console.WriteLine($"[INFO] Se encontraron {pedidoClienteDto.Pedidos.Count} pedidos, {pedidoClienteDto.Productos.Count} productos y {pedidoClienteDto.Comercios.Count} comercios para el cliente: {correoCliente}");

        // Recorrer y depurar cada uno de los pedidos para identificar posibles valores nulos
        foreach (var pedido in pedidoClienteDto.Pedidos)
        {
            Console.WriteLine($"PedidoID: {pedido.PedidoID}, Total: {pedido.Total}, CorreoMensajero: {pedido.CorreoMensajero ?? "NULL"}, FechaCreacion: {pedido.FechaCreacion?.ToString() ?? "NULL"}, CorreoComercio: {pedido.CorreoComercio ?? "NULL"}, Estado: {pedido.Estado ?? "NULL"}");
        }

        // Recorrer y depurar los productos (usando PedidoProductoDto)
        foreach (var producto in pedidoClienteDto.Productos)
        {
            Console.WriteLine($"ProductoID: {producto.ProductID}, ProductoNombre: {producto.ProductoNombre}, Cantidad: {producto.Cantidad}, Precio: {producto.Precio}, TotalProducto: {producto.TotalProducto}");
        }

        // Recorrer y depurar los comercios
        foreach (var comercio in pedidoClienteDto.Comercios)
        {
            Console.WriteLine($"ComercioID: {comercio.PedidoID}, ComercioNombre: {comercio.ComercioNombre}, ComercioImagen: {comercio.ComercioImagen ?? "NULL"}");
        }

        // Retornar el DTO con los datos obtenidos
        return Ok(pedidoClienteDto);
    }
    catch (Exception ex)
    {
        // Si hay un error, lo capturamos y lo mostramos
        Console.WriteLine($"[ERROR] Error al obtener los pedidos: {ex.Message}");
        return StatusCode(500, new { error = $"Error al obtener los pedidos: {ex.Message}" });
    }
}
[HttpGet("obtenerPorCorreoComercio")]
public async Task<IActionResult> ObtenerPedidosPorCorreoComercio([FromQuery] string correoComercio)
{
    Console.WriteLine($"[INFO] Iniciando búsqueda de pedidos para el comercio con correo: {correoComercio}");

    if (string.IsNullOrEmpty(correoComercio))
    {
        Console.WriteLine("[ERROR] El correo del comercio es requerido y está vacío.");
        return BadRequest(new { error = "Correo del comercio es requerido" });
    }

    try
    {
        Console.WriteLine("[INFO] Llamando al método ObtenerPedidosPorCorreoComercioAsync...");
        var pedidosComercioDto = await _context.ObtenerPedidosPorCorreoComercioAsync(correoComercio);

        // Verifica si el DTO está vacío
        if (pedidosComercioDto == null || 
            (pedidosComercioDto.Pedidos.Count == 0 && pedidosComercioDto.Productos.Count == 0 && pedidosComercioDto.Clientes.Count == 0))
        {
            Console.WriteLine($"[INFO] No se encontraron pedidos para el comercio con correo: {correoComercio}");
            return NotFound(new { error = "No se encontraron pedidos para este comercio" });
        }

        // Mostrar cantidad de pedidos, productos y clientes encontrados
        Console.WriteLine($"[INFO] Se encontraron {pedidosComercioDto.Pedidos.Count} pedidos, {pedidosComercioDto.Productos.Count} productos y {pedidosComercioDto.Clientes.Count} clientes para el comercio: {correoComercio}");

        // Recorrer y depurar cada uno de los pedidos
        foreach (var pedido in pedidosComercioDto.Pedidos)
        {
            Console.WriteLine($"PedidoID: {pedido.PedidoID}, Total: {pedido.Total}, CorreoMensajero: {pedido.CorreoMensajero ?? "NULL"}, FechaCreacion: {pedido.FechaCreacion?.ToString() ?? "NULL"}, Estado: {pedido.Estado ?? "NULL"}");
        }

        // Recorrer y depurar los productos
        foreach (var producto in pedidosComercioDto.Productos)
        {
            Console.WriteLine($"ProductoID: {producto.ProductID}, ProductoNombre: {producto.ProductoNombre}, Cantidad: {producto.Cantidad}, Precio: {producto.Precio}, TotalProducto: {producto.TotalProducto}");
        }

        // Recorrer y depurar los clientes
        foreach (var cliente in pedidosComercioDto.Clientes)
        {
            Console.WriteLine($"ClienteNombre: {cliente.ClienteNombre}");
        }

        // Retornar el DTO con los datos obtenidos
        return Ok(pedidosComercioDto);
    }
    catch (Exception ex)
    {
        // Si hay un error, lo capturamos y lo mostramos
        Console.WriteLine($"[ERROR] Error al obtener los pedidos: {ex.Message}");
        return StatusCode(500, new { error = $"Error al obtener los pedidos: {ex.Message}" });
    }
}



[HttpPost("cambiarEstadoPedido")]
public async Task<IActionResult> CambiarEstadoPedido([FromBody] CambiarEstadoPedidoRequest request)
{
    Console.WriteLine("Iniciando el proceso de cambiar el estado del pedido...");

    // Validar que los datos recibidos sean correctos
    if (request == null || request.PedidoID <= 0 || string.IsNullOrEmpty(request.NuevoEstado))
    {
        Console.WriteLine("Datos incompletos recibidos. Retornando error de solicitud.");
        return BadRequest(new { error = "Datos incompletos. Por favor, proporcione el ID del pedido y el nuevo estado." });
    }

    try
    {
        // Llamamos al método que ejecuta el procedimiento almacenado para cambiar el estado del pedido
        var resultado = await _context.CambiarEstadoPedidoAsync(request.PedidoID, request.NuevoEstado);

        // Si el número de filas afectadas es mayor que 0, la actualización fue exitosa
        if (resultado > 0)
        {
            Console.WriteLine($"Estado del pedido {request.PedidoID} actualizado correctamente a {request.NuevoEstado}.");
            return Ok(new { message = "Estado del pedido actualizado correctamente." });
        }
        else
        {
            Console.WriteLine($"No se pudo actualizar el estado del pedido {request.PedidoID}. Esto puede deberse a un error en la base de datos.");
            return BadRequest(new { error = "No se pudo actualizar el estado del pedido." });
        }
    }
    catch (Exception ex)
    {
        // Manejo de errores
        Console.WriteLine($"Ocurrió un error al cambiar el estado del pedido: {ex.Message}");
        return StatusCode(500, new { error = $"Error al cambiar el estado del pedido: {ex.Message}" });
    }
    finally
    {
        Console.WriteLine("Finalizando el proceso de cambiar el estado del pedido.");
    }
}








}
