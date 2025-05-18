// Schedule.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  isSameDay,
  isAfter,
  format as dateFnsFormat,
} from 'date-fns';
import DateSlider from '@/components/ui/DateSlider';
import { mockMovies } from '@/mockMovies';

interface Movie {
  id: number;
  title: string;
  duration: string;
  genre: string;
  imageUrl: string;
  description?: string | null;
  actors?: string[];
  director?: string;
  year?: number;
}

interface Zone {
  id: string;
  name: string;
  price: number;
}

interface Hall {
  id: number;
  name: string;
  capacity: number;
  type: 'standard' | 'vip' | 'comfort';
  zones: Zone[];
}

interface ScheduleItem {
  id: number;
  movieId: number;
  hallId: number;
  date: string;
  time: string;
}

const HALLS_KEY = 'cinema_halls';
const SCHEDULE_KEY = 'cinema_schedule';

function buildInitialHalls(): Hall[] {
  return [
    {
      id: 1,
      name: 'Зал 1 (Стандартный)',
      capacity: 100,
      type: 'standard',
      zones: [
        { id: 'standard', name: 'Стандарт', price: 300 },
        { id: 'comfort', name: 'Комфорт', price: 500 },
      ],
    },
    {
      id: 2,
      name: 'Зал 2 (Комфортный)',
      capacity: 50,
      type: 'comfort',
      zones: [
        { id: 'vip', name: 'Комфорт+', price: 1000 },
      ],
    },
    {
      id: 3,
      name: 'VIP Зал',
      capacity: 30,
      type: 'vip',
      zones: [{ id: 'vip', name: 'VIP', price: 1500 }],
    },
  ];
}

function buildInitialSchedule(halls: Hall[]): ScheduleItem[] {
  const today = new Date();
  let id = 1;
  const res: ScheduleItem[] = [];

  for (let offset = 0; offset < 7; offset++) {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);
    const dateStr = dateFnsFormat(date, 'yyyy-MM-dd');

    const moviesForDay = [...mockMovies]
      .sort(() => 0.5 - Math.random())
      .slice(0, 5 + Math.floor(Math.random() * 5));

      moviesForDay.forEach(movie => {
        const timesCount = 1 + Math.floor(Math.random() * 3);
        const times = ['10:00', '13:00', '16:00', '19:00', '22:00']
          .sort(() => 0.5 - Math.random())
          .slice(0, timesCount);
      
        times.forEach(time => {
          // Выбираем между всеми залами (1,2,3)
          const hallIds = [1, 2, 3];
          const randomHallId = hallIds[Math.floor(Math.random() * hallIds.length)];
          const hall = halls.find(h => h.id === randomHallId) || halls[0];
          res.push({
            id: id++,
            movieId: movie.id,
            hallId: hall.id,
            date: dateStr,
            time,
          });
        });
      });
  }
  return res;
}

const Schedule: React.FC = () => {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [movies] = useState<Movie[]>(mockMovies as Movie[]);
  const [halls, setHalls] = useState<Hall[]>([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const storedHalls = localStorage.getItem(HALLS_KEY);
    const initialHalls: Hall[] = storedHalls
      ? JSON.parse(storedHalls)
      : buildInitialHalls();
    if (!storedHalls)
      localStorage.setItem(HALLS_KEY, JSON.stringify(initialHalls));
    setHalls(initialHalls);

    const storedSchedule = localStorage.getItem(SCHEDULE_KEY);
    const initialSchedule: ScheduleItem[] = storedSchedule
      ? JSON.parse(storedSchedule)
      : buildInitialSchedule(initialHalls);
    if (!storedSchedule)
      localStorage.setItem(SCHEDULE_KEY, JSON.stringify(initialSchedule));
    setSchedule(initialSchedule);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const formattedSelectedDate = dateFnsFormat(selectedDate, 'yyyy-MM-dd');
  const isToday = isSameDay(selectedDate, currentTime);

  const filteredSchedule = useMemo(() => {
    return schedule.filter(item => {
      if (item.date !== formattedSelectedDate) return false;

      if (isToday) {
        const [h, m] = item.time.split(':').map(Number);
        const session = new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          h,
          m,
        );
        return isAfter(session, currentTime);
      }
      return true;
    });
  }, [schedule, formattedSelectedDate, isToday, selectedDate, currentTime]);

  const moviesOfDay = useMemo(
    () => movies.filter(m => filteredSchedule.some(s => s.movieId === m.id)),
    [movies, filteredSchedule],
  );

  const goToMoviePage = (movie: Movie, sessions: ScheduleItem[]) => {
    const sessionData = sessions.map(s => ({
      id: s.id,
      time: s.time,
      hall: halls.find(h => h.id === s.hallId)?.name || '',
      date: s.date
    }));
    navigate(`/movie/${movie.id}`, {
      state: {
        fromSchedule: true,
        scheduleData: sessionData,
      },
    });
  };
  return (
    <section className="relative px-4 py-6 bg-cinema-primary text-cinema-text min-h-screen pt-20">
      <header className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Расписание</h1>
        <DateSlider selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </header>

      {moviesOfDay.length ? (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {moviesOfDay.map(movie => {
            const times = filteredSchedule
              .filter(s => s.movieId === movie.id)
              .sort((a, b) => a.time.localeCompare(b.time));

            return (
              <article
                key={movie.id}
                className="bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition cursor-pointer"
                onClick={() => goToMoviePage(movie, times)}
              >
                <div className="relative w-full aspect-[2/3]">
                  <img
                    src={movie.imageUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>

                <div className="p-3">
                  <h3 className="text-lg font-bold mb-1 line-clamp-1">
                    {movie.title}
                  </h3>

                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1">
                      {times.map(t => (
                        <button
                          key={t.id}
                          className="bg-cinema-accent px-2 py-1 rounded text-white text-xs hover:bg-cinema-accent/80 transition"
                          onClick={e => {
                            e.stopPropagation();
                            navigate(`/booking/${t.id}`);
                          }}
                        >
                          {t.time}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-400 text-lg mt-10">
          Нет сеансов на выбранную дату
        </p>
      )}
    </section>
  );
};

export default Schedule;
