using System.Text.Json.Serialization;

namespace CinemaProject.DTOs
{
    public class TmdbNowPlayingResponse
    {
        [JsonPropertyName("results")]
        public List<TmdbMovieSummary> Results { get; set; } = new();
    }

    public class TmdbMovieSummary
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("title")]
        public string? Title { get; set; }
    }

    public class TmdbMovieDetails
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("title")]
        public string? Title { get; set; }

        [JsonPropertyName("overview")]
        public string? Overview { get; set; }

        [JsonPropertyName("poster_path")]
        public string? PosterPath { get; set; }

        [JsonPropertyName("backdrop_path")]
        public string? BackdropPath { get; set; }

        [JsonPropertyName("runtime")]
        public int? Runtime { get; set; }

        [JsonPropertyName("release_date")]
        public string? ReleaseDate { get; set; }

        [JsonPropertyName("popularity")]
        public double? Popularity { get; set; }

        [JsonPropertyName("genres")]
        public List<TmdbGenre> Genres { get; set; } = new();

        [JsonPropertyName("videos")]
        public TmdbVideos Videos { get; set; } = new();
    }

    public class TmdbGenre
    {
        [JsonPropertyName("id")]
        public int Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;
    }

    public class TmdbVideos
    {
        [JsonPropertyName("results")]
        public List<TmdbVideo> Results { get; set; } = new();
    }

    public class TmdbVideo
    {
        [JsonPropertyName("key")]
        public string? Key { get; set; }

        [JsonPropertyName("site")]
        public string? Site { get; set; }

        [JsonPropertyName("type")]
        public string? Type { get; set; }

        [JsonPropertyName("official")]
        public bool? Official { get; set; }
    }
}

