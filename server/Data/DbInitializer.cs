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
                 new Movie { 
                        Title = "65", 
                        Duration = "1ч 33мин", 
                        Genre = "Триллер", 
                        ImageUrl = "/assets/images/65.jpg",
                        AgeRating = "13+", 
                        Year = 2023,
                        Description = "Чтобы заработать на лечение дочери, семьянин Миллс с планеты Сомарис берётся за разведывательную миссию продолжительностью в два года. В пути его корабль попадает в необозначенный на картах пояс астероидов и терпит крушение, развалившись на части на неизвестной планете. ",
                        TrailerUrl = "https://www.youtube.com/embed/e4-KEuXoddY?si=SdZCNR9ptBMGSGq6",
                        BackgroundImageUrl = "/assets/images/bg-65.jpeg"
                    },

                    new Movie { 
                        Title = "Обезьяна против Мехаобезьяны", 
                        Duration = "1ч 1мин", 
                        Genre = "Боевик", 
                        ImageUrl = "/assets/images/ape.jpg",
                        AgeRating = "13+", 
                        Year = 2023,
                        Description = "Осознав разрушительную силу гигантской обезьяны, которую они поймали, военные решают создать свой собственный боевой искусственный интеллект - Мехаобезьяну. Однако, при первом испытании что-то идет не так, и они понимают, что создание такого оружия может привести к катастрофическим последствиям. В итоге, они решают освободить обезьяну, чтобы она остановила колоссального робота, который угрожал Чикаго",
                        TrailerUrl = "https://www.youtube.com/embed/iiHf56xXYq4?si=BXgEuN1OdzLQB1SD",
                        BackgroundImageUrl = "/assets/images/bg-Ape-vs-Mecha-Ape.jpg"
                    },

                    new Movie { 
                        Title = "Ассасин: Битва миров", 
                        Duration = "2ч 10мин", 
                        Genre = "Фэнтези", 
                        ImageUrl = "/assets/images/assassin.jpg",
                        AgeRating = "18+", 
                        Year = 2021,
                        Description = "В неком фэнтезийном мире правит жестокий Бог, которому нужны лишь смерть и разрушения. Потеряв сестру, но обретя волшебный доспех, молодой воин Кунвэнь отправляется в путешествие, чтобы разыскать и убить Бога. В это время в нашем мире мужчина Гуань Нин уже шесть лет находится на грани отчаяния, разыскивая пропавшую дочку. ",
                        TrailerUrl = "https://www.youtube.com/embed/4fzIm7y27wY?si=tz7hvYhraCxhdfYa",
                        BackgroundImageUrl = "/assets/images/bg-assasin.jpg"
                    },

                    new Movie { 
                        Title = "Мег 2: Бездна", 
                        Duration = "1ч 56мин", 
                        Genre = "Боевик", 
                        ImageUrl = "/assets/images/meg-2.jpg" ,
                        AgeRating = "12+", 
                        Year = 2023,
                        Description = "Пять лет спустя борец с экологическими преступлениями Джонас Тейлор вместе сотрудниками компании-владельца глубоководной станции опускается на дно Марианской впадины, где миллионы лет существует скрытая экосистема с невиданными существами и обитают гигантские акулы. На месте выясняется, что станция захвачена группой наёмников, которые незаконно ведут добычу особо ценных ископаемых.",
                        TrailerUrl = "https://www.youtube.com/embed/h0jB3_u6Z5A?si=Fkg96ag0xmHAAqdC",
                        BackgroundImageUrl = "/assets/images/bg-meg2.jpg"
                    },

                    new Movie { 
                        Title = "Без обид", 
                        Duration = "1ч 43мин", 
                        Genre = "Романтика", 
                        ImageUrl = "/assets/images/no-hard-feelings.jpeg" ,
                        AgeRating = "18+", 
                        Year = 2023,
                        Description = "Мэдди 32 года, она всю жизнь прожила в Монтоке — курортном местечке недалеко от Нью-Йорка. Богачи скупают тут недвижимость, налоги постоянно растут, а девушка пытается сохранить доставшийся в наследство от матери дом, поэтому оказывается по уши в долгах. Лишившись автомобиля и возможности таксовать, она в обмен на машину решает помочь богатеньким родителям, которые волнуются, что их 19-летнему сыну скоро в колледж, а он всё никак не вылезет из своей раковины. ",
                        TrailerUrl = "https://www.youtube.com/embed/p4gTCGrrHpw?si=Et4s8Yf5fVv5SjfC",
                        BackgroundImageUrl = "/assets/images/bg-no-hard-feelings.jpg"
                    },

                    new Movie { 
                        Title = "Моё прекрасное несчастье",
                        Duration = "1ч 45мин", 
                        Genre = "Романтика", 
                        ImageUrl = "/assets/images/beautiful-disaster.jpeg",
                        AgeRating = "18+", 
                        Year = 2023,
                        Description = "Эбби — загадочная и недоступная первокурсница, желающая сбежать от своего прошлого. Трэвис — бунтарь и чемпион подпольных боёв, который не верит в любовь. Воплощая в себе всё, от чего Эбби стоит держаться подальше, Трэвис предлагает пари: если он выиграет следующий поединок, она проведёт месяц с ним. Однако он и не догадывается, что у них намного больше общего, чем кажется.",
                        TrailerUrl = "https://www.youtube.com/embed/FLCOztw19OY?si=CyZ2LX9KyUkPPtTQ",
                        BackgroundImageUrl = "/assets/images/bg-beautiful-disaster.jpg"
                    },
                    
                    new Movie { 
                        Title = "Форсаж 10",
                        Duration = "2ч 21мин",
                        Genre = "Боевик",
                        ImageUrl = "/assets/images/fast-x.jpeg",
                        AgeRating = "13+",
                        Year = 2023,
                        Description = "10 лет назад по заданию Агентства Доминик и Брайан ограбили бразильского политика, бизнесмена и по совместительству наркобарона Эрнана Рейеса, который пустился за ними в погоню и погиб. Теперь его сын Данте собирается реализовать коварный план мести — не просто убить Доминика, а заставить страдать, разделавшись с его семьёй.",
                        TrailerUrl = "https://www.youtube.com/embed/SBZGp9edOVk?si=94AtB_VKl96W-KeC",
                        BackgroundImageUrl = "/assets/images/bg-fast-x.jpeg"
                    },

                    new Movie { 
                        Title = "Сердце Стоун",
                        Duration = "2ч 2мин",
                        Genre = "Боевик",
                        ImageUrl = "/assets/images/heart-of-stone.jpg",
                        AgeRating = "13+",
                        Year = 2023,
                        Description = "Оперативница секретного миротворческого агентства Рэйчел Стоун должна помешать хакеру украсть их самый ценный и опасный актив.",
                        TrailerUrl = "https://www.youtube.com/embed/FZe1hw99bic?si=wN2oZ1AdvNT1LbMq",
                        BackgroundImageUrl = "/assets/images/bg-heart-of-stone.jpeg"
                    },

                    new Movie { 
                        Title = "1+1", 
                        Duration = "1ч 52мин", 
                        Genre = "Драма", 
                        ImageUrl = "/assets/images/Intouchables.jpg" ,
                        AgeRating = "16+", 
                        Year = 2011,
                        Description = "Пострадав в результате несчастного случая, богатый аристократ Филипп нанимает в помощники человека, который менее всего подходит для этой работы, – молодого жителя предместья Дрисса, только что освободившегося из тюрьмы. Несмотря на то, что Филипп прикован к инвалидному креслу, Дриссу удается привнести в размеренную жизнь аристократа дух приключений.",
                        TrailerUrl = "https://www.youtube.com/embed/tTwFeGArcrs?si=BDLQcMBuM-IZCuq6",
                        BackgroundImageUrl = "/assets/images/bg-1+1.jpg"
                    },

                    new Movie { 
                        Title = "Тюрьма 77",
                        Duration = "2ч 48мин",
                        Genre = "Триллер",
                        ImageUrl = "/assets/images/jailer.jpg",
                        AgeRating = "16+",
                        Year = 2023,
                        Description = "Бывший тюремщик отправляется на поиски убийц своего сына.",
                        TrailerUrl = "https://www.youtube.com/embed/6jf4Hp1Dkeg?si=jkZN-PmcIAmT2ft_",
                        BackgroundImageUrl = "/assets/images/bg-jailer.jpeg"
                    },

                    
                    new Movie { 
                        Title = "Питер Пэн и Венди", 
                        Duration = "1ч 49мин", 
                        Genre = "Фэнтези", 
                        ImageUrl = "/assets/images/peter-pan-and-wendy.jpg",
                        AgeRating = "6+",
                        Year = 2023,
                        Description = "Накануне отъезда в частную закрытую школу Венди Дарлинг говорит матери, что не хочет взрослеть, и что было бы прекрасно, если бы всё оставалось, как есть. Этой же ночью девочку и двух её младших братьев посещает Питер Пэн с феей Динь-Динь и забирает в сказочную страну Нетландию, где ребятам предстоит познакомиться с невзрослеющими Потерянными мальчиками, индейской принцессой Тигровой Лилией и вступить в противостояние с безжалостным капитаном Крюком и его бандой злобных пиратов.",
                        TrailerUrl = "https://www.youtube.com/embed/IvzEiXTfNLs?si=vlQw2Lml9-WQDkEn",
                        BackgroundImageUrl = "/assets/images/bg-peter-pan-and-wendy.jpeg" 
                        },

                    new Movie { 
                        Title = "Мегалодон", 
                        Duration = "1ч 40мин", 
                        Genre = "Ужасы", 
                        ImageUrl = "/assets/images/the-black-demon.jpg" ,
                        AgeRating = "18+",
                        Year = 2023,
                        Description = "Пол и его семья собираются провести отпуск в райском местечке на побережье. К их удивлению, живописный и дружелюбный поселок покинут и разрушен. По ацтекским легендам, в местных водах обитает последний мегалодон — Черный демон. Он ревностно защищает природу от вторжения людей, уничтожая все на своем пути.",
                        TrailerUrl = "https://www.youtube.com/embed/smdoOSt9Crk?si=mcZHRytJiv9bRfqA",
                        BackgroundImageUrl = "/assets/images/bg-the-black-demon.jpeg"
                        },

                    new Movie { 
                        Title = "Переводчик", 
                        Duration = "2ч 3мин", 
                        Genre = "Боевик", 
                        ImageUrl = "/assets/images/the-covenant.jpg" ,
                        AgeRating = "18+",
                        Year = 2023,
                        Description = "Афганистан, март 2018 года. Во время спецоперации по поиску оружия талибов отряд сержанта армии США Джона Кинли попадает в засаду. В живых остаются только сам Джон, получивший ранение, и местный переводчик Ахмед, который сотрудничает с американцами. Очнувшись на родине, Кинли не помнит, как ему удалось выжить, но понимает, что именно Ахмед спас ему жизнь, протащив на себе через опасную территорию. Теперь чувство вины не даёт Джону покоя, и он решает вернуться за Ахмедом и его семьёй, которых в Афганистане усиленно ищут талибы.",
                        TrailerUrl = "https://www.youtube.com/embed/GXEshCygW3U?si=8uEOJjRvORQhTpce",
                        BackgroundImageUrl = "/assets/images/bg-the-covenant.jpeg"
                        },

                    new Movie { 
                        Title = "Русалочка", 
                        Duration = "2ч 15мин", 
                        Genre = "Фэнтези", 
                        ImageUrl = "/assets/images/the-little-mermaid.jpeg" ,
                        AgeRating = "6+",
                        Year = 2023,
                        Description = "Русалочку Ариэль, одну из дочерей морского царя Тритона, ужасно интересует человечество. Несмотря на неодобрение отца, она поднимается к поверхности и спасает попавшего в кораблекрушение принца Эрика. Узнав об этом, Тритон приходит в ярость и навсегда запрещает дочери покидать морское дно — этим и решает воспользоваться морская ведьма Урсула. В обмен на голос она даёт Ариэль ноги, но у девушки есть только три дня: если к закату третьего дня она не разделит с Эриком поцелуй настоящей любви, то навсегда попадёт в собственность ведьмы.",
                        TrailerUrl = "https://www.youtube.com/embed/AkXCEb0STLM?si=EpOijPvYhdusU_NL",
                        BackgroundImageUrl = "/assets/images/bg-little-mermaid.jpg"
                        },

                    new Movie { 
                        Title = "Нечто. Монстр из глубин", 
                        Duration = "1ч 39мин", 
                        Genre = "Ужасы", 
                        ImageUrl = "/assets/images/the-tank.jpeg" ,
                        AgeRating = "18+", 
                        Year = 2023,
                        Description = "1978 год. После смерти матери внезапно узнав, что получил в наследство дом на морском побережье, Бен с женой и маленькой дочерью едет из Калифорнии в Орегон, чтобы оценить потенциал недвижимости. Рядом с домом обнаруживается выдолбленный в породе резервуар, и, пока семейство приводит жилище в порядок, в глубинах пещер пробуждается нечто.",
                        TrailerUrl = "https://www.youtube.com/embed/Qbsgw7Jq0p8?si=dMyMr8SGKMw-SaHX",
                        BackgroundImageUrl = "/assets/images/bg-the-tank.jpg"
                    },

                    new Movie { 
                        Title = "Трансформеры: Восхождение Звероботов",
                        Duration = "2ч 07мин",
                        Genre = "Боевик",
                        ImageUrl = "/assets/images/transformer.jpg",
                        AgeRating = "15+",
                        Year = 2023,
                        Description = "1994 год. Стажер музея Елена Уоллес и бывший военный эксперт по электронике Ной Диас оказываются втянуты в древний конфликт, связанный с максималами и террорконами.",
                        TrailerUrl = "https://www.youtube.com/embed/eQDfGzlhHoY?si=wuTZs-lwBBA6McwO",
                        BackgroundImageUrl = "/assets/images/bg-transformer.jpg"
                    },

                    new Movie { 
                        Title = "Интерстеллар", 
                        Duration = "1ч 33мин", 
                        Genre = "Фэнтези", 
                        ImageUrl = "/assets/images/Интерстеллар.jpg",
                        AgeRating = "16+", 
                        Year = 2014,
                        Description = "Когда засуха, пыльные бури и вымирание растений приводят человечество к продовольственному кризису, коллектив исследователей и учёных отправляется сквозь червоточину (которая предположительно соединяет области пространства-времени через большое расстояние) в путешествие, чтобы превзойти прежние ограничения для космических путешествий человека и найти планету с подходящими для человечества условиями.",
                        TrailerUrl = "https://www.youtube.com/embed/m2vijtILDuk?si=CCB3QOFmf-GJQJLS",
                        BackgroundImageUrl = "/assets/images/bg-interstellar.jpg" 
                    },

                    new Movie { 
                        Title = "Побег из Шоушенка", 
                        Duration = "2ч 22мин", 
                        Genre = "Триллер", 
                        ImageUrl = "/assets/images/Побег-из-Шоушенка.jpg",
                        AgeRating = "16+", 
                        Year = 1994,
                        Description = "Бухгалтер Энди Дюфрейн обвинён в убийстве собственной жены и её любовника. Оказавшись в тюрьме под названием Шоушенк, он сталкивается с жестокостью и беззаконием, царящими по обе стороны решётки. Каждый, кто попадает в эти стены, становится их рабом до конца жизни. Но Энди, обладающий живым умом и доброй душой, находит подход как к заключённым, так и к охранникам, добиваясь их особого к себе расположения.",
                        TrailerUrl = "https://www.youtube.com/embed/kgAeKpAPOYk?si=aXaZHUxKNqgO3ES2",
                        BackgroundImageUrl = "/assets/images/bg-Побег-из-Шоушенка.jpg" 
                    },

                    new Movie { 
                        Title = "Форрест Гамп", 
                        Duration = "2ч 22мин", 
                        Genre = "Романтика", 
                        ImageUrl = "/assets/images/Форрест-Гамп.jpg",
                        AgeRating = "12+", 
                        Year = 1994,
                        Description = "Сидя на автобусной остановке, Форрест Гамп — не очень умный, но добрый и открытый парень — рассказывает случайным встречным историю своей необыкновенной жизни. С самого малолетства парень страдал от заболевания ног, соседские мальчишки дразнили его, но в один прекрасный день Форрест открыл в себе невероятные способности к бегу. Подруга детства Дженни всегда его поддерживала и защищала, но вскоре дороги их разошлись.",
                        TrailerUrl = "https://www.youtube.com/embed/otmeAaifX04?si=_kU-YyotzJc8s4qG",
                        BackgroundImageUrl = "/assets/images/bg-Форрест-Гамп.jpg"
                    },

                    new Movie { 
                        Title = "Хатико: Самый верный друг", 
                        Duration = "1ч 33min", 
                        Genre = "Драма", 
                        ImageUrl = "/assets/images/Хатико.jpg",
                        AgeRating = "0+", 
                        Year = 2009,
                        Description = "Однажды, возвращаясь с работы, профессор колледжа нашел на вокзале симпатичного щенка породы акита-ину. Профессор и Хатико стали верными друзьями. Каждый день пес провожал и встречал хозяина на вокзале.",
                        TrailerUrl = "https://www.youtube.com/embed/uSBUbKaffzU?si=gKMTUWaJ42zqY3Fr",
                        BackgroundImageUrl = "/assets/images/bg-Хатико.jpg" 
                    }
            };
        }
    }
}