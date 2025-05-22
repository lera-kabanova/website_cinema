using Microsoft.EntityFrameworkCore;
using CinemaProject.Models;

namespace CinemaProject.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Movie> Movies { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Hall> Halls { get; set; }
        public DbSet<Zone> Zones { get; set; }
        public DbSet<Schedule> Schedules { get; set; }
        public DbSet<PriceModifier> PriceModifiers { get; set; }
        public DbSet<TicketType> TicketTypes { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Row> Rows { get; set; } // Добавлено

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Hall>()
                .ToTable(t => t.HasCheckConstraint("CK_Hall_Type", "Type IN ('standard', 'comfort', 'vip')"));

            modelBuilder.Entity<Hall>()
                .HasMany(h => h.Zones)
                .WithOne(z => z.Hall)
                .HasForeignKey(z => z.HallId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Hall>()
                .HasMany(h => h.Rows)
                .WithOne(r => r.Hall)
                .HasForeignKey(r => r.HallId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Schedule)
                .WithMany()
                .HasForeignKey(b => b.ScheduleId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Zone)
                .WithMany()
                .HasForeignKey(b => b.ZoneId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.TicketType)
                .WithMany()
                .HasForeignKey(b => b.TicketTypeId)
                .OnDelete(DeleteBehavior.Cascade);

            // Начальные данные для залов
            modelBuilder.Entity<Hall>().HasData(
                new Hall { Id = 1, Name = "Зал 1 (Стандартный)", Capacity = 100, Type = "standard" },
                new Hall { Id = 2, Name = "Зал 2 (Комфортный)", Capacity = 50, Type = "comfort" },
                new Hall { Id = 3, Name = "VIP Зал", Capacity = 30, Type = "vip" }
            );

            // Начальные данные для зон
modelBuilder.Entity<Zone>().HasData(
        // HallId=1 (стандартный зал)
        new Zone { Id = 1, HallId = 1, Name = "Стандартное кресло", BasePrice = 10.00m },
        new Zone { Id = 7, HallId = 1, Name = "Диван", BasePrice = 20.00m },
        new Zone { Id = 8, HallId = 1, Name = "LoveSeats", BasePrice = 18.00m },
        // HallId=2 (комфорт)
        new Zone { Id = 3, HallId = 2, Name = "Диван", BasePrice = 20.00m },
        new Zone { Id = 4, HallId = 2, Name = "LoveSeats", BasePrice = 18.00m },
        new Zone { Id = 9, HallId = 2, Name = "Реклайнер", BasePrice = 15.00m },
        new Zone { Id = 10, HallId = 2, Name = "Стандартное кресло", BasePrice = 10.00m },
        // HallId=3 (VIP зал)
        new Zone { Id = 5, HallId = 3, Name = "VIP Диван", BasePrice = 25.00m },
        new Zone { Id = 6, HallId = 3, Name = "VIP Реклайнер", BasePrice = 30.00m },
        new Zone { Id = 11, HallId = 3, Name = "VIP LoveSeats", BasePrice = 28.00m }
    );

            modelBuilder.Entity<Row>().HasData(
    // Зал 1 (Стандартный)
    new Row { Id = 1, HallId = 1, Number = 1, ZoneId = 7, Seats = 5, Type = "sofa", Spacing = "extraWide" },
    new Row { Id = 2, HallId = 1, Number = 2, ZoneId = 1, Seats = 10, Type = "standard", Spacing = "normal" },
    new Row { Id = 3, HallId = 1, Number = 3, ZoneId = 1, Seats = 10, Type = "standard", Spacing = "normal" },
    new Row { Id = 4, HallId = 1, Number = 4, ZoneId = 1, Seats = 10, Type = "standard", Spacing = "normal" },
    new Row { Id = 5, HallId = 1, Number = 5, ZoneId = 1, Seats = 10, Type = "standard", Spacing = "normal" },
    new Row { Id = 6, HallId = 1, Number = 6, ZoneId = 1, Seats = 10, Type = "standard", Spacing = "normal" },
    new Row { Id = 7, HallId = 1, Number = 7, ZoneId = 1, Seats = 10, Type = "standard", Spacing = "normal" },
    new Row { Id = 8, HallId = 1, Number = 8, ZoneId = 1, Seats = 10, Type = "standard", Spacing = "normal" },
    new Row { Id = 9, HallId = 1, Number = 9, ZoneId = 8, Seats = 8, Type = "loveSeat", Spacing = "wide" },
    // Зал 2 (Комфортный)
    new Row { Id = 10, HallId = 2, Number = 1, ZoneId = 3, Seats = 5, Type = "sofa", Spacing = "extraWide" },
    new Row { Id = 11, HallId = 2, Number = 2, ZoneId = 10, Seats = 10, Type = "standard", Spacing = "normal" },
    new Row { Id = 12, HallId = 2, Number = 3, ZoneId = 10, Seats = 10, Type = "standard", Spacing = "normal" },
    new Row { Id = 13, HallId = 2, Number = 4, ZoneId = 10, Seats = 10, Type = "standard", Spacing = "normal" },
    new Row { Id = 14, HallId = 2, Number = 5, ZoneId = 10, Seats = 10, Type = "standard", Spacing = "normal" },
    new Row { Id = 15, HallId = 2, Number = 6, ZoneId = 10, Seats = 10, Type = "standard", Spacing = "normal" },
    new Row { Id = 16, HallId = 2, Number = 7, ZoneId = 10, Seats = 10, Type = "standard", Spacing = "normal" },
    new Row { Id = 17, HallId = 2, Number = 8, ZoneId = 10, Seats = 10, Type = "standard", Spacing = "normal" },
    new Row { Id = 18, HallId = 2, Number = 9, ZoneId = 4, Seats = 8, Type = "loveSeat", Spacing = "wide" },
    new Row { Id = 19, HallId = 2, Number = 10, ZoneId = 9, Seats = 6, Type = "recliner", Spacing = "wide" },
    // Зал 3 (VIP)
    new Row { Id = 20, HallId = 3, Number = 1, ZoneId = 11, Seats = 8, Type = "loveSeat", Spacing = "wide" },
    new Row { Id = 21, HallId = 3, Number = 2, ZoneId = 11, Seats = 8, Type = "loveSeat", Spacing = "wide" },
    new Row { Id = 22, HallId = 3, Number = 3, ZoneId = 6, Seats = 8, Type = "recliner", Spacing = "wide" },
    new Row { Id = 23, HallId = 3, Number = 4, ZoneId = 6, Seats = 8, Type = "recliner", Spacing = "wide" },
    new Row { Id = 24, HallId = 3, Number = 5, ZoneId = 5, Seats = 6, Type = "sofa", Spacing = "wide" },
    new Row { Id = 25, HallId = 3, Number = 6, ZoneId = 5, Seats = 6, Type = "sofa", Spacing = "wide" }
);
            // Начальные данные для модификаторов цен
modelBuilder.Entity<PriceModifier>().HasData(
    new PriceModifier { Id = 1, Type = "time_slot", Condition = "{\"start_time\": \"18:00:00\", \"end_time\": \"22:00:00\"}", Multiplier = 1.2f },
    new PriceModifier { Id = 2, Type = "popularity", Condition = "{\"min_score\": 0.8}", Multiplier = 1.3f }
);

            // Начальные данные для типов билетов
            modelBuilder.Entity<TicketType>().HasData(
                new TicketType { Id = 1, Name = "Стандартный", Multiplier = 1.0m },
                new TicketType { Id = 2, Name = "Студенческий", Multiplier = 0.8m },
                new TicketType { Id = 3, Name = "Пенсионный", Multiplier = 0.7m }
            );
        }
    }
}