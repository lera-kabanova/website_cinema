using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace cinema_mng_backend.Migrations
{
    /// <inheritdoc />
    public partial class AddBookingStatusAndSeatId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Price",
                table: "Bookings",
                newName: "FinalPrice");

            migrationBuilder.AddColumn<int>(
                name: "SeatNumber",
                table: "Bookings",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "SeatRow",
                table: "Bookings",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SeatNumber",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "SeatRow",
                table: "Bookings");

            migrationBuilder.RenameColumn(
                name: "FinalPrice",
                table: "Bookings",
                newName: "Price");
        }
    }
}
