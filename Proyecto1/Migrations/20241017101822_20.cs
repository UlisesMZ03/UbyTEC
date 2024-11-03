using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Proyecto1.Migrations
{
    /// <inheritdoc />
    public partial class _20 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Id",
                table: "Dispositivos");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "Dispositivos",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }
    }
}
