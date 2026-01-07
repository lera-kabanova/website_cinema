import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Edit2, Eye, EyeOff, MoreVertical, Trash2, Loader2, Save, X, Sparkles } from 'lucide-react';
import { adminApi, Schedule } from '@/lib/adminApi';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

const ScheduleManagement: React.FC = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editData, setEditData] = useState<{ date: string; time: string }>({ date: '', time: '' });
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [generating, setGenerating] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getSchedules();
      setSchedules(data);
    } catch (error: any) {
      toast.error('Ошибка загрузки', {
        description: error.message || 'Не удалось загрузить расписание',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (id: number) => {
    try {
      setTogglingId(id);
      const result = await adminApi.toggleScheduleActive(id);
      toast.success('Успешно', {
        description: result.message,
      });
      await loadSchedules();
    } catch (error: any) {
      toast.error('Ошибка', {
        description: error.message || 'Не удалось изменить статус сеанса',
      });
    } finally {
      setTogglingId(null);
    }
  };

  const handleEdit = (schedule: Schedule) => {
    setEditingId(schedule.id);
    setEditData({
      date: schedule.date,
      time: schedule.time,
    });
  };

  const handleSaveEdit = async (id: number) => {
    try {
      await adminApi.updateSchedule(id, {
        date: editData.date,
        time: editData.time,
      });
      toast.success('Успешно', {
        description: 'Сеанс успешно обновлен',
      });
      setEditingId(null);
      await loadSchedules();
    } catch (error: any) {
      toast.error('Ошибка', {
        description: error.message || 'Не удалось обновить сеанс',
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditData({ date: '', time: '' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm(`Вы уверены, что хотите удалить этот сеанс? Это действие нельзя отменить.`)) {
      return;
    }

    try {
      await adminApi.deleteSchedule(id);
      toast.success('Успешно', {
        description: 'Сеанс успешно удален',
      });
      await loadSchedules();
    } catch (error: any) {
      toast.error('Ошибка', {
        description: error.message || 'Не удалось удалить сеанс',
      });
    }
  };

  const handleGenerateSchedule = async () => {
    if (!startDate || !endDate) {
      toast.error('Ошибка', {
        description: 'Пожалуйста, выберите даты начала и окончания',
      });
      return;
    }

    try {
      setGenerating(true);
      const response = await fetch('/api/cinema/schedules/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          startDate: startDate,
          endDate: endDate,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Ошибка генерации расписания' }));
        throw new Error(errorData.message || 'Не удалось сгенерировать расписание');
      }

      toast.success('Успешно', {
        description: 'Расписание успешно сгенерировано',
      });
      await loadSchedules();
      setStartDate('');
      setEndDate('');
    } catch (error: any) {
      toast.error('Ошибка', {
        description: error.message || 'Не удалось сгенерировать расписание',
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
        <h3 className="text-2xl font-black uppercase tracking-tight">Расписание сеансов</h3>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">От:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-xl text-xs outline-none focus:ring-2 focus:ring-cinema-accent/30"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest whitespace-nowrap">До:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-2 bg-background border border-border rounded-xl text-xs outline-none focus:ring-2 focus:ring-cinema-accent/30"
            />
          </div>
          <button 
            onClick={handleGenerateSchedule}
            disabled={generating || !startDate || !endDate}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-cinema-accent text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-cinema-mouse transition-all shadow-lg shadow-cinema-accent/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            СГЕНЕРИРОВАТЬ РАСПИСАНИЕ
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 border-b border-border">
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Фильм</th>
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Зал</th>
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Дата и время</th>
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Заполнение</th>
                <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Статус</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <Loader2 className="h-8 w-8 animate-spin text-cinema-accent" />
                      <p className="text-muted-foreground font-bold uppercase tracking-widest">Загрузка...</p>
                    </div>
                  </td>
                </tr>
              ) : schedules.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-32 text-center">
                    <div className="flex flex-col items-center gap-4 text-muted-foreground">
                      <Calendar className="h-10 w-10 opacity-30" />
                      <p className="font-bold uppercase tracking-widest">Сеансов не найдено</p>
                    </div>
                  </td>
                </tr>
              ) : schedules.map((s) => (
                <tr key={s.id} className="hover:bg-white/[0.03] transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-sm font-black group-hover:text-cinema-accent transition-colors">
                      {s.movie?.title || 'Неизвестно'}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-zinc-900 border border-border rounded-lg text-[10px] text-muted-foreground font-black uppercase tracking-tighter">
                      {s.hall?.name || 'Неизвестно'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {editingId === s.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="date"
                          value={editData.date}
                          onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                          className="px-2 py-1 bg-background border border-border rounded text-xs"
                        />
                        <input
                          type="time"
                          value={editData.time}
                          onChange={(e) => setEditData({ ...editData, time: e.target.value })}
                          className="px-2 py-1 bg-background border border-border rounded text-xs"
                        />
                        <button
                          onClick={() => handleSaveEdit(s.id)}
                          className="p-1 hover:bg-green-500/10 rounded text-green-500"
                          title="Сохранить"
                        >
                          <Save className="h-3 w-3" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="p-1 hover:bg-red-500/10 rounded text-red-500"
                          title="Отменить"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm font-semibold">
                        {s.date} <span className="text-cinema-accent ml-2">{s.time}</span>
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold w-12">{s.bookingsCount} шт.</span>
                      <div className="w-24 h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-border">
                        <div 
                          className="bg-cinema-accent h-full transition-all duration-500" 
                          style={{ width: `${Math.min((s.bookingsCount / (s.hall?.capacity || 100)) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleVisibility(s.id)}
                      disabled={togglingId === s.id}
                      className={`flex items-center gap-2 text-[10px] font-black uppercase transition-colors disabled:opacity-50 ${
                        s.isActive ? 'text-green-500 hover:text-green-400' : 'text-zinc-500 hover:text-zinc-400'
                      }`}
                      title={s.isActive ? "Скрыть сеанс на сайте" : "Сделать сеанс видимым"}
                    >
                      {togglingId === s.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : s.isActive ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )}
                      {s.isActive ? 'Виден' : 'Скрыт'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(s)}
                        disabled={editingId !== null && editingId !== s.id}
                        className="p-2 hover:bg-white/5 rounded-xl transition-colors text-muted-foreground hover:text-foreground disabled:opacity-50"
                        title="Редактировать"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(s.id)}
                        className="p-2 hover:bg-red-500/10 rounded-xl transition-colors text-muted-foreground hover:text-red-500"
                        title="Удалить"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ScheduleManagement;