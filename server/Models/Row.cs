namespace CinemaProject.Models
{
    public class Row
    {
        public int Id { get; set; }
        public int HallId { get; set; }
        public int Number { get; set; }
        public int Seats { get; set; }
        public string Type { get; set; } // standard, sofa, loveSeat, recliner
        public string Spacing { get; set; } // normal, wide, extraWide
        public Hall Hall { get; set; }
    }
}