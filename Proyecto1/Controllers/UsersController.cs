using Proyecto1.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Proyecto1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly SmartHomeDbContext _context;

        public UsersController(SmartHomeDbContext context)
        {
            _context = context;
        }

        // GET: api/Users
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            return await _context.Users.ToListAsync();
        }

        // GET: api/Users/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }

        // GET: api/Users/{id}/details
        [HttpGet("{id}/details")]
        public async Task<ActionResult<UserDetailsDto>> GetUserDetails(int id)
        {
            var user = await _context.Users
                .Include(u => u.DireccionesEntrega)
                .Where(u => u.Id == id)
                .Select(u => new UserDetailsDto
                {
                    Nombre = u.Nombre,
                    Apellidos = u.Apellidos,
                    Region = u.Region,
                    CorreoElectronico = u.CorreoElectronico,
                    DireccionesEntrega = u.DireccionesEntrega.Select(d => new DireccionEntregaDto
                    {
                        Id = d.Id,
                        Calle = d.Calle,
                        Ciudad = d.Ciudad,
                        CodigoPostal = d.CodigoPostal,
                        Pais = d.Pais
                    }).ToList()
                })
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        // PUT: api/Users/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, User user)
        {
            if (id != user.Id)
            {
                return BadRequest();
            }

            _context.Entry(user).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Users/register
        [Route("register")]
        [HttpPost]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            // Verificar si el correo ya existe
            if (_context.Users.Any(u => u.CorreoElectronico == user.CorreoElectronico))
            {
                return Conflict(new { message = "El correo electrónico ya está en uso." });
            }

            // Agregar el usuario a la base de datos
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Asignar el UserId a cada dirección de entrega asociada
            if (user.DireccionesEntrega != null)
            {
                foreach (var direccion in user.DireccionesEntrega)
                {
                    direccion.UserId = user.Id;
                    _context.DireccionesEntrega.Add(direccion);
                }

                await _context.SaveChangesAsync(); // Guardar las direcciones con el UserId asociado
            }

            return CreatedAtAction("GetUser", new { id = user.Id }, user);
        }

        // POST: api/Users/login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
        {
            // Buscar usuario con el correo electrónico y la contraseña proporcionados
            var user = await _context.Users
                .Where(u => u.CorreoElectronico == loginDto.Email && u.Contrasena == loginDto.Password)
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return Unauthorized(new { message = "Email o contraseña incorrectos" });
            }

            // Si las credenciales son correctas, devolver una respuesta exitosa
            return Ok(new { message = "Login exitoso", userId = user.Id, nombre = user.Nombre });
        }

        // PUT: api/Users/{id}/updateProfile
        [HttpPut("{id}/updateProfile")]
        public async Task<IActionResult> UpdateProfile(int id, [FromBody] UpdateProfileDto updatedProfile)
        {
            if (updatedProfile == null)
            {
                return BadRequest("Datos del perfil no proporcionados.");
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("Usuario no encontrado.");
            }

            // Actualizar solo las propiedades permitidas
            user.Nombre = updatedProfile.Nombre;
            user.Apellidos = updatedProfile.Apellidos;
            user.Region = updatedProfile.Region;

            try
            {
                await _context.SaveChangesAsync();
                return NoContent(); // Devuelve 204 No Content si la actualización fue exitosa
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound("Usuario no encontrado al intentar actualizar.");
                }
                else
                {
                    throw;
                }
            }
        }




        // PUT: api/Users/{id}/updatePassword
        [HttpPut("{id}/updatePassword")]
        public async Task<IActionResult> UpdatePassword(int id, [FromBody] UpdatePasswordDto passwordDto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            if (user.Contrasena != passwordDto.CurrentPassword)
            {
                return BadRequest(new { message = "La contraseña actual es incorrecta." });
            }

            user.Contrasena = passwordDto.NewPassword;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/Users/{id}/addAddress
        [HttpPost("{id}/addAddress")]
        public async Task<ActionResult<DireccionEntrega>> AddAddress(int id, [FromBody] DireccionEntrega direccionEntrega)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            direccionEntrega.UserId = id;
            _context.DireccionesEntrega.Add(direccionEntrega);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUserDetails", new { id = user.Id }, direccionEntrega);
        }

        // PUT: api/Users/{id}/updateAddress/{addressId}
        [HttpPut("{id}/updateAddress/{addressId}")]
        public async Task<IActionResult> UpdateAddress(int id, int addressId, [FromBody] DireccionEntrega direccionEntrega)
        {
            if (direccionEntrega.Id != addressId)
            {
                return BadRequest();
            }

            var address = await _context.DireccionesEntrega.FindAsync(addressId);
            if (address == null || address.UserId != id)
            {
                return NotFound();
            }

            address.Calle = direccionEntrega.Calle;
            address.Ciudad = direccionEntrega.Ciudad;
            address.CodigoPostal = direccionEntrega.CodigoPostal;
            address.Pais = direccionEntrega.Pais;

            _context.Entry(address).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Users/{id}/deleteAddress/{addressId}
        [HttpDelete("{id}/deleteAddress/{addressId}")]
        public async Task<IActionResult> DeleteAddress(int id, int addressId)
        {
            var address = await _context.DireccionesEntrega.FindAsync(addressId);
            if (address == null || address.UserId != id)
            {
                return NotFound();
            }

            _context.DireccionesEntrega.Remove(address);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }

    // DTO para recibir las credenciales de login
    public class LoginDto
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
    public class UpdateProfileDto
    {
        public string Nombre { get; set; }
        public string Apellidos { get; set; }
        public string Region { get; set; }
    }

    // DTO para los detalles del usuario
    public class UserDetailsDto
    {
        public string Nombre { get; set; }
        public string Apellidos { get; set; }
        public string Region { get; set; }
        public string CorreoElectronico { get; set; }
        public List<DireccionEntregaDto> DireccionesEntrega { get; set; }
    }

    // DTO para la entidad DireccionEntrega
    public class DireccionEntregaDto
    {
        public int Id { get; set; }
        public string Calle { get; set; }
        public string Ciudad { get; set; }
        public string CodigoPostal { get; set; }
        public string Pais { get; set; }
    }

    // DTO para actualizar la contraseña
    public class UpdatePasswordDto
    {
        public string CurrentPassword { get; set; }
        public string NewPassword { get; set; }
    }
}
