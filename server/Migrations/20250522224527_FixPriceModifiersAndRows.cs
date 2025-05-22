using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace cinema_mng_backend.Migrations
{
    /// <inheritdoc />
    public partial class FixPriceModifiersAndRows : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "PriceModifiers",
                keyColumn: "Id",
                keyValue: 1,
                column: "Condition",
                value: "{\"start_time\": \"18:00:00\", \"end_time\": \"22:00:00\"}");

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 1,
                column: "ZoneId",
                value: 7);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 2,
                column: "ZoneId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 3,
                column: "ZoneId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 4,
                column: "ZoneId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 5,
                column: "ZoneId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 6,
                column: "ZoneId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 7,
                column: "ZoneId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 8,
                column: "ZoneId",
                value: 1);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 9,
                column: "ZoneId",
                value: 8);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 10,
                column: "ZoneId",
                value: 3);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 11,
                column: "ZoneId",
                value: 10);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 12,
                column: "ZoneId",
                value: 10);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 13,
                column: "ZoneId",
                value: 10);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 14,
                column: "ZoneId",
                value: 10);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 15,
                column: "ZoneId",
                value: 10);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 16,
                column: "ZoneId",
                value: 10);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 17,
                column: "ZoneId",
                value: 10);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 18,
                column: "ZoneId",
                value: 4);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 19,
                column: "ZoneId",
                value: 9);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 20,
                columns: new[] { "Spacing", "ZoneId" },
                values: new object[] { "wide", 11 });

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 21,
                columns: new[] { "Spacing", "ZoneId" },
                values: new object[] { "wide", 11 });

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 22,
                columns: new[] { "Spacing", "ZoneId" },
                values: new object[] { "wide", 6 });

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 23,
                columns: new[] { "Spacing", "ZoneId" },
                values: new object[] { "wide", 6 });

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 24,
                column: "ZoneId",
                value: 5);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 25,
                column: "ZoneId",
                value: 5);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "PriceModifiers",
                keyColumn: "Id",
                keyValue: 1,
                column: "Condition",
                value: "{\"start_time\": \"18:00\", \"end_time\": \"22:00\"}");

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 1,
                column: "ZoneId",
                value: 0);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 2,
                column: "ZoneId",
                value: 0);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 3,
                column: "ZoneId",
                value: 0);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 4,
                column: "ZoneId",
                value: 0);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 5,
                column: "ZoneId",
                value: 0);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 6,
                column: "ZoneId",
                value: 0);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 7,
                column: "ZoneId",
                value: 0);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 8,
                column: "ZoneId",
                value: 0);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 9,
                column: "ZoneId",
                value: 0);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 10,
                column: "ZoneId",
                value: 0);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 11,
                column: "ZoneId",
                value: 0);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 12,
                column: "ZoneId",
                value: 0);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 13,
                column: "ZoneId",
                value: 0);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 14,
                column: "ZoneId",
                value: 0);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 15,
                column: "ZoneId",
                value: 0);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 16,
                column: "ZoneId",
                value: 0);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 17,
                column: "ZoneId",
                value: 0);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 18,
                column: "ZoneId",
                value: 0);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 19,
                column: "ZoneId",
                value: 0);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 20,
                columns: new[] { "Spacing", "ZoneId" },
                values: new object[] { "normal", 0 });

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 21,
                columns: new[] { "Spacing", "ZoneId" },
                values: new object[] { "normal", 0 });

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 22,
                columns: new[] { "Spacing", "ZoneId" },
                values: new object[] { "normal", 0 });

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 23,
                columns: new[] { "Spacing", "ZoneId" },
                values: new object[] { "normal", 0 });

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 24,
                column: "ZoneId",
                value: 0);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 25,
                column: "ZoneId",
                value: 0);
        }
    }
}
