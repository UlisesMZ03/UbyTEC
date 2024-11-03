using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Proyecto1.Models
{
    public class Dispositivo
    {
        [Key]
        public string NumeroSerie { get; set; } // Clave primaria

        public string Marca { get; set; }
        public decimal ConsumoElectrico { get; set; } // Consumo en kWh

        // Clave foránea obligatoria para relacionar con TipoDispositivo
        public int TipoDispositivoId { get; set; }
        public TipoDispositivo? TipoDispositivo { get; set; } = null;

        // Relación opcional con Producto
        public Producto? Producto { get; set; } // Un dispositivo puede no tener un producto

        // Relaciones opcionales
        public ICollection<DispositivoUsuario> DispositivosUsuarios { get; set; } = new List<DispositivoUsuario>();
        public ICollection<Pedido> Pedidos { get; set; } = new List<Pedido>();
        public ICollection<Factura> Facturas { get; set; } = new List<Factura>();
    }
}
