using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using CinemaProject.Data;
using CinemaProject.Models;
using CinemaProject.DTOs;
using CinemaProject.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace CinemaProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly TokenService _tokenService;
        private readonly PasswordHasher<User> _hasher = new();
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, TokenService tokenService, IConfiguration configuration)
        {
            _context = context;
            _tokenService = tokenService;
            _configuration = configuration;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
            {
                return BadRequest(new { message = "Email уже используется" });
            }

            if (dto.Role == "Admin")
            {
                var adminSecretKey = _configuration["AdminSecretKey"];
                if (string.IsNullOrEmpty(dto.SecretKey) || dto.SecretKey != adminSecretKey)
                {
                    return BadRequest(new { message = "Неверный секретный ключ для регистрации администратора" });
                }
            }

            var user = new User
            {
                Email = dto.Email,
                Role = dto.Role == "Admin" ? "Admin" : "User"
            };
            user.PasswordHash = _hasher.HashPassword(user, dto.Password);

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { 
                message = "Регистрация успешна",
                email = user.Email,
                role = user.Role
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null)
            {
                return Unauthorized(new { message = "Неверный логин или пароль" });
            }

            var result = _hasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
            if (result == PasswordVerificationResult.Failed)
            {
                return Unauthorized(new { message = "Неверный логин или пароль" });
            }

            var token = _tokenService.CreateToken(user);
            return Ok(new { 
                token,
                email = user.Email,
                role = user.Role
            });
        }

        [Authorize]
        [HttpGet("me")]
        public IActionResult Me()
        {
            var email = User.FindFirstValue(ClaimTypes.Email);
            var role = User.FindFirstValue(ClaimTypes.Role);
            return Ok(new { email, role });
        }
    }
}