using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Proyecto1.Migrations
{
    /// <inheritdoc />
    public partial class _19 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CertificadosGarantia_Dispositivos_DispositivoId",
                table: "CertificadosGarantia");

            migrationBuilder.DropForeignKey(
                name: "FK_DispositivosUsuarios_Dispositivos_DispositivoId",
                table: "DispositivosUsuarios");

            migrationBuilder.DropForeignKey(
                name: "FK_Facturas_Dispositivos_DispositivoId",
                table: "Facturas");

            migrationBuilder.DropForeignKey(
                name: "FK_HistorialUsuariosDispositivos_Dispositivos_DispositivoId",
                table: "HistorialUsuariosDispositivos");

            migrationBuilder.DropForeignKey(
                name: "FK_Pedidos_Dispositivos_DispositivoId",
                table: "Pedidos");

            migrationBuilder.DropIndex(
                name: "IX_Pedidos_DispositivoId",
                table: "Pedidos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_HistorialUsuariosDispositivos",
                table: "HistorialUsuariosDispositivos");

            migrationBuilder.DropIndex(
                name: "IX_HistorialUsuariosDispositivos_DispositivoId",
                table: "HistorialUsuariosDispositivos");

            migrationBuilder.DropIndex(
                name: "IX_Facturas_DispositivoId",
                table: "Facturas");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DispositivosUsuarios",
                table: "DispositivosUsuarios");

            migrationBuilder.DropIndex(
                name: "IX_DispositivosUsuarios_DispositivoId",
                table: "DispositivosUsuarios");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Dispositivos",
                table: "Dispositivos");

            migrationBuilder.DropIndex(
                name: "IX_CertificadosGarantia_DispositivoId",
                table: "CertificadosGarantia");

            migrationBuilder.DropColumn(
                name: "DispositivoId",
                table: "Pedidos");

            migrationBuilder.DropColumn(
                name: "DispositivoId",
                table: "HistorialUsuariosDispositivos");

            migrationBuilder.DropColumn(
                name: "DispositivoId",
                table: "Facturas");

            migrationBuilder.DropColumn(
                name: "DispositivoId",
                table: "DispositivosUsuarios");

            migrationBuilder.DropColumn(
                name: "DispositivoId",
                table: "CertificadosGarantia");

            migrationBuilder.AddColumn<string>(
                name: "DispositivoNumeroSerie",
                table: "Pedidos",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DispositivoNumeroSerie",
                table: "HistorialUsuariosDispositivos",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DispositivoNumeroSerie",
                table: "Facturas",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "DispositivoNumeroSerie",
                table: "DispositivosUsuarios",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Dispositivos",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .OldAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<string>(
                name: "DispositivoNumeroSerie",
                table: "CertificadosGarantia",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_HistorialUsuariosDispositivos",
                table: "HistorialUsuariosDispositivos",
                columns: new[] { "UsuarioId", "DispositivoNumeroSerie", "FechaTransferencia" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_DispositivosUsuarios",
                table: "DispositivosUsuarios",
                columns: new[] { "UserId", "DispositivoNumeroSerie" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Dispositivos",
                table: "Dispositivos",
                column: "NumeroSerie");

            migrationBuilder.CreateIndex(
                name: "IX_Pedidos_DispositivoNumeroSerie",
                table: "Pedidos",
                column: "DispositivoNumeroSerie");

            migrationBuilder.CreateIndex(
                name: "IX_HistorialUsuariosDispositivos_DispositivoNumeroSerie",
                table: "HistorialUsuariosDispositivos",
                column: "DispositivoNumeroSerie");

            migrationBuilder.CreateIndex(
                name: "IX_Facturas_DispositivoNumeroSerie",
                table: "Facturas",
                column: "DispositivoNumeroSerie");

            migrationBuilder.CreateIndex(
                name: "IX_DispositivosUsuarios_DispositivoNumeroSerie",
                table: "DispositivosUsuarios",
                column: "DispositivoNumeroSerie");

            migrationBuilder.CreateIndex(
                name: "IX_CertificadosGarantia_DispositivoNumeroSerie",
                table: "CertificadosGarantia",
                column: "DispositivoNumeroSerie");

            migrationBuilder.AddForeignKey(
                name: "FK_CertificadosGarantia_Dispositivos_DispositivoNumeroSerie",
                table: "CertificadosGarantia",
                column: "DispositivoNumeroSerie",
                principalTable: "Dispositivos",
                principalColumn: "NumeroSerie",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DispositivosUsuarios_Dispositivos_DispositivoNumeroSerie",
                table: "DispositivosUsuarios",
                column: "DispositivoNumeroSerie",
                principalTable: "Dispositivos",
                principalColumn: "NumeroSerie",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Facturas_Dispositivos_DispositivoNumeroSerie",
                table: "Facturas",
                column: "DispositivoNumeroSerie",
                principalTable: "Dispositivos",
                principalColumn: "NumeroSerie",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_HistorialUsuariosDispositivos_Dispositivos_DispositivoNumer~",
                table: "HistorialUsuariosDispositivos",
                column: "DispositivoNumeroSerie",
                principalTable: "Dispositivos",
                principalColumn: "NumeroSerie",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Pedidos_Dispositivos_DispositivoNumeroSerie",
                table: "Pedidos",
                column: "DispositivoNumeroSerie",
                principalTable: "Dispositivos",
                principalColumn: "NumeroSerie",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CertificadosGarantia_Dispositivos_DispositivoNumeroSerie",
                table: "CertificadosGarantia");

            migrationBuilder.DropForeignKey(
                name: "FK_DispositivosUsuarios_Dispositivos_DispositivoNumeroSerie",
                table: "DispositivosUsuarios");

            migrationBuilder.DropForeignKey(
                name: "FK_Facturas_Dispositivos_DispositivoNumeroSerie",
                table: "Facturas");

            migrationBuilder.DropForeignKey(
                name: "FK_HistorialUsuariosDispositivos_Dispositivos_DispositivoNumer~",
                table: "HistorialUsuariosDispositivos");

            migrationBuilder.DropForeignKey(
                name: "FK_Pedidos_Dispositivos_DispositivoNumeroSerie",
                table: "Pedidos");

            migrationBuilder.DropIndex(
                name: "IX_Pedidos_DispositivoNumeroSerie",
                table: "Pedidos");

            migrationBuilder.DropPrimaryKey(
                name: "PK_HistorialUsuariosDispositivos",
                table: "HistorialUsuariosDispositivos");

            migrationBuilder.DropIndex(
                name: "IX_HistorialUsuariosDispositivos_DispositivoNumeroSerie",
                table: "HistorialUsuariosDispositivos");

            migrationBuilder.DropIndex(
                name: "IX_Facturas_DispositivoNumeroSerie",
                table: "Facturas");

            migrationBuilder.DropPrimaryKey(
                name: "PK_DispositivosUsuarios",
                table: "DispositivosUsuarios");

            migrationBuilder.DropIndex(
                name: "IX_DispositivosUsuarios_DispositivoNumeroSerie",
                table: "DispositivosUsuarios");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Dispositivos",
                table: "Dispositivos");

            migrationBuilder.DropIndex(
                name: "IX_CertificadosGarantia_DispositivoNumeroSerie",
                table: "CertificadosGarantia");

            migrationBuilder.DropColumn(
                name: "DispositivoNumeroSerie",
                table: "Pedidos");

            migrationBuilder.DropColumn(
                name: "DispositivoNumeroSerie",
                table: "HistorialUsuariosDispositivos");

            migrationBuilder.DropColumn(
                name: "DispositivoNumeroSerie",
                table: "Facturas");

            migrationBuilder.DropColumn(
                name: "DispositivoNumeroSerie",
                table: "DispositivosUsuarios");

            migrationBuilder.DropColumn(
                name: "DispositivoNumeroSerie",
                table: "CertificadosGarantia");

            migrationBuilder.AddColumn<int>(
                name: "DispositivoId",
                table: "Pedidos",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DispositivoId",
                table: "HistorialUsuariosDispositivos",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DispositivoId",
                table: "Facturas",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "DispositivoId",
                table: "DispositivosUsuarios",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AlterColumn<int>(
                name: "Id",
                table: "Dispositivos",
                type: "integer",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "integer")
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<int>(
                name: "DispositivoId",
                table: "CertificadosGarantia",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddPrimaryKey(
                name: "PK_HistorialUsuariosDispositivos",
                table: "HistorialUsuariosDispositivos",
                columns: new[] { "UsuarioId", "DispositivoId", "FechaTransferencia" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_DispositivosUsuarios",
                table: "DispositivosUsuarios",
                columns: new[] { "UserId", "DispositivoId" });

            migrationBuilder.AddPrimaryKey(
                name: "PK_Dispositivos",
                table: "Dispositivos",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_Pedidos_DispositivoId",
                table: "Pedidos",
                column: "DispositivoId");

            migrationBuilder.CreateIndex(
                name: "IX_HistorialUsuariosDispositivos_DispositivoId",
                table: "HistorialUsuariosDispositivos",
                column: "DispositivoId");

            migrationBuilder.CreateIndex(
                name: "IX_Facturas_DispositivoId",
                table: "Facturas",
                column: "DispositivoId");

            migrationBuilder.CreateIndex(
                name: "IX_DispositivosUsuarios_DispositivoId",
                table: "DispositivosUsuarios",
                column: "DispositivoId");

            migrationBuilder.CreateIndex(
                name: "IX_CertificadosGarantia_DispositivoId",
                table: "CertificadosGarantia",
                column: "DispositivoId");

            migrationBuilder.AddForeignKey(
                name: "FK_CertificadosGarantia_Dispositivos_DispositivoId",
                table: "CertificadosGarantia",
                column: "DispositivoId",
                principalTable: "Dispositivos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_DispositivosUsuarios_Dispositivos_DispositivoId",
                table: "DispositivosUsuarios",
                column: "DispositivoId",
                principalTable: "Dispositivos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Facturas_Dispositivos_DispositivoId",
                table: "Facturas",
                column: "DispositivoId",
                principalTable: "Dispositivos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_HistorialUsuariosDispositivos_Dispositivos_DispositivoId",
                table: "HistorialUsuariosDispositivos",
                column: "DispositivoId",
                principalTable: "Dispositivos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Pedidos_Dispositivos_DispositivoId",
                table: "Pedidos",
                column: "DispositivoId",
                principalTable: "Dispositivos",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
