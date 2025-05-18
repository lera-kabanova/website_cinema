using System.ComponentModel.DataAnnotations;

namespace CinemaProject.DTOs
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "Email обязателен")]
        [EmailAddress(ErrorMessage = "Некорректный формат email")]
        [StringLength(100, ErrorMessage = "Email не может быть длиннее 100 символов")]
        public string Email { get; set; } = null!;

        [Required(ErrorMessage = "Пароль обязателен")]
        [MinLength(6, ErrorMessage = "Пароль должен быть не менее 6 символов")]
        [RegularExpression(@"^(?=.*\D).+$",
        ErrorMessage = "Пароль должен содержать хотя бы один нецифровой символ")]

        public string Password { get; set; } = null!;
    }
}