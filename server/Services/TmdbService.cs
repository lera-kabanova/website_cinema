using System.Text.Json;
using CinemaProject.DTOs;
using CinemaProject.Models;

namespace CinemaProject.Services
{
    public class TmdbService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<TmdbService> _logger;
        private readonly string _apiKey;
        private readonly string _language;
        private readonly string _region;
        private readonly string _posterBaseUrl;
        private readonly string _backdropBaseUrl;
        private readonly JsonSerializerOptions _serializerOptions = new()
        {
            PropertyNameCaseInsensitive = true
        };

        public TmdbService(HttpClient httpClient, IConfiguration configuration, ILogger<TmdbService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;

            var tmdbSection = configuration.GetSection("Tmdb");
            _apiKey = tmdbSection["ApiKey"] ?? string.Empty;
            _language = tmdbSection["Language"] ?? "ru-RU";
            _region = tmdbSection["Region"] ?? "RU";
            _posterBaseUrl = tmdbSection["ImageBaseUrl"] ?? "https://image.tmdb.org/t/p/w500";
            _backdropBaseUrl = tmdbSection["BackdropBaseUrl"] ?? "https://image.tmdb.org/t/p/w1280";

            var baseUrl = tmdbSection["BaseUrl"] ?? "https://api.themoviedb.org/3";
            _httpClient.BaseAddress = new Uri(baseUrl);
        }

        public async Task<List<Movie>> GetNowPlayingAsync(int take = 12)
        {
            if (string.IsNullOrWhiteSpace(_apiKey))
            {
                _logger.LogWarning("TMDb ApiKey is missing. Add Tmdb:ApiKey to configuration.");
                return new List<Movie>();
            }

            var limitedTake = Math.Clamp(take, 1, 20);

            try
            {
                var nowPlayingResponse = await _httpClient.GetAsync($"movie/now_playing?api_key={_apiKey}&language={_language}&region={_region}&page=1");
                if (!nowPlayingResponse.IsSuccessStatusCode)
                {
                    _logger.LogWarning("TMDb now_playing request failed with status {Status}", nowPlayingResponse.StatusCode);
                    return new List<Movie>();
                }

                await using var contentStream = await nowPlayingResponse.Content.ReadAsStreamAsync();
                var nowPlaying = await JsonSerializer.DeserializeAsync<TmdbNowPlayingResponse>(contentStream, _serializerOptions);
                if (nowPlaying?.Results == null || nowPlaying.Results.Count == 0)
                {
                    _logger.LogInformation("TMDb now_playing returned no results");
                    return new List<Movie>();
                }

                var ids = nowPlaying.Results.Take(limitedTake).Select(r => r.Id).ToList();
                var detailTasks = ids.Select(GetMovieDetailsAsync).ToArray();
                var details = await Task.WhenAll(detailTasks);

                return details
                    .Where(m => m != null)
                    .Select(m => m!)
                    .ToList();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to load now_playing from TMDb");
                return new List<Movie>();
            }
        }

        public async Task<Movie?> GetMovieDetailsAsync(int tmdbId)
        {
            if (string.IsNullOrWhiteSpace(_apiKey))
            {
                return null;
            }

            try
            {
                var detailResponse = await _httpClient.GetAsync($"movie/{tmdbId}?api_key={_apiKey}&language={_language}&append_to_response=videos");
                if (!detailResponse.IsSuccessStatusCode)
                {
                    _logger.LogWarning("TMDb details request failed for {Id} with status {Status}", tmdbId, detailResponse.StatusCode);
                    return null;
                }

                await using var stream = await detailResponse.Content.ReadAsStreamAsync();
                var details = await JsonSerializer.DeserializeAsync<TmdbMovieDetails>(stream, _serializerOptions);
                if (details == null)
                {
                    return null;
                }

                return MapToMovie(details);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to load TMDb details for {Id}", tmdbId);
                return null;
            }
        }

        private Movie MapToMovie(TmdbMovieDetails details)
        {
            var trailerKey = details.Videos?.Results?
                .FirstOrDefault(v =>
                    string.Equals(v.Site, "YouTube", StringComparison.OrdinalIgnoreCase) &&
                    (string.Equals(v.Type, "Trailer", StringComparison.OrdinalIgnoreCase) ||
                     (v.Type?.Contains("Trailer", StringComparison.OrdinalIgnoreCase) ?? false)) &&
                    (v.Official ?? false))?.Key
                ?? details.Videos?.Results?
                    .FirstOrDefault(v =>
                        string.Equals(v.Site, "YouTube", StringComparison.OrdinalIgnoreCase) &&
                        (v.Type?.Contains("Trailer", StringComparison.OrdinalIgnoreCase) ?? false))?.Key;

            // Создаем Movie с пустым списком MovieGenres
            // Жанры будут доступны через вычисляемое свойство Genre, которое обработает пустой список
            var movie = new Movie
            {
                Id = details.Id,
                Title = details.Title ?? "Без названия",
                Description = details.Overview,
                Duration = details.Runtime ?? 0,
                ImageUrl = details.PosterPath != null ? $"{_posterBaseUrl}{details.PosterPath}" : string.Empty,
                BackgroundImageUrl = details.BackdropPath != null ? $"{_backdropBaseUrl}{details.BackdropPath}" : null,
                Year = TryParseYear(details.ReleaseDate),
                TrailerUrl = trailerKey != null ? $"https://www.youtube.com/watch?v={trailerKey}" : null,
                PopularityScore = (float)(details.Popularity ?? 0.5),
                AgeRating = null, // Возрастной рейтинг в TMDb требует дополнительного запроса release_dates
                MovieGenres = new List<MovieGenre>() // Пустой список - жанры не сохраняются в БД для TMDb фильмов
            };
            
            return movie;
        }

        private static int? TryParseYear(string? releaseDate)
        {
            if (string.IsNullOrWhiteSpace(releaseDate))
            {
                return null;
            }

            if (DateTime.TryParse(releaseDate, out var date))
            {
                return date.Year;
            }

            return null;
        }
    }
}

