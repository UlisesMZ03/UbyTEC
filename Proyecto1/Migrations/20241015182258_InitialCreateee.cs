using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Proyecto1.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreateee : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Contraseña",
                table: "Users",
                newName: "Contrasena");

            migrationBuilder.AlterColumn<decimal>(
                name: "ConsumoElectrico",
                table: "Dispositivos",
                type: "numeric",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<int>(
                name: "DistribuidorId",
                table: "Dispositivos",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "CertificadosGarantia",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FechaCompra = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    FechaFinGarantia = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UsuarioId = table.Column<int>(type: "integer", nullable: false),
                    DispositivoId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CertificadosGarantia", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CertificadosGarantia_Dispositivos_DispositivoId",
                        column: x => x.DispositivoId,
                        principalTable: "Dispositivos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CertificadosGarantia_Users_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Distribuidores",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    CedulaJuridica = table.Column<string>(type: "text", nullable: false),
                    Nombre = table.Column<string>(type: "text", nullable: false),
                    Region = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Distribuidores", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Facturas",
                columns: table => new
                {
                    NumeroFactura = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FechaCompra = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UsuarioId = table.Column<int>(type: "integer", nullable: false),
                    DispositivoId = table.Column<int>(type: "integer", nullable: false),
                    Precio = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Facturas", x => x.NumeroFactura);
                    table.ForeignKey(
                        name: "FK_Facturas_Dispositivos_DispositivoId",
                        column: x => x.DispositivoId,
                        principalTable: "Dispositivos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Facturas_Users_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "HistorialUsuariosDispositivos",
                columns: table => new
                {
                    UsuarioId = table.Column<int>(type: "integer", nullable: false),
                    DispositivoId = table.Column<int>(type: "integer", nullable: false),
                    FechaTransferencia = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HistorialUsuariosDispositivos", x => new { x.UsuarioId, x.DispositivoId, x.FechaTransferencia });
                    table.ForeignKey(
                        name: "FK_HistorialUsuariosDispositivos_Dispositivos_DispositivoId",
                        column: x => x.DispositivoId,
                        principalTable: "Dispositivos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_HistorialUsuariosDispositivos_Users_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Pedidos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UsuarioId = table.Column<int>(type: "integer", nullable: false),
                    DispositivoId = table.Column<int>(type: "integer", nullable: false),
                    NumeroPedido = table.Column<int>(type: "integer", nullable: false),
                    FechaHora = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    MontoTotal = table.Column<decimal>(type: "numeric", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Pedidos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Pedidos_Dispositivos_DispositivoId",
                        column: x => x.DispositivoId,
                        principalTable: "Dispositivos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Pedidos_Users_UsuarioId",
                        column: x => x.UsuarioId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Dispositivos_DistribuidorId",
                table: "Dispositivos",
                column: "DistribuidorId");

            migrationBuilder.CreateIndex(
                name: "IX_CertificadosGarantia_DispositivoId",
                table: "CertificadosGarantia",
                column: "DispositivoId");

            migrationBuilder.CreateIndex(
                name: "IX_CertificadosGarantia_UsuarioId",
                table: "CertificadosGarantia",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_Facturas_DispositivoId",
                table: "Facturas",
                column: "DispositivoId");

            migrationBuilder.CreateIndex(
                name: "IX_Facturas_UsuarioId",
                table: "Facturas",
                column: "UsuarioId");

            migrationBuilder.CreateIndex(
                name: "IX_HistorialUsuariosDispositivos_DispositivoId",
                table: "HistorialUsuariosDispositivos",
                column: "DispositivoId");

            migrationBuilder.CreateIndex(
                name: "IX_Pedidos_DispositivoId",
                table: "Pedidos",
                column: "DispositivoId");

            migrationBuilder.CreateIndex(
                name: "IX_Pedidos_UsuarioId",
                table: "Pedidos",
                column: "UsuarioId");

            migrationBuilder.AddForeignKey(
                name: "FK_Dispositivos_Distribuidores_DistribuidorId",
                table: "Dispositivos",
                column: "DistribuidorId",
                principalTable: "Distribuidores",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Dispositivos_Distribuidores_DistribuidorId",
                table: "Dispositivos");

            migrationBuilder.DropTable(
                name: "CertificadosGarantia");

            migrationBuilder.DropTable(
                name: "Distribuidores");

            migrationBuilder.DropTable(
                name: "Facturas");

            migrationBuilder.DropTable(
                name: "HistorialUsuariosDispositivos");

            migrationBuilder.DropTable(
                name: "Pedidos");

            migrationBuilder.DropIndex(
                name: "IX_Dispositivos_DistribuidorId",
                table: "Dispositivos");

            migrationBuilder.DropColumn(
                name: "DistribuidorId",
                table: "Dispositivos");

            migrationBuilder.RenameColumn(
                name: "Contrasena",
                table: "Users",
                newName: "Contraseña");

            migrationBuilder.AlterColumn<int>(
                name: "ConsumoElectrico",
                table: "Dispositivos",
                type: "integer",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "numeric");
        }
    }
}
