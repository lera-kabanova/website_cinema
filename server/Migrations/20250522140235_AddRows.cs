using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace cinema_mng_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddRows : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Rows",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    HallId = table.Column<int>(type: "INTEGER", nullable: false),
                    Number = table.Column<int>(type: "INTEGER", nullable: false),
                    Seats = table.Column<int>(type: "INTEGER", nullable: false),
                    Type = table.Column<string>(type: "TEXT", nullable: false),
                    Spacing = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rows", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Rows_Halls_HallId",
                        column: x => x.HallId,
                        principalTable: "Halls",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Rows",
                columns: new[] { "Id", "HallId", "Number", "Seats", "Spacing", "Type" },
                values: new object[,]
                {
                    { 1, 1, 1, 5, "extraWide", "sofa" },
                    { 2, 1, 2, 10, "normal", "standard" },
                    { 3, 1, 3, 10, "normal", "standard" },
                    { 4, 1, 4, 10, "normal", "standard" },
                    { 5, 1, 5, 10, "normal", "standard" },
                    { 6, 1, 6, 10, "normal", "standard" },
                    { 7, 1, 7, 10, "normal", "standard" },
                    { 8, 1, 8, 10, "normal", "standard" },
                    { 9, 1, 9, 8, "wide", "loveSeat" },
                    { 10, 2, 1, 5, "extraWide", "sofa" },
                    { 11, 2, 2, 10, "normal", "standard" },
                    { 12, 2, 3, 10, "normal", "standard" },
                    { 13, 2, 4, 10, "normal", "standard" },
                    { 14, 2, 5, 10, "normal", "standard" },
                    { 15, 2, 6, 10, "normal", "standard" },
                    { 16, 2, 7, 10, "normal", "standard" },
                    { 17, 2, 8, 10, "normal", "standard" },
                    { 18, 2, 9, 8, "wide", "loveSeat" },
                    { 19, 2, 10, 6, "wide", "recliner" },
                    { 20, 3, 1, 8, "normal", "loveSeat" },
                    { 21, 3, 2, 8, "normal", "loveSeat" },
                    { 22, 3, 3, 8, "normal", "recliner" },
                    { 23, 3, 4, 8, "normal", "recliner" },
                    { 24, 3, 5, 6, "wide", "sofa" },
                    { 25, 3, 6, 6, "wide", "sofa" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Rows_HallId",
                table: "Rows",
                column: "HallId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Rows");
        }
    }
}
