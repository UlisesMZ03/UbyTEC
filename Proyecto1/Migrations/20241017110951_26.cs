using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Proyecto1.Migrations
{
    /// <inheritdoc />
    public partial class _26 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Dispositivos_Distribuidores_DistribuidorId",
                table: "Dispositivos");

            migrationBuilder.AddForeignKey(
                name: "FK_Dispositivos_Distribuidores_DistribuidorId",
                table: "Dispositivos",
                column: "DistribuidorId",
                principalTable: "Distribuidores",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Dispositivos_Distribuidores_DistribuidorId",
                table: "Dispositivos");

            migrationBuilder.AddForeignKey(
                name: "FK_Dispositivos_Distribuidores_DistribuidorId",
                table: "Dispositivos",
                column: "DistribuidorId",
                principalTable: "Distribuidores",
                principalColumn: "Id");
        }
    }
}
