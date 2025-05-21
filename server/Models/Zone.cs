using System.ComponentModel.DataAnnotations;

namespace CinemaProject.Models
{
    public class Zone
    {
        public int Id { get; set; }

        [Required]
        public int HallId { get; set; }

        [Required]
        public required string Name { get; set; } // Диван, LoveSeats, Реклайнер, Стандартное кресло

        [Required]
        public decimal BasePrice { get; set; } // Цены в белорусских рублях (BYN)

        public Hall? Hall { get; set; } // Навигационное свойство, nullable
    }
}