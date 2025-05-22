using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace cinema_mng_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddNewZonesForAllHalls : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Zones",
                columns: new[] { "Id", "BasePrice", "HallId", "Name" },
                values: new object[,]
                {
                    { 7, 20.00m, 1, "Диван" },
                    { 8, 18.00m, 1, "LoveSeats" },
                    { 9, 15.00m, 2, "Реклайнер" },
                    { 10, 10.00m, 2, "Стандартное кресло" },
                    { 11, 28.00m, 3, "VIP LoveSeats" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Zones",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "Zones",
                keyColumn: "Id",
                keyValue: 8);

            migrationBuilder.DeleteData(
                table: "Zones",
                keyColumn: "Id",
                keyValue: 9);

            migrationBuilder.DeleteData(
                table: "Zones",
                keyColumn: "Id",
                keyValue: 10);

            migrationBuilder.DeleteData(
                table: "Zones",
                keyColumn: "Id",
                keyValue: 11);
        }
    }
}
