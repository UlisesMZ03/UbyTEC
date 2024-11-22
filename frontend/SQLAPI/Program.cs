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
builder.Services.AddControllers();  // Registrar servicios para los controladores
// Registra HttpClient y EmailService en el contenedor de dependencias
builder.Services.AddHttpClient(); // Agrega HttpClient
builder.Services.AddTransient<EmailService>(); // Registra EmailService

// Configuración de Swagger para la documentación de la API
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuración de CORS para permitir solicitudes desde cualquier origen, método y encabezado
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins", policy =>
    {
        policy.AllowAnyOrigin()    // Permitir cualquier origen
              .AllowAnyMethod()    // Permitir cualquier método (GET, POST, PUT, DELETE, etc.)
              .AllowAnyHeader();   // Permitir cualquier encabezado
    });
});

var app = builder.Build();  // Construir la aplicación

// Configuración de Middleware
if (app.Environment.IsDevelopment())
{
    // Usar Swagger solo en el entorno de desarrollo
    app.UseSwagger();
    app.UseSwaggerUI();  // Configuración de la interfaz de usuario de Swagger
}

// Middleware de manejo de excepciones global
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = 500;  // Configura el código de estado HTTP
        context.Response.ContentType = "application/json";  // Establece el tipo de contenido como JSON

        var errorFeature = context.Features.Get<IExceptionHandlerFeature>();
        if (errorFeature != null)
        {
            var exception = errorFeature.Error;

            // Log del error en la consola
            Console.WriteLine($"Error: {exception.Message}");
            Console.WriteLine($"StackTrace: {exception.StackTrace}");

            // Respuesta del error, enviando detalles solo en desarrollo
            await context.Response.WriteAsJsonAsync(new
            {
                error = "Se produjo un error interno en el servidor.",
                details = app.Environment.IsDevelopment() ? exception.Message : null  // Detalles solo en desarrollo
            });
        }
    });
});

// Aplicar configuración de CORS
app.UseCors("AllowAllOrigins");  // Usar la política CORS que permite todos los orígenes

// Middleware adicional
app.UseHttpsRedirection();  // Redirige las solicitudes HTTP a HTTPS
app.UseAuthorization();     // Habilita la autorización (si usas autenticación)
app.MapControllers();       // Mapea los controladores a las rutas de la API

app.Run();  // Ejecutar la aplicación
