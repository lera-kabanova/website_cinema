using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using CinemaProject.Data;
using CinemaProject.Models;
using CinemaProject.DTOs;
using CinemaProject.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Linq;

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
        private readonly EmailService _emailService;

        public AuthController(AppDbContext context, TokenService tokenService, IConfiguration configuration, EmailService emailService)
        {
            _context = context;
            _tokenService = tokenService;
            _configuration = configuration;
            _emailService = emailService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDto dto)
        {
            if (!ModelState.IsValid)
            {
                var errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).ToList();
                return BadRequest(new { message = string.Join("; ", errors) });
            }

            if (await _context.Users.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower()))
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

            // Отправка письма пользователю (не ломает регистрацию при ошибке)
            try
            {
                await _emailService.SendEmailAsync(
                    user.Email,
                    "Добро пожаловать в Cinema!",
                    $"<h2>Здравствуйте!</h2>"
                    + "<p>Вы успешно зарегистрировались на сайте Cinema.</p>"
                    + $"<p>Ваш email: <b>{user.Email}</b></p>"
                    + "<p>Желаем приятного просмотра и отличного настроения! Если у вас возникнут вопросы — всегда рады помочь.</p>"
                );
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Ошибка отправки email: {ex.Message}");
            }

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

        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.OldPassword) || string.IsNullOrWhiteSpace(dto.NewPassword))
            {
                return BadRequest(new { error = "missing_fields" });
            }

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == dto.Email);
            if (user == null)
            {
                return BadRequest(new { error = "user_not_found" });
            }

            var result = _hasher.VerifyHashedPassword(user, user.PasswordHash, dto.OldPassword);
            if (result == PasswordVerificationResult.Failed)
            {
                return BadRequest(new { error = "wrong_old_password" });
            }

            user.PasswordHash = _hasher.HashPassword(user, dto.NewPassword);
            await _context.SaveChangesAsync();
            return Ok(new { success = true });
        }
    }
}