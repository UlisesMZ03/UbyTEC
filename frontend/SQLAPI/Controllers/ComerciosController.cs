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
// Método para obtener todos los comercios
[HttpGet("obtenerComercios")]
public async Task<IActionResult> ObtenerComercios()
{
    try
    {
        // Llamamos al método que obtiene los comercios de la base de datos
        var comercios = await _context.ObtenerComerciosAsync();

        // Devolvemos los comercios como respuesta
        return Ok(comercios);
    }
    catch (Exception ex)
    {
        // En caso de error, retornamos un error 500 con el mensaje de error
        return StatusCode(500, new { error = $"Error al obtener los comercios: {ex.Message}" });
    }
}

    // Método para insertar un comercio
    [HttpPost("insertar")]
    public async Task<IActionResult> InsertarComercio([FromBody] ComercioRequest request)
    {
        // Depuración: Mostrar los datos recibidos en la solicitud
        Console.WriteLine("Datos recibidos para insertar comercio:");
        Console.WriteLine($"Correo: {request.Correo}");
        Console.WriteLine($"Nombre: {request.Nombre}");
        Console.WriteLine($"CedulaJuridica: {request.CedulaJuridica}");
        Console.WriteLine($"NumeroSINPE: {request.NumeroSINPE}");
        Console.WriteLine($"CorreoAdmin: {request.CorreoAdmin}");
        Console.WriteLine($"TipoID: {request.TipoID}");
        Console.WriteLine($"Provincia: {request.Provincia}");
        Console.WriteLine($"Canton: {request.Canton}");
        Console.WriteLine($"Distrito: {request.Distrito}");
        Console.WriteLine($"Imagen: {request.Imagen}");

        if (request == null)
        {
            Console.WriteLine("Error: Los datos del comercio son nulos.");
            return BadRequest("Los datos del comercio son requeridos.");
        }

        try
        {
            // Depuración: Confirmar que el objeto 'request' no es nulo antes de procesarlo
            Console.WriteLine("Iniciando proceso de inserción en la base de datos...");

            // Aquí se llama al método en el contexto de base de datos para insertar el comercio
            var result = await _context.InsertarComercioAsync(request);
            
            // Depuración: Confirmar que la inserción se realizó correctamente
            Console.WriteLine("Comercio insertado correctamente en la base de datos.");

            // Respuesta exitosa
            return Ok(new { message = "Comercio insertado correctamente." });
        }
        catch (Exception ex)
        {
            // Depuración: Capturar y mostrar cualquier error que ocurra
            Console.WriteLine($"Error al insertar el comercio: {ex.Message}");
            return StatusCode(500, new { error = $"Error al insertar el comercio: {ex.Message}" });
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




[HttpPost("solicitarRegistro")]
public async Task<IActionResult> SolicitarComercio([FromBody] SolicitudComercioRequest solicitud)
{
    // Verifica si el modelo es válido
    if (!ModelState.IsValid)
    {
        Console.WriteLine("Modelo no válido.");  // Print cuando el modelo no es válido
        return BadRequest(ModelState);
    }

    try
    {
        // Print para saber si entra a la función
        Console.WriteLine("Entrando a la solicitud de comercio.");

        // Llamada al método que inserta la solicitud en la base de datos
        await _context.InsertarSolicitudComercioAsync(solicitud);

        // Si todo va bien, regresa éxito
        Console.WriteLine("Solicitud de comercio registrada exitosamente.");
        return Ok(new { message = "Solicitud de comercio registrada exitosamente" });
    }
    catch (Exception ex)
    {
        // En caso de un error, se captura y se imprime
        Console.WriteLine($"Error al registrar la solicitud: {ex.Message}");
        return StatusCode(500, new { error = $"Error al registrar la solicitud: {ex.Message}" });
    }
}
[HttpGet("obtenerSolicitudesComercio")]
public async Task<IActionResult> ObtenerSolicitudesComercio()
{
    try
    {
        // Obtener las solicitudes de comercio desde el DbContext
        var solicitudes = await _context.ObtenerSolicitudesComercioAsync();

        // Si no se encuentran solicitudes, retorna un mensaje de no encontrado
        if (solicitudes == null || solicitudes.Count == 0)
        {
            return NotFound(new { error = "No se encontraron solicitudes de comercio" });
        }

        // Retorna las solicitudes de comercio
        return Ok(solicitudes);
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { error = $"Error al obtener las solicitudes de comercio: {ex.Message}" });
    }
}



}
