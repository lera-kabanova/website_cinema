import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Clock3, Armchair, Sofa, BedDouble, Baby, LucideProps } from 'lucide-react';
import { format, isSameDay, startOfDay, isAfter } from 'date-fns';
import { Locale } from 'date-fns';
import { ru } from 'date-fns/locale';

interface Movie {
  id: number;
  title: string;
  duration: string;
  genre: string;
  imageUrl: string;
  backgroundImageUrl?: string;
}

interface SessionData {
  id: number;
  time: string;
  hall: string;
  date: string;
  hallId: number;
}

interface ScheduleItem {
  id: number;
  movieId: number;
  hallId: number;
  date: string;
  time: string;
  format: string;
}

interface TicketType {
  id: string;
  name: string;
  prices: {
    [key in SeatType]: number;
  };
}

type SeatType = 'standard' | 'sofa' | 'loveSeat' | 'recliner';

interface SeatInfo {
  type: SeatType;
  price: number;
  label: string;
  icon: React.ReactElement<LucideProps>;
  color: string;
  description: string;
  isDouble?: boolean;
}

interface HallConfig {
  rows: {
    number: number;
    seats: number;
    type: SeatType;
    spacing: 'normal' | 'wide' | 'extraWide';
  }[];
  takenSeats: string[];
}

// Исправленный интерфейс для локали
interface CustomLocale extends Locale {
  localize: {
    day: (n: number) => string;
    ordinalNumber: (d: number) => string;
    era: (d: number) => string;
    quarter: (d: number) => string;
    month: (d: number) => string;
    dayPeriod: (d: string) => string;
  };
}

const shortRuLocale: CustomLocale = {
  ...ru,
  localize: {
    ...ru.localize!,
    day: (n: number) => ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'][n],
    ordinalNumber: (d: number) => ru.localize!.ordinalNumber(d),
    era: (d: number) => ru.localize!.era(d),
    quarter: (d: number) => ru.localize!.quarter(d),
    month: (d: number) => ru.localize!.month(d),
    dayPeriod: (d: string) => ru.localize!.dayPeriod(d),
  },
};


const hallNames: Record<number, string> = {
  1: 'Зал 1 (Стандартный)',
  2: 'Зал 2 (Комфортный)',
  3: 'VIP Зал',
};

const ticketTypes: TicketType[] = [
  { 
    id: 'standard',
    name: 'Стандартный', 
    prices: {
      standard: 15,
      sofa: 20,
      loveSeat: 25,
      recliner: 30
    }
  },
  { 
    id: 'student',
    name: 'Студенческий',
    prices: {
      standard: 10,
      sofa: 15,
      loveSeat: 20,
      recliner: 25
    }
  },
  { 
    id: 'pensioner',
    name: 'Пенсионный',
    prices: {
      standard: 8,
      sofa: 13,
      loveSeat: 18,
      recliner: 23
    }
  },
];

const seatTypes: Record<SeatType, SeatInfo> = {
  standard: {
    type: 'standard',
    price: 15,
    label: 'Стандарт',
    icon: <Armchair className="w-4 h-4 text-white" />,
    color: 'bg-blue-600/70',
    description: 'Одноместное кресло с откидной спинкой и подстаканником'
  },
  sofa: {
    type: 'sofa',
    price: 20,
    label: 'Диван',
    icon: <Sofa className="w-4 h-4 text-white" />,
    color: 'bg-purple-500/70',
    description: 'Двухместный мягкий диван с подушками и подстаканниками',
    isDouble: true
  },
  loveSeat: {
    type: 'loveSeat',
    price: 25,
    label: 'Love Seat',
    icon: <BedDouble className="w-4 h-4 text-white" />,
    color: 'bg-pink-400/70',
    description: 'Двухместное кресло с подъемным подлокотником',
    isDouble: true
  },
  recliner: {
    type: 'recliner',
    price: 30,
    label: 'Реклайнер',
    icon: <Armchair className="w-4 h-4 text-white" />,
    color: 'bg-red-500/70',
    description: 'Кресло-реклайнер с беспроводной зарядкой'
  }
};

