using Microsoft.Extensions.Options;
using MongoDB.Driver;
using UbyTECAPI;

var builder = WebApplication.CreateBuilder(args);

// Configuración de MongoDB
builder.Services.Configure<MongoDbSettings>(
    builder.Configuration.GetSection("MongoDbSettings"));

// Crear la instancia de MongoDB y añadirla a los servicios
builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var settings = sp.GetRequiredService<IOptions<MongoDbSettings>>().Value;
    return new MongoClient(settings.ConnectionString);
});

builder.Services.AddSingleton(sp =>
{
    var mongoClient = sp.GetRequiredService<IMongoClient>();
    var settings = sp.GetRequiredService<IOptions<MongoDbSettings>>().Value;
    return mongoClient.GetDatabase(settings.DatabaseName);
});

// Agregar configuración de CORS para permitir solicitudes desde React
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("https://apimongo-c5esbwe4bfhxf2gy.canadacentral-01.azurewebsites.net/") // URL del frontend de React
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Aplicar la política de CORS configurada
app.UseCors("AllowReactApp");

app.UseSwagger();
app.UseSwaggerUI();
app.UseHttpsRedirection(); // Puedes dejar esta línea comentada si no necesitas redirección a HTTPS en desarrollo
app.UseAuthorization();
app.MapControllers();

app.Run();