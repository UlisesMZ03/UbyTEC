using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Proyecto1.Migrations
{
    /// <inheritdoc />
    public partial class _30 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Dispositivos_Distribuidores_DistribuidorId",
                table: "Dispositivos");

            migrationBuilder.DropForeignKey(
                name: "FK_Productos_Distribuidores_DistribuidorId",
                table: "Productos");

            migrationBuilder.DropIndex(
                name: "IX_Productos_DistribuidorId",
                table: "Productos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Distribuidores",
                table: "Distribuidores");

            migrationBuilder.DropIndex(
                name: "IX_Dispositivos_DistribuidorId",
                table: "Dispositivos");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Distribuidores");

            migrationBuilder.DropColumn(
                name: "DistribuidorId",
                table: "Dispositivos");

            migrationBuilder.AddColumn<string>(
                name: "DistribuidorCedulaJuridica",
                table: "Productos",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "DistribuidorCedulaJuridica",
                table: "Dispositivos",
                type: "text",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Distribuidores",
                table: "Distribuidores",
                column: "CedulaJuridica");

            migrationBuilder.CreateIndex(
                name: "IX_Productos_DistribuidorCedulaJuridica",
                table: "Productos",
                column: "DistribuidorCedulaJuridica");

            migrationBuilder.CreateIndex(
                name: "IX_Dispositivos_DistribuidorCedulaJuridica",
                table: "Dispositivos",
                column: "DistribuidorCedulaJuridica");

            migrationBuilder.AddForeignKey(
                name: "FK_Dispositivos_Distribuidores_DistribuidorCedulaJuridica",
                table: "Dispositivos",
                column: "DistribuidorCedulaJuridica",
                principalTable: "Distribuidores",
                principalColumn: "CedulaJuridica");

            migrationBuilder.AddForeignKey(
                name: "FK_Productos_Distribuidores_DistribuidorCedulaJuridica",
                table: "Productos",
                column: "DistribuidorCedulaJuridica",
                principalTable: "Distribuidores",
                principalColumn: "CedulaJuridica");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Dispositivos_Distribuidores_DistribuidorCedulaJuridica",
                table: "Dispositivos");

            migrationBuilder.DropForeignKey(
                name: "FK_Productos_Distribuidores_DistribuidorCedulaJuridica",
                table: "Productos");

            migrationBuilder.DropIndex(
                name: "IX_Productos_DistribuidorCedulaJuridica",
                table: "Productos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Distribuidores",
                table: "Distribuidores");

            migrationBuilder.DropIndex(
                name: "IX_Dispositivos_DistribuidorCedulaJuridica",
                table: "Dispositivos");

            migrationBuilder.DropColumn(
                name: "DistribuidorCedulaJuridica",
                table: "Productos");

            migrationBuilder.DropColumn(
                name: "DistribuidorCedulaJuridica",
                table: "Dispositivos");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "Distribuidores",
                type: "integer",
                nullable: false,
                defaultValue: 0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<int>(
                name: "DistribuidorId",
                table: "Dispositivos",
                type: "integer",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Distribuidores",
                table: "Distribuidores",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Productos_DistribuidorId",
                table: "Productos",
                column: "DistribuidorId");

            migrationBuilder.CreateIndex(
                name: "IX_Dispositivos_DistribuidorId",
                table: "Dispositivos",
                column: "DistribuidorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Dispositivos_Distribuidores_DistribuidorId",
                table: "Dispositivos",
                column: "DistribuidorId",
                principalTable: "Distribuidores",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Productos_Distribuidores_DistribuidorId",
                table: "Productos",
                column: "DistribuidorId",
                principalTable: "Distribuidores",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
