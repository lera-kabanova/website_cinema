using CinemaProject.Data;
using CinemaProject.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IO;
using Microsoft.Data.SqlClient;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<EmailService>();
builder.Services.AddHttpClient<TmdbService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var key = Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!);
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["Jwt:Audience"],
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Игнорируем циклические ссылки при сериализации
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Cinema API", Version = "v1" });
    c.CustomSchemaIds(type => type.FullName); // Уникальные schemaId на основе полного имени типа
});

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
            
    });
});


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.Logger.LogInformation("Начало инициализации БД...");

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        
        // Проверяем подключение к SQL Server
        app.Logger.LogInformation("Проверка подключения к SQL Server...");
        if (!context.Database.CanConnect())
        {
            app.Logger.LogError("Не удается подключиться к SQL Server базе данных!");
            app.Logger.LogError("Проверьте строку подключения и убедитесь, что база CinemaDb существует");
            throw new Exception("Не удается подключиться к базе данных");
        }
        
        app.Logger.LogInformation("✓ Подключение к SQL Server установлено");
        app.Logger.LogInformation("Используется база данных: CinemaDb");
        
        // Проверяем существование таблиц через прямое SQL подключение
        try
        {
            var connection = context.Database.GetDbConnection();
            await connection.OpenAsync();
            using var command = connection.CreateCommand();
            command.CommandText = "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'BASE TABLE' ORDER BY TABLE_NAME";
            using var reader = await command.ExecuteReaderAsync();
            var tableNames = new List<string>();
            while (await reader.ReadAsync())
            {
                tableNames.Add(reader.GetString(0));
            }
            app.Logger.LogInformation($"Найдено таблиц в базе: {tableNames.Count}");
            foreach (var tableName in tableNames)
            {
                app.Logger.LogInformation($"  - {tableName}");
            }
            await connection.CloseAsync();
        }
        catch (Exception ex)
        {
            app.Logger.LogWarning($"Не удалось получить список таблиц: {ex.Message}");
        }
        
        // Пробуем выполнить простой запрос к таблице Movies
        try
        {
            var connection = context.Database.GetDbConnection();
            await connection.OpenAsync();
            using var command = connection.CreateCommand();
            command.CommandText = "SELECT COUNT(*) FROM Movies";
            var count = await command.ExecuteScalarAsync();
            app.Logger.LogInformation($"Прямой SQL запрос к Movies: {count} записей");
            await connection.CloseAsync();
        }
        catch (Exception ex)
        {
            app.Logger.LogError($"Ошибка при прямом запросе к Movies: {ex.Message}");
            if (ex.InnerException != null)
            {
                app.Logger.LogError($"Внутренняя ошибка: {ex.InnerException.Message}");
            }
        }
        
        // Инициализация начальных данных (только фильмы, если их нет)
        // Остальные данные (залы, зоны и т.д.) уже должны быть в базе
        DbInitializer.Initialize(context);
        app.Logger.LogInformation("БД успешно инициализирована");

        // Статистика базы данных с обработкой ошибок
        int movieCount = 0, userCount = 0, hallCount = 0, zoneCount = 0;
        int scheduleCount = 0, bookingCount = 0, rowCount = 0;
        int ticketTypeCount = 0, priceModifierCount = 0;
        
        try { movieCount = context.Movies.Count(); } catch (Exception ex) { app.Logger.LogError($"Movies: {ex.Message}"); }
        try { userCount = context.Users.Count(); } catch (Exception ex) { app.Logger.LogError($"Users: {ex.Message}"); }
        try { hallCount = context.Halls.Count(); } catch (Exception ex) { app.Logger.LogError($"Halls: {ex.Message}"); }
        try { zoneCount = context.Zones.Count(); } catch (Exception ex) { app.Logger.LogError($"Zones: {ex.Message}"); }
        try { scheduleCount = context.Schedules.Count(); } catch (Exception ex) { app.Logger.LogError($"Schedules: {ex.Message}"); }
        try { bookingCount = context.Bookings.Count(); } catch (Exception ex) { app.Logger.LogError($"Bookings: {ex.Message}"); }
        try { rowCount = context.Rows.Count(); } catch (Exception ex) { app.Logger.LogError($"Rows: {ex.Message}"); }
        try { ticketTypeCount = context.TicketTypes.Count(); } catch (Exception ex) { app.Logger.LogError($"TicketTypes: {ex.Message}"); }
        try { priceModifierCount = context.PriceModifiers.Count(); } catch (Exception ex) { app.Logger.LogError($"PriceModifiers: {ex.Message}"); }
        
        app.Logger.LogInformation("=== Статистика базы данных ===");
        app.Logger.LogInformation($"Фильмы: {movieCount}");
        app.Logger.LogInformation($"Пользователи: {userCount}");
        app.Logger.LogInformation($"Залы: {hallCount}");
        app.Logger.LogInformation($"Зоны: {zoneCount}");
        app.Logger.LogInformation($"Ряды: {rowCount}");
        app.Logger.LogInformation($"Расписания: {scheduleCount}");
        app.Logger.LogInformation($"Бронирования: {bookingCount}");
        app.Logger.LogInformation($"Типы билетов: {ticketTypeCount}");
        app.Logger.LogInformation($"Модификаторы цен: {priceModifierCount}");
        
        var featuredCount = context.Movies
            .Where(m => !string.IsNullOrEmpty(m.BackgroundImageUrl))
            .Count();
        app.Logger.LogInformation($"Из них {featuredCount} featured фильмов");
        app.Logger.LogInformation("===============================");
    }
    catch (Exception ex)
    {
        app.Logger.LogError(ex, "Ошибка при инициализации БД: {0}", ex.Message);
        throw;
    }
}

app.UseStaticFiles();
app.UseRouting();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
