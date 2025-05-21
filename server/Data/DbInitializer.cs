using CinemaProject.Models;

namespace CinemaProject.Data
{
    public static class DbInitializer
    {
        public static void Initialize(AppDbContext context)
        {
            try
            {
                context.Database.EnsureCreated();
                
                var existingMovies = context.Movies.ToList();
                var preconfiguredMovies = GetPreconfiguredMovies();
                
                var newMovies = preconfiguredMovies
                    .Where(pm => !existingMovies.Any(em => em.Title == pm.Title))
                    .ToList();
                
                if (newMovies.Any())
                {
                    context.Movies.AddRange(newMovies);
                    Console.WriteLine($"Добавлено {newMovies.Count} новых фильмов");
                }
                
                foreach (var existingMovie in existingMovies)
                {
                    var updatedMovie = preconfiguredMovies
                        .FirstOrDefault(pm => pm.Title == existingMovie.Title);
                    
                    if (updatedMovie != null)
                    {
                        existingMovie.Duration = updatedMovie.Duration;
                        existingMovie.Genre = updatedMovie.Genre;
                        existingMovie.ImageUrl = updatedMovie.ImageUrl;
                        existingMovie.AgeRating = updatedMovie.AgeRating;
                        existingMovie.Year = updatedMovie.Year;
                        existingMovie.Description = updatedMovie.Description;
                        existingMovie.TrailerUrl = updatedMovie.TrailerUrl;
                        existingMovie.BackgroundImageUrl = updatedMovie.BackgroundImageUrl;
                        existingMovie.PopularityScore = updatedMovie.PopularityScore;
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

        private static Movie[] GetPreconfiguredMovies()
        {
            return new Movie[]
            {
                new Movie
                {
                    Title = "65",
                    Duration = 93, // 1ч 33мин
                    Genre = "Триллер",
                    ImageUrl = "/assets/images/65.jpg",
                    AgeRating = "13+",
                    Year = 2023,
                    Description = "Чтобы заработать на лечение дочери, семьянин Миллс с планеты Сомарис берётся за разведывательную миссию продолжительностью в два года. В пути его корабль попадает в необозначенный на картах пояс астероидов и терпит крушение, развалившись на части на неизвестной планете.",
                    TrailerUrl = "https://www.youtube.com/embed/e4-KEuXoddY?si=SdZCNR9ptBMGSGq6",
                    BackgroundImageUrl = "/assets/images/bg-65.jpeg",
                    PopularityScore = 0.7f
                },
                new Movie
                {
                    Title = "Обезьяна против Мехаобезьяны",
                    Duration = 61, // 1ч 1мин
                    Genre = "Боевик",
                    ImageUrl = "/assets/images/ape.jpg",
                    AgeRating = "13+",
                    Year = 2023,
                    Description = "Осознав разрушительную силу гигантской обезьяны, которую они поймали, военные решают создать свой собственный боевой искусственный интеллект - Мехаобезьяну.",
                    TrailerUrl = "https://www.youtube.com/embed/iiHf56xXYq4?si=BXgEuN1OdzLQB1SD",
                    BackgroundImageUrl = "/assets/images/bg-ape.jpeg",
                    PopularityScore = 0.6f
                },
                new Movie
                {
                    Title = "Ассасин: Битва миров",
                    Duration = 130, // 2ч 10мин
                    Genre = "Фэнтези",
                    ImageUrl = "/assets/images/assassin.jpg",
                    AgeRating = "18+",
                    Year = 2021,
                    Description = "В неком фэнтезийном мире правит жестокий Бог, которому нужны лишь смерть и разрушения.",
                    TrailerUrl = "https://www.youtube.com/embed/4fzIm7y27wY?si=tz7hvYhraCxhdfYa",
                    BackgroundImageUrl = "/assets/images/bg-assassin.jpg",
                    PopularityScore = 0.8f
                },
                new Movie
                {
                    Title = "Мег 2: Бездна",
                    Duration = 116, // 1ч 56мин
                    Genre = "Боевик",
                    ImageUrl = "/assets/images/meg-2.jpg",
                    AgeRating = "12+",
                    Year = 2023,
                    Description = "Пять лет спустя борец с экологическими преступлениями Джонас Тейлор вместе сотрудниками компании-владельца глубоководной станции опускается на дно Марианской впадины.",
                    TrailerUrl = "https://www.youtube.com/embed/h0jB3_u6Z5A?si=Fkg96ag0xmHAAqdC",
                    BackgroundImageUrl = "/assets/images/bg-meg-2.jpeg",
                    PopularityScore = 0.9f
                },
                new Movie
                {
                    Title = "Без обид",
                    Duration = 103, // 1ч 43мин
                    Genre = "Романтика",
                    ImageUrl = "/assets/images/no-hard-feelings.jpeg",
                    AgeRating = "18+",
                    Year = 2023,
                    Description = "Мэдди 32 года, она всю жизнь прожила в Монтоке — курортном местечке недалеко от Нью-Йорка.",
                    TrailerUrl = "https://www.youtube.com/embed/p4gTCGrrHpw?si=Et4s8Yf5fVv5SjfC",
                    BackgroundImageUrl = "/assets/images/bg-no-hard-feelings.jpeg",
                    PopularityScore = 0.7f
                },
                new Movie
                {
                    Title = "Моё прекрасное несчастье",
                    Duration = 105, // 1ч 45мин
                    Genre = "Романтика",
                    ImageUrl = "/assets/images/beautiful-disaster.jpeg",
                    AgeRating = "18+",
                    Year = 2023,
                    Description = "Эбби — загадочная и недоступная первокурсница, желающая сбежать от своего прошлого.",
                    TrailerUrl = "https://www.youtube.com/embed/FLCOztw19OY?si=CyZ2LX9KyUkPPtTQ",
                    BackgroundImageUrl = "/assets/images/bg-beautiful-disaster.jpeg",
                    PopularityScore = 0.6f
                },
                new Movie
                {
                    Title = "Форсаж 10",
                    Duration = 141, // 2ч 21мин
                    Genre = "Боевик",
                    ImageUrl = "/assets/images/fast-x.jpeg",
                    AgeRating = "13+",
                    Year = 2023,
                    Description = "10 лет назад по заданию Агентства Доминик и Брайан ограбили бразильского политика.",
                    TrailerUrl = "https://www.youtube.com/embed/SBZGp9edOVk?si=94AtB_VKl96W-KeC",
                    BackgroundImageUrl = "/assets/images/bg-fast-x.jpeg",
                    PopularityScore = 0.9f
                },
                new Movie
                {
                    Title = "Сердце Стоун",
                    Duration = 122, // 2ч 2мин
                    Genre = "Боевик",
                    ImageUrl = "/assets/images/heart-of-stone.jpg",
                    AgeRating = "13+",
                    Year = 2023,
                    Description = "Оперативница секретного миротворческого агентства Рэйчел Стоун должна помешать хакеру украсть их самый ценный и опасный актив.",
                    TrailerUrl = "https://www.youtube.com/embed/FZe1hw99bic?si=wN2oZ1AdvNT1LbMq",
                    BackgroundImageUrl = "/assets/images/bg-heart-of-stone.jpeg",
                    PopularityScore = 0.8f
                },
                new Movie
                {
                    Title = "1+1",
                    Duration = 112, // 1ч 52мин
                    Genre = "Драма",
                    ImageUrl = "/assets/images/Intouchables.jpg",
                    AgeRating = "16+",
                    Year = 2011,
                    Description = "Пострадав в результате несчастного случая, богатый аристократ Филипп нанимает в помощники человека, который менее всего подходит для этой работы.",
                    TrailerUrl = "https://www.youtube.com/embed/tTwFeGArcrs?si=BDLQcMBuM-IZCuq6",
                    BackgroundImageUrl = "/assets/images/bg-1+1.jpg",
                    PopularityScore = 0.9f
                },
                new Movie
                {
                    Title = "Тюрьма 77",
                    Duration = 168, // 2ч 48мин
                    Genre = "Триллер",
                    ImageUrl = "/assets/images/jailer.jpg",
                    AgeRating = "16+",
                    Year = 2023,
                    Description = "Бывший тюремщик отправляется на поиски убийц своего сына.",
                    TrailerUrl = "https://www.youtube.com/embed/6jf4Hp1Dkeg?si=jkZN-PmcIAmT2ft_",
                    BackgroundImageUrl = "/assets/images/bg-jailer.jpeg",
                    PopularityScore = 0.7f
                },
                new Movie
                {
                    Title = "Питер Пэн и Венди",
                    Duration = 109, // 1ч 49мин
                    Genre = "Фэнтези",
                    ImageUrl = "/assets/images/peter-pan-and-wendy.jpg",
                    AgeRating = "6+",
                    Year = 2023,
                    Description = "Накануне отъезда в частную закрытую школу Венди Дарлинг говорит матери, что не хочет взрослеть.",
                    TrailerUrl = "https://www.youtube.com/embed/IvzEiXTfNLs?si=vlQw2Lml9-WQDkEn",
                    BackgroundImageUrl = "/assets/images/bg-peter-pan-and-wendy.jpeg",
                    PopularityScore = 0.6f
                },
                new Movie
                {
                    Title = "Мегалодон",
                    Duration = 100, // 1ч 40мин
                    Genre = "Ужасы",
                    ImageUrl = "/assets/images/the-black-demon.jpg",
                    AgeRating = "18+",
                    Year = 2023,
                    Description = "Пол и его семья собираются провести отпуск в райском местечке на побережье.",
                    TrailerUrl = "https://www.youtube.com/embed/smdoOSt9Crk?si=mcZHRytJiv9bRfqA",
                    BackgroundImageUrl = "/assets/images/bg-the-black-demon.jpeg",
                    PopularityScore = 0.7f
                },
                new Movie
                {
                    Title = "Переводчик",
                    Duration = 123, // 2ч 3мин
                    Genre = "Боевик",
                    ImageUrl = "/assets/images/the-covenant.jpg",
                    AgeRating = "18+",
                    Year = 2023,
                    Description = "Афганистан, март 2018 года. Во время спецоперации по поиску оружия талибов отряд сержанта армии США Джона Кинли попадает в засаду.",
                    TrailerUrl = "https://www.youtube.com/embed/GXEshCygW3U?si=8uEOJjRvORQhTpce",
                    BackgroundImageUrl = "/assets/images/bg-the-covenant.jpeg",
                    PopularityScore = 0.8f
                },
                new Movie
                {
                    Title = "Русалочка",
                    Duration = 135, // 2ч 15мин
                    Genre = "Фэнтези",
                    ImageUrl = "/assets/images/the-little-mermaid.jpeg",
                    AgeRating = "6+",
                    Year = 2023,
                    Description = "Русалочку Ариэль, одну из дочерей морского царя Тритона, ужасно интересует человечество.",
                    TrailerUrl = "https://www.youtube.com/embed/AkXCEb0STLM?si=EpOijPvYhdusU_NL",
                    BackgroundImageUrl = "/assets/images/bg-little-mermaid.jpg",
                    PopularityScore = 0.8f
                },
                new Movie
                {
                    Title = "Нечто. Монстр из глубин",
                    Duration = 99, // 1ч 39мин
                    Genre = "Ужасы",
                    ImageUrl = "/assets/images/the-tank.jpeg",
                    AgeRating = "18+",
                    Year = 2023,
                    Description = "1978 год. После смерти матери внезапно узнав, что получил в наследство дом на морском побережье.",
                    TrailerUrl = "https://www.youtube.com/embed/Qbsgw7Jq0p8?si=dMyMr8SGKMw-SaHX",
                    BackgroundImageUrl = "/assets/images/bg-the-tank.jpeg",
                    PopularityScore = 0.6f
                },
                new Movie
                {
                    Title = "Трансформеры: Восхождение Звероботов",
                    Duration = 127, // 2ч 7мин
                    Genre = "Боевик",
                    ImageUrl = "/assets/images/transformer.jpg",
                    AgeRating = "15+",
                    Year = 2023,
                    Description = "1994 год. Стажер музея Елена Уоллес и бывший военный эксперт по электронике Ной Диас оказываются втянуты в древний конфликт.",
                    TrailerUrl = "https://www.youtube.com/embed/eQDfGzlhHoY?si=wuTZs-lwBBA6McwO",
                    BackgroundImageUrl = "/assets/images/bg-transformer.jpg",
                    PopularityScore = 0.9f
                },
                new Movie
                {
                    Title = "Интерстеллар",
                    Duration = 93, // 1ч 33мин
                    Genre = "Фэнтези",
                    ImageUrl = "/assets/images/Интерстеллар.jpg",
                    AgeRating = "16+",
                    Year = 2014,
                    Description = "Когда засуха, пыльные бури и вымирание растений приводят человечество к продовольственному кризису.",
                    TrailerUrl = "https://www.youtube.com/embed/m2vijtILDuk?si=CCB3QOFmf-GJQJLS",
                    BackgroundImageUrl = "/assets/images/bg-interstellar.jpg",
                    PopularityScore = 0.95f
                },
                new Movie
                {
                    Title = "Побег из Шоушенка",
                    Duration = 142, // 2ч 22мин
                    Genre = "Триллер",
                    ImageUrl = "/assets/images/Побег-из-Шоушенка.jpg",
                    AgeRating = "16+",
                    Year = 1994,
                    Description = "Бухгалтер Энди Дюфрейн обвинён в убийстве собственной жены и её любовника.",
                    TrailerUrl = "https://www.youtube.com/embed/kgAeKpAPOYk?si=aXaZHUxKNqgO3ES2",
                    BackgroundImageUrl = "/assets/images/bg-Побег-из-Шоушенка.jpg",
                    PopularityScore = 0.95f
                },
                new Movie
                {
                    Title = "Форрест Гамп",
                    Duration = 142, // 2ч 22мин
                    Genre = "Романтика",
                    ImageUrl = "/assets/images/Форрест-Гамп.jpg",
                    AgeRating = "12+",
                    Year = 1994,
                    Description = "Сидя на автобусной остановке, Форрест Гамп — не очень умный, но добрый и открытый парень.",
                    TrailerUrl = "https://www.youtube.com/embed/otmeAaifX04?si=_kU-YyotzJc8s4qG",
                    BackgroundImageUrl = "/assets/images/bg-Форрест-Гамп.jpg",
                    PopularityScore = 0.9f
                },
                new Movie
                {
                    Title = "Хатико: Самый верный друг",
                    Duration = 93, // 1ч 33мин
                    Genre = "Драма",
                    ImageUrl = "/assets/images/Хатико.jpg",
                    AgeRating = "0+",
                    Year = 2009,
                    Description = "Однажды, возвращаясь с работы, профессор колледжа нашел на вокзале симпатичного щенка породы акита-ину.",
                    TrailerUrl = "https://www.youtube.com/embed/uSBUbKaffzU?si=gKMTUWaJ42zqY3Fr",
                    BackgroundImageUrl = "/assets/images/bg-Хатико.jpg",
                    PopularityScore = 0.85f
                }
            };
        }
    }
}