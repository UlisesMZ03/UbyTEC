using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Diagnostics;

var builder = WebApplication.CreateBuilder(args);

// Configuración de la cadena de conexión para Azure SQL Server
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    var connectionString = builder.Configuration.GetConnectionString("AzureSqlDatabase");

    options.UseSqlServer(connectionString, sqlOptions =>
    {
        sqlOptions.EnableRetryOnFailure(5, TimeSpan.FromSeconds(10), null); // Estrategia de reintento en caso de fallos de conexión
    });
});

// Configuración general de servicios
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configuración de Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Middleware de manejo de excepciones global
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";

        var errorFeature = context.Features.Get<IExceptionHandlerFeature>();
        if (errorFeature != null)
        {
            var exception = errorFeature.Error;

            // Log del error en la consola
            Console.WriteLine($"Error: {exception.Message}");
            Console.WriteLine($"StackTrace: {exception.StackTrace}");

            // Respuesta del error
            await context.Response.WriteAsJsonAsync(new
            {
                error = "Se produjo un error interno en el servidor.",
                details = exception.Message // Para producción, puedes omitir 'details' para mayor seguridad.
            });
        }
    });
});

// Aplicar configuración de CORS
app.UseCors("AllowAllOrigins");

// Middleware adicional
app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();

