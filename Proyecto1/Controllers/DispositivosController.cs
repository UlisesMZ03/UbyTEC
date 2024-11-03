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
    public class DispositivosController : ControllerBase
    {
        private readonly SmartHomeDbContext _context;

        public DispositivosController(SmartHomeDbContext context)
        {
            _context = context;
        }

        // GET: api/Dispositivos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Dispositivo>>> GetDispositivos()
        {
            return await _context.Dispositivos
                .Include(d => d.TipoDispositivo) // Incluye los datos del TipoDispositivo relacionado
                .ToListAsync();
        }

        // GET: api/Dispositivos/{numeroSerie}
        [HttpGet("{numeroSerie}")]
        public async Task<ActionResult<Dispositivo>> GetDispositivo(string numeroSerie)
        {
            var dispositivo = await _context.Dispositivos
                .Include(d => d.TipoDispositivo) // Incluye los datos del TipoDispositivo relacionado
                .FirstOrDefaultAsync(d => d.NumeroSerie == numeroSerie);

            if (dispositivo == null)
            {
                return NotFound();
            }

            return dispositivo;
        }

        // POST: api/Dispositivos
        [HttpPost]
        public async Task<ActionResult<Dispositivo>> PostDispositivo(Dispositivo dispositivo)
        {
            // Validar si el TipoDispositivoId existe
            var tipoDispositivo = await _context.TiposDispositivos.FindAsync(dispositivo.TipoDispositivoId);
            if (tipoDispositivo == null)
            {
                return BadRequest(new { message = "El TipoDispositivo no existe." });
            }

            // Asignar el TipoDispositivo encontrado al dispositivo
            dispositivo.TipoDispositivo = tipoDispositivo;

            _context.Dispositivos.Add(dispositivo);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDispositivo", new { numeroSerie = dispositivo.NumeroSerie }, dispositivo);
        }
        // POST: api/Dispositivos/multiple
        [HttpPost("multiple")]
        public async Task<ActionResult<IEnumerable<Dispositivo>>> PostDispositivos(List<Dispositivo> dispositivos)
        {
            if (dispositivos == null || !dispositivos.Any())
            {
                return BadRequest("La lista de dispositivos no puede estar vacía.");
            }

            foreach (var dispositivo in dispositivos)
            {
                // Validar si el TipoDispositivoId existe
                var tipoDispositivo = await _context.TiposDispositivos.FindAsync(dispositivo.TipoDispositivoId);
                if (tipoDispositivo == null)
                {
                    return BadRequest(new { message = $"El TipoDispositivoId {dispositivo.TipoDispositivoId} no existe." });
                }

                // Asignar el TipoDispositivo encontrado al dispositivo
                dispositivo.TipoDispositivo = tipoDispositivo;
            }

            // Agregar todos los dispositivos a la base de datos
            _context.Dispositivos.AddRange(dispositivos);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetDispositivos", dispositivos);
        }

        // PUT: api/Dispositivos/{numeroSerie}
        [HttpPut("{numeroSerie}")]
        public async Task<IActionResult> PutDispositivo(string numeroSerie, Dispositivo dispositivo)
        {
            // Verifica que el número de serie en la URL coincida con el del dispositivo proporcionado
            if (numeroSerie != dispositivo.NumeroSerie)
            {
                return BadRequest(new { message = "No se puede cambiar el número de serie." });
            }

            // Busca el dispositivo existente en la base de datos
            var existingDispositivo = await _context.Dispositivos.FindAsync(numeroSerie);
            if (existingDispositivo == null)
            {
                return NotFound(new { message = "Dispositivo no encontrado." }); // Mensaje de error
            }

            // Validar que el TipoDispositivoId exista en la base de datos
            var tipoDispositivo = await _context.TiposDispositivos.FindAsync(dispositivo.TipoDispositivoId);
            if (tipoDispositivo == null)
            {
                return BadRequest(new { message = "El TipoDispositivoId proporcionado no es válido." });
            }

            // Actualiza solo los campos permitidos
            existingDispositivo.Marca = dispositivo.Marca; // Cambia solo la marca
            existingDispositivo.ConsumoElectrico = dispositivo.ConsumoElectrico; // Cambia solo el consumo eléctrico
            existingDispositivo.TipoDispositivoId = dispositivo.TipoDispositivoId; // Cambia el tipo de dispositivo
            existingDispositivo.TipoDispositivo = tipoDispositivo; // Asigna el tipo de dispositivo encontrado

            _context.Entry(existingDispositivo).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DispositivoExists(numeroSerie))
                {
                    return NotFound(new { message = "Dispositivo no encontrado." });
                }
                else
                {
                    throw;
                }
            }

            // Devuelve un mensaje de éxito en lugar del dispositivo
            return Ok(new { message = "Dispositivo actualizado exitosamente." });
        }



        // DELETE: api/Dispositivos/{numeroSerie}
        [HttpDelete("{numeroSerie}")]
        public async Task<IActionResult> DeleteDispositivo(string numeroSerie)
        {
            var dispositivo = await _context.Dispositivos.FindAsync(numeroSerie);
            if (dispositivo == null)
            {
                return NotFound();
            }

            _context.Dispositivos.Remove(dispositivo);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool DispositivoExists(string numeroSerie)
        {
            return _context.Dispositivos.Any(e => e.NumeroSerie == numeroSerie);
        }
    }
}
