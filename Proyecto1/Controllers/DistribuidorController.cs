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
    public class DistribuidorController : ControllerBase
    {
        private readonly SmartHomeDbContext _context;

        public DistribuidorController(SmartHomeDbContext context)
        {
            _context = context;
        }

        // GET: api/Distribuidor
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Distribuidor>>> GetDistribuidores()
        {
            return await _context.Distribuidores.ToListAsync();
        }

        // GET: api/Distribuidor/{cedulaJuridica}
        [HttpGet("{cedulaJuridica}")]
        public async Task<ActionResult<Distribuidor>> GetDistribuidor(string cedulaJuridica)
        {
            var distribuidor = await _context.Distribuidores.FindAsync(cedulaJuridica);

            if (distribuidor == null)
            {
                return NotFound();
            }

            return distribuidor;
        }
        // POST: api/Distribuidor/multiple
        [HttpPost("multiple")]
        public async Task<ActionResult<IEnumerable<Distribuidor>>> PostDistribuidores(List<Distribuidor> distribuidores)
        {
            if (distribuidores == null || !distribuidores.Any())
            {
                return BadRequest("La lista de distribuidores no puede estar vacía.");
            }

            foreach (var distribuidor in distribuidores)
            {
                // Verificar si la cédula jurídica ya existe
                if (_context.Distribuidores.Any(d => d.CedulaJuridica == distribuidor.CedulaJuridica))
                {
                    return Conflict(new { message = $"La cédula jurídica {distribuidor.CedulaJuridica} ya está en uso." });
                }
            }

            // Agregar todos los distribuidores a la base de datos
            _context.Distribuidores.AddRange(distribuidores);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDistribuidores", distribuidores);
        }

        // POST: api/Distribuidor
        [HttpPost]
        public async Task<ActionResult<Distribuidor>> PostDistribuidor(Distribuidor distribuidor)
        {
            // Verificar si la cédula jurídica ya existe
            if (_context.Distribuidores.Any(d => d.CedulaJuridica == distribuidor.CedulaJuridica))
            {
                return Conflict(new { message = "La cédula jurídica ya está en uso." });
            }

            _context.Distribuidores.Add(distribuidor);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDistribuidor", new { cedulaJuridica = distribuidor.CedulaJuridica }, distribuidor);
        }

        // PUT: api/Distribuidor/{cedulaJuridica}
        [HttpPut("{cedulaJuridica}")]
        public async Task<IActionResult> PutDistribuidor(string cedulaJuridica, Distribuidor distribuidor)
        {
            if (cedulaJuridica != distribuidor.CedulaJuridica)
            {
                return BadRequest();
            }

            _context.Entry(distribuidor).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DistribuidorExists(cedulaJuridica))
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

        // DELETE: api/Distribuidor/{cedulaJuridica}
        [HttpDelete("{cedulaJuridica}")]
        public async Task<IActionResult> DeleteDistribuidor(string cedulaJuridica)
        {
            var distribuidor = await _context.Distribuidores.FindAsync(cedulaJuridica);
            if (distribuidor == null)
            {
                return NotFound();
            }

            _context.Distribuidores.Remove(distribuidor);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DistribuidorExists(string cedulaJuridica)
        {
            return _context.Distribuidores.Any(e => e.CedulaJuridica == cedulaJuridica);
        }
    }
}
