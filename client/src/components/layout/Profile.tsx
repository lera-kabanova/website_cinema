import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { User, Ticket, Lock } from "lucide-react";

const Profile = () => {
  const { email } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Новые пароли не совпадают");
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          email,
          oldPassword,
          newPassword
        })
      });
      const data = await response.json();
      if (!response.ok) {
        if (data?.error === "wrong_old_password") {
          toast.error("пароль не верный");
        } else {
          toast.error(data?.error || "Ошибка при смене пароля");
        }
      } else {
        toast.success("Пароль успешно изменен");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      toast.error("Ошибка при смене пароля");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Личный кабинет</h1>
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Мой профиль
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex items-center gap-2">
              <Ticket className="w-4 h-4" />
              Мои билеты
            </TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-white">Информация профиля</CardTitle>
                <CardDescription className="text-gray-400">
                  Здесь вы можете просмотреть и изменить свои данные
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Email адрес</label>
                    <div className="relative">
                      <Input 
                        value={email || ''} 
                        disabled 
                        className="bg-white/10 border-white/20 text-white pl-10"
                      />
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                    <p className="text-sm text-gray-400">Ваш email используется для входа в систему</p>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-8">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Изменение пароля
                  </h3>
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Текущий пароль</label>
                      <Input
                        type="password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="Введите текущий пароль"
                      />
                      <p className="text-sm text-gray-400">Введите пароль, который вы используете сейчас</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Новый пароль</label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="Введите новый пароль"
                      />
                      <p className="text-sm text-gray-400">Придумайте надежный пароль</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-300">Подтверждение пароля</label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="bg-white/10 border-white/20 text-white"
                        placeholder="Повторите новый пароль"
                      />
                      <p className="text-sm text-gray-400">Введите новый пароль еще раз для подтверждения</p>
                    </div>
                    <Button 
                      type="submit"
                      className="w-full bg-cinema-accent hover:bg-cinema-accent/90 text-white"
                      disabled={loading}
                    >
                      {loading ? "Сохраняем..." : "Сохранить изменения"}
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tickets">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl text-white">История покупок</CardTitle>
                <CardDescription className="text-gray-400">
                  Здесь отображаются все ваши купленные билеты
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">
                    У вас пока нет купленных билетов
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    После покупки билетов они появятся здесь
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile; 