using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Proyecto1.Migrations
{
    /// <inheritdoc />
    public partial class _31 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DistribuidorId",
                table: "Productos");

            migrationBuilder.AddColumn<string>(
                name: "DistribuidorCedula",
                table: "Productos",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DistribuidorCedula",
                table: "Productos");

            migrationBuilder.AddColumn<int>(
                name: "DistribuidorId",
                table: "Productos",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
