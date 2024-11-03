

namespace Proyecto1.Models
{
    public class Pedido
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public User Usuario { get; set; }

        // Cambiar DispositivoId a tipo string y renombrar la propiedad
        public string DispositivoNumeroSerie { get; set; } // Cambiado de DispositivoId a DispositivoNumeroSerie
        public Dispositivo Dispositivo { get; set; }

        public int NumeroPedido { get; set; }
        public DateTime FechaHora { get; set; }
        public decimal MontoTotal { get; set; }
    }
}

