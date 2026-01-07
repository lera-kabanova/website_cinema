import React, { useState, useEffect  } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Search, ShoppingCart, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AuthForm } from "@/components/ui/auth-form";
import { useAuth } from "@/context/AuthContext";

const mainNavItems = [
  { name: "Главная", path: "/" },
  { name: "Афиша", path: "/afisha" },
  { name: "Расписание", path: "/schedule" },
  { name: "Залы", path: "/halls" }
];

const userMenuItems = [
  { name: "Профиль", path: "/профиль" },
  { name: "Настройки", path: "/настройки" },
  { name: "Выйти", path: "/выход" }
];

const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { email, logout, role } = useAuth(); 
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all ${scrolled ? 'backdrop-blur-md bg-white/10' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="text-3xl text-white"
              style={{ 
                fontFamily: "'Racing Sans One', cursive",
                fontWeight: 400,
                letterSpacing: '1px'
              }}
            >
              CINEMA
            </Link>
          </div>

          {/* Десктопная навигация */}
          <nav className="hidden md:flex items-center space-x-1">
            {mainNavItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) => cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "text-white bg-white/20" 
                    : "text-white/80 hover:text-white hover:bg-white/10"
                )}
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-2">
            {email ? (
              <div className="flex items-center space-x-4">
                {role === 'Admin' && (
                  <Link 
                    to="/admin" 
                    className="text-sm text-white hover:text-cinema-accent transition-colors"
                  >
                    Админ-панель
                  </Link>
                )}
                <Link 
                  to="/profile" 
                  className="text-sm text-white hover:text-cinema-accent transition-colors"
                >
                  {email}
                </Link>
                <Button
                  onClick={logout}
                  variant="ghost"
                  className="text-white hover:text-cinema-accent text-sm"
                >
                  Выйти
                </Button>
              </div>
            ) : (
              <Dialog open={authOpen} onOpenChange={setAuthOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-white/80 hover:text-white hover:bg-white/10"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] p-0 border-0 bg-transparent">
                  <AuthForm onSuccess={() => setAuthOpen(false)} />
                </DialogContent>
              </Dialog>
            )}
          </div>

          {/* Мобильное меню */}
          <div className="md:hidden flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white/80 hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Мобильная навигация */}
        {mobileMenuOpen && (
          <div className="md:hidden py-2 bg-white/10 backdrop-blur-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {mainNavItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) => cn(
                    "block px-3 py-2 rounded-md text-base font-medium",
                    isActive 
                      ? "text-white bg-white/20" 
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}
              
              <div className="pt-2 mt-2 border-t border-white/20">
                {email ? (
                  <div className="px-3 py-2 text-white/90 flex flex-col gap-2">
                    {role === 'Admin' && (
                      <Link 
                        to="/admin" 
                        className="text-white/80 hover:text-white transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Админ-панель
                      </Link>
                    )}
                    <Link 
                      to="/profile" 
                      className="text-white/80 hover:text-white transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {email}
                    </Link>
                    <button
                      onClick={logout}
                      className="text-left text-base text-white/80 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md"
                    >
                      Выйти
                    </button>
                  </div>
                ) : (
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white/80 hover:text-white hover:bg-white/10">
                        Войти
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] p-0 border-0 bg-transparent">
                      <AuthForm />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;