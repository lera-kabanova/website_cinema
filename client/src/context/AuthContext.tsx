import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  token: string | null;
  email: string | null;
  role: string | null;
  isAuthenticated: boolean;
  login: (token: string, email: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedEmail = localStorage.getItem("email");
    const savedRole = localStorage.getItem("role");
    if (savedToken && savedEmail && savedRole) {
      setToken(savedToken);
      setEmail(savedEmail);
      setRole(savedRole);
    }
  }, []);

  const login = (newToken: string, userEmail: string, userRole: string) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("email", userEmail);
    localStorage.setItem("role", userRole);
    setToken(newToken);
    setEmail(userEmail);
    setRole(userRole);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    setToken(null);
    setEmail(null);
    setRole(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, email, role, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
};