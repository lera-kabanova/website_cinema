using CinemaProject.Models;
using System.Linq;

namespace CinemaProject.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AppDbContext context)
        {
            try
            {
                // База уже должна быть создана через миграции, просто проверяем подключение
                if (!context.Database.CanConnect())
                {
                    throw new Exception("Не удается подключиться к базе данных");
                }
                
                // Получаем маппинг жанров по именам
                var genres = context.Genres.ToList();
                var genreMap = genres.ToDictionary(g => g.Name, g => g.Id);
                
                // Проверяем, есть ли уже данные в базе
                var existingMovies = context.Movies.ToList();
                var preconfiguredMoviesData = GetPreconfiguredMovies(genreMap);
                
                var newMoviesData = preconfiguredMoviesData
                    .Where(pm => !existingMovies.Any(em => em.Title == pm.Movie.Title))
                    .ToList();
                
                if (newMoviesData.Any())
                {
                    var newMovies = newMoviesData.Select(pm => pm.Movie).ToList();
                    context.Movies.AddRange(newMovies);
                    context.SaveChanges(); // Сохраняем, чтобы получить Id для новых фильмов
                    Console.WriteLine($"Добавлено {newMovies.Count} новых фильмов");
                    
                    // Создаем связи MovieGenre для новых фильмов
                    foreach (var movieData in newMoviesData)
                    {
                        var movie = context.Movies.First(m => m.Title == movieData.Movie.Title);
                        if (!context.MovieGenres.Any(mg => mg.MovieId == movie.Id && mg.GenreId == movieData.GenreId))
                        {
                            context.MovieGenres.Add(new MovieGenre
                            {
                                MovieId = movie.Id,
                                GenreId = movieData.GenreId
                            });
                        }
                    }
                }
                
                foreach (var existingMovie in existingMovies)
                {
                    var updatedMovieData = preconfiguredMoviesData
                        .FirstOrDefault(pm => pm.Movie.Title == existingMovie.Title);
                    
                    if (updatedMovieData.Movie != null)
                    {
                        existingMovie.Duration = updatedMovieData.Movie.Duration;
                        existingMovie.ImageUrl = updatedMovieData.Movie.ImageUrl;
                        existingMovie.AgeRating = updatedMovieData.Movie.AgeRating;
                        existingMovie.Year = updatedMovieData.Movie.Year;
                        existingMovie.Description = updatedMovieData.Movie.Description;
                        existingMovie.TrailerUrl = updatedMovieData.Movie.TrailerUrl;
                        existingMovie.BackgroundImageUrl = updatedMovieData.Movie.BackgroundImageUrl;
                        existingMovie.PopularityScore = updatedMovieData.Movie.PopularityScore;
                        
                        // Обновляем связь с жанром
                        if (!context.MovieGenres.Any(mg => mg.MovieId == existingMovie.Id && mg.GenreId == updatedMovieData.GenreId))
                        {
                            // Удаляем старые связи для этого фильма
                            var oldMovieGenres = context.MovieGenres.Where(mg => mg.MovieId == existingMovie.Id).ToList();
                            context.MovieGenres.RemoveRange(oldMovieGenres);
                            
                            // Добавляем новую связь
                            context.MovieGenres.Add(new MovieGenre
                            {
                                MovieId = existingMovie.Id,
                                GenreId = updatedMovieData.GenreId
                            });
                        }
                    }
                }
                
                var changes = context.SaveChanges();
                Console.WriteLine($"Сохранено {changes} изменений");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Ошибка инициализации: {ex}");
                throw;
            }
        }

        private static (Movie Movie, int GenreId)[] GetPreconfiguredMovies(Dictionary<string, int> genreMap)
        {
            return new (Movie Movie, int GenreId)[]
            {
                (new Movie
                {
                    Title = "65",
                    Duration = 93,
                    ImageUrl = "/assets/images/65.jpg",
                    AgeRating = "13+",
                    Year = 2023,
                    Description = "Чтобы заработать на лечение дочери, семьянин Миллс с планеты Сомарис берётся за разведывательную миссию продолжительностью в два года. В пути его корабль попадает в необозначенный на картах пояс астероидов и терпит крушение, развалившись на части на неизвестной планете.",
                    TrailerUrl = "https://www.youtube.com/embed/e4-KEuXoddY?si=SdZCNR9ptBMGSGq6",
                    BackgroundImageUrl = "/assets/images/bg-65.jpeg",
                    PopularityScore = 0.7f
                }, genreMap.GetValueOrDefault("Триллер", 1)),
                (new Movie
                {
                    Title = "Обезьяна против Мехаобезьяны",
                    Duration = 61,
                    ImageUrl = "/assets/images/ape.jpg",
                    AgeRating = "13+",
                    Year = 2023,
                    Description = "Осознав разрушительную силу гигантской обезьяны, которую они поймали, военные решают создать свой собственный боевой искусственный интеллект - Мехаобезьяну.",
                    TrailerUrl = "https://www.youtube.com/embed/iiHf56xXYq4?si=BXgEuN1OdzLQB1SD",
                    BackgroundImageUrl = "/assets/images/bg-ape.jpeg",
                    PopularityScore = 0.6f
                }, genreMap.GetValueOrDefault("Боевик", 2)),
                (new Movie
                {
                    Title = "Ассасин: Битва миров",
                    Duration = 130, // 2ч 10мин
                    ImageUrl = "/assets/images/assassin.jpg",
                    AgeRating = "18+",
                    Year = 2021,
                    Description = "В неком фэнтезийном мире правит жестокий Бог, которому нужны лишь смерть и разрушения.",
                    TrailerUrl = "https://www.youtube.com/embed/4fzIm7y27wY?si=tz7hvYhraCxhdfYa",
                    BackgroundImageUrl = "/assets/images/bg-assassin.jpg",
                    PopularityScore = 0.8f
                }, genreMap.GetValueOrDefault("Фэнтези", 3)),
                (new Movie
                {
                    Title = "Мег 2: Бездна",
                    Duration = 116,
                    ImageUrl = "/assets/images/meg-2.jpg",
                    AgeRating = "12+",
                    Year = 2023,
                    Description = "Пять лет спустя борец с экологическими преступлениями Джонас Тейлор вместе сотрудниками компании-владельца глубоководной станции опускается на дно Марианской впадины.",
                    TrailerUrl = "https://www.youtube.com/embed/h0jB3_u6Z5A?si=Fkg96ag0xmHAAqdC",
                    BackgroundImageUrl = "/assets/images/bg-meg-2.jpeg",
                    PopularityScore = 0.9f
                }, genreMap.GetValueOrDefault("Боевик", 2)),
                (new Movie
                {
                    Title = "Без обид",
                    Duration = 103, // 1ч 43мин
                    ImageUrl = "/assets/images/no-hard-feelings.jpeg",
                    AgeRating = "18+",
                    Year = 2023,
                    Description = "Мэдди 32 года, она всю жизнь прожила в Монтоке — курортном местечке недалеко от Нью-Йорка.",
                    TrailerUrl = "https://www.youtube.com/embed/p4gTCGrrHpw?si=Et4s8Yf5fVv5SjfC",
                    BackgroundImageUrl = "/assets/images/bg-no-hard-feelings.jpeg",
                    PopularityScore = 0.7f
                }, genreMap.GetValueOrDefault("Романтика", 4)),
                (new Movie
                {
                    Title = "Моё прекрасное несчастье",
                    Duration = 105, // 1ч 45мин
                    ImageUrl = "/assets/images/beautiful-disaster.jpeg",
                    AgeRating = "18+",
                    Year = 2023,
                    Description = "Эбби — загадочная и недоступная первокурсница, желающая сбежать от своего прошлого.",
                    TrailerUrl = "https://www.youtube.com/embed/FLCOztw19OY?si=CyZ2LX9KyUkPPtTQ",
                    BackgroundImageUrl = "/assets/images/bg-beautiful-disaster.jpeg",
                    PopularityScore = 0.6f
                }, genreMap.GetValueOrDefault("Романтика", 4)),
                (new Movie
                {
                    Title = "Форсаж 10",
                    Duration = 141, // 2ч 21мин
                    ImageUrl = "/assets/images/fast-x.jpeg",
                    AgeRating = "13+",
                    Year = 2023,
                    Description = "10 лет назад по заданию Агентства Доминик и Брайан ограбили бразильского политика.",
                    TrailerUrl = "https://www.youtube.com/embed/SBZGp9edOVk?si=94AtB_VKl96W-KeC",
                    BackgroundImageUrl = "/assets/images/bg-fast-x.jpeg",
                    PopularityScore = 0.9f
                }, genreMap.GetValueOrDefault("Боевик", 2)),
                (new Movie
                {
                    Title = "Сердце Стоун",
                    Duration = 122, // 2ч 2мин
                    ImageUrl = "/assets/images/heart-of-stone.jpg",
                    AgeRating = "13+",
                    Year = 2023,
                    Description = "Оперативница секретного миротворческого агентства Рэйчел Стоун должна помешать хакеру украсть их самый ценный и опасный актив.",
                    TrailerUrl = "https://www.youtube.com/embed/FZe1hw99bic?si=wN2oZ1AdvNT1LbMq",
                    BackgroundImageUrl = "/assets/images/bg-heart-of-stone.jpeg",
                    PopularityScore = 0.8f
                }, genreMap.GetValueOrDefault("Боевик", 2)),
                (new Movie
                {
                    Title = "1+1",
                    Duration = 112, // 1ч 52мин
                    ImageUrl = "/assets/images/Intouchables.jpg",
                    AgeRating = "16+",
                    Year = 2011,
                    Description = "Пострадав в результате несчастного случая, богатый аристократ Филипп нанимает в помощники человека, который менее всего подходит для этой работы.",
                    TrailerUrl = "https://www.youtube.com/embed/tTwFeGArcrs?si=BDLQcMBuM-IZCuq6",
                    BackgroundImageUrl = "/assets/images/bg-1+1.jpg",
                    PopularityScore = 0.9f
                }, genreMap.GetValueOrDefault("Драма", 5)),
                (new Movie
                {
                    Title = "Тюрьма 77",
                    Duration = 168, // 2ч 48мин
                    ImageUrl = "/assets/images/jailer.jpg",
                    AgeRating = "16+",
                    Year = 2023,
                    Description = "Бывший тюремщик отправляется на поиски убийц своего сына.",
                    TrailerUrl = "https://www.youtube.com/embed/6jf4Hp1Dkeg?si=jkZN-PmcIAmT2ft_",
                    BackgroundImageUrl = "/assets/images/bg-jailer.jpeg",
                    PopularityScore = 0.7f
                }, genreMap.GetValueOrDefault("Триллер", 1)),
                (new Movie
                {
                    Title = "Питер Пэн и Венди",
                    Duration = 109, // 1ч 49мин
                    ImageUrl = "/assets/images/peter-pan-and-wendy.jpg",
                    AgeRating = "6+",
                    Year = 2023,
                    Description = "Накануне отъезда в частную закрытую школу Венди Дарлинг говорит матери, что не хочет взрослеть.",
                    TrailerUrl = "https://www.youtube.com/embed/IvzEiXTfNLs?si=vlQw2Lml9-WQDkEn",
                    BackgroundImageUrl = "/assets/images/bg-peter-pan-and-wendy.jpeg",
                    PopularityScore = 0.6f
                }, genreMap.GetValueOrDefault("Фэнтези", 3)),
                (new Movie
                {
                    Title = "Мегалодон",
                    Duration = 100, // 1ч 40мин
                    ImageUrl = "/assets/images/the-black-demon.jpg",
                    AgeRating = "18+",
                    Year = 2023,
                    Description = "Пол и его семья собираются провести отпуск в райском местечке на побережье.",
                    TrailerUrl = "https://www.youtube.com/embed/smdoOSt9Crk?si=mcZHRytJiv9bRfqA",
                    BackgroundImageUrl = "/assets/images/bg-the-black-demon.jpeg",
                    PopularityScore = 0.7f
                }, genreMap.GetValueOrDefault("Ужасы", 6)),
                (new Movie
                {
                    Title = "Переводчик",
                    Duration = 123, // 2ч 3мин
                    ImageUrl = "/assets/images/the-covenant.jpg",
                    AgeRating = "18+",
                    Year = 2023,
                    Description = "Афганистан, март 2018 года. Во время спецоперации по поиску оружия талибов отряд сержанта армии США Джона Кинли попадает в засаду.",
                    TrailerUrl = "https://www.youtube.com/embed/GXEshCygW3U?si=8uEOJjRvORQhTpce",
                    BackgroundImageUrl = "/assets/images/bg-the-covenant.jpeg",
                    PopularityScore = 0.8f
                }, genreMap.GetValueOrDefault("Боевик", 2)),
                (new Movie
                {
                    Title = "Русалочка",
                    Duration = 135, // 2ч 15мин
                    ImageUrl = "/assets/images/the-little-mermaid.jpeg",
                    AgeRating = "6+",
                    Year = 2023,
                    Description = "Русалочку Ариэль, одну из дочерей морского царя Тритона, ужасно интересует человечество.",
                    TrailerUrl = "https://www.youtube.com/embed/AkXCEb0STLM?si=EpOijPvYhdusU_NL",
                    BackgroundImageUrl = "/assets/images/bg-little-mermaid.jpg",
                    PopularityScore = 0.8f
                }, genreMap.GetValueOrDefault("Фэнтези", 3)),
                (new Movie
                {
                    Title = "Нечто. Монстр из глубин",
                    Duration = 99, // 1ч 39мин
                    ImageUrl = "/assets/images/the-tank.jpeg",
                    AgeRating = "18+",
                    Year = 2023,
                    Description = "1978 год. После смерти матери внезапно узнав, что получил в наследство дом на морском побережье.",
                    TrailerUrl = "https://www.youtube.com/embed/Qbsgw7Jq0p8?si=dMyMr8SGKMw-SaHX",
                    BackgroundImageUrl = "/assets/images/bg-the-tank.jpeg",
                    PopularityScore = 0.6f
                }, genreMap.GetValueOrDefault("Ужасы", 6)),
                (new Movie
                {
                    Title = "Трансформеры: Восхождение Звероботов",
                    Duration = 127, // 2ч 7мин
                    ImageUrl = "/assets/images/transformer.jpg",
                    AgeRating = "15+",
                    Year = 2023,
                    Description = "1994 год. Стажер музея Елена Уоллес и бывший военный эксперт по электронике Ной Диас оказываются втянуты в древний конфликт.",
                    TrailerUrl = "https://www.youtube.com/embed/eQDfGzlhHoY?si=wuTZs-lwBBA6McwO",
                    BackgroundImageUrl = "/assets/images/bg-transformer.jpg",
                    PopularityScore = 0.9f
                }, genreMap.GetValueOrDefault("Боевик", 2)),
                (new Movie
                {
                    Title = "Интерстеллар",
                    Duration = 93, // 1ч 33мин
                    ImageUrl = "/assets/images/Интерстеллар.jpg",
                    AgeRating = "16+",
                    Year = 2014,
                    Description = "Когда засуха, пыльные бури и вымирание растений приводят человечество к продовольственному кризису.",
                    TrailerUrl = "https://www.youtube.com/embed/m2vijtILDuk?si=CCB3QOFmf-GJQJLS",
                    BackgroundImageUrl = "/assets/images/bg-interstellar.jpg",
                    PopularityScore = 0.95f
                }, genreMap.GetValueOrDefault("Фэнтези", 3)),
                (new Movie
                {
                    Title = "Побег из Шоушенка",
                    Duration = 142, // 2ч 22мин
                    ImageUrl = "/assets/images/Побег-из-Шоушенка.jpg",
                    AgeRating = "16+",
                    Year = 1994,
                    Description = "Бухгалтер Энди Дюфрейн обвинён в убийстве собственной жены и её любовника.",
                    TrailerUrl = "https://www.youtube.com/embed/kgAeKpAPOYk?si=aXaZHUxKNqgO3ES2",
                    BackgroundImageUrl = "/assets/images/bg-Побег-из-Шоушенка.jpg",
                    PopularityScore = 0.95f
                }, genreMap.GetValueOrDefault("Триллер", 1)),
                (new Movie
                {
                    Title = "Форрест Гамп",
                    Duration = 142, // 2ч 22мин
                    ImageUrl = "/assets/images/Форрест-Гамп.jpg",
                    AgeRating = "12+",
                    Year = 1994,
                    Description = "Сидя на автобусной остановке, Форрест Гамп — не очень умный, но добрый и открытый парень.",
                    TrailerUrl = "https://www.youtube.com/embed/otmeAaifX04?si=_kU-YyotzJc8s4qG",
                    BackgroundImageUrl = "/assets/images/bg-Форрест-Гамп.jpg",
                    PopularityScore = 0.9f
                }, genreMap.GetValueOrDefault("Романтика", 4)),
                (new Movie
                {
                    Title = "Хатико: Самый верный друг",
                    Duration = 93, // 1ч 33мин
                    ImageUrl = "/assets/images/Хатико.jpg",
                    AgeRating = "0+",
                    Year = 2009,
                    Description = "Однажды, возвращаясь с работы, профессор колледжа нашел на вокзале симпатичного щенка породы акита-ину.",
                    TrailerUrl = "https://www.youtube.com/embed/uSBUbKaffzU?si=gKMTUWaJ42zqY3Fr",
                    BackgroundImageUrl = "/assets/images/bg-Хатико.jpg",
                    PopularityScore = 0.85f
                }, genreMap.GetValueOrDefault("Драма", 5))
            };
        }
    }
}