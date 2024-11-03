using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Proyecto1.Models
{
    public class Producto
    {
        [Key]
        public int Id { get; set; } // Clave primaria

        public string Nombre { get; set; } // Nombre del producto

        public string NumeroSerieDispositivo { get; set; } // Referencia al número de serie del dispositivo

        [Required(ErrorMessage = "La cédula jurídica del distribuidor es obligatoria.")]
        public string DistribuidorCedula { get; set; } // Cédula jurídica del distribuidor

        public decimal Precio { get; set; } // Precio del producto

        // Navegación hacia Dispositivo (obligatoria)
        [ForeignKey("NumeroSerieDispositivo")] // Especifica la clave foránea
        public Dispositivo Dispositivo { get; set; } // Un producto debe tener un dispositivo

        // Navegación hacia Distribuidor (obligatoria)
        [Required(ErrorMessage = "El distribuidor es obligatorio.")]
        public Distribuidor Distribuidor { get; set; } // Relación con el distribuidor
    }
}
