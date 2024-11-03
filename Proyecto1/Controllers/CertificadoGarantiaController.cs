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
    public class CertificadoGarantiaController : ControllerBase
    {
        private readonly SmartHomeDbContext _context;

        public CertificadoGarantiaController(SmartHomeDbContext context)
        {
            _context = context;
        }

        // GET: api/CertificadoGarantia
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CertificadoGarantia>>> GetCertificados()
        {
            return await _context.CertificadosGarantia.ToListAsync();
        }

        // GET: api/CertificadoGarantia/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CertificadoGarantia>> GetCertificado(int id)
        {
            var certificado = await _context.CertificadosGarantia.FindAsync(id);

            if (certificado == null)
            {
                return NotFound();
            }

            return certificado;
        }

        // POST: api/CertificadoGarantia
        [HttpPost]
        public async Task<ActionResult<CertificadoGarantia>> PostCertificado(CertificadoGarantia certificado)
        {
            _context.CertificadosGarantia.Add(certificado);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetCertificado", new { id = certificado.Id }, certificado);
        }

        // PUT: api/CertificadoGarantia/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutCertificado(int id, CertificadoGarantia certificado)
        {
            if (id != certificado.Id)
            {
                return BadRequest();
            }

            _context.Entry(certificado).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CertificadoExists(id))
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

        // DELETE: api/CertificadoGarantia/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCertificado(int id)
        {
            var certificado = await _context.CertificadosGarantia.FindAsync(id);
            if (certificado == null)
            {
                return NotFound();
            }

            _context.CertificadosGarantia.Remove(certificado);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool CertificadoExists(int id)
        {
            return _context.CertificadosGarantia.Any(e => e.Id == id);
        }
    }
}
