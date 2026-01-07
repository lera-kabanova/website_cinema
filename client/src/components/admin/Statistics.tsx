import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, PieChart, TrendingUp, DollarSign, Download, Calendar as CalIcon, Loader2 } from 'lucide-react';
import { adminApi, MovieStatistics, DateReport } from '@/lib/adminApi';
import { toast } from 'sonner';

const Statistics: React.FC = () => {
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('week');
  const [loading, setLoading] = useState(true);
  const [movieStats, setMovieStats] = useState<MovieStatistics[]>([]);
  const [dateReports, setDateReports] = useState<DateReport[]>([]);

  useEffect(() => {
    loadStatistics();
  }, [period]);

  const getLocalDateString = (date: Date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
  };

   const loadStatistics = async () => {
    try {
      setLoading(true);
      const today = new Date();
      let startDate: string;
      
      let endDate = getLocalDateString(today); 

      if (period === 'day') {
        startDate = endDate;
      } else if (period === 'week') {
        const weekAgo = new Date(today);
        weekAgo.setDate(today.getDate() - 7);
        startDate = getLocalDateString(weekAgo);
      } else {
        const monthAgo = new Date(today);
        monthAgo.setMonth(today.getMonth() - 1);
        startDate = getLocalDateString(monthAgo);
      }

      console.log(`Запрашиваем статистику с ${startDate} по ${endDate}`);

      const [movies, reports] = await Promise.all([
        adminApi.getMovieStatistics({ startDate, endDate }),
        adminApi.getDateReports({ startDate, endDate, period }),
      ]);
      
      setMovieStats(movies);
      setDateReports(reports);
    } catch (error: any) {
      console.error(error);
      toast.error('Ошибка загрузки', {
        description: error.message || 'Не удалось загрузить статистику',
      });
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const totalRevenue = dateReports.reduce((sum, r) => sum + r.revenue, 0);
    const totalTickets = dateReports.reduce((sum, r) => sum + r.confirmedTicketsCount, 0);
    const avgTicket = totalTickets > 0 ? totalRevenue / totalTickets : 0;

    const topMovies = movieStats
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)
      .map(m => ({
        title: m.movieTitle,
        tickets: m.confirmedTicketsCount, // Количество билетов
        revenue: m.revenue,
      }));

    return {
      rev: totalRevenue.toLocaleString('ru-RU', { maximumFractionDigits: 0 }),
      tickets: totalTickets.toLocaleString('ru-RU'),
      avg: avgTicket.toFixed(2),
      movies: topMovies,
    };
  }, [movieStats, dateReports]);

  const handleExport = () => {
    try {
      const periodText = period === 'day' ? 'сегодняшний день' : period === 'week' ? 'последнюю неделю' : 'текущий месяц';
      const date = new Date().toLocaleDateString('ru-RU');
      
      let content = `ОТЧЕТ ПО АНАЛИТИКЕ ПРОДАЖ\n`;
      content += `Период: ${periodText}\n`;
      content += `Дата формирования: ${date}\n\n`;
      content += `ОБЩАЯ СТАТИСТИКА:\n`;
      content += `Выручка: ${stats.rev} BYN\n`;
      content += `Продано билетов: ${stats.tickets} шт.\n`;
      content += `Средний чек: ${stats.avg} BYN\n\n`;
      content += `ТОП-10 ФИЛЬМОВ ПО ВЫРУЧКЕ:\n`;
      content += `Фильм | Билетов | Выручка (BYN)\n`;
      content += `-`.repeat(50) + `\n`;
      
      stats.movies.forEach((m, idx) => {
        content += `${idx + 1}. ${m.title} | ${m.tickets} | ${m.revenue.toLocaleString('ru-RU')}\n`;
      });

      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics_top10_${period}_${date.replace(/\//g, '_')}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('Успешно', {
        description: 'Отчет (ТОП-10) успешно скачан',
      });
    } catch (error: any) {
      toast.error('Ошибка', {
        description: error.message || 'Не удалось экспортировать отчет',
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-4">
        <h3 className="text-2xl font-black uppercase tracking-tight">Аналитика продаж</h3>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <CalIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cinema-accent" />
            <select 
              value={period} 
              onChange={(e) => setPeriod(e.target.value as 'day' | 'week' | 'month')}
              className="w-full bg-background border border-border rounded-xl pl-10 pr-8 py-2.5 text-xs font-black uppercase tracking-widest outline-none focus:ring-2 focus:ring-cinema-accent/30 cursor-pointer appearance-none"
            >
              <option value="day">Сегодня</option>
              <option value="week">За неделю</option>
              <option value="month">За месяц</option>
            </select>
          </div>
          <button 
            onClick={handleExport}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-cinema-accent text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-cinema-mouse transition-all shadow-lg shadow-cinema-accent/20"
          >
            <Download className="h-4 w-4" />
            ТОП-10 PDF
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard 
          icon={<DollarSign className="h-6 w-6 text-green-500" />} 
          label="Общая выручка" 
          value={`${stats.rev} BYN`}
        />
        <StatCard 
          icon={<BarChart className="h-6 w-6 text-blue-500" />} 
          label="Продано билетов" 
          value={`${stats.tickets} шт.`}
        />
        <StatCard 
          icon={<PieChart className="h-6 w-6 text-purple-500" />} 
          label="Средний чек" 
          value={`${stats.avg} BYN`}
        />
      </div>

      {/* Top Movies Table */}
      <div className="bg-background/50 border border-border rounded-2xl overflow-hidden shadow-soft">
        <div className="px-6 py-5 border-b border-border bg-white/[0.02] flex items-center justify-between">
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">ТОП-10 ФИЛЬМОВ ПО ВЫРУЧКЕ</h4>
          <TrendingUp className="h-5 w-5 text-cinema-accent" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-4 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Фильм</th>
                <th className="px-6 py-4 text-[9px] font-black text-muted-foreground uppercase tracking-widest text-center">Билетов</th>
                <th className="px-6 py-4 text-[9px] font-black text-muted-foreground uppercase tracking-widest text-right">Выручка</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="h-8 w-8 animate-spin text-cinema-accent" />
                      <p className="text-muted-foreground font-bold uppercase tracking-widest">Загрузка...</p>
                    </div>
                  </td>
                </tr>
              ) : stats.movies.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-32 text-center">
                    <div className="flex flex-col items-center gap-4 text-muted-foreground">
                      <BarChart className="h-10 w-10 opacity-30" />
                      <p className="font-bold uppercase tracking-widest">Данных нет</p>
                    </div>
                  </td>
                </tr>
              ) : (
                stats.movies.map((m: any, idx: number) => (
                  <tr key={idx} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                         <span className="text-xs font-black text-muted-foreground w-4">{idx + 1}.</span>
                         <span className="text-sm font-black group-hover:text-cinema-accent transition-colors">{m.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                        <span className="text-sm font-semibold">{m.tickets}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                        <span className="text-sm font-black text-cinema-accent">{m.revenue.toLocaleString('ru-RU')} BYN</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
  <div className="bg-background border border-border rounded-2xl p-6 shadow-soft transition-all select-none">
    <div className="flex items-center gap-5">
      <div className="p-4 bg-zinc-900 border border-border rounded-2xl">
        {icon}
      </div>
      <div>
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-2xl font-black">{value}</p>
      </div>
    </div>
  </div>
);

export default Statistics;