using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CinemaProject.Data;
using CinemaProject.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
                .FirstOrDefaultAsync(s => s.Id == request.ScheduleId);
            if (schedule == null) return NotFound("Сеанс не найден");

            var zone = schedule.Hall.Zones.FirstOrDefault(z => z.Id == request.ZoneId);
            if (zone == null) return NotFound("Зона не найдена");

            var ticketType = await _context.TicketTypes.FindAsync(request.TicketTypeId);
            if (ticketType == null) return NotFound("Тип билета не найден");

            var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var booking = new Booking
            {
                UserId = userId,
                ScheduleId = request.ScheduleId,
                ZoneId = request.ZoneId,
                TicketTypeId = request.TicketTypeId,
                BookingTime = DateTime.UtcNow,
                Status = "Confirmed"
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();
            return Ok("Бронирование успешно");
        }
    }

    public class BookingRequest
    {
        public int ScheduleId { get; set; }
        public int ZoneId { get; set; }
        public int TicketTypeId { get; set; }
    }
}