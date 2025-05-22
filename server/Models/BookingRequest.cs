    namespace CinemaProject.Models
{
    public class BookingRequest
    {
        public int ScheduleId { get; set; }
        public int ZoneId { get; set; }
        public int TicketTypeId { get; set; }
        public string? SeatId { get; set; } // Сделано необязательным
    }
}