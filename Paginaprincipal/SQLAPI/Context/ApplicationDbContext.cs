using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

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
}