const getHallConfig = (hallId: number): HallConfig => {
  switch(hallId) {
    case 1: // Стандартный зал
      return {
        rows: [
          { number: 1, seats: 5, type: 'sofa', spacing: 'extraWide' },
          { number: 2, seats: 10, type: 'standard', spacing: 'normal' },
          { number: 3, seats: 10, type: 'standard', spacing: 'normal' },
          { number: 4, seats: 10, type: 'standard', spacing: 'normal' },
          { number: 5, seats: 10, type: 'standard', spacing: 'normal' },
          { number: 6, seats: 10, type: 'standard', spacing: 'normal' },
          { number: 7, seats: 10, type: 'standard', spacing: 'normal' },
          { number: 8, seats: 10, type: 'standard', spacing: 'normal' },
          { number: 9, seats: 8, type: 'loveSeat', spacing: 'wide' }
        ], 
        takenSeats: ['1-2', '1-3', '2-5', '3-7', '4-2', '5-8', '6-3', '7-6', '8-1', '9-4']
      }; 
    case 2: // Комфортный зал
      return {
        rows: [
          { number: 1, seats: 5, type: 'sofa', spacing: 'extraWide' },
          { number: 2, seats: 10, type: 'standard', spacing: 'normal' },
          { number: 3, seats: 10, type: 'standard', spacing: 'normal' },
          { number: 4, seats: 10, type: 'standard', spacing: 'normal' },
          { number: 5, seats: 10, type: 'standard', spacing: 'normal' },
          { number: 6, seats: 10, type: 'standard', spacing: 'normal' },
          { number: 7, seats: 10, type: 'standard', spacing: 'normal' },
          { number: 8, seats: 10, type: 'standard', spacing: 'normal' },
          { number: 9, seats: 8, type: 'loveSeat', spacing: 'wide' },
          { number: 10, seats: 6, type: 'recliner', spacing: 'wide' }
        ], 
        takenSeats: ['1-2', '1-3', '2-5', '3-7', '4-2', '5-8', '6-3', '7-6', '8-1', '9-4', '10-2']
      }; 
      case 3: // VIP зал (бывший семейный)
      return {
        rows: [ 
          { number: 1, seats: 8, type: 'loveSeat', spacing: 'normal' },
          { number: 2, seats: 8, type: 'loveSeat', spacing: 'normal' },
          { number: 3, seats: 8, type: 'recliner', spacing: 'normal' },
          { number: 4, seats: 8, type: 'recliner', spacing: 'normal' },
          { number: 5, seats: 6, type: 'sofa', spacing: 'wide' },
          { number: 6, seats: 6, type: 'sofa', spacing: 'wide' }
        ], 
        takenSeats: ['1-3', '2-5', '3-2', '4-7', '5-4', '6-1']
      };
    default:
      return {
        rows: [],
        takenSeats: []
      };
  }
}; 

