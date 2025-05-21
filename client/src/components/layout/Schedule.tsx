import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  isSameDay,
  isAfter,
  format as dateFnsFormat,
  addDays,
} from 'date-fns';
import DateSlider from '@/components/ui/DateSlider';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface ScheduleItem {
  id: number;
  movieId: number;
  hallId: number;
  date: string;
  time: string;
  movie: {
    id: number;
    title: string;
    duration: number;
    genre: string;
    imageUrl: string;
    ageRating?: string | null;
    year?: number;
    description?: string | null;
    trailerUrl?: string | null;
    backgroundImageUrl?: string | null;
  };
  hall: {
    id: number;
    name: string;
    capacity: number;
    type: 'standard' | 'vip' | 'comfort';
    zones: {
      id: number;
      name: string;
      basePrice: number;
    }[];
  };
}

const Schedule: React.FC = () => {
  const navigate = useNavigate();
  const { token, role, isAuthenticated } = useAuth();

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch('http://localhost:5218/api/cinema/schedules', {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          credentials: 'include',
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => null);
          throw new Error(errorData?.message || `Ошибка загрузки расписания: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Получено расписание:', data);
        setSchedules(data);
      } catch (error: unknown) {
        console.error('Ошибка загрузки расписания:', error);
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Не удалось загрузить расписание. Проверьте подключение.';
        toast.error(errorMessage);
      }
    };

    fetchSchedules();
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const formattedSelectedDate = dateFnsFormat(selectedDate, 'yyyy-MM-dd');
  const isToday = isSameDay(selectedDate, currentTime);

  const filteredSchedule = useMemo(() => {
    return schedules.filter(item => {
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
  }, [schedules, formattedSelectedDate, isToday, selectedDate, currentTime]);

  const moviesOfDay = useMemo(() => {
    const movieIds = [...new Set(filteredSchedule.map(s => s.movieId))];
    return movieIds.map(id => filteredSchedule.find(s => s.movieId === id)!.movie);
  }, [filteredSchedule]);

  const goToMoviePage = (movie: ScheduleItem['movie'], sessions: ScheduleItem[]) => {
    const sessionData = sessions.map(s => ({
      id: s.id,
      time: s.time,
      hall: s.hall.type === 'standard' ? 'Стандартный зал' : s.hall.type === 'comfort' ? 'Комфортный зал' : 'VIP зал',
      date: s.date,
      zones: s.hall.zones,
    }));
    console.log('Переход на /movie/', movie.id, 'с данными:', { movie, scheduleData: sessionData });
    navigate(`/movie/${movie.id}`, {
      state: {
        fromSchedule: true,
        scheduleData: sessionData,
        movie: movie,
      },
    });
  };

  const handleGenerateSchedule = async () => {
    if (!isAuthenticated || role !== 'Admin') {
      toast.error('Только администраторы могут генерировать расписание');
      return;
    }

    if (!startDate || !endDate) {
      toast.error('Пожалуйста, выберите начальную и конечную даты');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      toast.error('Начальная дата не может быть позже конечной');
      return;
    }

    const maxDaysRange = 30;
    const daysDifference = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    if (daysDifference > maxDaysRange) {
      toast.error(`Период не может быть больше ${maxDaysRange} дней`);
      return;
    }

    setIsGenerating(true);
    try {
      console.log('Отправка запроса на генерацию расписания:', { startDate, endDate, token });
      const response = await fetch('http://localhost:5218/api/cinema/schedules/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({
          startDate: startDate,
          endDate: endDate,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Ошибка сервера:', errorData);
        if (response.status === 401) {
          throw new Error('Необходима авторизация. Пожалуйста, войдите снова.');
        } else if (response.status === 403) {
          throw new Error('У вас нет прав для этой операции.');
        } else {
          throw new Error(errorData.message || `Ошибка ${response.status}: Не удалось сгенерировать расписание`);
        }
      }

      const scheduleResponse = await fetch('http://localhost:5218/api/cinema/schedules', {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
      });

      if (!scheduleResponse.ok) {
        throw new Error('Ошибка при получении обновленного расписания');
      }

      const newSchedules = await scheduleResponse.json();
      console.log('Обновленное расписание:', newSchedules);
      setSchedules(newSchedules);
      setIsDialogOpen(false);
      setStartDate('');
      setEndDate('');
      toast.success('Расписание успешно сгенерировано', {
        description: newSchedules.length === 0 ? 'Внимание: сеансов не создано, возможно, слишком позднее время для текущего дня.' : undefined,
      });
    } catch (error) {
      console.error('Ошибка генерации расписания:', error);
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка. Проверьте подключение.';
      toast.error(errorMessage, {
        description: 'Попробуйте снова или обратитесь к администратору.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getHallName = (type: 'standard' | 'vip' | 'comfort') => {
    return type === 'standard' ? 'Зал 1' : type === 'comfort' ? 'Зал 2' : 'VIP Зал';
  };

  return (
    <section className="relative px-4 py-6 bg-cinema-primary text-cinema-text min-h-screen pt-20">
      <header className="mb-6">
        {/* <h1 className="text-3xl font-bold mb-4">Расписание</h1> */}
        <DateSlider selectedDate={selectedDate} onDateChange={setSelectedDate} />
        {role === 'Admin' && (
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="mt-4 bg-cinema-accent hover:bg-cinema-mouse text-white"
          >
            Сгенерировать расписание
          </Button>
        )}
      </header>

      <Dialog open={isDialogOpen} onOpenChange={(open) => !isGenerating && setIsDialogOpen(open)}>
        <DialogContent className="bg-gray-800 text-white">
          <DialogHeader>
            <VisuallyHidden>
              <DialogTitle>Генерация расписания</DialogTitle>
            </VisuallyHidden>
            <DialogDescription className="text-gray-400">
              При генерации учитываются следующие правила:
              • Случайный выбор фильмов на каждый день
              • Перерыв между сеансами - 20 минут
              • Семейные фильмы (0+, 6+) - до 20:00
              • Фильмы 18+ - после 16:00
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label htmlFor="startDate" className="block text-sm text-gray-400">Начальная дата</label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                min={dateFnsFormat(new Date(), 'yyyy-MM-dd')}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-gray-700 text-white"
              />
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm text-gray-400">Конечная дата</label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                min={startDate || dateFnsFormat(new Date(), 'yyyy-MM-dd')}
                max={startDate ? dateFnsFormat(addDays(new Date(startDate), 30), 'yyyy-MM-dd') : undefined}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-gray-700 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setIsDialogOpen(false)}
              className="bg-gray-600 hover:bg-gray-500 text-white"
              disabled={isGenerating}
            >
              Отмена
            </Button>
            <Button
              onClick={handleGenerateSchedule}
              className="bg-cinema-accent hover:bg-cinema-mouse text-white"
              disabled={isGenerating}
            >
              {isGenerating ? 'Генерация...' : 'Сгенерировать'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {moviesOfDay.length ? (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {moviesOfDay.map(movie => {
            const times = filteredSchedule
              .filter(s => s.movieId === movie.id)
              .sort((a, b) => a.time.localeCompare(b.time));

            return (
              <article
                key={movie.id}
                className="bg-white/5 rounded-lg overflow-hidden hover:bg-white/10 transition"
              >
                <div 
                  className="relative w-full aspect-[2/3] cursor-pointer"
                  onClick={() => goToMoviePage(movie, times)}
                >
                  <img
                    src={movie.imageUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>

                <div className="p-3">
                  <h3 className="text-lg font-bold mb-1 line-clamp-1">{movie.title}</h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {times.map((session) => (
                      <div
                        key={session.id}
                        className="bg-cinema-accent text-white rounded-sm text-center px-2 py-1 text-xs inline-flex items-center justify-center min-w-[100px]"
                      >
                        {session.time} • {getHallName(session.hall.type)}
                      </div>
                    ))}
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