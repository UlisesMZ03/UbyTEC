using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;

[Route("api/[controller]")]
[ApiController]
public class ReportesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ReportesController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpGet("reporte-consolidado-ventas")]
    public async Task<IActionResult> GetReporteConsolidadoVentas()
    {
        try
        {
            var reporte = await _context.ObtenerReporteConsolidadoVentasAsync();
            return Ok(reporte);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"Error al obtener el reporte: {ex.Message}" });
        }
    }



    [HttpGet("reporte-ventas-por-afiliado")]
public async Task<IActionResult> GetReporteVentasPorAfiliado()
{
    try
    {
        var reporte = await _context.ObtenerReporteVentasPorAfiliadoAsync();
        return Ok(reporte);
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { error = $"Error al obtener el reporte: {ex.Message}" });
    }
}

}
