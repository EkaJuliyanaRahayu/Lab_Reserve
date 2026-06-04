import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  allowedRoles?: Array<'admin' | 'guru'>;  // kosong = semua role boleh akses
}

/**
 * Bungkus route yang membutuhkan login.
 * Kalau belum login → redirect ke /login (sambil simpan URL tujuan).
 * Kalau sudah login tapi role tidak sesuai → redirect ke /unauthorized.
 */
export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  // Belum login → ke halaman login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role tidak diizinkan
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
