using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Proyecto1.Migrations
{
    /// <inheritdoc />
    public partial class _33 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Productos_Distribuidores_DistribuidorCedula",
                table: "Productos");

            migrationBuilder.AddForeignKey(
                name: "FK_Productos_Distribuidores_DistribuidorCedula",
                table: "Productos",
                column: "DistribuidorCedula",
                principalTable: "Distribuidores",
                principalColumn: "CedulaJuridica",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Productos_Distribuidores_DistribuidorCedula",
                table: "Productos");

            migrationBuilder.AddForeignKey(
                name: "FK_Productos_Distribuidores_DistribuidorCedula",
                table: "Productos",
                column: "DistribuidorCedula",
                principalTable: "Distribuidores",
                principalColumn: "CedulaJuridica",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
