namespace CinemaProject.Models
{
    public class SeatInfoApi
    {
        public string SeatId { get; set; } = string.Empty;
        public bool IsTaken { get; set; }
        public int ZoneId { get; set; }
        public string ZoneName { get; set; } = string.Empty;
        public string SeatType { get; set; } = string.Empty;
        public decimal BasePrice { get; set; }
        public decimal PopularityPrice { get; set; }
        public decimal TimeSlotPrice { get; set; }
        public decimal FinalPrice { get; set; }
    }
}