    using Microsoft.EntityFrameworkCore;
    using CinemaProject.Models;

    namespace CinemaProject.Data
    {
        public class AppDbContext : DbContext
        {
            public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

            public DbSet<Movie> Movies { get; set; }
            public DbSet<User> Users => Set<User>();
        }
    }