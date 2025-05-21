using System.ComponentModel.DataAnnotations;

namespace CinemaProject.Models
{
    public class TicketType
    {
        public int Id { get; set; }

        [Required, StringLength(50)]
        public required string Name { get; set; } // Стандартный, Студенческий, Пенсионный

        [Required]
        public float Multiplier { get; set; } // Множитель цены, например, 1.0 для стандартного, 0.8 для студенческого
    }
}