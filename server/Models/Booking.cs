namespace CinemaProject.Models
{
    public class Booking
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public int ScheduleId { get; set; }
        public int ZoneId { get; set; }
        public int TicketTypeId { get; set; }
        public DateTime BookingTime { get; set; }
        public string Status { get; set; }

        public Schedule Schedule { get; set; }
        public Zone Zone { get; set; }
        public TicketType TicketType { get; set; }
    }
}