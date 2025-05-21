using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace cinema_mng_backend.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSchemaForSchedule : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<float>(
                name: "PopularityScore",
                table: "Movies",
                type: "float",
                nullable: false,
                defaultValue: 0f);

            migrationBuilder.CreateTable(
                name: "Halls",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Capacity = table.Column<int>(type: "INTEGER", nullable: false),
                    Type = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Halls", x => x.Id);
                    table.CheckConstraint("CK_Hall_Type", "Type IN ('standard', 'comfort', 'vip')");
                });

            migrationBuilder.CreateTable(
                name: "PriceModifiers",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Type = table.Column<string>(type: "TEXT", nullable: false),
                    Condition = table.Column<string>(type: "TEXT", nullable: false),
                    Multiplier = table.Column<float>(type: "REAL", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PriceModifiers", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TicketTypes",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", maxLength: 50, nullable: false),
                    Multiplier = table.Column<float>(type: "REAL", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TicketTypes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Schedules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    MovieId = table.Column<int>(type: "INTEGER", nullable: false),
                    HallId = table.Column<int>(type: "INTEGER", nullable: false),
                    Date = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Time = table.Column<TimeSpan>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Schedules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Schedules_Halls_HallId",
                        column: x => x.HallId,
                        principalTable: "Halls",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Schedules_Movies_MovieId",
                        column: x => x.MovieId,
                        principalTable: "Movies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Zones",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    HallId = table.Column<int>(type: "INTEGER", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    BasePrice = table.Column<decimal>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Zones", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Zones_Halls_HallId",
                        column: x => x.HallId,
                        principalTable: "Halls",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Halls",
                columns: new[] { "Id", "Capacity", "Name", "Type" },
                values: new object[,]
                {
                    { 1, 100, "Зал 1 (Стандартный)", "standard" },
                    { 2, 50, "Зал 2 (Комфортный)", "comfort" },
                    { 3, 30, "VIP Зал", "vip" }
                });

            migrationBuilder.InsertData(
                table: "PriceModifiers",
                columns: new[] { "Id", "Condition", "Multiplier", "Type" },
                values: new object[,]
                {
                    { 1, "{\"start_time\": \"18:00\", \"end_time\": \"22:00\"}", 1.2f, "time_slot" },
                    { 2, "{\"min_score\": 0.8}", 1.3f, "popularity" }
                });

            migrationBuilder.InsertData(
                table: "TicketTypes",
                columns: new[] { "Id", "Multiplier", "Name" },
                values: new object[,]
                {
                    { 1, 1f, "Стандартный" },
                    { 2, 0.8f, "Студенческий" },
                    { 3, 0.7f, "Пенсионный" }
                });

            migrationBuilder.InsertData(
                table: "Zones",
                columns: new[] { "Id", "BasePrice", "HallId", "Name" },
                values: new object[,]
                {
                    { 1, 10.00m, 1, "Стандартное кресло" },
                    { 2, 15.00m, 1, "Реклайнер" },
                    { 3, 20.00m, 2, "Диван" },
                    { 4, 18.00m, 2, "LoveSeats" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Schedules_HallId",
                table: "Schedules",
                column: "HallId");

            migrationBuilder.CreateIndex(
                name: "IX_Schedules_MovieId",
                table: "Schedules",
                column: "MovieId");

            migrationBuilder.CreateIndex(
                name: "IX_Zones_HallId",
                table: "Zones",
                column: "HallId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PriceModifiers");

            migrationBuilder.DropTable(
                name: "Schedules");

            migrationBuilder.DropTable(
                name: "TicketTypes");

            migrationBuilder.DropTable(
                name: "Zones");

            migrationBuilder.DropTable(
                name: "Halls");

            migrationBuilder.DropColumn(
                name: "PopularityScore",
                table: "Movies");
        }
    }
}
