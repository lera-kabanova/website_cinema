import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from 'sonner';
import { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface AuthFormProps {
  onSuccess?: () => void;
  onClose?: () => void;
}

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export function AuthForm({ onSuccess, onClose }: AuthFormProps) {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

const validateForm = (): boolean => {
  const newErrors: FormErrors = {};

  // Шаг 1: Валидация email
  if (!formData.email) {
    newErrors.email = "Email обязателен";
    setErrors(newErrors);
    return false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    newErrors.email = "Некорректный email";
    setErrors(newErrors);
    return false;
  }

  // Шаг 2: Валидация пароля
  if (!formData.password) {
    newErrors.password = "Пароль обязателен";
    setErrors(newErrors);
    return false;
  } else if (!isLogin) {
    if (formData.password.length < 6) {
      newErrors.password = "Минимум 6 символов";
      setErrors(newErrors);
      return false;
    } else if (!/\D/.test(formData.password)) {
      newErrors.password = "Пароль должен содержать хотя бы один символ";
      setErrors(newErrors);
      return false;
    }
  }

  // Шаг 3: Подтверждение пароля (только при регистрации)
  if (!isLogin && formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = "Пароли не совпадают";
    setErrors(newErrors);
    return false;
  }

  // Если все успешно
  setErrors({});
  return true;
};



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleTabChange = (isLoginTab: boolean) => {
    setIsLogin(isLoginTab);
    setFormData({ email: '', password: '', confirmPassword: '' });
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const endpoint = isLogin ? "login" : "register";
    const url = `http://localhost:5218/api/auth/${endpoint}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          email: formData.email, 
          password: formData.password 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || 
          (isLogin ? "Ошибка входа" : "Ошибка регистрации")
        );
      }

      const data = await response.json();

      if (isLogin && data.token) {
        login(data.token, formData.email);
        toast.success("Вы успешно вошли в систему");
      } else if (!isLogin) {
        toast.success("Регистрация успешна. Теперь вы можете войти в систему");
        setIsLogin(true);
        setFormData({ email: '', password: '', confirmPassword: '' });
      }

      if (onSuccess) onSuccess();
    } catch (error: any) {
      let errorMessage = error.message;

      if (errorMessage.includes("Email уже используется")) {
  setErrors({ email: "Email уже используется" });
} else if (errorMessage.includes("Некорректный email")) {
  setErrors({ email: "Некорректный email" });
} else if (errorMessage.includes("Неверный пароль")) {
  setErrors({ password: "Неверный пароль" });
} else {
  toast.error(errorMessage);
}

      

    }
  };

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 relative overflow-visible">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute -right-2 -top-2 p-1 rounded-full bg-gray-700 text-gray-300 hover:text-white transition-colors shadow-lg hover:bg-gray-600"
          aria-label="Закрыть форму"
        >
          <X className="h-5 w-5" />
        </button>
      )}

      <div className="flex mb-6 border-b">
        <button
          type="button"
          className={`px-4 py-2 font-bold text-white ${
            isLogin
              ? "border-b-4 border-cinema-accent"
              : "text-white opacity-60"
          }`}
          onClick={() => handleTabChange(true)}
        >
          Вход
        </button>
        <button
          type="button"
          className={`px-4 py-2 font-bold text-white ${
            !isLogin
              ? "border-b-4 border-cinema-accent"
              : "text-white opacity-60"
          }`}
          onClick={() => handleTabChange(false)}
        >
          Регистрация
        </button>
      </div>

      <p className="mb-6 text-sm text-gray-400 dark:text-gray-300">
        {isLogin ? (
          <>
            Для входа используйте свой{" "}
            <span className="font-semibold text-white">email</span> и{" "}
            <span className="font-semibold text-white">пароль</span>.<br />
            Если вы новый пользователь – зарегистрируйтесь.
          </>
        ) : (
          <>Создайте новый аккаунт для доступа к системе.</>
        )}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <div className="relative">
            <Input
              id="email"
              name="email"
              type="text"
              required
              placeholder=" "
              className={`peer bg-gray-700 text-white pt-4 pb-1 px-3 h-12 ${
                errors.email ? "border-red-500" : ""
              }`}
              value={formData.email}
              onChange={handleInputChange}
            />
            <label
              htmlFor="email"
              className="absolute left-3 top-1 text-xs text-gray-400 transition-all 
                peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5
                peer-focus:top-1 peer-focus:text-xs"
            >
              Email
            </label>
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div className="space-y-1">
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              placeholder=" "
              className={`peer bg-gray-700 text-white pt-4 pb-1 px-3 h-12 ${
                errors.password ? "border-red-500" : ""
              }`}
              value={formData.password}
              onChange={handleInputChange}
            />
            <label
              htmlFor="password"
              className="absolute left-3 top-1 text-xs text-gray-400 transition-all 
                peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5
                peer-focus:top-1 peer-focus:text-xs"
            >
              Пароль
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-white"
              tabIndex={-1}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        {!isLogin && (
          <div className="space-y-1">
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                required
                placeholder=" "
                className={`peer bg-gray-700 text-white pt-4 pb-1 px-3 h-12 ${
                  errors.confirmPassword ? "border-red-500" : ""
                }`}
                value={formData.confirmPassword}
                onChange={handleInputChange}
              />
              <label
                htmlFor="confirmPassword"
                className="absolute left-3 top-1 text-xs text-gray-400 transition-all 
                  peer-placeholder-shown:text-sm peer-placeholder-shown:top-3.5
                  peer-focus:top-1 peer-focus:text-xs"
              >
                Подтвердите пароль
              </label>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-white"
                tabIndex={-1}
              >
                {showConfirmPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.522 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.478 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>
        )}

        {isLogin && (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(!!checked)}
                className="h-5 w-5 border-2 border-gray-400 data-[state=checked]:border-cinema-accent rounded-md"
              />
              <label
                htmlFor="remember"
                className="text-sm text-gray-400 select-none cursor-pointer"
              >
                Запомнить меня
              </label>
            </div>
            <button
              type="button"
              className="text-sm text-gray-400 hover:text-white hover:underline"
            >
              Забыли пароль?
            </button>
          </div>
        )}

        <Button
          type="submit"
          className="w-full py-2 bg-cinema-accent hover:bg-cinema-mouse text-white font-bold"
        >
          {isLogin ? "Войти" : "Зарегистрироваться"}
        </Button>
      </form>
    </div>
  );
}