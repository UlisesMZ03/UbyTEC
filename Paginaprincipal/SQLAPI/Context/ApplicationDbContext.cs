using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // Método para insertar comercio
    public async Task InsertarComercioAsync(ComercioRequest comercio)
    {
        await Database.ExecuteSqlRawAsync(
            "EXEC InsertarComercio @Correo = {0}, @Nombre = {1}, @CedulaJuridica = {2}, @NumeroSINPE = {3}, @CorreoAdmin = {4}, @TipoID = {5}",
            comercio.Correo,
            comercio.Nombre,
            comercio.CedulaJuridica,
            comercio.NumeroSINPE,
            comercio.CorreoAdmin,
            comercio.TipoID
        );
    }

    // Método para verificar las credenciales usando el procedimiento almacenado
    public async Task<string> VerificarCredencialesAsync(string correo, string password)
    {
        // Usamos FromSqlRaw para obtener el resultado del procedimiento almacenado
        var result = await this.Set<Resultado>().FromSqlRaw(
            "EXEC [dbo].[VerificarCorreoYPasswordCliente] @Correo = {0}, @Password = {1}",
            correo,
            password
        ).ToListAsync();

        // Devuelve el resultado obtenido (asumiendo que el procedimiento devuelve una fila con el valor)
        return result.FirstOrDefault()?.Resultado;
    }
}

// Clase que representa el resultado esperado del procedimiento almacenado
public class Resultado
{
    public string Resultado { get; set; }
}
