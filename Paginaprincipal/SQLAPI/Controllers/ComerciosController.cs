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
}
