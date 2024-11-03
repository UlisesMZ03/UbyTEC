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
    public class ProductoController : ControllerBase
    {
        private readonly SmartHomeDbContext _context;

        public ProductoController(SmartHomeDbContext context)
        {
            _context = context;
        }

        // GET: api/Producto
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductoDto>>> GetProductos()
        {
            var productos = await _context.Productos
                .Include(p => p.Distribuidor)
                .Include(p => p.Dispositivo)
                .ThenInclude(d => d.TipoDispositivo) // Incluir el TipoDispositivo
                .ToListAsync();

            var productosDto = productos.Select(p => new ProductoDto
            {
                Id = p.Id,
                Nombre = p.Nombre,
                NumeroSerieDispositivo = p.NumeroSerieDispositivo,
                DistribuidorCedula = p.DistribuidorCedula,
                Precio = p.Precio,
            }).ToList();

            return Ok(productosDto);
        }

        // GET: api/Producto/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductoDto>> GetProducto(int id)
        {
            var producto = await _context.Productos
                .Include(p => p.Distribuidor)
                .Include(p => p.Dispositivo)
                .ThenInclude(d => d.TipoDispositivo) // Incluir el TipoDispositivo
                .FirstOrDefaultAsync(p => p.Id == id);

            if (producto == null)
            {
                return NotFound();
            }

            var productoDto = new ProductoDto
            {
                Id = producto.Id,
                Nombre = producto.Nombre,
                NumeroSerieDispositivo = producto.NumeroSerieDispositivo,
                DistribuidorCedula = producto.DistribuidorCedula,
                Precio = producto.Precio,
            };

            return Ok(productoDto);
        }

        // GET: api/Producto/{id}/relacionados
        [HttpGet("{id}/relacionados")]
        public async Task<ActionResult<IEnumerable<ProductoDto>>> GetDispositivosRelacionados(int id)
        {
            var producto = await _context.Productos
                .Include(p => p.Dispositivo)
                .ThenInclude(d => d.TipoDispositivo)
                .Include(p => p.Distribuidor) // Asegúrate de incluir el distribuidor
                .FirstOrDefaultAsync(p => p.Id == id);

            if (producto == null)
            {
                return NotFound();
            }

            // Obtener la región del distribuidor del producto
            var regionDistribuidor = producto.Distribuidor.Region;

            // Obtener productos del mismo tipo que están en la misma región
            var tipoDispositivoId = producto.Dispositivo.TipoDispositivoId;
            var productosRelacionados = await _context.Productos
                .Include(p => p.Distribuidor)
                .Include(p => p.Dispositivo)
                .ThenInclude(d => d.TipoDispositivo)
                .Where(p => p.Dispositivo.TipoDispositivoId == tipoDispositivoId
                             && p.Id != producto.Id // Excluye el producto actual
                             && p.Distribuidor.Region == regionDistribuidor) // Filtra por región
                .Select(p => new ProductoDto
                {
                    Id = p.Id,
                    Nombre = p.Nombre,
                    NumeroSerieDispositivo = p.NumeroSerieDispositivo,
                    DistribuidorCedula = p.DistribuidorCedula,
                    Precio = p.Precio,
                })
                .ToListAsync();

            return Ok(productosRelacionados);
        }

        // Método en el controlador ProductoController
        [HttpGet("por-region/{region}")]
        public async Task<ActionResult<IEnumerable<ProductoDto>>> GetProductosPorRegion(string region)
        {
            var productos = await _context.Productos
                .Include(p => p.Distribuidor) // Incluir la información del distribuidor
                .Include(p => p.Dispositivo) // Incluir la información del dispositivo
                .ThenInclude(d => d.TipoDispositivo) // Incluir el TipoDispositivo
                .Where(p => p.Distribuidor.Region == region) // Filtrar por región
                .ToListAsync();

            var productosDto = productos.Select(p => new ProductoDto
            {
                Id = p.Id,
                Nombre = p.Nombre,
                NumeroSerieDispositivo = p.NumeroSerieDispositivo,
                DistribuidorCedula = p.DistribuidorCedula,
                Precio = p.Precio,
            }).ToList();

            if (!productosDto.Any())
            {
                return NotFound(new { message = "No se encontraron productos en la región especificada." });
            }

            return Ok(productosDto);
        }
        // Método en el controlador ProductoController
        [HttpGet("dispositivos-por-region")]
        public async Task<ActionResult<IEnumerable<object>>> GetCantidadDispositivosPorRegion()
        {
            var dispositivosPorRegion = await _context.Productos
                .Include(p => p.Distribuidor) // Incluir la información del distribuidor
                .GroupBy(p => p.Distribuidor.Region)
                .Select(g => new
                {
                    Region = g.Key,
                    Cantidad = g.Count()
                })
                .ToListAsync();

            return Ok(dispositivosPorRegion);
        }

        // GET: api/Producto/detalles/{id}
        [HttpGet("detalles/{id}")]
        public async Task<ActionResult<ProductoDetallesDto>> GetProductoConDetalles(int id)
        {
            var producto = await _context.Productos
                .Include(p => p.Distribuidor)
                .Include(p => p.Dispositivo)
                .ThenInclude(d => d.TipoDispositivo) // Incluir el TipoDispositivo
                .FirstOrDefaultAsync(p => p.Id == id);

            if (producto == null)
            {
                return NotFound();
            }

            var productoDetallesDto = new ProductoDetallesDto
            {
                Id = producto.Id,
                Nombre = producto.Nombre,
                NumeroSerieDispositivo = producto.NumeroSerieDispositivo,
                Precio = producto.Precio,
                Distribuidor = new DistribuidorDto
                {
                    CedulaJuridica = producto.Distribuidor.CedulaJuridica,
                    Nombre = producto.Distribuidor.Nombre,
                    Region = producto.Distribuidor.Region
                },
                Dispositivo = new DispositivoDto
                {
                    NumeroSerie = producto.Dispositivo.NumeroSerie,
                    Marca = producto.Dispositivo.Marca,
                    ConsumoElectrico = producto.Dispositivo.ConsumoElectrico,
                    TipoDispositivoId = producto.Dispositivo.TipoDispositivoId,
                    TipoDispositivo = producto.Dispositivo.TipoDispositivo != null
                        ? new TipoDispositivoDto
                        {
                            Id = producto.Dispositivo.TipoDispositivo.Id,
                            Nombre = producto.Dispositivo.TipoDispositivo.Nombre,
                            Descripcion = producto.Dispositivo.TipoDispositivo.Descripcion,
                            TiempoGarantia = producto.Dispositivo.TipoDispositivo.TiempoGarantia
                        }
                        : null // Manejo del caso en que TipoDispositivo es nulo
                }
            };

            return Ok(productoDetallesDto);
        }

        [HttpPost]
        public async Task<ActionResult<ProductoDto>> PostProducto([FromBody] ProductoCreationDto productoDto)
        {
            var errores = new List<string>();

            // Validaciones
            if (string.IsNullOrWhiteSpace(productoDto.Nombre))
            {
                errores.Add("El nombre del producto es obligatorio.");
            }

            if (string.IsNullOrWhiteSpace(productoDto.NumeroSerieDispositivo))
            {
                errores.Add("El número de serie del dispositivo es obligatorio.");
            }

            if (string.IsNullOrWhiteSpace(productoDto.DistribuidorCedula))
            {
                errores.Add("La cédula del distribuidor es obligatoria.");
            }
            else
            {
                var distribuidor = await _context.Distribuidores
                    .FirstOrDefaultAsync(d => d.CedulaJuridica == productoDto.DistribuidorCedula);
                if (distribuidor == null)
                {
                    errores.Add("El distribuidor no existe.");
                }
            }

            if (productoDto.Precio <= 0)
            {
                errores.Add("El precio debe ser un valor positivo.");
            }

            // Si hay errores, devolverlos
            if (errores.Count > 0)
            {
                return BadRequest(new { errores });
            }

            // Verifica si el número de serie ya existe
            var existingProduct = await _context.Productos
                .FirstOrDefaultAsync(p => p.NumeroSerieDispositivo == productoDto.NumeroSerieDispositivo);
            if (existingProduct != null)
            {
                return BadRequest(new { message = "El número de serie del dispositivo ya existe en la base de datos." });
            }

            // Verifica si el dispositivo existe
            var dispositivo = await _context.Dispositivos
                .FirstOrDefaultAsync(d => d.NumeroSerie == productoDto.NumeroSerieDispositivo);
            if (dispositivo == null)
            {
                return BadRequest(new { message = "El dispositivo no existe." });
            }

            // Crear el nuevo producto y asignarle el dispositivo
            var producto = new Producto
            {
                Nombre = productoDto.Nombre,
                NumeroSerieDispositivo = productoDto.NumeroSerieDispositivo,
                DistribuidorCedula = productoDto.DistribuidorCedula,
                Precio = productoDto.Precio,
                Dispositivo = dispositivo // Asignar directamente el dispositivo
            };

            try
            {
                _context.Productos.Add(producto);
                await _context.SaveChangesAsync();

                // Asignar el producto al dispositivo
                dispositivo.Producto = producto; // Esta línea debería establecer la relación
                await _context.SaveChangesAsync(); // Guardar los cambios en el dispositivo
            }
            catch (DbUpdateException ex)
            {
                string errorMessage = "Error al guardar en la base de datos.";
                if (ex.InnerException != null)
                {
                    errorMessage = ex.InnerException.Message;
                }
                return StatusCode(500, new { message = errorMessage });
            }

            var productoResponse = new ProductoDto
            {
                Id = producto.Id,
                Nombre = producto.Nombre,
                NumeroSerieDispositivo = producto.NumeroSerieDispositivo,
                DistribuidorCedula = producto.DistribuidorCedula,
                Precio = producto.Precio,
            };

            return CreatedAtAction("GetProducto", new { id = producto.Id }, productoResponse);
        }


        // PUT: api/Producto/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProducto(int id, [FromBody] Producto producto)
        {
            if (id != producto.Id)
            {
                return BadRequest();
            }

            var distribuidor = await _context.Distribuidores
                .FirstOrDefaultAsync(d => d.CedulaJuridica == producto.DistribuidorCedula);

            if (distribuidor == null)
            {
                return BadRequest(new { message = "El distribuidor no existe." });
            }

            _context.Entry(producto).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductoExists(id))
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

        // DELETE: api/Producto/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProducto(int id)
        {
            var producto = await _context.Productos.FindAsync(id);
            if (producto == null)
            {
                return NotFound();
            }

            _context.Productos.Remove(producto);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductoExists(int id)
        {
            return _context.Productos.Any(e => e.Id == id);
        }
    }

    // DTO para crear un nuevo producto
    public class ProductoCreationDto
    {
        public string Nombre { get; set; }
        public string NumeroSerieDispositivo { get; set; }
        public string DistribuidorCedula { get; set; } // Usar cédula jurídica
        public decimal Precio { get; set; }
    }

    // DTO para el producto que se devuelve
    public class ProductoDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string NumeroSerieDispositivo { get; set; }
        public string DistribuidorCedula { get; set; }
        public decimal Precio { get; set; }
    }

    // DTO para detalles del producto
    public class ProductoDetallesDto
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string NumeroSerieDispositivo { get; set; }
        public decimal Precio { get; set; }
        public DistribuidorDto Distribuidor { get; set; }
        public DispositivoDto Dispositivo { get; set; }
    }

    // DTO para el distribuidor
    public class DistribuidorDto
    {
        public string CedulaJuridica { get; set; }
        public string Nombre { get; set; }
        public string Region { get; set; }
    }

    // DTO para el dispositivo
    public class DispositivoDto
    {
        public string NumeroSerie { get; set; } // Clave primaria
        public string Marca { get; set; }
        public decimal ConsumoElectrico { get; set; } // Consumo en kWh
        public int TipoDispositivoId { get; set; } // Clave foránea
        public TipoDispositivoDto TipoDispositivo { get; set; } // Información del tipo de dispositivo
    }

    // DTO para el tipo de dispositivo
    public class TipoDispositivoDto
    {
        public int Id { get; set; } // Clave primaria
        public string Nombre { get; set; } // Nombre del tipo de dispositivo
        public string Descripcion { get; set; } // Descripción del tipo de dispositivo
        public int TiempoGarantia { get; set; } // Tiempo de garantía en meses
    }
}
