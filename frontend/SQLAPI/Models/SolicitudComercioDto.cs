public class SolicitudComercioDto
{
    public int Id { get; set; }
    public string Correo { get; set; }
    public string Nombre { get; set; }
    public string CedulaJuridica { get; set; }
    public string NumeroSINPE { get; set; }
    public string CorreoAdmin { get; set; }
    public string TipoID { get; set; }
    public string Provincia { get; set; }
    public string Canton { get; set; }
    public string Distrito { get; set; }
    public string Imagen { get; set; }
    public int? Estado { get; set; }  // Cambiado de string a int? para permitir valores nulos
    public DateTime FechaSolicitud { get; set; }
}
