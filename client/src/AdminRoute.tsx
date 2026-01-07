import { useAuth } from "@/context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";

interface AdminRouteProps {
  children: ReactNode;
}

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (role !== "Admin") {
    return <Navigate to="/" replace />;
  }

  // Если админ пытается зайти на другие страницы, перенаправляем на админ-панель
  if (location.pathname !== "/admin") {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
};

