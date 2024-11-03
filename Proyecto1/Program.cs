using Microsoft.EntityFrameworkCore;
using Proyecto1.Models;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors();

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddDbContext<SmartHomeDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("SmartHomeDb"));
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(builder =>
{
    builder.AllowAnyOrigin()
           .AllowAnyMethod()
           .AllowAnyHeader();
});

app.UseAuthorization();

app.MapControllers();

app.Run();
