using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CinemaProject.Data;
using CinemaProject.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CinemaProject.Controllers
{
    [Route("api/cinema/schedules")]
    [ApiController]
    public class ScheduleController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<ScheduleController> _logger;

        public ScheduleController(AppDbContext context, ILogger<ScheduleController> logger)
        {
            _context = context;
            _logger = logger;
        }

        public class ScheduleRequest
        {
            public string StartDate { get; set; }
            public string EndDate { get; set; }
        }

        [HttpPost("generate")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GenerateSchedule([FromBody] ScheduleRequest request)
        {
            _logger.LogInformation("Попытка генерации расписания пользователем {UserId} для дат {StartDate} - {EndDate}", User.Identity?.Name, request.StartDate, request.EndDate);

            if (string.IsNullOrEmpty(request.StartDate) || string.IsNullOrEmpty(request.EndDate))
            {
                _logger.LogWarning("StartDate или EndDate не указаны");
                return BadRequest("StartDate and EndDate are required.");
            }

            if (!DateTime.TryParse(request.StartDate, out var startDate) ||
                !DateTime.TryParse(request.EndDate, out var endDate))
            {
                _logger.LogWarning("Неверный формат даты: StartDate={StartDate}, EndDate={EndDate}", request.StartDate, request.EndDate);
                return BadRequest("Invalid date format. Use yyyy-MM-dd.");
            }

            if (startDate > endDate)
            {
                _logger.LogWarning("StartDate позже EndDate: {StartDate} > {EndDate}", startDate, endDate);
                return BadRequest("StartDate cannot be later than EndDate.");
            }

            // Разрешить текущий день, но проверить прошлое
            var now = DateTime.Now;
            if (startDate.Date < now.Date)
            {
                _logger.LogWarning("StartDate в прошлом: {StartDate}", startDate);
                return BadRequest("StartDate cannot be in the past.");
            }

            // Удалить ВСЕ существующие сеансы
            var existingSchedules = await _context.Schedules.ToListAsync();
            _context.Schedules.RemoveRange(existingSchedules);
            _logger.LogInformation("Удалено {Count} старых сеансов", existingSchedules.Count);

            var schedules = new List<Schedule>();
            var movies = await _context.Movies.ToListAsync();
            var halls = await _context.Halls.Include(h => h.Zones).ToListAsync();
            var random = new Random();

            _logger.LogInformation("Доступно фильмов: {MovieCount}, залов: {HallCount}", movies.Count, halls.Count);

            if (!movies.Any() || !halls.Any())
            {
                _logger.LogWarning("Нет доступных фильмов или залов");
                return BadRequest("No movies or halls available.");
            }

            foreach (var date in EachDay(startDate, endDate))
            {
                var shuffledHalls = halls.OrderBy(h => random.Next()).ToList();

                foreach (var hall in shuffledHalls)
                {
                    // Установить начальное время: для текущего дня не ранее текущего времени + 30 минут
                    var currentTime = new TimeSpan(10, 0, 0);
                    if (date.Date == now.Date)
                    {
                        var currentTimeOfDay = now.TimeOfDay;
                        // Округлить текущее время вверх до ближайших 15 минут
                        var minutes = (int)Math.Ceiling(currentTimeOfDay.TotalMinutes / 15.0) * 15;
                        currentTime = TimeSpan.FromMinutes(minutes);
                        _logger.LogInformation("Для текущего дня {Date} установлено начальное время {CurrentTime}", date.ToString("yyyy-MM-dd"), currentTime);
                    }

                    var endTime = new TimeSpan(23, 59, 0);

                    var moviesForDay = movies
                        .OrderBy(m => random.NextDouble() * m.PopularityScore)
                        .Take(random.Next(2, Math.Min(5, movies.Count)))
                        .ToList();

                    _logger.LogInformation("Для зала {HallId} на дату {Date} выбрано {Count} фильмов", hall.Id, date.ToString("yyyy-MM-dd"), moviesForDay.Count);

                    foreach (var movie in moviesForDay)
                    {
                        var ageRating = movie.AgeRating?.ToLower() ?? "";
                        if (ageRating == "0+" || ageRating == "6+")
                        {
                            if (currentTime >= new TimeSpan(20, 0, 0))
                            {
                                _logger.LogDebug("Фильм {MovieId} ({AgeRating}) пропущен: время {CurrentTime} после 20:00", movie.Id, ageRating, currentTime);
                                continue;
                            }
                        }
                        else if (ageRating == "18+")
                        {
                            if (currentTime < new TimeSpan(16, 0, 0))
                            {
                                _logger.LogDebug("Фильм {MovieId} ({AgeRating}) пропущен: время {CurrentTime} до 16:00", movie.Id, ageRating, currentTime);
                                continue;
                            }
                        }

                        if (movie.Duration <= 0)
                        {
                            _logger.LogWarning("Неверная длительность для фильма {MovieId}: {Duration} минут", movie.Id, movie.Duration);
                            continue;
                        }

                        var duration = TimeSpan.FromMinutes(movie.Duration);
                        var totalDuration = duration + TimeSpan.FromMinutes(20); // Перерыв 20 минут

                        if (currentTime + totalDuration > endTime)
                        {
                            _logger.LogDebug("Фильм {MovieId} пропущен: время {CurrentTime} + {TotalDuration} превышает {EndTime}", movie.Id, currentTime, totalDuration, endTime);
                            break;
                        }

                        // Усиленная проверка конфликтов
                        var conflictExists = schedules.Any(s =>
                            s.HallId == hall.Id &&
                            s.Date.Date == date.Date &&
                            (
                                // Новый сеанс пересекается с существующим
                                (s.Time >= currentTime && s.Time < currentTime + totalDuration) ||
                                (currentTime >= s.Time && currentTime < s.Time + TimeSpan.FromMinutes(s.Movie.Duration) + TimeSpan.FromMinutes(20)) ||
                                // Новый сеанс полностью охватывает существующий или наоборот
                                (s.Time <= currentTime && s.Time + TimeSpan.FromMinutes(s.Movie.Duration) + TimeSpan.FromMinutes(20) > currentTime) ||
                                (currentTime <= s.Time && currentTime + totalDuration > s.Time)
                            ));

                        if (conflictExists)
                        {
                            _logger.LogDebug("Конфликт сеансов для зала {HallId} на время {CurrentTime}", hall.Id, currentTime);
                            continue;
                        }

                        var schedule = new Schedule
                        {
                            MovieId = movie.Id,
                            HallId = hall.Id,
                            Date = date,
                            Time = currentTime,
                            CreatedAt = DateTime.UtcNow,
                            Movie = movie,
                            Hall = hall
                        };

                        schedules.Add(schedule);
                        _logger.LogDebug("Добавлен сеанс: фильм {MovieId}, зал {HallId}, время {Time}, длительность {Duration}, конец {EndTime}",
                            movie.Id, hall.Id, currentTime, duration, currentTime + totalDuration);
                        // Округлить следующее время до ближайшего 15-минутного интервала
                        var nextMinutes = (int)Math.Ceiling((currentTime + totalDuration).TotalMinutes / 15.0) * 15;
                        currentTime = TimeSpan.FromMinutes(nextMinutes);
                    }
                }
            }

            if (!schedules.Any())
            {
                _logger.LogWarning("Не удалось сгенерировать расписание: нет подходящих сеансов");
                return BadRequest("Не удалось сгенерировать расписание. Проверьте доступные фильмы и залы.");
            }

            _context.Schedules.AddRange(schedules);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Сгенерировано {Count} сеансов", schedules.Count);

            return Ok(new { message = "Расписание успешно сгенерировано", count = schedules.Count });
        }

        [HttpGet]
        [AllowAnonymous]
        public async Task<IActionResult> GetSchedules()
        {
            _logger.LogInformation("Запрос на получение расписания");
            var schedules = await _context.Schedules
                .Include(s => s.Movie)
                .Include(s => s.Hall)
                .ThenInclude(h => h.Zones)
                .ToListAsync();

            var formattedSchedules = schedules.Select(s => new
            {
                s.Id,
                s.MovieId,
                s.HallId,
                Date = s.Date.ToString("yyyy-MM-dd"),
                Time = s.Time.ToString(@"hh\:mm"),
                Movie = new
                {
                    s.Movie.Id,
                    s.Movie.Title,
                    Duration = s.Movie.Duration, // В минутах
                    s.Movie.Genre,
                    s.Movie.ImageUrl,
                    s.Movie.AgeRating,
                    s.Movie.Year,
                    s.Movie.Description,
                    s.Movie.TrailerUrl,
                    s.Movie.BackgroundImageUrl
                },
                Hall = new
                {
                    s.Hall.Id,
                    s.Hall.Name,
                    s.Hall.Capacity,
                    s.Hall.Type,
                    Zones = s.Hall.Zones.Select(z => new
                    {
                        z.Id,
                        z.Name,
                        z.BasePrice
                    })
                }
            });

            return Ok(formattedSchedules);
        }

        private IEnumerable<DateTime> EachDay(DateTime from, DateTime to)
        {
            for (var day = from.Date; day <= to.Date; day = day.AddDays(1))
                yield return day;
        }
    }
}