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
    public class FacturaController : ControllerBase
    {
        private readonly SmartHomeDbContext _context;

        public FacturaController(SmartHomeDbContext context)
        {
            _context = context;
        }

        // GET: api/Factura
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Factura>>> GetFacturas()
        {
            // Incluye el Dispositivo relacionado al obtener las facturas
            return await _context.Facturas.Include(f => f.Dispositivo).ToListAsync();
        }

        // GET: api/Factura/5
        [HttpGet("{NumeroFactura}")]
        public async Task<ActionResult<Factura>> GetFactura(int NumeroFactura)
        {
            var factura = await _context.Facturas
                .Include(f => f.Dispositivo) // Incluye el Dispositivo relacionado
                .FirstOrDefaultAsync(f => f.NumeroFactura == NumeroFactura);

            if (factura == null)
            {
                return NotFound();
            }

            return factura;
        }

        // POST: api/Factura
        [HttpPost]
        public async Task<ActionResult<Factura>> PostFactura(Factura factura)
        {
            // Asegúrate de que el DispositivoNumeroSerie esté asignado
            if (string.IsNullOrEmpty(factura.DispositivoNumeroSerie))
            {
                return BadRequest("El número de serie del dispositivo es obligatorio.");
            }

            _context.Facturas.Add(factura);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetFactura", new { NumeroFactura = factura.NumeroFactura }, factura);
        }

        // PUT: api/Factura/5
        [HttpPut("{NumeroFactura}")]
        public async Task<IActionResult> PutFactura(int NumeroFactura, Factura factura)
        {
            if (NumeroFactura != factura.NumeroFactura)
            {
                return BadRequest();
            }

            _context.Entry(factura).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!FacturaExists(NumeroFactura))
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

        // DELETE: api/Factura/5
        [HttpDelete("{NumeroFactura}")]
        public async Task<IActionResult> DeleteFactura(int NumeroFactura)
        {
            var factura = await _context.Facturas.FindAsync(NumeroFactura);
            if (factura == null)
            {
                return NotFound();
            }

            _context.Facturas.Remove(factura);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FacturaExists(int NumeroFactura)
        {
            return _context.Facturas.Any(e => e.NumeroFactura == NumeroFactura);
        }
    }
}
