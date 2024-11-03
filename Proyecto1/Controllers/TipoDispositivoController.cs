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
    public class TipoDispositivoController : ControllerBase
    {
        private readonly SmartHomeDbContext _context;

        public TipoDispositivoController(SmartHomeDbContext context)
        {
            _context = context;
        }

        // GET: api/TipoDispositivo
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TipoDispositivo>>> GetTiposDispositivos()
        {
            return await _context.TiposDispositivos.ToListAsync();
        }

        // GET: api/TipoDispositivo/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TipoDispositivo>> GetTipoDispositivo(int id)
        {
            var tipoDispositivo = await _context.TiposDispositivos.FindAsync(id);

            if (tipoDispositivo == null)
            {
                return NotFound();
            }

            return tipoDispositivo;
        }

        [HttpPost]
        public async Task<ActionResult<TipoDispositivo>> PostTipoDispositivo(TipoDispositivo tipoDispositivo)
        {
            // Validaciones
            if (string.IsNullOrEmpty(tipoDispositivo.Nombre))
            {
                return BadRequest("El campo Nombre es requerido.");
            }

            if (string.IsNullOrEmpty(tipoDispositivo.Descripcion))
            {
                return BadRequest("El campo Descripción es requerido.");
            }

            if (tipoDispositivo.TiempoGarantia <= 0)
            {
                return BadRequest("El Tiempo de garantía debe ser mayor que cero.");
            }

            _context.TiposDispositivos.Add(tipoDispositivo);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTipoDispositivo", new { id = tipoDispositivo.Id }, tipoDispositivo);
        }


        // PUT: api/TipoDispositivo/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTipoDispositivo(int id, TipoDispositivo tipoDispositivo)
        {
            // Validar que el ID en la URL coincida con el ID del objeto enviado
            if (id != tipoDispositivo.Id)
            {
                return BadRequest("El ID en la URL no coincide con el ID del tipo de dispositivo.");
            }

            // Validar que los campos requeridos no estén vacíos
            if (string.IsNullOrEmpty(tipoDispositivo.Nombre))
            {
                return BadRequest("El campo Nombre es requerido.");
            }

            if (string.IsNullOrEmpty(tipoDispositivo.Descripcion))
            {
                return BadRequest("El campo Descripción es requerido.");
            }

            if (tipoDispositivo.TiempoGarantia <= 0)
            {
                return BadRequest("El Tiempo de garantía debe ser mayor que cero.");
            }

            // Marcar el tipo de dispositivo como modificado
            _context.Entry(tipoDispositivo).State = EntityState.Modified;

            try
            {
                // Guardar los cambios en la base de datos
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TipoDispositivoExists(id))
                {
                    return NotFound("El tipo de dispositivo no existe.");
                }
                else
                {
                    throw; // Si hubo otro error, lo lanzamos
                }
            }

            // Retornar un estado 204 No Content si la actualización fue exitosa
            return NoContent();
        }

        // POST: api/TipoDispositivo/multiple
        [HttpPost("multiple")]
        public async Task<ActionResult<IEnumerable<TipoDispositivo>>> PostTiposDispositivos(List<TipoDispositivo> tiposDispositivos)
        {
            // Validaciones
            if (tiposDispositivos == null || !tiposDispositivos.Any())
            {
                return BadRequest("La lista de tipos de dispositivos no puede estar vacía.");
            }

            foreach (var tipoDispositivo in tiposDispositivos)
            {
                if (string.IsNullOrEmpty(tipoDispositivo.Nombre))
                {
                    return BadRequest("El campo Nombre es requerido para todos los tipos de dispositivos.");
                }

                if (string.IsNullOrEmpty(tipoDispositivo.Descripcion))
                {
                    return BadRequest("El campo Descripción es requerido para todos los tipos de dispositivos.");
                }

                if (tipoDispositivo.TiempoGarantia <= 0)
                {
                    return BadRequest("El Tiempo de garantía debe ser mayor que cero para todos los tipos de dispositivos.");
                }
            }

            // Agregar todos los tipos de dispositivos a la base de datos
            _context.TiposDispositivos.AddRange(tiposDispositivos);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTiposDispositivos", tiposDispositivos);
        }

        // DELETE: api/TipoDispositivo/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTipoDispositivo(int id)
        {
            var tipoDispositivo = await _context.TiposDispositivos.FindAsync(id);
            if (tipoDispositivo == null)
            {
                return NotFound();
            }

            _context.TiposDispositivos.Remove(tipoDispositivo);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool TipoDispositivoExists(int id)
        {
            return _context.TiposDispositivos.Any(e => e.Id == id);
        }
    }
}
