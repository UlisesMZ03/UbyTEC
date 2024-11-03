using System;

namespace Proyecto1.Models
{
    public class HistorialUsuariosDispositivos
    {
        public int UsuarioId { get; set; }
        public User Usuario { get; set; }

        // Cambiar DispositivoId a tipo string y renombrar la propiedad
        public string DispositivoNumeroSerie { get; set; } // Cambiado de DispositivoId a DispositivoNumeroSerie
        public Dispositivo Dispositivo { get; set; }

        public DateTime FechaTransferencia { get; set; }
    }
}
