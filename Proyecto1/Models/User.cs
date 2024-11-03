using Proyecto1.Models;
using System.Collections.Generic;

public class User
{
    public int Id { get; set; }
    public string Nombre { get; set; }
    public string Apellidos { get; set; }
    public string Region { get; set; }
    public string CorreoElectronico { get; set; } // Único
    public string Contrasena { get; set; }

    // Inicializar como lista vacía para evitar que sea obligatorio
    public ICollection<Pedido> Pedidos { get; set; } = new List<Pedido>();
    public ICollection<Factura> Facturas { get; set; } = new List<Factura>();
    public ICollection<DispositivoUsuario> Dispositivos { get; set; } = new List<DispositivoUsuario>();

    // Relación con direcciones de entrega
    public ICollection<DireccionEntrega> DireccionesEntrega { get; set; } = new List<DireccionEntrega>();
}


public class DireccionEntrega
{
    public int Id { get; set; }
    public string Calle { get; set; }
    public string Ciudad { get; set; }
    public string CodigoPostal { get; set; }
    public string Pais { get; set; }

    // Clave foránea opcional, se asigna después de crear el usuario
    public int? UserId { get; set; } // Hacer opcional con `int?`

    // Relación con el usuario, opcional durante la creación
    public User? User { get; set; }
}

