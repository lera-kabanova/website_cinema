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
        public DbSet<Row> Rows { get; set; }
        public DbSet<Genre> Genres { get; set; }
        public DbSet<MovieGenre> MovieGenres { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Конфигурация для Schedule (SQL Server использует нативные типы datetime2 и time)
            modelBuilder.Entity<Schedule>(entity =>
            {
                entity.ToTable("Schedules");
            });

            // Конфигурация для Booking
            modelBuilder.Entity<Booking>(entity =>
            {
                entity.ToTable("Bookings");
            });

            // Конфигурация для Zone
            modelBuilder.Entity<Zone>(entity =>
            {
                entity.ToTable("Zones");
            });

            // Конфигурация для TicketType
            modelBuilder.Entity<TicketType>(entity =>
            {
                entity.ToTable("TicketTypes");
            });

            // Конфигурация для PriceModifier
            modelBuilder.Entity<PriceModifier>(entity =>
            {
                entity.ToTable("PriceModifiers");
            });

            // Конфигурация для Movie
            modelBuilder.Entity<Movie>(entity =>
            {
                entity.ToTable("Movies");
            });
            modelBuilder.Entity<Genre>(entity =>
            {
                entity.ToTable("Genres");
            });

            modelBuilder.Entity<MovieGenre>(entity =>
            {
                entity.ToTable("MovieGenres");
                
                // Составной первичный ключ
                entity.HasKey(mg => new { mg.MovieId, mg.GenreId });
                
                // Связь с Movie
                entity.HasOne(mg => mg.Movie)
                    .WithMany(m => m.MovieGenres)
                    .HasForeignKey(mg => mg.MovieId)
                    .OnDelete(DeleteBehavior.Cascade);
                
                // Связь с Genre
                entity.HasOne(mg => mg.Genre)
                    .WithMany(g => g.MovieGenres)
                    .HasForeignKey(mg => mg.GenreId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Booking>()
            .HasOne(b => b.User)
            .WithMany()
            .HasForeignKey(b => b.UserId)
            .OnDelete(DeleteBehavior.Restrict);

            // Явное указание имен таблиц (на случай, если в SQL Server они отличаются)
            modelBuilder.Entity<Movie>().ToTable("Movies");
            modelBuilder.Entity<User>().ToTable("Users");
            modelBuilder.Entity<Hall>().ToTable("Halls");
            modelBuilder.Entity<Zone>().ToTable("Zones");
            // modelBuilder.Entity<Schedule>().ToTable("Schedules"); // Уже указано выше
            modelBuilder.Entity<PriceModifier>().ToTable("PriceModifiers");
            modelBuilder.Entity<TicketType>().ToTable("TicketTypes");
            // modelBuilder.Entity<Booking>().ToTable("Bookings"); // Уже указано выше
            modelBuilder.Entity<Row>().ToTable("Rows");
            
            modelBuilder.Entity<Booking>()
                .Property(b => b.FinalPrice)
                .HasPrecision(18, 2); // 18 цифр всего, 2 после запятой

            modelBuilder.Entity<TicketType>()
                .Property(t => t.Multiplier)
                .HasPrecision(5, 2); // 5 цифр всего, 2 после запятой

            modelBuilder.Entity<Zone>()
                .Property(z => z.BasePrice)
                .HasPrecision(18, 2); // 18 цифр всего, 2 после запятой

            modelBuilder.Entity<PriceModifier>()
                .Property(p => p.Multiplier)
                .HasPrecision(5, 2); // 5 цифр всего, 2 после запятой
            modelBuilder.Entity<Hall>()
                .ToTable("Halls")
                .HasCheckConstraint("CK_Hall_Type", "Type IN ('standard', 'comfort', 'vip')");

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

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.User)
                .WithMany()
                .HasForeignKey(b => b.UserId)
                .OnDelete(DeleteBehavior.Restrict); // Не удаляем пользователя при удалении бронирования

            // Конфигурация для Genre
            modelBuilder.Entity<Genre>(entity =>
            {
                entity.ToTable("Genres");
            });

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

            // Начальные данные для жанров
            modelBuilder.Entity<Genre>().HasData(
                new Genre { Id = 1, Name = "Триллер" },
                new Genre { Id = 2, Name = "Боевик" },
                new Genre { Id = 3, Name = "Фэнтези" },
                new Genre { Id = 4, Name = "Романтика" },
                new Genre { Id = 5, Name = "Драма" },
                new Genre { Id = 6, Name = "Ужасы" },
                new Genre { Id = 7, Name = "Комедия" },
                new Genre { Id = 8, Name = "Научная фантастика" }
            );
        }
    }
}