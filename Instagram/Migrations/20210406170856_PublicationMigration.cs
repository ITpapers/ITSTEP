using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Instagram.Migrations
{
    public partial class PublicationMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Publications",
                columns: table => new
                {
                    PublicationId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicationName = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    PublicationDescription = table.Column<string>(type: "nvarchar(200)", nullable: true),
                    PublicationAuthor = table.Column<string>(type: "nvarchar(50)", nullable: true),
                    PublicationDate = table.Column<DateTime>(type: "datetime", nullable: false),
                    ImageName = table.Column<string>(type: "nvarchar(100)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Publications", x => x.PublicationId);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Publications");
        }
    }
}
