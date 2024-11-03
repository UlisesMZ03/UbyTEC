using System;

namespace Proyecto1.Models
{
    public class DispositivoUsuario
    {
        public int Id { get; set; }

        public int UserId { get; set; }
        public User? User { get; set; }

        public string DispositivoNumeroSerie { get; set; } 
        public Dispositivo? Dispositivo { get; set; }

        public DateTime FechaAsociacion { get; set; }
        public string Aposento { get; set; }
        public int GarantiaRestante { get; set; }
    }
}
