using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Proyecto1.Models
{
    public class Distribuidor
    {
        [Key] // Indica que esta propiedad es la clave primaria
        [Required(ErrorMessage = "La cédula jurídica es obligatoria.")]
        public string CedulaJuridica { get; set; } // Único

        [Required(ErrorMessage = "El nombre es obligatorio.")]
        public string Nombre { get; set; }

        [Required(ErrorMessage = "La región es obligatoria.")]
        public string Region { get; set; }

        // Relación con dispositivos, inicializada como lista vacía
        public ICollection<Dispositivo> Dispositivos { get; set; } = new List<Dispositivo>();
    }
}
