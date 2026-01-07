using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CinemaProject.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CinemaProject.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

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
            var movie = await _context.Movies
                .Include(m => m.MovieGenres)
                    .ThenInclude(mg => mg.Genre)
                .FirstOrDefaultAsync(m => m.Id == id);
            if (movie == null) return NotFound("Фильм не найден");
            return Ok(movie);
        }

        [HttpPost("bookings")]
        [Authorize]
        public async Task<IActionResult> CreateBooking([FromBody] BookingRequest request)
        {
    try
    {
        if (request == null)
        {
            return BadRequest("Запрос не может быть пустым");
        }

        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            return Unauthorized("Пользователь не авторизован");
        }

        var schedule = await _context.Schedules
            .Include(s => s.Hall)
                .ThenInclude(h => h.Zones)
            .Include(s => s.Movie)
                .ThenInclude(m => m.MovieGenres)
                    .ThenInclude(mg => mg.Genre)
            .FirstOrDefaultAsync(s => s.Id == request.ScheduleId);
        
        // Проверяем активность сеанса и зала после загрузки
        if (schedule == null || !schedule.IsActive)
            return NotFound("Сеанс не найден или неактивен");
        
        if (schedule.Hall == null || schedule.Hall.IsClosed)
            return BadRequest("Зал не найден или закрыт");
        
        if (schedule == null) 
            return NotFound("Сеанс не найден");

        if (schedule.Hall == null)
            return BadRequest("Зал не найден для данного сеанса");

        var zone = schedule.Hall.Zones?.FirstOrDefault(z => z.Id == request.ZoneId);
        if (zone == null) 
            return NotFound("Зона не найдена");

        var ticketType = await _context.TicketTypes.FindAsync(request.TicketTypeId);
        if (ticketType == null) 
            return NotFound("Тип билета не найден");

        if (string.IsNullOrEmpty(request.SeatId))
            return BadRequest("SeatId не может быть пустым");

        var seatParts = request.SeatId.Split('-');
        if (seatParts.Length != 2 || !int.TryParse(seatParts[0], out int seatRow) || !int.TryParse(seatParts[1], out int seatNumber))
        {
            return BadRequest("Неверный формат SeatId");
        }

        // Проверяем, не занято ли место
        var existingBooking = await _context.Bookings
            .FirstOrDefaultAsync(b => b.ScheduleId == request.ScheduleId && b.SeatId == request.SeatId && b.Status == "Confirmed");
        if (existingBooking != null)
        {
            return BadRequest("Место уже забронировано");
        }

        // Определяем timeSlotMultiplier
        var timeSlotModifier = await _context.PriceModifiers
            .FirstOrDefaultAsync(pm => pm.Type == "time_slot");
        var timeSlotMultiplier = 1.0m;
        if (timeSlotModifier != null && !string.IsNullOrEmpty(timeSlotModifier.Condition))
        {
            try
            {
                var condition = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(timeSlotModifier.Condition);
                if (condition != null && condition.ContainsKey("start_time") && condition.ContainsKey("end_time"))
                {
                    var startTime = TimeSpan.Parse(condition["start_time"]);
                    var endTime = TimeSpan.Parse(condition["end_time"]);
                    if (schedule.Time >= startTime && schedule.Time <= endTime)
                    {
                        timeSlotMultiplier = (decimal)timeSlotModifier.Multiplier;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error parsing time slot modifier: {ex.Message}");
            }
        }

        // Определяем popularityMultiplier
        var popularityScore = schedule.Movie?.PopularityScore ?? 0.5f;
        var popularityModifier = await _context.PriceModifiers
            .FirstOrDefaultAsync(pm => pm.Type == "popularity");
        var popularityMultiplier = 1.0m;
        if (popularityModifier != null && !string.IsNullOrEmpty(popularityModifier.Condition))
        {
            try
            {
                var condition = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, float>>(popularityModifier.Condition);
                if (condition != null && condition.ContainsKey("min_score"))
                {
                    var minScore = condition["min_score"];
                    if (popularityScore >= minScore)
                    {
                        popularityMultiplier = (decimal)popularityModifier.Multiplier;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error parsing popularity modifier: {ex.Message}");
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
        return Ok(new { message = "Бронирование успешно", bookingId = booking.Id });
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error in CreateBooking: {ex.Message}");
        Console.WriteLine($"Stack trace: {ex.StackTrace}");
        return StatusCode(500, $"Внутренняя ошибка сервера: {ex.Message}");
    }
}

        [HttpGet("bookings/my")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<object>>> GetMyBookings()
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
                {
                    return Unauthorized();
                }

                var bookings = await _context.Bookings
                    .Where(b => b.UserId == userId && b.Status == "Confirmed")
                    .Include(b => b.Schedule)
                        .ThenInclude(s => s.Movie)
                            .ThenInclude(m => m.MovieGenres)
                                .ThenInclude(mg => mg.Genre)
                    .Include(b => b.Schedule)
                        .ThenInclude(s => s.Hall)
                    .Include(b => b.Zone)
                    .Include(b => b.TicketType)
                    .AsNoTracking() // Не отслеживаем изменения для избежания проблем с сериализацией
                    .OrderByDescending(b => b.BookingTime)
                    .ToListAsync();

                // Фильтруем только активные сеансы и не закрытые залы
                bookings = bookings
                    .Where(b => b.Schedule != null && b.Schedule.IsActive && b.Schedule.Hall != null && !b.Schedule.Hall.IsClosed)
                    .ToList();

                var result = bookings.Select(b =>
                {
                    object? movie = null;
                    string cinema = "";
                    string date = "";
                    string time = "";
                    
                    try
                    {
                        if (b.Schedule?.Movie != null)
                        {
                            string genre = string.Empty;
                            try
                            {
                                // Безопасное получение Genre
                                if (b.Schedule.Movie.MovieGenres != null && b.Schedule.Movie.MovieGenres.Count > 0)
                                {
                                    genre = string.Join(", ", b.Schedule.Movie.MovieGenres
                                        .Where(mg => mg != null && mg.Genre != null)
                                        .Select(mg => mg.Genre!.Name)
                                        .OrderBy(name => name));
                                }
                            }
                            catch
                            {
                                genre = string.Empty;
                            }
                            
                            movie = new
                            {
                                b.Schedule.Movie.Id,
                                b.Schedule.Movie.Title,
                                b.Schedule.Movie.ImageUrl,
                                Genre = genre
                            };
                        }
                        cinema = b.Schedule?.Hall?.Name ?? "";
                        date = b.Schedule?.Date.ToString("dd.MM.yyyy") ?? "";
                        time = b.Schedule?.Time.ToString(@"hh\:mm") ?? "";
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error processing booking {b.Id}: {ex.Message}");
                        Console.WriteLine($"Stack trace: {ex.StackTrace}");
                    }
                    
                    return new
                    {
                        b.Id,
                        Movie = movie,
                        Cinema = cinema,
                        Date = date,
                        Time = time,
                        Seat = $"{b.SeatRow}-{b.SeatNumber}",
                        Zone = b.Zone?.Name ?? "",
                        b.FinalPrice,
                        b.BookingTime
                    };
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetMyBookings: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return StatusCode(500, $"Внутренняя ошибка сервера: {ex.Message}");
            }
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
    try
    {
        var schedule = await _context.Schedules
            .Include(s => s.Hall)
                .ThenInclude(h => h.Zones)
            .AsNoTracking() // Не отслеживаем изменения для избежания проблем с сериализацией
            .FirstOrDefaultAsync(s => s.Id == sessionId);
        
        // Проверяем активность сеанса и зала после загрузки
        if (schedule == null || !schedule.IsActive)
            return NotFound("Сеанс не найден или неактивен");
        
        if (schedule.Hall == null || schedule.Hall.IsClosed)
            return BadRequest("Зал не найден или закрыт");
        
        if (schedule == null)
        {
            Console.WriteLine($"No schedule found for SessionId: {sessionId}");
            return NotFound("Сеанс не найден");
        }

        if (schedule.Hall == null)
        {
            return BadRequest("Зал не найден для данного сеанса");
        }

        var bookings = await _context.Bookings
            .Where(b => b.ScheduleId == sessionId && b.Status == "Confirmed")
            .AsNoTracking()
            .ToListAsync();

        var ticketTypes = await _context.TicketTypes
            .AsNoTracking()
            .ToListAsync();
        var standardTicket = ticketTypes.FirstOrDefault(t => t.Name.ToLower() == "стандартный") ?? ticketTypes.First();

        // Определяем timeSlotMultiplier
        var timeSlotModifier = await _context.PriceModifiers
            .AsNoTracking()
            .FirstOrDefaultAsync(pm => pm.Type == "time_slot");
        var timeSlotMultiplier = 1.0m;
        if (timeSlotModifier != null && !string.IsNullOrEmpty(timeSlotModifier.Condition))
        {
            try
            {
                var condition = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, string>>(timeSlotModifier.Condition);
                if (condition != null && condition.ContainsKey("start_time") && condition.ContainsKey("end_time"))
                {
                    var startTime = TimeSpan.Parse(condition["start_time"]);
                    var endTime = TimeSpan.Parse(condition["end_time"]);
                    if (schedule.Time >= startTime && schedule.Time <= endTime)
                    {
                        timeSlotMultiplier = (decimal)timeSlotModifier.Multiplier; // 1.2 для 18:00–22:00
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error parsing time slot modifier: {ex.Message}");
            }
        }

        // Определяем popularityMultiplier - загружаем PopularityScore отдельно
        var movie = await _context.Movies
            .AsNoTracking()
            .Where(m => m.Id == schedule.MovieId)
            .Select(m => new { m.PopularityScore })
            .FirstOrDefaultAsync();
        var popularityScore = movie?.PopularityScore ?? 0.5f;
        var popularityModifier = await _context.PriceModifiers
            .FirstOrDefaultAsync(pm => pm.Type == "popularity");
        var popularityMultiplier = 1.0m;
        if (popularityModifier != null && !string.IsNullOrEmpty(popularityModifier.Condition))
        {
            try
            {
                var condition = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, float>>(popularityModifier.Condition);
                if (condition != null && condition.ContainsKey("min_score"))
                {
                    var minScore = condition["min_score"];
                    if (popularityScore >= minScore)
                    {
                        popularityMultiplier = (decimal)popularityModifier.Multiplier; // 1.3 для score >= 0.8
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error parsing popularity modifier condition: {ex.Message}");
            }
        }

        var seats = new List<SeatInfoApi>();
        if (schedule.Hall.Zones != null)
        {
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
                            SeatId = seatId ?? string.Empty,
                            IsTaken = isTaken,
                            ZoneId = zone.Id,
                            ZoneName = zone.Name ?? string.Empty,
                            SeatType = row.Type ?? string.Empty,
                            BasePrice = zone.BasePrice,
                            PopularityPrice = zone.BasePrice * popularityMultiplier,
                            TimeSlotPrice = zone.BasePrice * timeSlotMultiplier,
                            FinalPrice = finalPrice
                        });
                    }
                }
            }
        }

        Console.WriteLine($"SessionId: {sessionId}, Time: {schedule.Time}, PopularityScore: {popularityScore}, TimeSlotMultiplier: {timeSlotMultiplier}, Seats: {seats.Count}");
        return Ok(seats);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Error in GetSeatsForSession: {ex.Message}");
        Console.WriteLine($"Stack trace: {ex.StackTrace}");
        return StatusCode(500, $"Внутренняя ошибка сервера: {ex.Message}");
    }
}
    }

    public class BookingRequest
    {
        public int ScheduleId { get; set; }
        public int ZoneId { get; set; }
        public int TicketTypeId { get; set; }
        public string SeatId { get; set; } = string.Empty;
    }
}