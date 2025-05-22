using Microsoft.AspNetCore.Mvc;
using CinemaProject.Services;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;

namespace CinemaProject.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeedbackController : ControllerBase
    {
        private readonly EmailService _emailService;
        private readonly IConfiguration _config;
        public FeedbackController(EmailService emailService, IConfiguration config)
        {
            _emailService = emailService;
            _config = config;
        }

        public class FeedbackDto
        {
            public string Name { get; set; }
            public string Login { get; set; }
            public string Message { get; set; }
        }

        [HttpPost]
        public async Task<IActionResult> SendFeedback([FromBody] FeedbackDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name) || string.IsNullOrWhiteSpace(dto.Login) || string.IsNullOrWhiteSpace(dto.Message))
                return BadRequest(new { error = "Все поля обязательны" });

            var adminEmail = _config["Smtp:User"];
            var subject = $"Обратная связь от {dto.Name} (логин: {dto.Login})";
            var body = $"<b>Имя:</b> {dto.Name}<br/><b>Логин:</b> {dto.Login}<br/><b>Сообщение:</b><br/>{dto.Message}";
            await _emailService.SendEmailAsync(adminEmail, subject, body);
            return Ok(new { success = true });
        }
    }
} 