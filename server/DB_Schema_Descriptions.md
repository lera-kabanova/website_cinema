Описание структуры БД: Концептуальная и Логическая схемы

Краткая проверка 1NF (текущая модель)
- Все атрибуты — скалярные типы (int, decimal, datetime, nvarchar, time), нет списков/массивов/CSV в колонках.
- Связь многие-ко-многим (Movies–Genres) вынесена в отдельную таблицу MovieGenres.
- Одна строка Bookings описывает ровно одно место (SeatId/SeatRow/SeatNumber) на конкретный сеанс.
- JSON-условия в PriceModifiers хранятся строкой; логика парсится на уровне приложения — 1NF не нарушается.
Вывод: схема приведена к 1NF.

РАЗДЕЛ A. КОНЦЕПТУАЛЬНАЯ СХЕМА (бизнес-уровень)
1) User — клиент, совершающий бронирования. Связи: User 1:N Booking.
2) Movie — фильм для показа. Связи: Movie 1:N Schedule; Movie M:N Genre через MovieGenre.
3) Genre — жанр. Связи: Genre M:N Movie через MovieGenre.
4) Hall — зал. Связи: Hall 1:N Schedule; Hall 1:N Zone; Hall 1:N Row.
5) Zone — ценовая зона зала. Связи: Zone N:1 Hall; Zone 1:N Row.
6) Row — ряд зала. Связи: Row N:1 Hall; Row N:1 Zone.
7) TicketType — тип билета/льготы. Связи: TicketType 1:N Booking.
8) PriceModifier — правило-множитель цены (по времени, популярности и т.д.), применяется движком ценообразования.
9) Schedule — сеанс. Связи: Schedule N:1 Movie; Schedule N:1 Hall; Schedule 1:N Booking.
10) Booking — бронь места на сеанс. Связи: Booking N:1 User; Booking N:1 Schedule; Booking N:1 TicketType; Booking N:1 Zone (цена/зона места фиксируется).

РАЗДЕЛ B. ЛОГИЧЕСКАЯ СХЕМА (табличная спецификация)
Типы указаны по факту из миграций (SQL Server): int, nvarchar, decimal(p,s), datetime2, time.

1) Users
- Колонки: Id int PK; Email nvarchar(max) not null; PasswordHash nvarchar(max) not null; Role nvarchar(max) not null.
- Связи: Users.Id referenced by Bookings.UserId (Restrict on delete).

2) Movies
- Колонки: Id int PK; Title nvarchar(max) not null; Duration int not null; ImageUrl nvarchar(max) not null; AgeRating nvarchar(max) null; Year int null; Description nvarchar(max) null; TrailerUrl nvarchar(max) null; BackgroundImageUrl nvarchar(max) null; PopularityScore float not null default 0.5.
- Связи: Movies.Id referenced by Schedules.MovieId (Cascade); Movies M:N Genres via MovieGenres.

3) Genres
- Колонки: Id int PK; Name nvarchar(max) not null.
- Связи: Genres.Id referenced by MovieGenres.GenreId (Cascade).

4) MovieGenres (M:N)
- Колонки: MovieId int not null; GenreId int not null.
- Ключи: PK(MovieId, GenreId); IX(GenreId).
- Связи: MovieGenres.MovieId → Movies.Id (Cascade); MovieGenres.GenreId → Genres.Id (Cascade).

5) Halls
- Колонки: Id int PK; Name nvarchar(max) not null; Capacity int not null; Type nvarchar(max) not null (CHECK Type IN ('standard','comfort','vip')).
- Связи: Halls.Id referenced by Schedules.HallId (Cascade); Rows.HallId (Cascade); Zones.HallId (Cascade).

6) Zones
- Колонки: Id int PK; HallId int not null; Name nvarchar(max) not null; BasePrice decimal(18,2) not null.
- Индексы: IX(HallId).
- Связи: Zones.HallId → Halls.Id (Cascade); referenced by Bookings.ZoneId (Cascade); Rows.ZoneId (нет FK в миграциях, но ZoneId хранится).

7) Rows
- Колонки: Id int PK; HallId int not null; Number int not null; Seats int not null; Type nvarchar(max) not null; Spacing nvarchar(max) not null; ZoneId int not null.
- Индексы: IX(HallId).
- Связи: Rows.HallId → Halls.Id (Cascade). (ZoneId хранится, FK не создан в миграциях — при построении диаграммы можно показать связь Row N:1 Zone).

8) TicketTypes
- Колонки: Id int PK; Name nvarchar(50) not null; Multiplier decimal(5,2) not null.
- Связи: TicketTypes.Id referenced by Bookings.TicketTypeId (Cascade).

9) PriceModifiers
- Колонки: Id int PK; Type nvarchar(max) not null; Condition nvarchar(max) not null (JSON условие); Multiplier real with precision(5,2) not null.
- Использование: применяется в бизнес-логике расчёта цены; внешних ключей нет.

10) Schedules
- Колонки: Id int PK; MovieId int not null; HallId int not null; Date datetime2 not null; Time time not null; CreatedAt datetime2 not null.
- Индексы: IX(HallId), IX(MovieId).
- Связи: Schedules.MovieId → Movies.Id (Cascade); Schedules.HallId → Halls.Id (Cascade); referenced by Bookings.ScheduleId (Cascade).

11) Bookings
- Колонки: Id int PK; UserId int not null; ScheduleId int not null; ZoneId int not null; TicketTypeId int not null; SeatId nvarchar(max) not null; SeatRow int not null; SeatNumber int not null; BookingTime datetime2 not null; Status nvarchar(max) not null; FinalPrice decimal(18,2) not null.
- Индексы: IX(ScheduleId), IX(TicketTypeId), IX(UserId), IX(ZoneId). (Уникальность SeatId в пределах Schedule не задана — при необходимости добавить UX(ScheduleId, SeatId)).
- Связи: Bookings.UserId → Users.Id (Restrict); Bookings.ScheduleId → Schedules.Id (Cascade); Bookings.ZoneId → Zones.Id (Cascade); Bookings.TicketTypeId → TicketTypes.Id (Cascade).

Кардинальности (итог)
- User 1:N Booking
- Movie 1:N Schedule
- Genre M:N Movie (через MovieGenres)
- Hall 1:N Schedule
- Hall 1:N Zone
- Hall 1:N Row
- Zone 1:N Row (логически; FK отсутствует, но ZoneId хранится)
- Schedule 1:N Booking
- TicketType 1:N Booking
- Zone 1:N Booking

Подсказки для генерации диаграмм
- Концептуальная схема: использовать сущности и связи из раздела A.
- Логическая схема: использовать таблицы, колонки, PK/FK/индексы из раздела B; отметить каскады (Cascade/Restrict) из связей выше.
