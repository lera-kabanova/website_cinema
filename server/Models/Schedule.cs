using System;
using System.ComponentModel.DataAnnotations;

namespace CinemaProject.Models
{
    public class Schedule
    {
        public int Id { get; set; }

        [Required]
        public int MovieId { get; set; }

        [Required]
        public int HallId { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public TimeSpan Time { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public Movie? Movie { get; set; }
        public Hall? Hall { get; set; }
    }
}