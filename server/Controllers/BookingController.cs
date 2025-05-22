// using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.Mvc;
// using Microsoft.EntityFrameworkCore;
// using CinemaProject.Data;
// using CinemaProject.Models;
// using System;
// using System.Collections.Generic;
// using System.Linq;
// using System.Text.Json;
// using System.Threading.Tasks;

// namespace CinemaProject.Controllers
// {
//     [Route("api/cinema/bookings")]
//     [ApiController]
//     public class BookingController : ControllerBase
//     {
//         private readonly AppDbContext _context;

//         public BookingController(AppDbContext context)
//         {
//             _context = context;
//         }

//         public class SeatInfo
//         {
//             public string SeatId { get; set; }
//             public bool IsTaken { get; set; }
//             public int ZoneId { get; set; }
//             public string ZoneName { get; set; }
//             public string SeatType { get; set; }
//             public decimal BasePrice { get; set; }
//             public decimal PopularityPrice { get; set; }
//             public decimal TimeSlotPrice { get; set; }
//             public decimal FinalPrice { get; set; }
//         }


//         [HttpGet("seats/{scheduleId}")]
//         public async Task<IActionResult> GetSeats(int scheduleId)
//         {
//             var schedule = await _context.Schedules
//                 .Include(s => s.Movie)
//                 .Include(s => s.Hall)
//                 .ThenInclude(h => h.Zones)
//                 .FirstOrDefaultAsync(s => s.Id == scheduleId);

//             if (schedule == null)
//             {
//                 return NotFound("Сеанс не найден");
//             }

//             var bookings = await _context.Bookings
//                 .Where(b => b.ScheduleId == scheduleId && b.Status == "Confirmed")
//                 .Select(b => b.SeatId)
//                 .ToListAsync();

//             var priceModifiers = await _context.PriceModifiers.ToListAsync();
//             var popularityModifier = priceModifiers.FirstOrDefault(pm => pm.Type == "popularity");
//             var timeSlotModifier = priceModifiers.FirstOrDefault(pm => pm.Type == "time_slot");

//             var seats = new List<SeatInfo>();
//             foreach (var zone in schedule.Hall.Zones)
//             {
//                 int seatsPerRow = zone.Name.ToLower().Contains("sofa") || zone.Name.ToLower().Contains("loveseat") ? 5 : 10;
//                 int rows = zone.Name.ToLower().Contains("vip") ? 6 : 10;
//                 string seatType = zone.Name.ToLower().Contains("sofa") ? "sofa" :
//                                  zone.Name.ToLower().Contains("loveseat") ? "loveSeat" :
//                                  zone.Name.ToLower().Contains("реклайнер") ? "recliner" : "standard";

//                 for (int row = 1; row <= rows; row++)
//                 {
//                     for (int seat = 1; seat <= seatsPerRow; seat++)
//                     {
//                         var seatId = $"{row}-{seat}";
//                         var isTaken = bookings.Contains(seatId);

//                         decimal basePrice = zone.BasePrice;
//                         decimal popularityPrice = basePrice;
//                         decimal timeSlotPrice = basePrice;

//                         if (popularityModifier != null && schedule.Movie != null)
//                         {
//                             var condition = JsonSerializer.Deserialize<Dictionary<string, float>>(popularityModifier.Condition);
//                             if (condition != null && schedule.Movie.PopularityScore >= condition["min_score"])
//                             {
//                                 popularityPrice = basePrice * (decimal)popularityModifier.Multiplier;
//                             }
//                         }

//                         if (timeSlotModifier != null)
//                         {
//                             var condition = JsonSerializer.Deserialize<Dictionary<string, string>>(timeSlotModifier.Condition);
//                             if (condition != null)
//                             {
//                                 var startTime = TimeSpan.Parse(condition["start_time"]);
//                                 var endTime = TimeSpan.Parse(condition["end_time"]);
//                                 if (schedule.Time >= startTime && schedule.Time <= endTime)
//                                 {
//                                     timeSlotPrice = basePrice * (decimal)timeSlotModifier.Multiplier;
//                                 }
//                             }
//                         }

