using System.ComponentModel.DataAnnotations;

namespace CinemaProject.Models
{
    public class PriceModifier
    {
        public int Id { get; set; }

        [Required]
        public required string Type { get; set; }

        [Required]
        public required string Condition { get; set; }

        [Required]
        public float Multiplier { get; set; }
    }
}