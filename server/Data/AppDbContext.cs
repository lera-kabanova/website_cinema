using Microsoft.EntityFrameworkCore;
using CinemaProject.Models;

namespace CinemaProject.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        public DbSet<Movie> Movies { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Hall> Halls { get; set; }
        public DbSet<Zone> Zones { get; set; }
        public DbSet<Schedule> Schedules { get; set; }
        public DbSet<PriceModifier> PriceModifiers { get; set; }
        public DbSet<TicketType> TicketTypes { get; set; }
        public DbSet<Booking> Bookings { get; set; }

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

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Schedule)
                .WithMany()
                .HasForeignKey(b => b.ScheduleId);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Zone)
                .WithMany()
                .HasForeignKey(b => b.ZoneId);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.TicketType)
                .WithMany()
                .HasForeignKey(b => b.TicketTypeId);

            // Начальные данные для залов
            modelBuilder.Entity<Hall>().HasData(
                new Hall { Id = 1, Name = "Зал 1 (Стандартный)", Capacity = 100, Type = "standard" },
                new Hall { Id = 2, Name = "Зал 2 (Комфортный)", Capacity = 50, Type = "comfort" },
                new Hall { Id = 3, Name = "VIP Зал", Capacity = 30, Type = "vip" }
            );

            // Начальные данные для зон (типы мест, цены в BYN)
            modelBuilder.Entity<Zone>().HasData(
                new Zone { Id = 1, HallId = 1, Name = "Стандартное кресло", BasePrice = 10.00m },
                new Zone { Id = 2, HallId = 1, Name = "Реклайнер", BasePrice = 15.00m },
                new Zone { Id = 3, HallId = 2, Name = "Диван", BasePrice = 20.00m },
                new Zone { Id = 4, HallId = 2, Name = "LoveSeats", BasePrice = 18.00m },
                new Zone { Id = 5, HallId = 3, Name = "VIP Диван", BasePrice = 25.00m },
                new Zone { Id = 6, HallId = 3, Name = "VIP Реклайнер", BasePrice = 30.00m }
            );

            // Начальные данные для модификаторов цен
            modelBuilder.Entity<PriceModifier>().HasData(
                new PriceModifier { Id = 1, Type = "time_slot", Condition = "{\"start_time\": \"18:00\", \"end_time\": \"22:00\"}", Multiplier = 1.2f },
                new PriceModifier { Id = 2, Type = "popularity", Condition = "{\"min_score\": 0.8}", Multiplier = 1.3f }
            );

            // Начальные данные для типов билетов
            modelBuilder.Entity<TicketType>().HasData(
                new TicketType { Id = 1, Name = "Стандартный", Multiplier = 1.0f },
                new TicketType { Id = 2, Name = "Студенческий", Multiplier = 0.8f },
                new TicketType { Id = 3, Name = "Пенсионный", Multiplier = 0.7f }
            );
        }
    }
}