//                         decimal finalPrice = Math.Max(popularityPrice, timeSlotPrice);

//                         seats.Add(new SeatInfo
//                         {
//                             SeatId = seatId,
//                             IsTaken = isTaken,
//                             ZoneId = zone.Id,
//                             ZoneName = zone.Name,
//                             SeatType = seatType,
//                             BasePrice = basePrice,
//                             PopularityPrice = popularityPrice,
//                             TimeSlotPrice = timeSlotPrice,
//                             FinalPrice = finalPrice
//                         });
//                     }
//                 }
//             }

//             return Ok(seats);
//         }

//         [HttpPost]
// [Authorize]
// public async Task<IActionResult> CreateBooking([FromBody] BookingRequest request)
// {
//     if (!ModelState.IsValid)
//     {
//         return BadRequest(ModelState);
//     }

//     if (string.IsNullOrEmpty(request.SeatId))
//     {
//         return BadRequest("SeatId обязателен");
//     }

//     var schedule = await _context.Schedules
//         .Include(s => s.Movie)
//         .Include(s => s.Hall)
//         .ThenInclude(h => h.Zones)
//         .FirstOrDefaultAsync(s => s.Id == request.ScheduleId);

//     if (schedule == null)
//     {
//         return NotFound("Сеанс не найден");
//     }

//     var zone = schedule.Hall.Zones.FirstOrDefault(z => z.Id == request.ZoneId);
//     if (zone == null)
//     {
//         return BadRequest("Зона не найдена");
//     }

//     var ticketType = await _context.TicketTypes
//         .FirstOrDefaultAsync(t => t.Id == request.TicketTypeId);
//     if (ticketType == null)
//     {
//         return BadRequest("Тип билета не найден");
//     }

//     var existingBooking = await _context.Bookings
//         .FirstOrDefaultAsync(b => b.ScheduleId == request.ScheduleId &&
//                                 b.SeatId == request.SeatId &&
//                                 b.Status == "Confirmed");
//     if (existingBooking != null)
//     {
//         return Conflict("Место уже забронировано");
//     }

//     decimal basePrice = zone.BasePrice;
//     var priceModifiers = await _context.PriceModifiers.ToListAsync();
//     var popularityModifier = priceModifiers.FirstOrDefault(pm => pm.Type == "popularity");
//     var timeSlotModifier = priceModifiers.FirstOrDefault(pm => pm.Type == "time_slot");

//     if (popularityModifier != null && schedule.Movie != null)
//     {
//         var condition = JsonSerializer.Deserialize<Dictionary<string, float>>(popularityModifier.Condition);
//         if (condition != null && schedule.Movie.PopularityScore >= condition["min_score"])
//         {
//             basePrice *= (decimal)popularityModifier.Multiplier;
//         }
//     }

//     if (timeSlotModifier != null)
//     {
//         var condition = JsonSerializer.Deserialize<Dictionary<string, string>>(timeSlotModifier.Condition);
//         if (condition != null)
//         {
//             var startTime = TimeSpan.Parse(condition["start_time"]);
//             var endTime = TimeSpan.Parse(condition["end_time"]);
//             if (schedule.Time >= startTime && schedule.Time <= endTime)
//             {
//                 basePrice *= (decimal)timeSlotModifier.Multiplier;
//             }
//         }
//     }

//     basePrice *= (decimal)ticketType.Multiplier;

//     var booking = new Booking
//     {
//         UserId = User.Claims.FirstOrDefault(c => c.Type == "sub")?.Value ?? "anonymous",
//         ScheduleId = request.ScheduleId,
//         ZoneId = request.ZoneId,
//         TicketTypeId = request.TicketTypeId,
//         SeatId = request.SeatId,
//         BookingTime = DateTime.UtcNow,
//         Status = "Confirmed",
//         Price = basePrice
//     };

//     _context.Bookings.Add(booking);
//     await _context.SaveChangesAsync();

//     return Ok(new { booking.Id, booking.Price });
// }
//     }
// }