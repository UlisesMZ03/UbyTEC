using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;

[Route("api/[controller]")]
[ApiController]
public class RepartidorController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly EmailService _emailService;

    public RepartidorController(ApplicationDbContext context, EmailService emailService)
    {
        _context = context;
        _emailService = emailService;
    }

    // Ruta para registrar el repartidor
    [HttpPost("registrarRepartidor")]
    public async Task<IActionResult> RegistrarRepartidor([FromBody] RepartidorRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        string password = GenerateRandomPassword();
        var result = await _context.InsertarRepartidorAsync(request, password);

        if (result == "Repartidor registrado con éxito.")
        {
            await _emailService.SendEmailAsync(request.Correo, password);
            return Ok(new { message = result });
        }
        else
        {
            return StatusCode(500, new { error = result });
        }
    }

    // Ruta para obtener todos los repartidores
    [HttpGet("obtenerRepartidores")]
    public async Task<IActionResult> ObtenerRepartidores()
    {
        var repartidores = await _context.ObtenerRepartidoresAsync();
        return Ok(repartidores);
    }

    // Ruta para editar un repartidor
    [HttpPut("editarRepartidor/{correo}")]
    public async Task<IActionResult> EditarRepartidor(string correo, [FromBody] RepartidorRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result = await _context.EditarRepartidorAsync(correo, request);

        if (result == "Repartidor actualizado con éxito.")
        {
            return Ok(new { message = result });
        }
        else
        {
            return StatusCode(500, new { error = result });
        }
    }

    // Ruta para eliminar un repartidor
    [HttpDelete("eliminarRepartidor/{correo}")]
    public async Task<IActionResult> EliminarRepartidor(string correo)
    {
        var result = await _context.EliminarRepartidorAsync(correo);

        if (result == "Repartidor eliminado con éxito.")
        {
            return Ok(new { message = result });
        }
        else
        {
            return StatusCode(500, new { error = result });
        }
    }

    // Método para generar una contraseña aleatoria
    private string GenerateRandomPassword()
    {
        var random = new Random();
        const string validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        var password = new char[12];

        for (int i = 0; i < password.Length; i++)
        {
            password[i] = validChars[random.Next(validChars.Length)];
        }

        return new string(password);
    }
}
