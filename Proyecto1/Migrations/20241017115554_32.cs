using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Proyecto1.Migrations
{
    /// <inheritdoc />
    public partial class _32 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Productos_Distribuidores_DistribuidorCedulaJuridica",
                table: "Productos");

            migrationBuilder.DropIndex(
                name: "IX_Productos_DistribuidorCedulaJuridica",
                table: "Productos");

            migrationBuilder.DropColumn(
                name: "DistribuidorCedulaJuridica",
                table: "Productos");

            migrationBuilder.CreateIndex(
                name: "IX_Productos_DistribuidorCedula",
                table: "Productos",
                column: "DistribuidorCedula");

            migrationBuilder.AddForeignKey(
                name: "FK_Productos_Distribuidores_DistribuidorCedula",
                table: "Productos",
                column: "DistribuidorCedula",
                principalTable: "Distribuidores",
                principalColumn: "CedulaJuridica",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Productos_Distribuidores_DistribuidorCedula",
                table: "Productos");

            migrationBuilder.DropIndex(
                name: "IX_Productos_DistribuidorCedula",
                table: "Productos");

            migrationBuilder.AddColumn<string>(
                name: "DistribuidorCedulaJuridica",
                table: "Productos",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Productos_DistribuidorCedulaJuridica",
                table: "Productos",
                column: "DistribuidorCedulaJuridica");

            migrationBuilder.AddForeignKey(
                name: "FK_Productos_Distribuidores_DistribuidorCedulaJuridica",
                table: "Productos",
                column: "DistribuidorCedulaJuridica",
                principalTable: "Distribuidores",
                principalColumn: "CedulaJuridica");
        }
    }
}
