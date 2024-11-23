using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
[Route("api/[controller]")]
[ApiController]
public class AdministradorController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AdministradorController(ApplicationDbContext context)
    {
        _context = context;
    }

    // Método para obtener todos los administradores
    [HttpGet("obtenerAdministradores")]
    public async Task<IActionResult> ObtenerAdministradores()
    {
        try
        {
            // Llamamos al método que obtiene los administradores de la base de datos
            var administradores = await _context.ObtenerAdministradoresAsync();

            // Devolvemos los administradores como respuesta
            return Ok(administradores);
        }
        catch (Exception ex)
        {
            // En caso de error, retornamos un error 500 con el mensaje de error
            return StatusCode(500, new { error = $"Error al obtener los administradores: {ex.Message}" });
        }
    }

        // Método para insertar un administrador
    [HttpPost("insertar")]
    public async Task<IActionResult> InsertarAdministrador([FromBody] AdministradorRequest request)
    {
        // Depuración: Mostrar los datos recibidos en la solicitud
        Console.WriteLine("Datos recibidos para insertar administrador:");
        Console.WriteLine($"Cedula: {request.Cedula}");
        Console.WriteLine($"Nombre: {request.Nombre}");
        Console.WriteLine($"Apellido1: {request.Apellido1}");
        Console.WriteLine($"Apellido2: {request.Apellido2}");
        Console.WriteLine($"Usuario: {request.Usuario}");
        Console.WriteLine($"Provincia: {request.Provincia}");
        Console.WriteLine($"Canton: {request.Canton}");
        Console.WriteLine($"Distrito: {request.Distrito}");

        if (request == null)
        {
            Console.WriteLine("Error: Los datos del administrador son nulos.");
            return BadRequest("Los datos del administrador son requeridos.");
        }

        try
        {
            // Depuración: Confirmar que el objeto 'request' no es nulo antes de procesarlo
            Console.WriteLine("Iniciando proceso de inserción en la base de datos...");

            // Aquí se llama al método en el contexto de base de datos para insertar al administrador
            var result = await _context.InsertarAdministradorAsync(request);
            
            // Depuración: Confirmar que la inserción se realizó correctamente
            Console.WriteLine("Administrador insertado correctamente en la base de datos.");

            // Respuesta exitosa
            return Ok(new { message = "Administrador insertado correctamente." });
        }
        catch (Exception ex)
        {
            // Depuración: Capturar y mostrar cualquier error que ocurra
            Console.WriteLine($"Error al insertar el administrador: {ex.Message}");
            return StatusCode(500, new { error = $"Error al insertar el administrador: {ex.Message}" });
        }
    }

    // Método para obtener los administradores afiliados
    [HttpGet("obtenerAdministradoresAfiliados")]
    public async Task<IActionResult> ObtenerAdministradoresAfiliados()
    {
        try
        {
            var administradores = await _context.ObtenerAdministradoresAfiliadosAsync();
            return Ok(administradores);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Error al obtener los administradores afiliados: {ex.Message}" });
        }
    }

}
