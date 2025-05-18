using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CinemaProject.Data;
using CinemaProject.Models;
using Microsoft.AspNetCore.Authorization;

namespace CinemaProject.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MoviesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Movies - все фильмы
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Movie>>> GetMovies()
        {
            return await _context.Movies.ToListAsync();
        }

        // GET: api/Movies/mini - первые 5 фильмов
        [HttpGet("mini")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Movie>>> GetMiniMovies()
        {
            return await _context.Movies.Take(5).ToListAsync();
        }

        // GET: api/Movies/featured - избранные фильмы (с фоновыми изображениями)
        [HttpGet("featured")]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Movie>>> GetFeaturedMovies()
        {
            return await _context.Movies
                .Where(m => !string.IsNullOrEmpty(m.BackgroundImageUrl))
                .ToListAsync();
        }

        // GET: api/Movies/5 - детали одного фильма
        [HttpGet("{id}")]
        [AllowAnonymous]
        public async Task<ActionResult<Movie>> GetMovie(int id)
        {
            var movie = await _context.Movies.FindAsync(id);

            if (movie == null)
            {
                return NotFound();
            }

            return movie;
        }
    }
}