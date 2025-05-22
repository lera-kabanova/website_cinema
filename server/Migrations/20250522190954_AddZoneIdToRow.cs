using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace cinema_mng_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddZoneIdToRow : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "ZoneId",
                table: "Rows",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

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
                column: "ZoneId",
                value: 0);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 21,
                column: "ZoneId",
                value: 0);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 22,
                column: "ZoneId",
                value: 0);

            migrationBuilder.UpdateData(
                table: "Rows",
                keyColumn: "Id",
                keyValue: 23,
                column: "ZoneId",
                value: 0);

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ZoneId",
                table: "Rows");
        }
    }
}
