using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

[Route("api/[controller]")]
[ApiController]
public class ComerciosController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly EmailService _emailService;


    public ComerciosController(ApplicationDbContext context, EmailService emailService)
    {
        _context = context;
        _emailService = emailService;

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
            // Generar la contraseña aleatoria para el comercio
            string password = GenerateRandomPassword();

            // Insertar el comercio en la base de datos
            await _context.InsertarComercioAsync(comercio);

            // Enviar la contraseña al correo del comercio registrado


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
[HttpPost("registrarAdmin")]
public async Task<IActionResult> RegistrarAdministradorAfiliado([FromBody] AdministradorAfiliadoRequest request)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }

    // Generar la contraseña aleatoria para el administrador
    string password = GenerateRandomPassword();

    try
    {
        // Insertar el nuevo administrador en la base de datos
        var result = await _context.InsertarAdministradorAfiliadoAsync(request, password);

        if (result == "Administrador afiliado insertado con éxito.")
        {
            // Registrar los valores antes de enviarlos (para logging)
            Console.WriteLine($"Correo a enviar: {request.Correo}");
            Console.WriteLine($"Contraseña generada: {password}");

            // Enviar la contraseña al correo del administrador
            bool emailSent = await _emailService.SendEmailAsync(request.Correo, password);

            if (emailSent)
            {
                return Ok(new { message = result });
            }
            else
            {
                // Si el envío del correo falla
                Console.WriteLine($"Error al enviar el correo a {request.Correo}");
                return StatusCode(500, new { error = "Error al enviar el correo" });
            }
        }
        else
        {
            // Si la inserción en la base de datos falla
            Console.WriteLine($"Error al insertar el administrador: {result}");
            return StatusCode(500, new { error = result });
        }
    }
    catch (Exception ex)
    {
        // Manejo de excepciones generales
        Console.WriteLine($"Excepción al registrar el administrador afiliado: {ex.Message}");
        return StatusCode(500, new { error = $"Error al registrar el administrador: {ex.Message}" });
    }
}



    // Método para generar una contraseña aleatoria de 12 caracteres
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
