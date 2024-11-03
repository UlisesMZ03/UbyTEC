using Microsoft.EntityFrameworkCore;

namespace Proyecto1.Models
{
    public class SmartHomeDbContext : DbContext
    {
        public SmartHomeDbContext(DbContextOptions<SmartHomeDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Dispositivo> Dispositivos { get; set; }
        public DbSet<TipoDispositivo> TiposDispositivos { get; set; }
        public DbSet<Producto> Productos { get; set; } // Nueva entidad Productos
        public DbSet<DispositivoUsuario> DispositivosUsuarios { get; set; }
        public DbSet<Distribuidor> Distribuidores { get; set; }
        public DbSet<Pedido> Pedidos { get; set; }
        public DbSet<Factura> Facturas { get; set; }
        public DbSet<CertificadoGarantia> CertificadosGarantia { get; set; }
        public DbSet<HistorialUsuariosDispositivos> HistorialUsuariosDispositivos { get; set; }
        public DbSet<DireccionEntrega> DireccionesEntrega { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Relación uno a muchos entre Producto y Distribuidor (obligatoria)
            modelBuilder.Entity<Producto>()
                .HasOne(p => p.Distribuidor)
                .WithMany() // Ajusta esto si necesitas acceder a productos desde el distribuidor
                .HasForeignKey(p => p.DistribuidorCedula) // Usar la cédula como clave foránea
                .OnDelete(DeleteBehavior.Cascade); // Comportamiento de eliminación

            // Relación uno a uno entre Producto y Dispositivo
            modelBuilder.Entity<Producto>()
                .HasOne(p => p.Dispositivo)
                .WithOne(d => d.Producto)
                .HasForeignKey<Producto>(p => p.NumeroSerieDispositivo)
                .OnDelete(DeleteBehavior.SetNull); // Cambiado a SetNull para que no se elimine el dispositivo si se elimina el producto

            // Índice único para el correo electrónico del usuario
            modelBuilder.Entity<User>()
                .HasIndex(u => u.CorreoElectronico)
                .IsUnique();

            // Índice único para el número de serie del dispositivo
            modelBuilder.Entity<Dispositivo>()
                .HasIndex(d => d.NumeroSerie)
                .IsUnique();

            // Clave compuesta para la relación Dispositivo-Usuario
            modelBuilder.Entity<DispositivoUsuario>()
                .HasKey(du => new { du.UserId, du.DispositivoNumeroSerie });

            // Relación entre Dispositivo y TipoDispositivo
            modelBuilder.Entity<Dispositivo>()
                .HasOne(d => d.TipoDispositivo)
                .WithMany(t => t.Dispositivos)
                .HasForeignKey(d => d.TipoDispositivoId)
                .OnDelete(DeleteBehavior.Restrict); // Asegura que la eliminación de TipoDispositivo no borre dispositivos.

            // Relación entre Usuario y Pedido
            modelBuilder.Entity<Pedido>()
                .HasOne(p => p.Usuario)
                .WithMany(u => u.Pedidos)
                .HasForeignKey(p => p.UsuarioId);

            // Relación entre Pedido y Dispositivo
            modelBuilder.Entity<Pedido>()
                .HasOne(p => p.Dispositivo)
                .WithMany(d => d.Pedidos)
                .HasForeignKey(p => p.DispositivoNumeroSerie);

            // Relación entre Pedido y Factura
            modelBuilder.Entity<Factura>()
                .HasOne(f => f.Usuario)
                .WithMany(u => u.Facturas)
                .HasForeignKey(f => f.UsuarioId);

            // Relación entre Factura y Dispositivo
            modelBuilder.Entity<Factura>()
                .HasOne(f => f.Dispositivo)
                .WithMany(d => d.Facturas)
                .HasForeignKey(f => f.DispositivoNumeroSerie);

            // Clave compuesta para historial de dispositivos
            modelBuilder.Entity<HistorialUsuariosDispositivos>()
                .HasKey(h => new { h.UsuarioId, h.DispositivoNumeroSerie, h.FechaTransferencia });

            // Relación entre User y DireccionEntrega (uno a muchos)
            modelBuilder.Entity<DireccionEntrega>()
                .HasOne(de => de.User)
                .WithMany(u => u.DireccionesEntrega)
                .HasForeignKey(de => de.UserId);

            base.OnModelCreating(modelBuilder);
        }
    }
}
