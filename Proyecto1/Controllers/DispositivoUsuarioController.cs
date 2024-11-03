using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Proyecto1.Models;

namespace Proyecto1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DispositivoUsuarioController : ControllerBase
    {
        private readonly SmartHomeDbContext _context;

        public DispositivoUsuarioController(SmartHomeDbContext context)
        {
            _context = context;
        }

        // GET: api/DispositivoUsuario
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DispositivoUsuario>>> GetDispositivoUsuarios()
        {
            return await _context.DispositivosUsuarios.ToListAsync();
        }

        // GET: api/DispositivoUsuario/5
        [HttpGet("{id}")]
        public async Task<ActionResult<DispositivoUsuario>> GetDispositivoUsuario(int id)
        {
            var dispositivoUsuario = await _context.DispositivosUsuarios.FindAsync(id);

            if (dispositivoUsuario == null)
            {
                return NotFound();
            }

            return dispositivoUsuario;
        }

        // POST: api/DispositivoUsuario
        [HttpPost]
        public async Task<ActionResult<DispositivoUsuario>> PostDispositivoUsuario(DispositivoUsuario dispositivoUsuario)
        {
            // Validar el usuario
            var user = await _context.Users.FindAsync(dispositivoUsuario.UserId);
            if (user == null)
            {
                return BadRequest("El usuario no existe.");
            }

            // Validar el dispositivo
            var dispositivo = await _context.Dispositivos.FirstOrDefaultAsync(d => d.NumeroSerie == dispositivoUsuario.DispositivoNumeroSerie);
            if (dispositivo == null)
            {
                return BadRequest("El dispositivo no existe.");
            }

            // Asignar el usuario y el dispositivo al dispositivoUsuario
            dispositivoUsuario.User = user;
            dispositivoUsuario.Dispositivo = dispositivo;

            // Asegurarse de que la fecha de asociación sea UTC
            if (dispositivoUsuario.FechaAsociacion.Kind != DateTimeKind.Utc)
            {
                dispositivoUsuario.FechaAsociacion = DateTime.SpecifyKind(dispositivoUsuario.FechaAsociacion, DateTimeKind.Utc);
            }

            // Añadir el objeto a la base de datos
            _context.DispositivosUsuarios.Add(dispositivoUsuario);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDispositivoUsuario", new { id = dispositivoUsuario.Id }, dispositivoUsuario);
        }



        // PUT: api/DispositivoUsuario/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDispositivoUsuario(int id, DispositivoUsuario dispositivoUsuario)
        {
            if (id != dispositivoUsuario.UserId)
            {
                return BadRequest();
            }

            _context.Entry(dispositivoUsuario).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DispositivoUsuarioExists(id))
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

        // DELETE: api/DispositivoUsuario/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDispositivoUsuario(int id)
        {
            var dispositivoUsuario = await _context.DispositivosUsuarios.FindAsync(id);
            if (dispositivoUsuario == null)
            {
                return NotFound();
            }

            _context.DispositivosUsuarios.Remove(dispositivoUsuario);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DispositivoUsuarioExists(int id)
        {
            return _context.DispositivosUsuarios.Any(e => e.UserId == id);
        }
    }
}
