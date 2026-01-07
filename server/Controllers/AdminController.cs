using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CinemaProject.Data;
using CinemaProject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;

namespace CinemaProject.Controllers
{
    [Route("api/admin")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<AdminController> _logger;

        public AdminController(AppDbContext context, ILogger<AdminController> logger)
        {
            _context = context;
            _logger = logger;
        }

        #region Билеты

        /// <summary>
        /// Получить все билеты с фильтрацией
        /// </summary>
        [HttpGet("bookings")]
        public async Task<IActionResult> GetAllBookings(
            [FromQuery] int? scheduleId = null,
            [FromQuery] int? userId = null,
            [FromQuery] string? status = null,
            [FromQuery] string? startDate = null,
            [FromQuery] string? endDate = null)
        {
            try
            {
                var query = _context.Bookings
                    .Include(b => b.Schedule)
                        .ThenInclude(s => s.Movie)
                    .Include(b => b.Schedule)
                        .ThenInclude(s => s.Hall)
                    .Include(b => b.User)
                    .Include(b => b.Zone)
                    .Include(b => b.TicketType)
                    .AsQueryable();

                if (scheduleId.HasValue)
                    query = query.Where(b => b.ScheduleId == scheduleId.Value);

                if (userId.HasValue)
                    query = query.Where(b => b.UserId == userId.Value);

                if (!string.IsNullOrEmpty(status))
                    query = query.Where(b => b.Status == status);

                if (!string.IsNullOrEmpty(startDate) && DateTime.TryParse(startDate, out var start))
                    query = query.Where(b => b.BookingTime >= start);

                if (!string.IsNullOrEmpty(endDate) && DateTime.TryParse(endDate, out var end))
                    query = query.Where(b => b.BookingTime <= end.AddDays(1));

                var bookings = await query
                    .OrderByDescending(b => b.BookingTime)
                    .ToListAsync();

                var result = bookings.Select(b => new
                {
                    b.Id,
                    User = new { b.User.Id, b.User.Email },
                    Schedule = b.Schedule != null ? new
                    {
                        b.Schedule.Id,
                        Movie = b.Schedule.Movie != null ? new
                        {
                            b.Schedule.Movie.Id,
                            b.Schedule.Movie.Title,
                            b.Schedule.Movie.ImageUrl
                        } : null,
                        Hall = b.Schedule.Hall != null ? new
                        {
                            b.Schedule.Hall.Id,
                            b.Schedule.Hall.Name
                        } : null,
                        Date = b.Schedule.Date.ToString("yyyy-MM-dd"),
                        Time = b.Schedule.Time.ToString(@"hh\:mm")
                    } : null,
                    Zone = b.Zone != null ? new { b.Zone.Id, b.Zone.Name } : null,
                    TicketType = b.TicketType != null ? new { b.TicketType.Id, b.TicketType.Name } : null,
                    Seat = $"{b.SeatRow}-{b.SeatNumber}",
                    b.FinalPrice,
                    b.Status,
                    BookingTime = b.BookingTime.ToString("yyyy-MM-dd HH:mm:ss"),
                    CancelledAt = b.CancelledAt.HasValue ? b.CancelledAt.Value.ToString("yyyy-MM-dd HH:mm:ss") : null,
                    CancelledBy = b.CancelledBy
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении билетов");
                return StatusCode(500, new { message = "Ошибка при получении билетов: " + ex.Message });
            }
        }

        /// <summary>
        /// Получить отмененные билеты
        /// </summary>
        [HttpGet("bookings/cancelled")]
        public async Task<IActionResult> GetCancelledBookings()
        {
            try
            {
                var bookings = await _context.Bookings
                    .Where(b => b.Status == "Cancelled")
                    .Include(b => b.Schedule)
                        .ThenInclude(s => s.Movie)
                    .Include(b => b.Schedule)
                        .ThenInclude(s => s.Hall)
                    .Include(b => b.User)
                    .Include(b => b.Zone)
                    .Include(b => b.TicketType)
                    .OrderByDescending(b => b.CancelledAt ?? b.BookingTime)
                    .ToListAsync();

                var result = bookings.Select(b => new
                {
                    b.Id,
                    User = new { b.User.Id, b.User.Email },
                    Schedule = b.Schedule != null ? new
                    {
                        b.Schedule.Id,
                        Movie = b.Schedule.Movie != null ? new
                        {
                            b.Schedule.Movie.Id,
                            b.Schedule.Movie.Title,
                            b.Schedule.Movie.ImageUrl
                        } : null,
                        Hall = b.Schedule.Hall != null ? new
                        {
                            b.Schedule.Hall.Id,
                            b.Schedule.Hall.Name
                        } : null,
                        Date = b.Schedule.Date.ToString("yyyy-MM-dd"),
                        Time = b.Schedule.Time.ToString(@"hh\:mm")
                    } : null,
                    Zone = b.Zone != null ? new { b.Zone.Id, b.Zone.Name } : null,
                    TicketType = b.TicketType != null ? new { b.TicketType.Id, b.TicketType.Name } : null,
                    Seat = $"{b.SeatRow}-{b.SeatNumber}",
                    b.FinalPrice,
                    BookingTime = b.BookingTime.ToString("yyyy-MM-dd HH:mm:ss"),
                    CancelledAt = b.CancelledAt.HasValue ? b.CancelledAt.Value.ToString("yyyy-MM-dd HH:mm:ss") : null,
                    CancelledBy = b.CancelledBy
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении отмененных билетов");
                return StatusCode(500, new { message = "Ошибка при получении отмененных билетов: " + ex.Message });
            }
        }

        /// <summary>
        /// Отменить билет
        /// </summary>
        [HttpPost("bookings/{id}/cancel")]
        public async Task<IActionResult> CancelBooking(int id)
        {
            try
            {
                var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int adminId))
                {
                    return Unauthorized("Администратор не авторизован");
                }

                var booking = await _context.Bookings.FindAsync(id);
                if (booking == null)
                    return NotFound("Билет не найден");

                if (booking.Status == "Cancelled")
                    return BadRequest("Билет уже отменен");

                booking.Status = "Cancelled";
                booking.CancelledAt = DateTime.UtcNow;
                booking.CancelledBy = adminId;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Билет успешно отменен" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при отмене билета");
                return StatusCode(500, new { message = "Ошибка при отмене билета: " + ex.Message });
            }
        }

        #endregion

        #region Расписание

        /// <summary>
        /// Получить все сеансы с фильтрацией
        /// </summary>
        [HttpGet("schedules")]
        public async Task<IActionResult> GetAllSchedules(
            [FromQuery] int? movieId = null,
            [FromQuery] int? hallId = null,
            [FromQuery] bool? isActive = null,
            [FromQuery] string? startDate = null,
            [FromQuery] string? endDate = null)
        {
            try
            {
                var query = _context.Schedules
                    .Include(s => s.Movie)
                    .Include(s => s.Hall)
                    .AsQueryable();

                if (movieId.HasValue)
                    query = query.Where(s => s.MovieId == movieId.Value);

                if (hallId.HasValue)
                    query = query.Where(s => s.HallId == hallId.Value);

                if (isActive.HasValue)
                    query = query.Where(s => s.IsActive == isActive.Value);

                if (!string.IsNullOrEmpty(startDate) && DateTime.TryParse(startDate, out var start))
                    query = query.Where(s => s.Date >= start.Date);

                if (!string.IsNullOrEmpty(endDate) && DateTime.TryParse(endDate, out var end))
                    query = query.Where(s => s.Date <= end.Date);

                var schedules = await query
                    .OrderBy(s => s.Date)
                    .ThenBy(s => s.Time)
                    .ToListAsync();

                var result = schedules.Select(s => new
                {
                    s.Id,
                    Movie = s.Movie != null ? new
                    {
                        s.Movie.Id,
                        s.Movie.Title,
                        s.Movie.ImageUrl,
                        s.Movie.Duration
                    } : null,
                    Hall = s.Hall != null ? new
                    {
                        s.Hall.Id,
                        s.Hall.Name,
                        s.Hall.Type,
                        s.Hall.IsClosed
                    } : null,
                    Date = s.Date.ToString("yyyy-MM-dd"),
                    Time = s.Time.ToString(@"hh\:mm"),
                    s.IsActive,
                    CreatedAt = s.CreatedAt.ToString("yyyy-MM-dd HH:mm:ss"),
                    BookingsCount = _context.Bookings.Count(b => b.ScheduleId == s.Id && b.Status == "Confirmed"),
                    CancelledBookingsCount = _context.Bookings.Count(b => b.ScheduleId == s.Id && b.Status == "Cancelled")
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении расписания");
                return StatusCode(500, new { message = "Ошибка при получении расписания: " + ex.Message });
            }
        }

        /// <summary>
        /// Обновить сеанс
        /// </summary>
        [HttpPut("schedules/{id}")]
        public async Task<IActionResult> UpdateSchedule(int id, [FromBody] UpdateScheduleDto dto)
        {
            try
            {
                var schedule = await _context.Schedules.FindAsync(id);
                if (schedule == null)
                    return NotFound("Сеанс не найден");

                if (dto.MovieId.HasValue)
                    schedule.MovieId = dto.MovieId.Value;

                if (dto.HallId.HasValue)
                    schedule.HallId = dto.HallId.Value;

                if (!string.IsNullOrEmpty(dto.Date) && DateTime.TryParse(dto.Date, out var date))
                    schedule.Date = date.Date;

                if (!string.IsNullOrEmpty(dto.Time) && TimeSpan.TryParse(dto.Time, out var time))
                    schedule.Time = time;

                if (dto.IsActive.HasValue)
                    schedule.IsActive = dto.IsActive.Value;

                await _context.SaveChangesAsync();

                return Ok(new { message = "Сеанс успешно обновлен" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при обновлении сеанса");
                return StatusCode(500, new { message = "Ошибка при обновлении сеанса: " + ex.Message });
            }
        }

        /// <summary>
        /// Скрыть/показать сеанс
        /// </summary>
        [HttpPatch("schedules/{id}/toggle-active")]
        public async Task<IActionResult> ToggleScheduleActive(int id)
        {
            try
            {
                var schedule = await _context.Schedules.FindAsync(id);
                if (schedule == null)
                    return NotFound("Сеанс не найден");

                schedule.IsActive = !schedule.IsActive;
                await _context.SaveChangesAsync();

                return Ok(new { message = $"Сеанс {(schedule.IsActive ? "активирован" : "скрыт")}", isActive = schedule.IsActive });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при изменении статуса сеанса");
                return StatusCode(500, new { message = "Ошибка при изменении статуса сеанса: " + ex.Message });
            }
        }

        /// <summary>
        /// Удалить сеанс
        /// </summary>
        [HttpDelete("schedules/{id}")]
        public async Task<IActionResult> DeleteSchedule(int id)
        {
            try
            {
                var schedule = await _context.Schedules.FindAsync(id);
                
                if (schedule == null)
                    return NotFound("Сеанс не найден");

                // Проверяем, есть ли активные бронирования
                var activeBookings = await _context.Bookings
                    .Where(b => b.ScheduleId == id && b.Status == "Confirmed")
                    .ToListAsync();
                
                if (activeBookings.Any())
                {
                    return BadRequest(new { message = "Нельзя удалить сеанс с активными бронированиями. Сначала отмените все билеты." });
                }

                _context.Schedules.Remove(schedule);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Сеанс успешно удален" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при удалении сеанса");
                return StatusCode(500, new { message = "Ошибка при удалении сеанса: " + ex.Message });
            }
        }

        #endregion

        #region Залы

        /// <summary>
        /// Получить все залы
        /// </summary>
        [HttpGet("halls")]
        public async Task<IActionResult> GetAllHalls()
        {
            try
            {
                var halls = await _context.Halls
                    .Include(h => h.Zones)
                    .ToListAsync();

                var result = halls.Select(h => new
                {
                    h.Id,
                    h.Name,
                    h.Capacity,
                    h.Type,
                    h.IsClosed,
                    Zones = h.Zones.Select(z => new
                    {
                        z.Id,
                        z.Name,
                        z.BasePrice
                    }).ToList(),
                    ActiveSchedulesCount = _context.Schedules.Count(s => s.HallId == h.Id && s.IsActive && s.Date >= DateTime.Today)
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении залов");
                return StatusCode(500, new { message = "Ошибка при получении залов: " + ex.Message });
            }
        }

        /// <summary>
        /// Закрыть/открыть зал
        /// </summary>
        [HttpPatch("halls/{id}/toggle-closed")]
        public async Task<IActionResult> ToggleHallClosed(int id)
        {
            try
            {
                var hall = await _context.Halls.FindAsync(id);
                if (hall == null)
                    return NotFound("Зал не найден");

                var isClosing = !hall.IsClosed;
                hall.IsClosed = isClosing;

                var schedules = await _context.Schedules
                    .Where(s => s.HallId == id)
                    .ToListAsync();

                if (isClosing)
                {
                    // Если зал закрывается, скрываем все его сеансы
                    foreach (var schedule in schedules)
                    {
                        schedule.IsActive = false;
                    }
                }
                else
                {
                    // Если зал открывается, показываем все его сеансы (которые еще не прошли)
                    var today = DateTime.Today;
                    foreach (var schedule in schedules)
                    {
                        // Восстанавливаем видимость только для будущих сеансов
                        if (schedule.Date >= today)
                        {
                            schedule.IsActive = true;
                        }
                    }
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = $"Зал {(hall.IsClosed ? "закрыт" : "открыт")}", isClosed = hall.IsClosed });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при изменении статуса зала");
                return StatusCode(500, new { message = "Ошибка при изменении статуса зала: " + ex.Message });
            }
        }

        #endregion

        #region Статистика

        /// <summary>
        /// Статистика по сеансам
        /// </summary>
        [HttpGet("statistics/schedules")]
        public async Task<IActionResult> GetScheduleStatistics(
            [FromQuery] int? scheduleId = null,
            [FromQuery] string? startDate = null,
            [FromQuery] string? endDate = null)
        {
            try
            {
                var query = _context.Schedules
                    .Include(s => s.Movie)
                    .Include(s => s.Hall)
                    .AsQueryable();

                if (scheduleId.HasValue)
                    query = query.Where(s => s.Id == scheduleId.Value);

                if (!string.IsNullOrEmpty(startDate) && DateTime.TryParse(startDate, out var start))
                    query = query.Where(s => s.Date >= start.Date);

                if (!string.IsNullOrEmpty(endDate) && DateTime.TryParse(endDate, out var end))
                    query = query.Where(s => s.Date <= end.Date);

                var schedules = await query.ToListAsync();

                var result = schedules.Select(s =>
                {
                    var confirmedBookings = _context.Bookings
                        .Where(b => b.ScheduleId == s.Id && b.Status == "Confirmed")
                        .ToList();

                    var cancelledBookings = _context.Bookings
                        .Where(b => b.ScheduleId == s.Id && b.Status == "Cancelled")
                        .ToList();

                    return new
                    {
                        ScheduleId = s.Id,
                        Movie = s.Movie != null ? new { s.Movie.Id, s.Movie.Title } : null,
                        Hall = s.Hall != null ? new { s.Hall.Id, s.Hall.Name } : null,
                        Date = s.Date.ToString("yyyy-MM-dd"),
                        Time = s.Time.ToString(@"hh\:mm"),
                        ConfirmedTicketsCount = confirmedBookings.Count,
                        CancelledTicketsCount = cancelledBookings.Count,
                        Revenue = confirmedBookings.Sum(b => b.FinalPrice),
                        CancelledRevenue = cancelledBookings.Sum(b => b.FinalPrice)
                    };
                }).ToList();

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении статистики по сеансам");
                return StatusCode(500, new { message = "Ошибка при получении статистики по сеансам: " + ex.Message });
            }
        }

        /// <summary>
        /// Статистика по фильмам
        /// </summary>
        [HttpGet("statistics/movies")]
        public async Task<IActionResult> GetMovieStatistics(
            [FromQuery] int? movieId = null,
            [FromQuery] string? startDate = null,
            [FromQuery] string? endDate = null)
        {
            try
            {
                var moviesQuery = _context.Movies.AsQueryable();
                if (movieId.HasValue)
                    moviesQuery = moviesQuery.Where(m => m.Id == movieId.Value);

                var movies = await moviesQuery.ToListAsync();

                var result = new List<object>();

                foreach (var movie in movies)
                {
                    // Получаем все сеансы для этого фильма
                    var allSchedules = await _context.Schedules
                        .Where(s => s.MovieId == movie.Id)
                        .Select(s => s.Id)
                        .ToListAsync();

                    // Фильтруем билеты по дате покупки (BookingTime), а не по дате сеанса
                    var bookingsQuery = _context.Bookings
                        .Where(b => allSchedules.Contains(b.ScheduleId))
                        .AsQueryable();

                    if (!string.IsNullOrEmpty(startDate) && DateTime.TryParse(startDate, out var start))
                        bookingsQuery = bookingsQuery.Where(b => b.BookingTime >= start.Date);

                    if (!string.IsNullOrEmpty(endDate) && DateTime.TryParse(endDate, out var end))
                        bookingsQuery = bookingsQuery.Where(b => b.BookingTime <= end.Date.AddDays(1));

                    var confirmedBookings = await bookingsQuery
                        .Where(b => b.Status == "Confirmed")
                        .ToListAsync();

                    var cancelledBookings = await bookingsQuery
                        .Where(b => b.Status == "Cancelled")
                        .ToListAsync();

                    // Для подсчета сеансов используем фильтрацию по дате сеанса (если нужно)
                    var schedulesQuery = _context.Schedules
                        .Where(s => s.MovieId == movie.Id)
                        .AsQueryable();

                    if (!string.IsNullOrEmpty(startDate) && DateTime.TryParse(startDate, out var scheduleStart))
                        schedulesQuery = schedulesQuery.Where(s => s.Date >= scheduleStart.Date);

                    if (!string.IsNullOrEmpty(endDate) && DateTime.TryParse(endDate, out var scheduleEnd))
                        schedulesQuery = schedulesQuery.Where(s => s.Date <= scheduleEnd.Date);

                    var schedules = await schedulesQuery.Select(s => s.Id).ToListAsync();

                    result.Add(new
                    {
                        MovieId = movie.Id,
                        MovieTitle = movie.Title,
                        MovieImageUrl = movie.ImageUrl,
                        TotalSchedulesCount = schedules.Count,
                        ConfirmedTicketsCount = confirmedBookings.Count,
                        CancelledTicketsCount = cancelledBookings.Count,
                        Revenue = confirmedBookings.Sum(b => b.FinalPrice),
                        CancelledRevenue = cancelledBookings.Sum(b => b.FinalPrice)
                    });
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении статистики по фильмам");
                return StatusCode(500, new { message = "Ошибка при получении статистики по фильмам: " + ex.Message });
            }
        }

        /// <summary>
        /// Отчеты по датам
        /// </summary>
        [HttpGet("statistics/reports")]
        public async Task<IActionResult> GetDateReports(
            [FromQuery] string? startDate = null,
            [FromQuery] string? endDate = null,
            [FromQuery] string period = "day") // day, week, month
        {
            try
            {
                DateTime start = DateTime.Today.AddDays(-30);
                DateTime end = DateTime.Today;

                if (!string.IsNullOrEmpty(startDate) && DateTime.TryParse(startDate, out var parsedStart))
                    start = parsedStart.Date;

                if (!string.IsNullOrEmpty(endDate) && DateTime.TryParse(endDate, out var parsedEnd))
                    end = parsedEnd.Date;

                var bookings = await _context.Bookings
                    .Where(b => b.BookingTime >= start && b.BookingTime <= end.AddDays(1))
                    .Include(b => b.Schedule)
                        .ThenInclude(s => s.Movie)
                    .ToListAsync();

                var result = new List<object>();

                if (period == "day")
                {
                    var grouped = bookings
                        .GroupBy(b => b.BookingTime.Date)
                        .OrderBy(g => g.Key)
                        .ToList();

                    foreach (var group in grouped)
                    {
                        var confirmed = group.Where(b => b.Status == "Confirmed").ToList();
                        var cancelled = group.Where(b => b.Status == "Cancelled").ToList();

                        result.Add(new
                        {
                            Date = group.Key.ToString("yyyy-MM-dd"),
                            ConfirmedTicketsCount = confirmed.Count,
                            CancelledTicketsCount = cancelled.Count,
                            Revenue = confirmed.Sum(b => b.FinalPrice),
                            CancelledRevenue = cancelled.Sum(b => b.FinalPrice)
                        });
                    }
                }
                else if (period == "week")
                {
                    var grouped = bookings
                        .GroupBy(b => GetWeekStart(b.BookingTime.Date))
                        .OrderBy(g => g.Key)
                        .ToList();

                    foreach (var group in grouped)
                    {
                        var confirmed = group.Where(b => b.Status == "Confirmed").ToList();
                        var cancelled = group.Where(b => b.Status == "Cancelled").ToList();

                        result.Add(new
                        {
                            WeekStart = group.Key.ToString("yyyy-MM-dd"),
                            WeekEnd = group.Key.AddDays(6).ToString("yyyy-MM-dd"),
                            ConfirmedTicketsCount = confirmed.Count,
                            CancelledTicketsCount = cancelled.Count,
                            Revenue = confirmed.Sum(b => b.FinalPrice),
                            CancelledRevenue = cancelled.Sum(b => b.FinalPrice)
                        });
                    }
                }
                else if (period == "month")
                {
                    var grouped = bookings
                        .GroupBy(b => new { b.BookingTime.Year, b.BookingTime.Month })
                        .OrderBy(g => g.Key.Year)
                        .ThenBy(g => g.Key.Month)
                        .ToList();

                    foreach (var group in grouped)
                    {
                        var confirmed = group.Where(b => b.Status == "Confirmed").ToList();
                        var cancelled = group.Where(b => b.Status == "Cancelled").ToList();

                        result.Add(new
                        {
                            Year = group.Key.Year,
                            Month = group.Key.Month,
                            MonthName = new DateTime(group.Key.Year, group.Key.Month, 1).ToString("MMMM yyyy"),
                            ConfirmedTicketsCount = confirmed.Count,
                            CancelledTicketsCount = cancelled.Count,
                            Revenue = confirmed.Sum(b => b.FinalPrice),
                            CancelledRevenue = cancelled.Sum(b => b.FinalPrice)
                        });
                    }
                }

                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении отчетов");
                return StatusCode(500, new { message = "Ошибка при получении отчетов: " + ex.Message });
            }
        }

        private DateTime GetWeekStart(DateTime date)
        {
            var diff = (7 + (date.DayOfWeek - DayOfWeek.Monday)) % 7;
            return date.AddDays(-1 * diff).Date;
        }

        #endregion
    }

    public class UpdateScheduleDto
    {
        public int? MovieId { get; set; }
        public int? HallId { get; set; }
        public string? Date { get; set; }
        public string? Time { get; set; }
        public bool? IsActive { get; set; }
    }
}

