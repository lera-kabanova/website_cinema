import React, { useState, useEffect } from 'react';
import { DoorOpen, Users, Map, Loader2, Lock, Unlock } from 'lucide-react';
import { adminApi, Hall } from '@/lib/adminApi';
import { toast } from 'sonner';

const HallsManagement: React.FC = () => {
  const [halls, setHalls] = useState<Hall[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  useEffect(() => {
    loadHalls();
  }, []);

  const loadHalls = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getHalls();
      setHalls(data);
    } catch (error: any) {
      toast.error('Ошибка загрузки', {
        description: error.message || 'Не удалось загрузить залы',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleClosed = async (id: number) => {
    try {
      setTogglingId(id);
      const result = await adminApi.toggleHallClosed(id);
      toast.success('Успешно', {
        description: result.message,
      });
      await loadHalls();
    } catch (error: any) {
      toast.error('Ошибка', {
        description: error.message || 'Не удалось изменить статус зала',
      });
    } finally {
      setTogglingId(null);
    }
  };


  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-black uppercase tracking-tight">Конфигурация залов</h3>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-cinema-accent mb-4" />
          <p className="text-muted-foreground font-bold uppercase tracking-widest">Загрузка...</p>
        </div>
      ) : halls.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
          <DoorOpen className="h-10 w-10 opacity-30 mb-4" />
          <p className="font-bold uppercase tracking-widest">Залы не найдены</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {halls.map((hall) => (
            <div key={hall.id} className="bg-background border border-border rounded-2xl p-6 shadow-soft group hover:border-cinema-accent/50 transition-all duration-300">
              <div className="flex items-start justify-between mb-6">
                <div className={`p-4 rounded-2xl border transition-colors ${!hall.isClosed ? 'bg-green-500/10 border-green-500/20' : 'bg-orange-500/10 border-orange-500/20'}`}>
                  <DoorOpen className={`h-6 w-6 ${!hall.isClosed ? 'text-green-500' : 'text-orange-500'}`} />
                </div>
              </div>
              
              <h4 className="text-xl font-black mb-1 group-hover:text-cinema-accent transition-colors">{hall.name}</h4>
              <div className="flex items-center gap-2 mb-6">
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{hall.type}</span>
                <span className={`w-2 h-2 rounded-full ${!hall.isClosed ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]'}`}></span>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-border mb-4">
                <div className="space-y-1">
                  <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Вместимость</p>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-cinema-accent" />
                    <span className="text-sm font-black">{hall.capacity} мест</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Типы зон</p>
                  <div className="flex items-center gap-2">
                    <Map className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-black">{hall.zones.length} типа</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Активных сеансов</span>
                  <span className="text-sm font-black">{hall.activeSchedulesCount}</span>
                </div>
                <button
                  onClick={() => handleToggleClosed(hall.id)}
                  disabled={togglingId === hall.id}
                  className={`w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50 ${
                    hall.isClosed
                      ? 'bg-green-500/10 border border-green-500/20 text-green-500 hover:bg-green-500/20'
                      : 'bg-orange-500/10 border border-orange-500/20 text-orange-500 hover:bg-orange-500/20'
                  }`}
                >
                  {togglingId === hall.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : hall.isClosed ? (
                    <>
                      <Unlock className="h-4 w-4" />
                      Открыть зал
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4" />
                      Закрыть зал
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HallsManagement;