const Booking: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const location = useLocation();
  const movie = location.state?.movie as Movie;
  const bookingType = location.state?.bookingType as 'full' | 'quick';
  const sessionData = location.state?.sessionData as SessionData;

  const [selectedDate, setSelectedDate] = useState<Date>(bookingType === 'quick' ? new Date(sessionData.date) : startOfDay(new Date()));
  const [selectedTime, setSelectedTime] = useState<string>(bookingType === 'quick' ? sessionData.time : '');
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [availableTimes, setAvailableTimes] = useState<{time: string, hallId: number}[]>([]);
  const [currentSeat, setCurrentSeat] = useState<string | null>(null);
  const [selectedTicketType, setSelectedTicketType] = useState<string>('standard');
  const [currentTime] = useState<Date>(new Date());
  const [hallConfig, setHallConfig] = useState<HallConfig>({rows: [], takenSeats: []});

  useEffect(() => {
    if (bookingType === 'quick') {
      setHallConfig(getHallConfig(sessionData.hallId));
    }
  }, [bookingType, sessionData]);

  useEffect(() => {
    const storedSchedule = localStorage.getItem('cinema_schedule');
    if (storedSchedule) {
      const schedule: ScheduleItem[] = JSON.parse(storedSchedule);
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');

      const movieSessions = schedule.filter(
        s => s.movieId === movie.id && s.date === formattedDate
      ); 

      const now = currentTime;
      const futureTimes = movieSessions
        .filter(session => {
          const [hours, minutes] = session.time.split(':').map(Number);
          const sessionTime = new Date(selectedDate);
          sessionTime.setHours(hours, minutes);
          return isAfter(sessionTime, now);
        }) 
        .sort((a, b) => a.time.localeCompare(b.time))
        .map(session => ({ time: session.time, hallId: session.hallId }));

      setAvailableTimes(futureTimes);
    } 
  }, [selectedDate, movie.id, currentTime]);

  useEffect(() => {
    if (selectedTime) {
      const session = availableTimes.find(t => t.time === selectedTime);
      if (session) {
        setHallConfig(getHallConfig(session.hallId));
      }
    }
  }, [selectedTime, availableTimes]); 

  const getDayLabel = (date: Date) => {
    const today = startOfDay(new Date());
    if (isSameDay(date, today)) return 'Сегодня';
    return format(date, 'EEE, d MMM', { locale: shortRuLocale });
  }; 

  const visibleDates = Array.from({ length: 7 }, (_, i) => 
    startOfDay(new Date(currentTime.getTime() + i * 24 * 60 * 60 * 1000))
  ); 

  const handleSeatClick = (seat: string) => {
    if (selectedSeats.includes(seat)) {
      handleRemoveSeat(seat);
      return;
    }  
    setCurrentSeat(seat);
    if (!selectedSeats.includes(seat)) {
      setSelectedSeats(prev => [...prev, seat]);
    }
  }; 

  const handleRemoveSeat = (seat: string) => {
    setSelectedSeats(prev => prev.filter(s => s !== seat));
  }; 

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setSelectedTime('');
    setSelectedSeats([]);
  }; 

  const getSeatInfo = (seatType: SeatType) => {
    return seatTypes[seatType] || seatTypes.standard;
  }; 

  const renderSeatIcon = (icon: React.ReactElement<LucideProps>, className: string) => {
    return React.cloneElement(icon, { className });
  }; 

  const calculateSeatPositions = (row: { seats: number; type: SeatType; spacing: 'normal' | 'wide' | 'extraWide'; number: number }) => {
    const rowWidth = 600;
    const seatInfo = seatTypes[row.type];
    const isDoubleSeat = seatInfo.isDouble;
    const seatWidth = isDoubleSeat ? 48 : 32;
    const totalSeatsWidth = row.seats * seatWidth;
    const remainingSpace = rowWidth - totalSeatsWidth;
    const gapBetweenSeats = Math.floor(remainingSpace / (row.seats + 1));
    
    return Array(row.seats).fill(null).map((_, seatIndex) => {
      const seatId = `${row.number}-${seatIndex + 1}`;
      const isTaken = hallConfig.takenSeats.includes(seatId);
      const isSelected = selectedSeats.includes(seatId);
      
      return (
        <div 
          key={seatId}
          className="relative group"
          style={{ margin: `0 ${gapBetweenSeats/2}px` }}
        >
          <button
            onClick={() => handleSeatClick(seatId)}
            disabled={isTaken}
            className={`
              flex items-center justify-center relative transition-all duration-300
              ${isDoubleSeat ? 'w-12 h-6' : 'w-8 h-8'}
              ${isTaken ? 'cursor-not-allowed' : 
                isSelected ? 'text-cinema-accent' : 'text-white/50 hover:text-white/80'
              }
              transform group-hover:scale-125 group-hover:z-10
            `}
          >
            <div className={`
              absolute inset-0 rounded-md ${seatInfo.color} 
              ${isTaken ? 'opacity-30' : 'opacity-70'} 
              transition-all duration-300
              group-hover:shadow-lg group-hover:shadow-white/20
            `} />
            {React.cloneElement(seatInfo.icon, {
              className: `${isDoubleSeat ? 'w-4 h-4' : 'w-3 h-3'} ${
                isTaken ? 'text-red-500/80' : 
                isSelected ? 'text-cinema-accent' : 'text-white/80'
              }`
            })}
          </button>
          <div className="
            absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1
            bg-gray-800 rounded text-xs text-white whitespace-nowrap
            opacity-0 group-hover:opacity-100 transition-opacity duration-200
            pointer-events-none text-center
          ">
            <div>{seatInfo.label}</div>
            <div className="text-cinema-accent">{seatInfo.price} BYN</div>
            <div>Ряд {row.number}, Место {seatIndex + 1}</div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {movie?.backgroundImageUrl && (
        <div className="relative h-80 w-full overflow-hidden">
          <img 
            src={movie.backgroundImageUrl} 
            alt={movie.title}
            className="w-full h-full object-cover"
          /> 
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/30"></div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900 to-transparent"></div>
        </div>
      )} 

      <section className="px-8 py-6 text-cinema-text relative z-10 -mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">{movie?.title}</h1>
              <div className="flex gap-4 text-gray-400 mt-2">
                <span>{movie?.duration}</span>
                <span>|</span>
                <span>{movie?.genre}</span>
              </div>
            </div>
            <Clock3 className="text-cinema-accent w-10 h-10" />
          </div>

          {bookingType === 'full' && (
            <>
              <div className="mb-8">
                <div className="flex overflow-x-auto gap-2 py-2 scrollbar-hide">
                  {visibleDates.map((date) => {
                    const isSelected = isSameDay(date, selectedDate);
                    return (
                      <button
                        key={date.toString()}
                        onClick={() => handleDateChange(date)}
                        className={`flex flex-col items-center min-w-[120px] px-4 py-3 rounded-md whitespace-nowrap border 
                         transition-all duration-300 ease-out
                         ${isSelected
                          ? 'bg-cinema-accent text-white shadow-lg shadow-cinema-accent/40'
                          : 'bg-white/5 text-white border-white/20 hover:bg-white/15 hover:shadow-md hover:shadow-white/10'
                        }`}
                      > 
                        <span className="text-sm font-medium">
                          {getDayLabel(date)}
                        </span>
                      </button>
                    );
                  })} 
                </div>
              </div> 

              {availableTimes.length > 0 ? (
                <div className="flex flex-wrap gap-4 mb-10">
                  {availableTimes.map(({time, hallId}) => (
                    <button
                      key={time}
                      onClick={() => {
                        setSelectedTime(time);
                        setSelectedSeats([]);
                      }} 
                      className={`px-6 py-3 rounded-md text-lg font-medium flex flex-col items-start
                        ${selectedTime === time
                         ? 'bg-cinema-accent text-white shadow-lg shadow-cinema-accent/40'
                         : 'bg-white/5 text-white hover:bg-white/10'
                       }`}
                    >
                      <span>{time}</span>
                      <span className="text-sm text-gray-300 mt-1">
                        {hallNames[hallId] || `Зал ${hallId}`}
                      </span>
                    </button>
                  ))} 
                </div>
              ) : ( 
                <div className="mb-10 p-4 bg-white/5 rounded-lg text-white">
                  На выбранную дату сеансов нет
                </div>
              )}
            </>
          )} 

          {bookingType === 'quick' && (
            <div className="mb-10 p-4 bg-white/5 rounded-lg border border-white/10">
              <h3 className="text-xl font-bold text-white mb-2">Выбранный сеанс</h3>
              <div className="flex flex-wrap gap-4 text-gray-300">
                <div>
                  <span className="text-cinema-accent">Дата: </span>
                  {getDayLabel(new Date(sessionData.date))}
                </div>
                <div className="flex flex-col bg-cinema-accent/20 px-3 py-2 rounded">
                  <span className="text-cinema-accent">Время: </span>
                  {sessionData.time}
                  <span className="text-cinema-accent">Зал: </span>
                  {hallNames[sessionData.hallId] || sessionData.hall}
                </div>
              </div>
            </div>
          )}

          {selectedTime && (
            <> 
              <div className="relative mb-8">
                <div className="h-2 bg-gradient-to-r from-transparent via-cinema-accent/80 to-transparent rounded-full w-full mx-auto" />
                <div className="text-center mt-2 text-gray-300 tracking-widest font-medium">ЭКРАН</div>
              </div> 

              <div className="flex justify-center mb-10 relative hall-container">
                <div className="flex flex-col">
                  <div className="bg-gray-800/50 p-6 rounded-lg">
                    {hallConfig.rows.map((row) => (
                      <div key={row.number} className="flex items-center mb-2 last:mb-0">
                        <div className="w-8 text-right pr-2 text-gray-400 text-sm">
                          {row.number}
                        </div>
                        <div className="flex justify-center" style={{ width: '600px' }}>
                          {calculateSeatPositions(row)}
                        </div>
                        <div className="w-8 text-left pl-2 text-gray-400 text-sm">
                          {row.number}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div> 

              <div className="flex justify-center gap-8 mb-10 text-sm text-gray-400 flex-wrap">
                {Object.values(seatTypes).map((type) => (
                  <div key={type.type} className="flex items-center gap-2">
                    {renderSeatIcon(
                      type.icon,
                      `w-5 h-5 ${type.color} ${(type.type === 'sofa' || type.type === 'loveSeat') ? 'w-10 h-5' : ''} rounded-sm`
                    )}
                    {type.label}
                  </div>
                ))} 
                <div className="flex items-center gap-2">
                  <Armchair className="w-5 h-5 fill-red-500/30 stroke-red-500/80" />
                  Занято
                </div>
              </div>
            </>
          )} 

{currentSeat && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
              <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
                <h3 className="text-xl font-bold text-white mb-4">
                  Выбор билета для места {currentSeat}
                </h3>
                <div className="space-y-3 mb-6">
                  {ticketTypes.map(ticket => {
                    const rowNumber = parseInt(currentSeat.split('-')[0]);
                    const seatType = hallConfig.rows.find(r => r.number === rowNumber)?.type || 'standard';
                    const price = ticket.prices[seatType];

                    return (
                      <div 
                        key={ticket.id}
                        onClick={() => setSelectedTicketType(ticket.id)}
                        className={`p-3 rounded-lg border cursor-pointer 
                          ${selectedTicketType === ticket.id ? 'border-cinema-accent' : 'border-gray-600'}`}
                      >
                        <div className="flex justify-between">
                          <span>{ticket.name}</span>
                          <span>{price} BYN</span>
                        </div>
                      </div>
                    );
                  })}
      </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => {
                      handleRemoveSeat(currentSeat);
                      setCurrentSeat(null);
                    }} 
                    className="px-4 py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600"
                  > 
                    Отмена
                  </button>
                  <button
                    onClick={() => setCurrentSeat(null)}
                    className="px-4 py-2 text-white bg-cinema-accent rounded-lg hover:bg-cinema-accent/90"
                  > 
                    Применить 
                  </button>
                </div>
              </div>
            </div>
          )}

          {selectedSeats.length > 0 && ( 
            <div className="mb-6 bg-white/5 rounded-lg p-4">
              <h3 className="text-lg font-bold text-white mb-3">Выбранные места</h3>
              <div className="flex flex-wrap gap-3">
                {selectedSeats.map((seat) => {
                  const [row] = seat.split('-');
                  const seatType = hallConfig.rows.find(r => r.number === parseInt(row))?.type || 'standard';
                  const seatInfo = getSeatInfo(seatType);
 
                  return (
                    <div 
                      key={seat}
                      className="bg-cinema-accent/30 border border-cinema-accent rounded-lg px-3 py-2 flex items-center"
                    >
                      <div className={`w-4 h-4 ${seatInfo.color} rounded-sm mr-2`}></div>
                      <span className="font-medium text-white">{seat}</span>
                      <span className="mx-2 text-gray-300">|</span>
                      <span className="text-gray-300">{seatInfo.label} - {seatInfo.price} BYN</span>
                      <button 
                        onClick={() => handleRemoveSeat(seat)}
                        className="ml-2 text-gray-300 hover:text-white"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )} 

          <div className="flex justify-end">
            <button
              disabled={selectedSeats.length === 0}
              className={`bg-cinema-accent text-white py-4 px-10 rounded-full text-lg font-bold transition-all
                ${selectedSeats.length > 0 
                  ? 'hover:bg-cinema-accent/90 hover:shadow-lg hover:shadow-cinema-accent/40'
                  : 'opacity-50 cursor-not-allowed'
                }`}
            > 
              Перейти к оплате →
            </button>
          </div>
        </div>
      </section>

      <div className="h-32 bg-gradient-to-t from-gray-900 to-transparent w-full"></div>
    </div>
  );
};

export default Booking;