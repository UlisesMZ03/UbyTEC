using System;
using System.ComponentModel.DataAnnotations;

namespace Proyecto1.Models
{
    public class Factura
    {
        [Key] // Marca NumeroFactura como clave primaria
        public int NumeroFactura { get; set; } // Clave primaria

        public DateTime FechaCompra { get; set; }

        public int UsuarioId { get; set; }
        public User Usuario { get; set; }

        // Cambiar DispositivoId a tipo string y renombrar la propiedad
        public string DispositivoNumeroSerie { get; set; } // Cambiado de DispositivoId a DispositivoNumeroSerie
        public Dispositivo Dispositivo { get; set; }

        public decimal Precio { get; set; }
    }
}
