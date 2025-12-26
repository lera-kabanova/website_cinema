import { useMemo, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  User, Ticket, Lock, Mail, 
  Eye, EyeOff, QrCode, Calendar,
  Clock, MapPin, ChevronRight,
  LogOut, Check
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
interface Booking {
  id: number;
  movie: {
    id: number;
    title: string;
    posterUrl?: string;
  } | null;
  cinema: string;
  date: string;
  time: string;
  seat: string;
  zone: string;
  finalPrice: number;
  bookingTime: string;
}

const Profile = () => {
  const { email, logout, token } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [tickets, setTickets] = useState<Booking[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  
  const initials = useMemo(() => (email ? email[0]?.toUpperCase() : "U"), [email]);

  // Загрузка билетов пользователя
  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) {
        setLoadingTickets(false);
        return;
      }

      try {
        setLoadingTickets(true);
        const response = await fetch("/api/cinema/bookings/my", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data: Booking[] = await response.json();
          setTickets(data);
        } else {
          console.error("Ошибка загрузки билетов");
        }
      } catch (error) {
        console.error("Ошибка при загрузке билетов:", error);
      } finally {
        setLoadingTickets(false);
      }
    };

    fetchBookings();
  }, [token]);

  // Подсчет статистики
  const ticketCount = tickets.length;
  const uniqueMoviesCount = useMemo(() => {
    const movieIds = new Set(tickets.map(t => t.movie?.id).filter(Boolean));
    return movieIds.size;
  }, [tickets]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Пароли не совпадают");
      return;
    }
    if (!email || !token) {
      toast.error("Ошибка аутентификации");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email,
          oldPassword,
          newPassword,
        }),
      });

      if (response.ok) {
        toast.success("Пароль изменен");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const errorData = await response.json();
        if (errorData.error === "wrong_old_password") {
          toast.error("Неверный текущий пароль");
        } else {
          toast.error("Ошибка при изменении пароля");
        }
      }
    } catch (error) {
      toast.error("Ошибка при изменении пароля");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Вы вышли из аккаунта");
  };

  const stats = [
    { label: "Билетов", value: ticketCount.toString() },
    { label: "Фильмов", value: uniqueMoviesCount.toString() },
  ];

  const tabs = [
    { id: "profile", label: "Профиль", icon: User },
    { id: "tickets", label: "Билеты", icon: Ticket, count: tickets.length },
    { id: "security", label: "Безопасность", icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-foreground flex items-center justify-center text-xl font-medium text-background">
              {initials}
            </div>
            <div>
              <h1 className="text-lg font-medium text-foreground">{email || "Пользователь"}</h1>
              <p className="text-sm text-muted-foreground">Cinema Club Member</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Выйти
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-5 rounded-2xl bg-card border border-border">
              <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-muted mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.count && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-foreground text-background rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-card border border-border">
              <h2 className="text-base font-medium text-foreground mb-6">Личные данные</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-foreground">{email || "Не указан"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-success text-xs">
                    <Check className="w-3.5 h-3.5" />
                    Подтвержден
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border">
              <h2 className="text-base font-medium text-foreground mb-6">Настройки</h2>
              
              <div className="space-y-1">
                {[
                  { label: "Язык интерфейса", desc: "Русский" },
                  { label: "Тема оформления", desc: "Системная" },
                  { label: "Регион", desc: "Россия" },
                ].map((item) => (
                  <button
                    key={item.label}
                    className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-muted transition-colors"
                  >
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tickets Tab */}
        {activeTab === "tickets" && (
          <div className="space-y-4">
            {loadingTickets ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">Загрузка билетов...</p>
              </div>
            ) : tickets.length > 0 ? (
              tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className="p-6 rounded-2xl bg-card border border-border hover:border-foreground/20 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-base font-medium text-foreground">
                        {ticket.movie?.title || "Фильм не указан"}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{ticket.cinema}</p>
                    </div>
                    <Button size="sm" variant="outline" className="gap-2">
                      <QrCode className="w-4 h-4" />
                      QR
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {ticket.date}
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {ticket.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Место {ticket.seat}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16">
                <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-foreground font-medium">Нет билетов</p>
                <p className="text-sm text-muted-foreground mt-1">Забронируйте первый сеанс</p>
              </div>
            )}
          </div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <div className="p-6 rounded-2xl bg-card border border-border">
            <h2 className="text-base font-medium text-foreground mb-6">Смена пароля</h2>
            
            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-sm">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Текущий пароль
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    className="pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Новый пароль
                </label>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">
                  Подтвердите пароль
                </label>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
              </div>
              
              <Button type="submit" disabled={loading} className="w-full mt-2">
                {loading ? "Сохранение..." : "Изменить пароль"}
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
