using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class LoginController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public LoginController(ApplicationDbContext context)
    {
        _context = context;
    }

[HttpPost("client")]
public async Task<IActionResult> LoginCliente([FromBody] LoginRequest request)
{
    var result = await _context.VerificarLoginClienteAsync(request.Correo, request.Password);
    
    // Verificar si el resultado es nulo o si el mensaje es "Correo o contraseña incorrectos"
    if (result == null || result.Message == "Correo o contraseña incorrectos")
    {
        return Unauthorized(new { Message = "Correo o contraseña incorrectos" });
    }
    
    // Devuelve los datos del cliente si el login es exitoso
    return Ok(result);
}




    // Endpoint para administradores
    [HttpPost("admin")]
    public async Task<IActionResult> LoginAdmin([FromBody] LoginAdminRequest loginAdminRequest)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            // Llamar al procedimiento almacenado para verificar el login del admin
            string mensaje = await _context.VerificarLoginAdminAsync(loginAdminRequest.Usuario, loginAdminRequest.Password);

            if (mensaje == "Login exitoso")
            {
                return Ok(new { message = mensaje });
            }
            else
            {
                return Unauthorized(new { error = mensaje });
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Error al intentar iniciar sesión: {ex.Message}" });
        }
    }

    // Endpoint para clientes
    [HttpPost("adminComercio")]
    public async Task<IActionResult> LoginAdminCom([FromBody] LoginRequest loginRequest)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            // Llamar al procedimiento almacenado para verificar el login del cliente
            string mensaje = await _context.VerificarLoginAdminComAsync(loginRequest.Correo, loginRequest.Password);

            if (mensaje == "Login exitoso")
            {
                return Ok(new { message = mensaje });
            }
            else
            {
                return Unauthorized(new { error = mensaje });
            }
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Error al intentar iniciar sesión: {ex.Message}" });
        }
    }


[HttpPost("mensajero")]
public async Task<IActionResult> LoginMensajero([FromBody] LoginRequest request)
{
    var result = await _context.VerificarLoginMensajeroAsync(request.Correo, request.Password);

    // Verificar si el resultado es nulo o si el mensaje es "Correo o contraseña incorrectos"
    if (result == null || result.Message == "Correo o contraseña incorrectos")
    {
        return Unauthorized(new { Message = "Correo o contraseña incorrectos" });
    }

    // Devuelve los datos del mensajero si el login es exitoso
    return Ok(result);
}


}
