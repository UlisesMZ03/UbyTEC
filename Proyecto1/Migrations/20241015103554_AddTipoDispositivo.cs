using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Proyecto1.Migrations
{
    /// <inheritdoc />
    public partial class AddTipoDispositivo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "region",
                table: "Users",
                newName: "Region");

            migrationBuilder.RenameColumn(
                name: "password",
                table: "Users",
                newName: "Nombre");

            migrationBuilder.RenameColumn(
                name: "name",
                table: "Users",
                newName: "DireccionEntrega");

            migrationBuilder.RenameColumn(
                name: "lastName",
                table: "Users",
                newName: "CorreoElectronico");

            migrationBuilder.RenameColumn(
                name: "email",
                table: "Users",
                newName: "Contraseña");

            migrationBuilder.RenameColumn(
                name: "address",
                table: "Users",
                newName: "Apellidos");

            migrationBuilder.CreateTable(
                name: "TiposDispositivos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Nombre = table.Column<string>(type: "text", nullable: false),
                    Descripcion = table.Column<string>(type: "text", nullable: false),
                    TiempoGarantia = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TiposDispositivos", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Dispositivos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    NumeroSerie = table.Column<string>(type: "text", nullable: false),
                    Marca = table.Column<string>(type: "text", nullable: false),
                    ConsumoElectrico = table.Column<int>(type: "integer", nullable: false),
                    TipoDispositivoId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dispositivos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Dispositivos_TiposDispositivos_TipoDispositivoId",
                        column: x => x.TipoDispositivoId,
                        principalTable: "TiposDispositivos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "DispositivosUsuarios",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    DispositivoId = table.Column<int>(type: "integer", nullable: false),
                    Id = table.Column<int>(type: "integer", nullable: false),
                    FechaAsociacion = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Aposento = table.Column<string>(type: "text", nullable: false),
                    GarantiaRestante = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DispositivosUsuarios", x => new { x.UserId, x.DispositivoId });
                    table.ForeignKey(
                        name: "FK_DispositivosUsuarios_Dispositivos_DispositivoId",
                        column: x => x.DispositivoId,
                        principalTable: "Dispositivos",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DispositivosUsuarios_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Users_CorreoElectronico",
                table: "Users",
                column: "CorreoElectronico",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Dispositivos_NumeroSerie",
                table: "Dispositivos",
                column: "NumeroSerie",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Dispositivos_TipoDispositivoId",
                table: "Dispositivos",
                column: "TipoDispositivoId");

            migrationBuilder.CreateIndex(
                name: "IX_DispositivosUsuarios_DispositivoId",
                table: "DispositivosUsuarios",
                column: "DispositivoId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DispositivosUsuarios");

            migrationBuilder.DropTable(
                name: "Dispositivos");

            migrationBuilder.DropTable(
                name: "TiposDispositivos");

            migrationBuilder.DropIndex(
                name: "IX_Users_CorreoElectronico",
                table: "Users");

            migrationBuilder.RenameColumn(
                name: "Region",
                table: "Users",
                newName: "region");

            migrationBuilder.RenameColumn(
                name: "Nombre",
                table: "Users",
                newName: "password");

            migrationBuilder.RenameColumn(
                name: "DireccionEntrega",
                table: "Users",
                newName: "name");

            migrationBuilder.RenameColumn(
                name: "CorreoElectronico",
                table: "Users",
                newName: "lastName");

            migrationBuilder.RenameColumn(
                name: "Contraseña",
                table: "Users",
                newName: "email");

            migrationBuilder.RenameColumn(
                name: "Apellidos",
                table: "Users",
                newName: "address");
        }
    }
}
