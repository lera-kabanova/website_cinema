using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;

namespace CinemaProject.Models
{
    public class Movie
    {
        public int Id { get; set; }
        public required string Title { get; set; }
        public required int Duration { get; set; } 
        public required string ImageUrl { get; set; }
        public string? AgeRating { get; set; }
        public int? Year { get; set; }
        public string? Description { get; set; }
        public string? TrailerUrl { get; set; }
        public string? BackgroundImageUrl { get; set; }

        [Column(TypeName = "float")]
        public float PopularityScore { get; set; } = 0.5f;
        
        public List<MovieGenre> MovieGenres { get; set; } = new List<MovieGenre>();

        // Вычисляемое свойство для обратной совместимости с фронтендом
        // Преобразует список жанров в строку через запятую
        [NotMapped]
        public string Genre
        {
            get
            {
                try
                {
                    if (MovieGenres == null || MovieGenres.Count == 0)
                        return string.Empty;
                    
                    return string.Join(", ", MovieGenres
                        .Where(mg => mg != null && mg.Genre != null)
                        .Select(mg => mg.Genre!.Name)
                        .OrderBy(name => name));
                }
                catch
                {
                    return string.Empty;
                }
            }
        }
    }
}