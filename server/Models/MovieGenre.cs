using System.ComponentModel.DataAnnotations;

namespace CinemaProject.Models
{
    public class MovieGenre
    {
        [Required]
        public int MovieId { get; set; }
        
        [Required]
        public int GenreId { get; set; }
        
        // Навигационные свойства
        public Movie Movie { get; set; } = null!;
        public Genre Genre { get; set; } = null!;
    }
}