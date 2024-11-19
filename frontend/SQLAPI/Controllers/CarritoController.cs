using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;  // Asegúrate de incluir esto para las listas
using System.Text.Json;

[Route("api/[controller]")]
[ApiController]
public class CarritoController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public CarritoController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("actualizar")]
    public async Task<IActionResult> ActualizarCarrito([FromBody] CarritoRequest request)
    {
        Console.WriteLine("Entrando al método ActualizarCarrito");

        if (!ModelState.IsValid)
        {
            Console.WriteLine("Modelo no válido, retornando BadRequest");
            return BadRequest(ModelState);
        }
        
        try
        {
            Console.WriteLine("Llamando a ActualizarCarritoAsync...");
            // Aquí se pasan los productos y el correo cliente para su procesamiento
            await _context.ActualizarCarritoAsync(request.CorreoCliente, request.Productos);
            Console.WriteLine("Carrito actualizado correctamente");
            return Ok(new { message = "Carrito actualizado correctamente" });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error en ActualizarCarrito: {ex.Message}");
            return StatusCode(500, new { error = $"Error al actualizar el carrito: {ex.Message}" });
        }
    }
[HttpGet("buscarCarrito")]
public async Task<IActionResult> BuscarCarrito([FromQuery] string correoCliente)
{
    Console.WriteLine($"Buscando productos del carrito para el cliente con correo: {correoCliente}");

    if (string.IsNullOrEmpty(correoCliente))
    {
        return BadRequest(new { error = "Correo del cliente es requerido" });
    }

    try
    {
        // Llamar al método en el DbContext para obtener los productos del carrito
        var productosDelCarrito = await _context.ObtenerCarritoPorCorreoAsync(correoCliente);

        if (productosDelCarrito == null || productosDelCarrito.Count == 0)
        {
            return NotFound(new { error = "No se encontraron productos en el carrito para este cliente" });
        }

        return Ok(productosDelCarrito);
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { error = $"Error al obtener productos del carrito: {ex.Message}" });
    }
}
    // Método para eliminar productos del carrito
    [HttpPost("eliminar")]
    public async Task<IActionResult> EliminarProductosDelCarrito([FromBody] EliminarCarritoRequest request)
    {
        if (string.IsNullOrEmpty(request.CorreoCliente) || request.ProductIDs == null || request.ProductIDs.Count == 0)
        {
            return BadRequest(new { error = "CorreoCliente y ProductIDs son requeridos" });
        }

        try
        {
            // Convertir la lista de IDs de productos a JSON
            string productIdsJson = JsonSerializer.Serialize(request.ProductIDs);

            // Llamamos al método que ejecuta el procedimiento almacenado
            await _context.EliminarProductosCarritoAsync(request.CorreoCliente, productIdsJson);

            return Ok(new { message = "Productos eliminados del carrito correctamente" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Error al eliminar productos del carrito: {ex.Message}" });
        }
    }
    public class EliminarCarritoRequest
    {
        public string CorreoCliente { get; set; }
        public List<int> ProductIDs { get; set; }
    }
}

