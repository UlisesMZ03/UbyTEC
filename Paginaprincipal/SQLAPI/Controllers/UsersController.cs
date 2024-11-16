using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly string _secretKey = "your_secret_key_here"; // Utiliza una clave secreta fuerte y guárdala en un lugar seguro, como el archivo de configuración

    public UsersController(ApplicationDbContext context)
    {
        _context = context;
    }

    // POST: api/users/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest loginRequest)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        // Verificar las credenciales llamando al procedimiento almacenado
        var resultado = await _context.VerificarCredencialesAsync(loginRequest.Email, loginRequest.Password);

        if (resultado == "Credenciales válidas")
        {
            // Generar el token JWT si las credenciales son válidas
            var token = GenerateJwtToken(loginRequest.Email);
            return Ok(new { message = "Login exitoso", token });
        }

        return Unauthorized(new { message = "Credenciales inválidas" });
    }

    // Método para generar un JWT
    private string GenerateJwtToken(string email)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.Name, email),  // Añadir el email como claim
            new Claim(ClaimTypes.Role, "client") // Puedes añadir más claims, como roles
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));  // Utiliza la clave secreta
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: "your-issuer",  // Configura esto adecuadamente
            audience: "your-audience",  // Configura esto adecuadamente
            claims: claims,
            expires: DateTime.Now.AddHours(1), // El token expirará en 1 hora
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token); // Convertir el token a cadena
    }
}

public class LoginRequest
{
    public string Email { get; set; }
    public string Password { get; set; }
}
