using System.ComponentModel.DataAnnotations;

namespace CinemaProject.Models
{
    public class Hall
    {
        public int Id { get; set; }

        [Required]
        public required string Name { get; set; }

        [Required]
        public int Capacity { get; set; }

        [Required]
        public required string Type { get; set; } // standard, comfort, vip
        public List<Zone> Zones { get; set; } = new List<Zone>();
        public List<Row> Rows { get; set; } = new List<Row>();
    }
}