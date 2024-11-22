using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

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
        // Validar los datos del request
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState); // Retorna un error de validación si no es válido
        }

        // Generar una contraseña aleatoria para el repartidor
        string password = GenerateRandomPassword();

        // Insertar el nuevo repartidor en la base de datos
        var result = await _context.InsertarRepartidorAsync(request, password);

        // Verificar si el proceso de inserción fue exitoso
        if (result == "Repartidor registrado con éxito.")
        {
            // Enviar la contraseña generada al correo del repartidor
            await _emailService.SendEmailAsync(request.Correo,password);

            // Responder con el mensaje de éxito
            return Ok(new { message = result });
        }
        else
        {
            // En caso de error, retornar el código de error 500
            return StatusCode(500, new { error = result });
        }
    }

    // Método para generar una contraseña aleatoria de 12 caracteres
    private string GenerateRandomPassword()
    {
        var random = new Random();
        const string validChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        var password = new char[12]; // 12 caracteres para la contraseña

        for (int i = 0; i < password.Length; i++)
        {
            password[i] = validChars[random.Next(validChars.Length)];
        }

        return new string(password);
    }
}
