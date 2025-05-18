// src/mocks/movies.ts
export interface Movie {
    id: number;
    title: string;
    duration: string;
    genre: string;
    imageUrl: string;
    ageRating?: string | null;
    year?: number | null;
    description?: string | null;
    trailerUrl?: string | null;
    backgroundImageUrl?: string | null;
    actors?: string[];
    director?: string;
  }
  
  export const mockMovies: Movie[] = [
    {
      id: 1,
      title: "65",
      duration: "1ч 33мин",
      genre: "Триллер",
      imageUrl: "/assets/images/65.jpg",
      ageRating: null,
      year: null,
      description: null,
      trailerUrl: null,
      backgroundImageUrl: null,
      actors: [],
      director: ""
    },
    {
      id: 2,
      title: "Обезьяна против Мехаобезьяны",
      duration: "1ч 1мин",
      genre: "Боевик",
      imageUrl: "/assets/images/ape.jpg",
      ageRating: null,
      year: null,
      description: null,
      trailerUrl: null,
      backgroundImageUrl: null,
      actors: [],
      director: ""
    },
    {
      id: 3,
      title: "Ассасин: Битва миров",
      duration: "2ч 10мин",
      genre: "Фэнтези",
      imageUrl: "/assets/images/assassin.jpg",
      ageRating: null,
      year: null,
      description: null,
      trailerUrl: null,
      backgroundImageUrl: null,
      actors: [],
      director: ""
    },
    {
      id: 4,
      title: "Мег 2: Бездна",
      duration: "1ч 56мин",
      genre: "Боевик",
      imageUrl: "/assets/images/meg-2.jpg",
      ageRating: null,
      year: null,
      description: null,
      trailerUrl: null,
      backgroundImageUrl: null,
      actors: [],
      director: ""
    },
    {
      id: 5,
      title: "Без обид",
      duration: "1ч 43мин",
      genre: "Романтика",
      imageUrl: "/assets/images/no-hard-feelings.jpeg",
      ageRating: null,
      year: null,
      description: null,
      trailerUrl: null,
      backgroundImageUrl: null,
      actors: [],
      director: ""
    },
    {
      id: 6,
      title: "Моё прекрасное несчастье",
      duration: "1ч 45мин",
      genre: "Романтика",
      imageUrl: "/assets/images/beautiful-disaster.jpeg",
      ageRating: null,
      year: null,
      description: null,
      trailerUrl: null,
      backgroundImageUrl: null,
      actors: [],
      director: ""
    },
    {
      id: 7,
      title: "Форсаж 10",
      duration: "2ч 21мин",
      genre: "Боевик",
      imageUrl: "/assets/images/fast-x.jpeg",
      ageRating: "13+",
      year: 2023,
      description: "10 лет назад по заданию Агентства Доминик и Брайан ограбили бразильского политика, бизнесмена и по совместительству наркобарона Эрнана Рейеса, который пустился за ними в погоню и погиб. Теперь его сын Данте собирается реализовать коварный план мести — не просто убить Доминика, а заставить страдать, разделавшись с его семьёй.",
      trailerUrl: "https://www.youtube.com/embed/SBZGp9edOVk?si=94AtB_VKl96W-KeC",
      backgroundImageUrl: "/assets/images/bg-fast-x.jpeg",
      actors: ["Вин Дизель", "Джейсон Момоа", "Мишель Родригес"],
      director: "Луи Летерье"
    },
    {
      id: 8,
      title: "Сердце Стоун",
      duration: "2ч 2мин",
      genre: "Боевик",
      imageUrl: "/assets/images/heart-of-stone.jpg",
      ageRating: "13+",
      year: 2023,
      description: "Оперативница секретного миротворческого агентства Рэйчел Стоун должна помешать хакеру украсть их самый ценный и опасный актив.",
      trailerUrl: "https://www.youtube.com/embed/FZe1hw99bic?si=wN2oZ1AdvNT1LbMq",
      backgroundImageUrl: "/assets/images/bg-heart-of-stone.jpeg",
      actors: ["Галь Гадот", "Джейми Дорнан", "Алия Бхатт"],
      director: "Том Харпер"
    },
    {
      id: 9,
      title: "1+1",
      duration: "1ч 52мин",
      genre: "Драма",
      imageUrl: "/assets/images/Intouchables.jpg",
      ageRating: null,
      year: null,
      description: null,
      trailerUrl: null,
      backgroundImageUrl: null,
      actors: [],
      director: ""
    },
    {
      id: 10,
      title: "Тюрьма 77",
      duration: "2ч 48мин",
      genre: "Триллер",
      imageUrl: "/assets/images/jailer.jpg",
      ageRating: "16+",
      year: 2023,
      description: "Бывший тюремщик отправляется на поиски убийц своего сына.",
      trailerUrl: "https://www.youtube.com/embed/6jf4Hp1Dkeg?si=jkZN-PmcIAmT2ft_",
      backgroundImageUrl: "/assets/images/bg-jailer.jpeg",
      actors: ["Радженикант", "Моханлал", "Джеки Шрофф"],
      director: "Нельсон Дилипкумар"
    },
    {
      id: 11,
      title: "Питер Пэн и Венди",
      duration: "1ч 49мин",
      genre: "Фэнтези",
      imageUrl: "/assets/images/peter-pan-and-wendy.jpg",
      ageRating: "6+",
      year: 2023,
      description: "Накануне отъезда в частную закрытую школу Венди Дарлинг говорит матери, что не хочет взрослеть, и что было бы прекрасно, если бы всё оставалось, как есть. Этой же ночью девочку и двух её младших братьев посещает Питер Пэн с феей Динь-Динь и забирает в сказочную страну Нетландию, где ребятам предстоит познакомиться с невзрослеющими Потерянными мальчиками, индейской принцессой Тигровой Лилией и вступить в противостояние с безжалостным капитаном Крюком и его бандой злобных пиратов.",
      trailerUrl: "https://www.youtube.com/embed/IvzEiXTfNLs?si=vlQw2Lml9-WQDkEn",
      backgroundImageUrl: "/assets/images/bg-peter-pan-and-wendy.jpeg",
      actors: ["Александр Молони", "Эвер Андерсон", "Джуд Лоу"],
      director: "Дэвид Лоури"
    },
    {
      id: 12,
      title: "Мегалодон",
      duration: "1ч 40мин",
      genre: "Ужасы",
      imageUrl: "/assets/images/the-black-demon.jpg",
      ageRating: "18+",
      year: 2023,
      description: "Пол и его семья собираются провести отпуск в райском местечке на побережье. К их удивлению, живописный и дружелюбный поселок покинут и разрушен. По ацтекским легендам, в местных водах обитает последний мегалодон — Черный демон. Он ревностно защищает природу от вторжения людей, уничтожая все на своем пути.",
      trailerUrl: "https://www.youtube.com/embed/smdoOSt9Crk?si=mcZHRytJiv9bRfqA",
      backgroundImageUrl: "/assets/images/bg-the-black-demon.jpeg",
      actors: ["Джош Лукас", "Фернанда Уррехола", "Хулио Сезар Седильо"],
      director: "Адриан Грюнберг"
    },
    {
      id: 13,
      title: "Переводчик",
      duration: "2ч 3мин",
      genre: "Боевик",
      imageUrl: "/assets/images/the-covenant.jpg",
      ageRating: "18+",
      year: 2023,
      description: "Афганистан, март 2018 года. Во время спецоперации по поиску оружия талибов отряд сержанта армии США Джона Кинли попадает в засаду. В живых остаются только сам Джон, получивший ранение, и местный переводчик Ахмед, который сотрудничает с американцами. Очнувшись на родине, Кинли не помнит, как ему удалось выжить, но понимает, что именно Ахмед спас ему жизнь, протащив на себе через опасную территорию. Теперь чувство вины не даёт Джону покоя, и он решает вернуться за Ахмедом и его семьёй, которых в Афганистане усиленно ищут талибы.",
      trailerUrl: "https://www.youtube.com/embed/GXEshCygW3U?si=8uEOJjRvORQhTpce",
      backgroundImageUrl: "/assets/images/bg-the-covenant.jpeg",
      actors: ["Джейк Джилленхол", "Дар Салим", "Джонни Ли Миллер"],
      director: "Гай Ричи"
    },
    {
      id: 14,
      title: "Русалочка",
      duration: "2ч 15мин",
      genre: "Фэнтези",
      imageUrl: "/assets/images/the-little-mermaid.jpeg",
      ageRating: "6+",
      year: 2023,
      description: "Русалочку Ариэль, одну из дочерей морского царя Тритона, ужасно интересует человечество. Несмотря на неодобрение отца, она поднимается к поверхности и спасает попавшего в кораблекрушение принца Эрика. Узнав об этом, Тритон приходит в ярость и навсегда запрещает дочери покидать морское дно — этим и решает воспользоваться морская ведьма Урсула. В обмен на голос она даёт Ариэль ноги, но у девушки есть только три дня: если к закату третьего дня она не разделит с Эриком поцелуй настоящей любви, то навсегда попадёт в собственность ведьмы.",
      trailerUrl: "https://www.youtube.com/embed/AkXCEb0STLM?si=EpOijPvYhdusU_NL",
      backgroundImageUrl: "/assets/images/bg-little-mermaid.jpg",
      actors: ["Холли Бэйли", "Джона Хойер-Кинг", "Мелисса МакКарти"],
      director: "Роб Маршалл"
    },
    {
      id: 15,
      title: "Нечто. Монстр из глубин",
      duration: "1ч 39мин",
      genre: "Ужасы",
      imageUrl: "/assets/images/the-tank.jpeg",
      ageRating: null,
      year: null,
      description: null,
      trailerUrl: null,
      backgroundImageUrl: null,
      actors: [],
      director: ""
    },
    {
      id: 16,
      title: "Трансформеры: Восхождение Звероботов",
      duration: "2ч 07мин",
      genre: "Боевик",
      imageUrl: "/assets/images/transformer.jpg",
      ageRating: "15+",
      year: 2023,
      description: "1994 год. Стажер музея Елена Уоллес и бывший военный эксперт по электронике Ной Диас оказываются втянуты в древний конфликт, связанный с максималами и террорконами.",
      trailerUrl: "https://www.youtube.com/embed/eQDfGzlhHoY?si=wuTZs-lwBBA6McwO",
      backgroundImageUrl: "/assets/images/bg-transformer.jpg"
    },
    {
      id: 17,
      title: "Интерстеллар",
      duration: "1ч 33мин",
      genre: "Фэнтези",
      imageUrl: "/assets/images/Интерстеллар.jpg",
      ageRating: null,
      year: null,
      description: null,
      trailerUrl: null,
      backgroundImageUrl: "/assets/images/bg-interstellar.jpg",
      actors: [],
      director: ""
    },
    {
      id: 18,
      title: "Побег из Шоушенка",
      duration: "2ч 22мин",
      genre: "Триллер",
      imageUrl: "/assets/images/Побег-из-Шоушенка.jpg",
      ageRating: null,
      year: null,
      description: null,
      trailerUrl: null,
      backgroundImageUrl: null,
      actors: [],
      director: ""
    },
    {
      id: 19,
      title: "Форрест Гамп",
      duration: "2ч 22мин",
      genre: "Романтика",
      imageUrl: "/assets/images/Форрест-Гамп.jpg",
      ageRating: null,
      year: null,
      description: null,
      trailerUrl: null,
      backgroundImageUrl: null,
      actors: [],
      director: ""
    },
    {
      id: 20,
      title: "Хатико: Самый верный друг",
      duration: "1ч 33min",
      genre: "Драма",
      imageUrl: "/assets/images/Хатико.jpg",
      ageRating: null,
      year: null,
      description: null,
      trailerUrl: null,
      backgroundImageUrl: null,
      actors: [],
      director: ""
    }
  ];