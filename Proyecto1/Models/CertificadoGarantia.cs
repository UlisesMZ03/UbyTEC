using System;

namespace Proyecto1.Models
{
    public class CertificadoGarantia
    {
        public int Id { get; set; }
        public DateTime FechaCompra { get; set; }
        public DateTime FechaFinGarantia { get; set; }

        public int UsuarioId { get; set; }
        public User Usuario { get; set; }

        // Cambiar DispositivoId a tipo string y renombrar la propiedad
        public string DispositivoNumeroSerie { get; set; } // Cambiado de DispositivoId a DispositivoNumeroSerie
        public Dispositivo Dispositivo { get; set; }
    }
}
