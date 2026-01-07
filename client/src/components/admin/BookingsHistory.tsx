import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Calendar as CalendarIcon, CheckCircle, XCircle, ChevronLeft, ChevronRight, MoreHorizontal, Download, Loader2 } from 'lucide-react';
import { adminApi, Booking } from '@/lib/adminApi';
import { toast } from 'sonner';

const BookingsHistory: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    loadBookings();
  }, [startDate, endDate]);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      const data = await adminApi.getBookings(params);
      setBookings(data);
    } catch (error: any) {
      toast.error('Ошибка загрузки', {
        description: error.message || 'Не удалось загрузить билеты',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const matchesSearch = 
        booking.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
        booking.schedule?.movie?.title?.toLowerCase().includes(search.toLowerCase()) ||
        booking.id.toString().includes(search.toLowerCase());

      return matchesSearch;
    });
  }, [bookings, search]);

  const clearFilters = () => {
    setSearch('');
    setStartDate('');
    setEndDate('');
  };

  const handleExport = () => {
    try {
      // Создаем CSV контент
      const headers = ['ID', 'Email', 'Фильм', 'Зал', 'Дата', 'Время', 'Место', 'Цена (BYN)', 'Статус'];
      const rows = filteredBookings.map(b => [
        b.id.toString(),
        b.user?.email || '',
        b.schedule?.movie?.title || '',
        b.schedule?.hall?.name || '',
        b.schedule?.date || '',
        b.schedule?.time || '',
        b.seat,
        b.finalPrice.toFixed(2),
        b.status,
      ]);

      // Конвертируем в CSV формат
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Создаем blob и скачиваем
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const date = new Date().toLocaleDateString('ru-RU').replace(/\//g, '_');
      link.download = `bookings_${date}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Успешно', {
        description: 'Отчет успешно экспортирован',
      });
    } catch (error: any) {
      toast.error('Ошибка', {
        description: error.message || 'Не удалось экспортировать отчет',
      });
    }
  };

  const handleCancelBooking = async (id: number) => {
    if (!confirm('Вы уверены, что хотите отменить этот билет?')) {
      return;
    }

    try {
      setCancellingId(id);
      await adminApi.cancelBooking(id);
      toast.success('Успешно', {
        description: 'Билет успешно отменен',
      });
      await loadBookings();
    } catch (error: any) {
      toast.error('Ошибка', {
        description: error.message || 'Не удалось отменить билет',
      });
    } finally {
      setCancellingId(null);
    }
  };

  const handleDetails = (booking: Booking) => {
    // TODO: Реализовать модальное окно с деталями
    toast.info('Детали билета', {
      description: `Билет #${booking.id} - ${booking.schedule?.movie?.title || 'Неизвестно'}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-8">
        <h3 className="text-2xl font-black uppercase tracking-tight">История бронирований</h3>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 px-6 py-2.5 bg-cinema-accent text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-cinema-mouse transition-all shadow-lg shadow-cinema-accent/20"
        >
          <Download className="h-4 w-4" />
          Экспорт отчета
        </button>
      </div>

      {/* Filtering Toolbar */}
      <div className="bg-background/50 border border-border rounded-2xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">Поиск по данным</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Email, ID или фильм..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:ring-2 focus:ring-cinema-accent/30 focus:border-cinema-accent outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">От даты</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-cinema-accent/30 appearance-none" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">До даты</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm outline-none focus:ring-2 focus:ring-cinema-accent/30 appearance-none" 
              />
            </div>
          </div>

          <button 
            onClick={clearFilters}
            className="w-full py-2.5 text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-cinema-accent border border-dashed border-border rounded-xl transition-colors h-[42px]"
          >
            Сбросить фильтры
          </button>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-card border border-border rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-border">
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">ID</th>
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Клиент</th>
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Фильм</th>
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Детали сеанса</th>
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Сумма</th>
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Статус</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="h-8 w-8 animate-spin text-cinema-accent" />
                      <p className="text-muted-foreground font-bold uppercase tracking-widest">Загрузка...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-white/[0.03] transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-bold text-muted-foreground group-hover:text-cinema-accent transition-colors">
                      #{booking.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold">{booking.user?.email || 'Неизвестно'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {booking.schedule?.movie?.imageUrl && (
                        <div className="w-8 h-12 bg-zinc-900 rounded-lg flex-shrink-0 overflow-hidden border border-border">
                          <img src={booking.schedule.movie.imageUrl} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <p className="text-sm font-bold leading-tight">{booking.schedule?.movie?.title || 'Неизвестно'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-foreground">{booking.schedule?.hall?.name || 'Неизвестно'}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {booking.schedule?.date} {booking.schedule?.time}
                      </p>
                      <span className="inline-block px-2 py-0.5 rounded-md bg-cinema-accent/10 text-cinema-accent text-[9px] font-black uppercase">
                        {booking.seat}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-black text-cinema-accent">{booking.finalPrice.toFixed(2)} BYN</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {booking.status === 'Confirmed' ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-[10px] font-black text-green-500 uppercase">Подтвержден</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span className="text-[10px] font-black text-red-500 uppercase">Отменен</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {booking.status === 'Confirmed' && (
                        <button 
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={cancellingId === booking.id}
                          className="p-2 hover:bg-red-500/10 rounded-xl transition-colors text-muted-foreground hover:text-red-500 disabled:opacity-50"
                          title="Отменить билет"
                        >
                          {cancellingId === booking.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                        </button>
                      )}
                      <button 
                        onClick={() => handleDetails(booking)}
                        className="p-2.5 hover:bg-zinc-800 rounded-xl transition-colors group-hover:bg-white/5"
                      >
                        <MoreHorizontal className="h-5 w-5 text-muted-foreground group-hover:text-cinema-accent" />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-32 text-center">
                    <div className="flex flex-col items-center gap-4 text-muted-foreground">
                      <div className="p-6 bg-white/5 rounded-full border border-dashed border-border">
                        <Filter className="h-10 w-10 opacity-30" />
                      </div>
                      <p className="font-bold uppercase tracking-widest">Бронирований не найдено</p>
                      <button onClick={clearFilters} className="text-cinema-accent text-sm font-bold hover:underline">Сбросить фильтры</button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-6 py-5 bg-white/5 border-t border-border flex items-center justify-between">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Показано {filteredBookings.length} из {bookings.length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingsHistory;