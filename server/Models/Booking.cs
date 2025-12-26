using System;
using System.ComponentModel.DataAnnotations;

namespace CinemaProject.Models
{
    public class Booking
    {
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public int ScheduleId { get; set; }

        [Required]
        public int ZoneId { get; set; }

        [Required]
        public int TicketTypeId { get; set; }

        [Required]
        public string SeatId { get; set; }

        public int SeatRow { get; set; }
        public int SeatNumber { get; set; }

        public DateTime BookingTime { get; set; }

        [Required]
        public string Status { get; set; }

        public decimal FinalPrice { get; set; }

        public Schedule Schedule { get; set; } // Навигационное свойство
        public Zone Zone { get; set; } // Навигационное свойство
        public TicketType TicketType { get; set; } // Навигационное свойство
        public User User { get; set; } // Навигационное свойство
    }
}