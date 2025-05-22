namespace CinemaProject.Models
{
    public class SeatInfoApi
    {
        public string SeatId { get; set; }
        public bool IsTaken { get; set; }
        public int ZoneId { get; set; }
        public string ZoneName { get; set; }
        public string SeatType { get; set; }
        public decimal BasePrice { get; set; }
        public decimal PopularityPrice { get; set; }
        public decimal TimeSlotPrice { get; set; }
        public decimal FinalPrice { get; set; }
    }
}