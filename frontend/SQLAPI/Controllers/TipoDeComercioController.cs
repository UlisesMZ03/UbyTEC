using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

[Route("api/[controller]")]
[ApiController]
public class TiposDeComercioController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public TiposDeComercioController(ApplicationDbContext context)
    {
        _context = context;
    }

    // Método para obtener todos los tipos de comercio
    [HttpGet("obtenerTiposDeComercio")]
    public async Task<IActionResult> ObtenerTiposDeComercio()
    {
        try
        {
            // Llamamos al método que obtiene los tipos de comercio de la base de datos
            var tiposDeComercio = await _context.ObtenerTiposDeComercioAsync();
            Console.WriteLine("Respuesta del obtenertipos");
            // Devolvemos los tipos de comercio como respuesta
            return Ok(tiposDeComercio);
        }
        catch (Exception ex)
        {
            // En caso de error, retornamos un error 500 con el mensaje de error
            return StatusCode(500, new { error = $"Error al obtener los tipos de comercio: {ex.Message}" });
        }
    }

    // Método para insertar un nuevo tipo de comercio
    [HttpPost("insertar")]
    public async Task<IActionResult> InsertarTipoDeComercio([FromBody] TipoDeComercioRequest request)
    {
        if (request == null || string.IsNullOrEmpty(request.Nombre))
        {
            return BadRequest(new { error = "El nombre del tipo de comercio es requerido." });
        }

        try
        {
            var result = await _context.CrearTipoDeComercioAsync(request.Nombre);

            // Respuesta exitosa
            return Ok(new { message = result });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Error al insertar el tipo de comercio: {ex.Message}" });
        }
    }

    // Método para editar un tipo de comercio
    [HttpPut("editar/{id}")]
    public async Task<IActionResult> EditarTipoDeComercio(int id, [FromBody] TipoDeComercioRequest request)
    {
        if (request == null || string.IsNullOrEmpty(request.Nombre))
        {
            return BadRequest(new { error = "El nombre del tipo de comercio es requerido." });
        }

        try
        {
            var result = await _context.EditarTipoDeComercioAsync(id, request.Nombre);

            // Respuesta exitosa
            return Ok(new { message = result });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Error al editar el tipo de comercio: {ex.Message}" });
        }
    }

    // Método para eliminar un tipo de comercio
    [HttpDelete("eliminar/{id}")]
    public async Task<IActionResult> EliminarTipoDeComercio(int id)
    {
        try
        {
            var result = await _context.EliminarTipoDeComercioAsync(id);

            // Respuesta exitosa
            return Ok(new { message = result });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Error al eliminar el tipo de comercio: {ex.Message}" });
        }
    }
}
