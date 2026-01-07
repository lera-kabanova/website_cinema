using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace cinema_mng_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddAdminFeatures : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "Schedules",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsClosed",
                table: "Halls",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "CancelledAt",
                table: "Bookings",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CancelledBy",
                table: "Bookings",
                type: "int",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Halls",
                keyColumn: "Id",
                keyValue: 1,
                column: "IsClosed",
                value: false);

            migrationBuilder.UpdateData(
                table: "Halls",
                keyColumn: "Id",
                keyValue: 2,
                column: "IsClosed",
                value: false);

            migrationBuilder.UpdateData(
                table: "Halls",
                keyColumn: "Id",
                keyValue: 3,
                column: "IsClosed",
                value: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "Schedules");

            migrationBuilder.DropColumn(
                name: "IsClosed",
                table: "Halls");

            migrationBuilder.DropColumn(
                name: "CancelledAt",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "CancelledBy",
                table: "Bookings");
        }
    }
}
