using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CinemaProject.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CinemaProject.Models;
using Microsoft.AspNetCore.Authorization;

namespace CinemaProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CinemaController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CinemaController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("halls")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<object>>> GetHalls()
        {
            var halls = await _context.Halls
                .Include(h => h.Zones)
                .Select(h => new
                {
                    h.Id,
                    h.Name,
                    h.Capacity,
                    h.Type,
                    Zones = h.Zones.Select(z => new
                    {
                        z.Id,
                        z.Name,
                        z.BasePrice
                    }).ToList()
                })
                .ToListAsync();
            return Ok(halls);
        }

        [HttpGet("ticket-types")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<TicketType>>> GetTicketTypes()
        {
            return await _context.TicketTypes.ToListAsync();
        }

        [HttpGet("movies/{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Movie>> GetMovie(int id)
        {
            var movie = await _context.Movies.FindAsync(id);
            if (movie == null) return NotFound("Фильм не найден");
            return Ok(movie);
        }
[HttpPost("bookings")]
[Authorize]
public async Task<IActionResult> CreateBooking([FromBody] BookingRequest request)
{
    var schedule = await _context.Schedules
        .Include(s => s.Hall)
        .ThenInclude(h => h.Zones)
        .Include(s => s.Movie)
        .FirstOrDefaultAsync(s => s.Id == request.ScheduleId);
    if (schedule == null) return NotFound("Сеанс не найден");

    var zone = schedule.Hall.Zones.FirstOrDefault(z => z.Id == request.ZoneId);
    if (zone == null) return NotFound("Зона не найдена");

    var ticketType = await _context.TicketTypes.FindAsync(request.TicketTypeId);
    if (ticketType == null) return NotFound("Тип билета не найден");

    var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
    if (string.IsNullOrEmpty(userId)) return Unauthorized();

    var seatParts = request.SeatId.Split('-');
    if (seatParts.Length != 2 || !int.TryParse(seatParts[0], out int seatRow) || !int.TryParse(seatParts[1], out int seatNumber))
    {
        return BadRequest("Неверный формат SeatId");
    }

    // Определяем timeSlotMultiplier
    var timeSlotModifier = await _context.PriceModifiers
        .FirstOrDefaultAsync(pm => pm.Type == "time_slot");
    var timeSlotMultiplier = 1.0m;
    if (timeSlotModifier != null)
    {
        var condition = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(timeSlotModifier.Condition);
        var startTime = TimeSpan.Parse(condition["start_time"]);
        var endTime = TimeSpan.Parse(condition["end_time"]);
        if (schedule.Time >= startTime && schedule.Time <= endTime)
        {
            timeSlotMultiplier = (decimal)timeSlotModifier.Multiplier;
        }
    }

    // Определяем popularityMultiplier
    var popularityScore = schedule.Movie?.PopularityScore ?? 0.5f;
    var popularityModifier = await _context.PriceModifiers
        .FirstOrDefaultAsync(pm => pm.Type == "popularity");
    var popularityMultiplier = 1.0m;
    if (popularityModifier != null)
    {
        var condition = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, float>>(popularityModifier.Condition);
        var minScore = condition["min_score"];
        if (popularityScore >= minScore)
        {
            popularityMultiplier = (decimal)popularityModifier.Multiplier;
        }
    }

    var booking = new Booking
    {
        UserId = userId,
        ScheduleId = request.ScheduleId,
        ZoneId = request.ZoneId,
        TicketTypeId = request.TicketTypeId,
        SeatId = request.SeatId,
        BookingTime = DateTime.UtcNow,
        Status = "Confirmed",
        SeatRow = seatRow,
        SeatNumber = seatNumber,
        FinalPrice = zone.BasePrice * ticketType.Multiplier * popularityMultiplier * timeSlotMultiplier
    };

    _context.Bookings.Add(booking);
    await _context.SaveChangesAsync();
    return Ok("Бронирование успешно");
}

        [HttpGet("halls/{id}/rows")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Row>>> GetHallRows(int id)
        {
            var rows = await _context.Rows
                .Where(r => r.HallId == id)
                .ToListAsync();
            if (!rows.Any()) return NotFound("Ряды для зала не найдены");
            return Ok(rows);
        }

       [HttpGet("bookings/seats/{sessionId}")]
[AllowAnonymous]
public async Task<ActionResult<IEnumerable<SeatInfoApi>>> GetSeatsForSession(int sessionId)
{
    var schedule = await _context.Schedules
        .Include(s => s.Hall)
        .ThenInclude(h => h.Zones)
        .Include(s => s.Movie)
        .FirstOrDefaultAsync(s => s.Id == sessionId);
    if (schedule == null)
    {
        Console.WriteLine($"No schedule found for SessionId: {sessionId}");
        return NotFound("Сеанс не найден");
    }

    var bookings = await _context.Bookings
        .Where(b => b.ScheduleId == sessionId)
        .ToListAsync();

    var ticketTypes = await _context.TicketTypes.ToListAsync();
    var standardTicket = ticketTypes.FirstOrDefault(t => t.Name.ToLower() == "стандартный") ?? ticketTypes.First();

    // Определяем timeSlotMultiplier
    var timeSlotModifier = await _context.PriceModifiers
        .FirstOrDefaultAsync(pm => pm.Type == "time_slot");
    var timeSlotMultiplier = 1.0m;
    if (timeSlotModifier != null)
    {
        var condition = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(timeSlotModifier.Condition);
        var startTime = TimeSpan.Parse(condition["start_time"]);
        var endTime = TimeSpan.Parse(condition["end_time"]);
        if (schedule.Time >= startTime && schedule.Time <= endTime)
        {
            timeSlotMultiplier = (decimal)timeSlotModifier.Multiplier; // 1.2 для 18:00–22:00
        }
    }

    // Определяем popularityMultiplier
    var popularityScore = schedule.Movie?.PopularityScore ?? 0.5f;
    var popularityModifier = await _context.PriceModifiers
        .FirstOrDefaultAsync(pm => pm.Type == "popularity");
    var popularityMultiplier = 1.0m;
    if (popularityModifier != null)
    {
        var condition = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, float>>(popularityModifier.Condition);
        var minScore = condition["min_score"];
        if (popularityScore >= minScore)
        {
            popularityMultiplier = (decimal)popularityModifier.Multiplier; // 1.3 для score >= 0.8
        }
    }

    var seats = new List<SeatInfoApi>();
    foreach (var zone in schedule.Hall.Zones)
    {
        var rows = await _context.Rows
            .Where(r => r.HallId == schedule.HallId && r.ZoneId == zone.Id)
            .ToListAsync();

        foreach (var row in rows)
        {
            for (int seatNum = 1; seatNum <= row.Seats; seatNum++)
            {
                var seatId = $"{row.Number}-{seatNum}";
                var isTaken = bookings.Any(b => b.SeatId == seatId);
                var finalPrice = zone.BasePrice * standardTicket.Multiplier * popularityMultiplier * timeSlotMultiplier;
                seats.Add(new SeatInfoApi
                {
                    SeatId = seatId,
                    IsTaken = isTaken,
                    ZoneId = zone.Id,
                    ZoneName = zone.Name,
                    SeatType = row.Type,
                    BasePrice = zone.BasePrice,
                    PopularityPrice = zone.BasePrice * popularityMultiplier,
                    TimeSlotPrice = zone.BasePrice * timeSlotMultiplier,
                    FinalPrice = finalPrice
                });
            }
        }
    }

    Console.WriteLine($"SessionId: {sessionId}, Time: {schedule.Time}, PopularityScore: {popularityScore}, TimeSlotMultiplier: {timeSlotMultiplier}, Seats: {seats.Count}");
    return Ok(seats);
}
    }

    public class BookingRequest
    {
        public int ScheduleId { get; set; }
        public int ZoneId { get; set; }
        public int TicketTypeId { get; set; }
        public string SeatId { get; set; }
    }
}