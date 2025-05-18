import React, { useRef, useState, useEffect } from 'react';
import {
  format,
  addDays,
  isSameDay,
  isTomorrow,
  startOfDay,
} from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from 'lucide-react';
import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import '@/components/ui/dateSlider.css';
import type { Locale } from 'date-fns';

interface DateSliderProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const shortRuLocale: Locale = {
  ...ru,
  localize: {
    ...ru.localize!,
    day: (n: number) => ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'][n],
  },
};

const DateSlider: React.FC<DateSliderProps> = ({
  selectedDate,
  onDateChange,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const calendarButtonRef = useRef<HTMLButtonElement>(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const today = startOfDay(new Date());
  const [startDate, setStartDate] = useState<Date>(today);

  const visibleDates = Array.from({ length: 7 }, (_, i) =>
    addDays(startDate, i)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        calendarRef.current &&
        !calendarRef.current.contains(target) &&
        calendarButtonRef.current &&
        !calendarButtonRef.current.contains(target)
      ) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      const index = visibleDates.findIndex((d) =>
        isSameDay(startOfDay(d), startOfDay(selectedDate))
      );
      if (index >= 0) {
        const container = scrollRef.current;
        const item = container.children[index] as HTMLElement;
        if (item) {
          container.scrollTo({
            left:
              item.offsetLeft - container.offsetWidth / 2 + item.offsetWidth / 2,
            behavior: 'smooth',
          });
        }
      }
    }
  }, [selectedDate, visibleDates]);

  const scrollWeek = (direction: 'left' | 'right') => {
    const shift = direction === 'left' ? -7 : 7;
    const newStart = addDays(startDate, shift);
    setStartDate(newStart);
    // Убрали вызов onDateChange здесь, чтобы не менять выбранную дату при прокрутке
  };

  const getDayLabel = (date: Date) => {
    const day = startOfDay(date);
    if (isSameDay(day, today)) return 'Сегодня';
    if (isTomorrow(day)) return 'Завтра';
    return format(day, 'EEE, d MMM', { locale: shortRuLocale });
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2 w-full">
        <button
          onClick={() => scrollWeek('left')}
          className="text-white p-2 hover:bg-white/10 rounded-full"
        >
          <ChevronLeft size={20} />
        </button>

        <div
          ref={scrollRef}
          className="flex flex-1 overflow-x-auto gap-2 py-2 scrollbar-hide"
        >
          {visibleDates.map((date) => {
            const normalizedDate = startOfDay(date);
            const isSelected = isSameDay(startOfDay(selectedDate), normalizedDate);
            return (
              <button
                key={date.toISOString()}
                onClick={() => onDateChange(normalizedDate)}
                className={`flex flex-col items-start min-w-[120px] px-4 py-3 rounded-md whitespace-nowrap border 
                  transition-all duration-300 ease-out 
                  ${isSelected
                      ? 'bg-cinema-accent text-white shadow-lg shadow-cinema-accent/40 transform translate-y-[-2px]'
                      : 'bg-white/5 text-white border-white/20 hover:bg-white/15 hover:shadow-md hover:shadow-white/10 hover:translate-y-[-1px]'
                  }`}
              >
                <span className="text-sm font-medium">
                  {getDayLabel(normalizedDate)}
                </span>
              </button>
            );
          })}

          <div className="flex items-center gap-1 pl-2">
            <button
              onClick={() => scrollWeek('right')}
              className="text-white p-2 hover:bg-white/10 rounded-full"
            >
              <ChevronRight size={20} />
            </button>
            <button
              ref={calendarButtonRef}
              onClick={() => setShowCalendar((prev) => !prev)}
              className="text-white p-2 hover:bg-white/10 rounded-full"
            >
              <CalendarIcon size={20} />
            </button>
          </div>
        </div>
      </div>

      {showCalendar && (
        <div
          ref={calendarRef}
          className="absolute top-12 right-[180px] z-50 rounded-lg shadow-lg border border-gray-700 bg-gray-800"
        >
          <Calendar
            locale={shortRuLocale}
            date={selectedDate}
            onChange={(date: Date) => {
              const clean = startOfDay(date);
              setStartDate(clean);
              onDateChange(clean);
              setShowCalendar(false);
            }}
            color="#40409c"
            className="calendar-dark"
          />
        </div>
      )}
    </div>
  );
};

export default DateSlider;