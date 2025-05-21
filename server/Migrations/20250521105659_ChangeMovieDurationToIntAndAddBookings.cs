using Microsoft.EntityFrameworkCore.Migrations;

namespace cinema_mng_backend.Migrations
{
    public partial class ChangeMovieDurationToIntAndAddBookings : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // 1. Добавляем временную колонку TempDuration
            migrationBuilder.AddColumn<int>(
                name: "TempDuration",
                table: "Movies",
                type: "INTEGER",
                nullable: false,
                defaultValue: 120);

            // 2. Конвертируем данные из Duration (TEXT) в TempDuration (INTEGER)
            migrationBuilder.Sql(@"
                UPDATE Movies
                SET TempDuration = CASE
                    WHEN Duration LIKE '%ч %мин' THEN
                        CAST(SUBSTR(Duration, 1, INSTR(Duration, 'ч') - 1) AS INTEGER) * 60 +
                        CAST(SUBSTR(SUBSTR(Duration, INSTR(Duration, ' ') + 1), 1, INSTR(SUBSTR(Duration, INSTR(Duration, ' ') + 1), 'мин') - 1) AS INTEGER)
                    ELSE 120
                END;
            ");

            // 3. Удаляем старую колонку Duration
            migrationBuilder.DropColumn(
                name: "Duration",
                table: "Movies");

            // 4. Переименовываем TempDuration в Duration
            migrationBuilder.RenameColumn(
                name: "TempDuration",
                table: "Movies",
                newName: "Duration");

            // 5. Создаем таблицу Bookings
            migrationBuilder.CreateTable(
                name: "Bookings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<string>(type: "TEXT", nullable: false),
                    ScheduleId = table.Column<int>(type: "INTEGER", nullable: false),
                    ZoneId = table.Column<int>(type: "INTEGER", nullable: false),
                    TicketTypeId = table.Column<int>(type: "INTEGER", nullable: false),
                    BookingTime = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Status = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bookings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Bookings_Schedules_ScheduleId",
                        column: x => x.ScheduleId,
                        principalTable: "Schedules",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Bookings_TicketTypes_TicketTypeId",
                        column: x => x.TicketTypeId,
                        principalTable: "TicketTypes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Bookings_Zones_ZoneId",
                        column: x => x.ZoneId,
                        principalTable: "Zones",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            // 6. Добавляем данные в Zones
            migrationBuilder.InsertData(
                table: "Zones",
                columns: new[] { "Id", "BasePrice", "HallId", "Name" },
                values: new object[,]
                {
                    { 5, 25.00m, 3, "VIP Диван" },
                    { 6, 30.00m, 3, "VIP Реклайнер" }
                });

            // 7. Создаем индексы
            migrationBuilder.CreateIndex(
                name: "IX_Bookings_ScheduleId",
                table: "Bookings",
                column: "ScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_TicketTypeId",
                table: "Bookings",
                column: "TicketTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Bookings_ZoneId",
                table: "Bookings",
                column: "ZoneId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // 1. Удаляем таблицу Bookings
            migrationBuilder.DropTable(
                name: "Bookings");

            // 2. Удаляем данные из Zones
            migrationBuilder.DeleteData(
                table: "Zones",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "Zones",
                keyColumn: "Id",
                keyValue: 6);

            // 3. Добавляем временную колонку TEXT
            migrationBuilder.AddColumn<string>(
                name: "TempDuration",
                table: "Movies",
                type: "TEXT",
                nullable: false,
                defaultValue: "2ч 0мин");

            // 4. Конвертируем данные обратно
            migrationBuilder.Sql(@"
                UPDATE Movies
                SET TempDuration = 
                    (Duration / 60) || 'ч ' || (Duration % 60) || 'мин';
            ");

            // 5. Удаляем новую колонку Duration
            migrationBuilder.DropColumn(
                name: "Duration",
                table: "Movies");

            // 6. Переименовываем TempDuration в Duration
            migrationBuilder.RenameColumn(
                name: "TempDuration",
                table: "Movies",
                newName: "Duration");
        }
    }
}