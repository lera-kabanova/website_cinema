using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CinemaProject.Models
{
    public class Movie
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required int Duration { get; set; } // Теперь int (минуты)
        public required string Genre { get; set; }
        public required string ImageUrl { get; set; }

        public string? AgeRating { get; set; }
        public int? Year { get; set; }
        public string? Description { get; set; }
        public string? TrailerUrl { get; set; }
        public string? BackgroundImageUrl { get; set; }

        [Column(TypeName = "float")]
        public float PopularityScore { get; set; } = 0.5f;
    }
}