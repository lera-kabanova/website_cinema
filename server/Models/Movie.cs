namespace CinemaProject.Models
{
 public class Movie
    {
        public int Id { get; set; }
        public required string Title { get; set; } 
        public required string Duration { get; set; }
        public required string Genre { get; set; }
        public required string ImageUrl { get; set; }

        public string? AgeRating { get; set; } 
        public int? Year { get; set; } 
        public string? Description { get; set; } 
        public string? TrailerUrl { get; set; }
        public string? BackgroundImageUrl { get; set; } 
    }
}