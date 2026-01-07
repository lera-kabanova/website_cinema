import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  BarChart3, 
  Ticket, 
  Video,
  TrendingUp,
  Film,
  Bell,
  Settings as SettingsIcon,
  LogOut,
  Loader2
} from 'lucide-react';
import BookingsHistory from './BookingsHistory';
import ScheduleManagement from './ScheduleManagement';
import HallsManagement from './HallsManagement';
import Statistics from './Statistics';
import { adminApi } from '@/lib/adminApi';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

type TabId = 'bookings' | 'schedule' | 'halls' | 'statistics';

interface QuickStats {
  todayBookings: number;
  revenue: number;
  occupancy: number;
  activeSchedules: number;
}

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('bookings');
  const [stats, setStats] = useState<QuickStats>({
    todayBookings: 0,
    revenue: 0,
    occupancy: 0,
    activeSchedules: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const { logout } = useAuth();
  
  const tabs = [
    { id: 'bookings', label: 'История билетов', icon: Ticket, component: BookingsHistory },
    { id: 'schedule', label: 'Расписание', icon: Calendar, component: ScheduleManagement },
    { id: 'halls', label: 'Залы', icon: Video, component: HallsManagement },
    { id: 'statistics', label: 'Статистика', icon: BarChart3, component: Statistics },
  ] as const;

  const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || BookingsHistory;

  useEffect(() => {
    loadQuickStats();
  }, []);

  const loadQuickStats = async () => {
    try {
      setLoadingStats(true);
      const today = new Date().toISOString().split('T')[0];
      
      const [bookings, schedules, movieStats] = await Promise.all([
        adminApi.getBookings({ startDate: today, endDate: today }),
        adminApi.getSchedules({ isActive: true, startDate: today }),
        adminApi.getMovieStatistics({ startDate: today, endDate: today }),
      ]);

      const confirmedBookings = bookings.filter(b => b.status === 'Confirmed');
      const revenue = confirmedBookings.reduce((sum, b) => sum + b.finalPrice, 0);
      const totalTickets = confirmedBookings.length;
      
      // Подсчет заполняемости: считаем от общего количества мест во всех залах за сегодня
      // Для каждого сеанса берем вместимость зала и суммируем
      const totalCapacity = schedules.reduce((sum, s) => {
        const capacity = s.hall?.capacity || 0;
        return sum + capacity;
      }, 0);
      
      // Заполняемость = количество проданных билетов / общая вместимость всех залов * 100
      const occupancy = totalCapacity > 0 ? (totalTickets / totalCapacity) * 100 : 0;

      setStats({
        todayBookings: totalTickets,
        revenue,
        occupancy: Math.round(occupancy),
        activeSchedules: schedules.length,
      });
    } catch (error: any) {
      console.error('Ошибка загрузки статистики:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleAction = (msg: string) => {
    if (msg === 'Выход из системы') {
      logout();
      toast.success('Выход', {
        description: 'Вы успешно вышли из системы',
      });
    } else {
      toast.info('Уведомление', {
        description: `Функция "${msg}" будет реализована в ближайшее время`,
      });
    }
  };

  return (
    <main className="px-4 md:px-8 py-6 space-y-8 max-w-7xl mx-auto min-h-screen">
      {/* Modern Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-8">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-cinema-accent">CINE<span className="text-foreground">ADMIN</span></h1>
          <p className="text-muted-foreground mt-2 text-sm font-medium">Управление контентом и аналитика бронирований</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-card border border-border p-1 rounded-2xl shadow-glass">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabId)}
                  className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-cinema-accent text-white shadow-lg shadow-cinema-accent/30 scale-105' 
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>
          
          <div className="h-10 w-[1px] bg-border mx-2 hidden sm:block"></div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => handleAction('Уведомления')}
              className="p-2.5 bg-card border border-border rounded-xl text-muted-foreground hover:text-cinema-accent transition-colors"
              title="Уведомления"
            >
              <Bell className="h-5 w-5" />
            </button>
            <button 
              onClick={() => handleAction('Настройки системы')}
              className="p-2.5 bg-card border border-border rounded-xl text-muted-foreground hover:text-cinema-accent transition-colors"
              title="Настройки"
            >
              <SettingsIcon className="h-5 w-5" />
            </button>
            <button 
              onClick={() => handleAction('Выход из системы')}
              className="p-2.5 bg-card border border-border rounded-xl text-muted-foreground hover:text-red-500 transition-colors"
              title="Выйти"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loadingStats ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-zinc-800 rounded w-24 mb-2"></div>
                <div className="h-8 bg-zinc-800 rounded w-32"></div>
              </div>
            ))}
          </>
        ) : (
          <>
            <StatCard 
              title="Брони за сегодня" 
              value={stats.todayBookings.toString()} 
              icon={Ticket} 
              color="text-green-500" 
              bgColor="bg-green-500/10"
            />
            <StatCard 
              title="Выручка" 
              value={`${stats.revenue.toFixed(2)} BYN`} 
              icon={TrendingUp} 
              color="text-cinema-accent" 
              bgColor="bg-cinema-accent/10"
            />
            <StatCard 
              title="Заполняемость" 
              value={`${stats.occupancy}%`} 
              icon={Film} 
              color="text-blue-500" 
              bgColor="bg-blue-500/10"
            />
            <StatCard 
              title="Активные сеансы" 
              value={stats.activeSchedules.toString()} 
              icon={Calendar} 
              color="text-purple-500" 
              bgColor="bg-purple-500/10"
            />
          </>
        )}
      </div>

      {/* Active Section Content */}
      <div className="animate-fade-in bg-card border border-border rounded-3xl p-6 md:p-8 shadow-glass">
        <ActiveComponent />
      </div>
    </main>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, bgColor }) => (
  <div className="bg-card border border-border rounded-2xl p-6 hover:border-cinema-accent/40 transition-all duration-300 shadow-soft group">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-black">{value}</p>
      </div>
      <div className={`p-4 ${bgColor} rounded-2xl group-hover:scale-110 transition-transform`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
    </div>
  </div>
);

export default AdminPanel;