using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CinemaProject.Data;
using CinemaProject.Models;
using CinemaProject.Services;
using Microsoft.AspNetCore.Authorization;
using System.Linq;

namespace CinemaProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly TmdbService _tmdbService;
        private readonly ILogger<MoviesController> _logger;

        public MoviesController(AppDbContext context, TmdbService tmdbService, ILogger<MoviesController> logger)
        {
            _context = context;
            _tmdbService = tmdbService;
            _logger = logger;
        }

        // GET: api/Movies - все фильмы
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Movie>>> GetMovies()
        {
            return await _context.Movies
                .Include(m => m.MovieGenres)
                    .ThenInclude(mg => mg.Genre)
                .ToListAsync();
        }

        // GET: api/Movies/now-playing - актуальные фильмы из TMDb
        [HttpGet("now-playing")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<object>>> GetNowPlaying([FromQuery] int take = 12)
        {
            try
            {
                var movies = await _tmdbService.GetNowPlayingAsync(take);

                // Если не удалось получить из TMDb (нет ключа или ошибка) — отдадим локальные фильмы
                if (movies == null || movies.Count == 0)
                {
                    var fallback = await _context.Movies
                        .Include(m => m.MovieGenres)
                            .ThenInclude(mg => mg.Genre)
                        .Take(Math.Clamp(take, 1, 20))
                        .ToListAsync();
                    
                    // Сериализуем в безопасный формат
                    var result = fallback.Select(m => new
                    {
                        m.Id,
                        m.Title,
                        m.Duration,
                        Genre = m.Genre ?? string.Empty,
                        m.ImageUrl,
                        m.AgeRating,
                        m.Year,
                        m.Description,
                        m.TrailerUrl,
                        m.BackgroundImageUrl,
                        m.PopularityScore
                    }).ToList();
                    
                    return Ok(result);
                }

                // Сериализуем TMDb фильмы в безопасный формат
                var tmdbResult = movies.Select(m => new
                {
                    m.Id,
                    m.Title,
                    m.Duration,
                    Genre = m.Genre ?? string.Empty,
                    m.ImageUrl,
                    m.AgeRating,
                    m.Year,
                    m.Description,
                    m.TrailerUrl,
                    m.BackgroundImageUrl,
                    m.PopularityScore
                }).ToList();

                return Ok(tmdbResult);
            }
            catch (Exception ex)
            {
                // Логируем ошибку и возвращаем локальные фильмы как fallback
                _logger.LogError(ex, "Ошибка при получении фильмов из TMDb");
                
                try
                {
                    var fallback = await _context.Movies
                        .Include(m => m.MovieGenres)
                            .ThenInclude(mg => mg.Genre)
                        .Take(Math.Clamp(take, 1, 20))
                        .ToListAsync();
                    
                    var result = fallback.Select(m => new
                    {
                        m.Id,
                        m.Title,
                        m.Duration,
                        Genre = m.Genre ?? string.Empty,
                        m.ImageUrl,
                        m.AgeRating,
                        m.Year,
                        m.Description,
                        m.TrailerUrl,
                        m.BackgroundImageUrl,
                        m.PopularityScore
                    }).ToList();
                    
                    return Ok(result);
                }
                catch (Exception fallbackEx)
                {
                    _logger.LogError(fallbackEx, "Ошибка при получении локальных фильмов");
                    return StatusCode(500, "Ошибка при загрузке фильмов");
                }
            }
        }

        // GET: api/Movies/mini - первые 5 фильмов
        [HttpGet("mini")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Movie>>> GetMiniMovies()
        {
            return await _context.Movies
                .Include(m => m.MovieGenres)
                    .ThenInclude(mg => mg.Genre)
                .Take(5)
                .ToListAsync();
        }

        // GET: api/Movies/featured - избранные фильмы (с фоновыми изображениями)
        [HttpGet("featured")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Movie>>> GetFeaturedMovies()
        {
            return await _context.Movies
                .Include(m => m.MovieGenres)
                    .ThenInclude(mg => mg.Genre)
                .Where(m => !string.IsNullOrEmpty(m.BackgroundImageUrl))
                .ToListAsync();
        }

        // GET: api/Movies/tmdb/123 - детали фильма из TMDb по внешнему id
        [HttpGet("tmdb/{tmdbId}")]
        [AllowAnonymous]
        public async Task<ActionResult<Movie>> GetTmdbMovie(int tmdbId)
        {
            var movie = await _tmdbService.GetMovieDetailsAsync(tmdbId);
            if (movie == null)
            {
                return NotFound();
            }

            return Ok(movie);
        }

        // GET: api/Movies/5 - детали одного фильма
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Movie>> GetMovie(int id)
        {
            var movie = await _context.Movies
                .Include(m => m.MovieGenres)
                    .ThenInclude(mg => mg.Genre)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (movie == null)
            {
                return NotFound();
            }

            return movie;
        }

        
[HttpGet("byGenre")]
[AllowAnonymous]
public async Task<ActionResult<IEnumerable<Movie>>> GetMoviesByGenre(string genre)
{
    if (string.IsNullOrEmpty(genre) || genre.ToUpper() == "ВСЕ")
    {
        return await _context.Movies
            .Include(m => m.MovieGenres)
                .ThenInclude(mg => mg.Genre)
            .ToListAsync();
    }

    // Находим жанр по имени
    var genreEntity = await _context.Genres
        .FirstOrDefaultAsync(g => g.Name.Equals(genre, StringComparison.OrdinalIgnoreCase));

    if (genreEntity == null)
    {
        return NotFound($"Жанр '{genre}' не найден");
    }

    // Получаем фильмы с этим жанром через промежуточную таблицу
    var movies = await _context.Movies
        .Include(m => m.MovieGenres)
            .ThenInclude(mg => mg.Genre)
        .Where(m => m.MovieGenres.Any(mg => mg.GenreId == genreEntity.Id))
        .ToListAsync();

    return Ok(movies);
}


        
    }
}