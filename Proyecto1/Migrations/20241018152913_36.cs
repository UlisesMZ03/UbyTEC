using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Proyecto1.Migrations
{
    /// <inheritdoc />
    public partial class _36 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Productos_Dispositivos_NumeroSerieDispositivo",
                table: "Productos");

            migrationBuilder.AddForeignKey(
                name: "FK_Productos_Dispositivos_NumeroSerieDispositivo",
                table: "Productos",
                column: "NumeroSerieDispositivo",
                principalTable: "Dispositivos",
                principalColumn: "NumeroSerie",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Productos_Dispositivos_NumeroSerieDispositivo",
                table: "Productos");

            migrationBuilder.AddForeignKey(
                name: "FK_Productos_Dispositivos_NumeroSerieDispositivo",
                table: "Productos",
                column: "NumeroSerieDispositivo",
                principalTable: "Dispositivos",
                principalColumn: "NumeroSerie",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
