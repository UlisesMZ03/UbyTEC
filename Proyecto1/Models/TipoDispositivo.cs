using System.Text.Json.Serialization;

namespace Proyecto1.Models
{
    public class TipoDispositivo
    {
        public int Id { get; set; }
        public string Nombre { get; set; }
        public string Descripcion { get; set; }
        public int TiempoGarantia { get; set; }

        // Relación con dispositivos, marcada como JsonIgnore para evitar el ciclo
        [JsonIgnore]
        public ICollection<Dispositivo>? Dispositivos { get; set; } = new List<Dispositivo>();
    }
}