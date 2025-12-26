using System.ComponentModel.DataAnnotations;

namespace CinemaProject.Models
{
    public class Genre
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = null!;
        
        // Навигационное свойство для связи many-to-many
        public List<MovieGenre> MovieGenres { get; set; } = new List<MovieGenre>();
    }
}