using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Proyecto1.Migrations
{
    /// <inheritdoc />
    public partial class _9 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Dispositivos_TiposDispositivos_TipoDispositivoId",
                table: "Dispositivos");

            migrationBuilder.AddForeignKey(
                name: "FK_Dispositivos_TiposDispositivos_TipoDispositivoId",
                table: "Dispositivos",
                column: "TipoDispositivoId",
                principalTable: "TiposDispositivos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Dispositivos_TiposDispositivos_TipoDispositivoId",
                table: "Dispositivos");

            migrationBuilder.AddForeignKey(
                name: "FK_Dispositivos_TiposDispositivos_TipoDispositivoId",
                table: "Dispositivos",
                column: "TipoDispositivoId",
                principalTable: "TiposDispositivos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
