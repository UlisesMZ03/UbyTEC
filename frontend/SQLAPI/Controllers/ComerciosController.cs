using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class ComerciosController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ComerciosController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("registrar")]
    public async Task<IActionResult> RegistrarComercio([FromBody] ComercioRequest comercio)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            await _context.InsertarComercioAsync(comercio);
            return Ok(new { message = "Comercio registrado exitosamente" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Error al registrar el comercio: {ex.Message}" });
        }
    }

    [HttpGet("buscarZona")]
    public async Task<IActionResult> BuscarComerciosPorZona([FromQuery] string provincia, [FromQuery] string canton)
    {
        if (string.IsNullOrEmpty(provincia) || string.IsNullOrEmpty(canton))
        {
            return BadRequest(new { error = "Provincia y Cantón son requeridos" });
        }

        try
        {
            var comercios = await _context.BuscarComerciosPorZonaAsync(provincia, canton);
            return Ok(comercios);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Error al buscar comercios: {ex.Message}" });
        }
    }
    [HttpGet("buscarProductosConFotos")]
public async Task<IActionResult> BuscarProductosConFotos([FromQuery] string correoComercio)
{   
    Console.WriteLine($"Buscando productos con fotos para el comercio con correo: {correoComercio}");
    if (string.IsNullOrEmpty(correoComercio))
    {
        return BadRequest(new { error = "Correo del comercio es requerido" });
    }

    try
    {
        // Llamar al método en el DbContext para obtener los productos con fotos
        var productosConFotos = await _context.ObtenerProductosConFotosAsync(correoComercio);

        if (productosConFotos == null || productosConFotos.Count == 0)
        {
            return NotFound(new { error = "No se encontraron productos con fotos para este comercio" });
        }

        return Ok(productosConFotos);
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { error = $"Error al obtener productos con fotos: {ex.Message}" });
    }
}

}
