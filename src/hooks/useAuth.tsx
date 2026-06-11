import {
  createContext, useContext, useState,
  useCallback, ReactNode,
} from "react";
import { users, User } from "@/data/mockData";

// ── Tipe ────────────────────────────────────────────────────────────────────
type AuthUser = Omit<User, 'password'>;

interface AuthContextType {
  // data
  currentUser: AuthUser | null;
  role: 'admin' | 'guru' | null;
  isAuthenticated: boolean;

  // aksi
  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
}

export type LoginResult =
  | { success: true }
  | { success: false; message: string };

// ── Context ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextType | null>(null);

// ── Provider ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    // Cek session yang tersimpan saat pertama load
    const saved = sessionStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  // ── Login: cek ke mockData (nanti ganti dengan fetch ke Laravel API) ──────
  const login = useCallback(
    async (email: string, password: string): Promise<LoginResult> => {
      // Simulasi network delay seperti request ke backend
      await new Promise(res => setTimeout(res, 800));

      // Cari user berdasarkan email & password
      // ⚠️  Ini mock — di produksi, kirim ke POST /api/login dan terima token
      const found = users.find(
        u => u.email.toLowerCase() === email.toLowerCase()
          && u.password === password
      );

      if (!found) {
        return { success: false, message: 'Email atau password salah.' };
      }

      // Simpan user tanpa password ke state & sessionStorage
      const { password: _, ...safeUser } = found;
      setCurrentUser(safeUser);
      sessionStorage.setItem('auth_user', JSON.stringify(safeUser));

      return { success: true };
    },
    []
  );

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    setCurrentUser(null);
    sessionStorage.removeItem('auth_user');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role: currentUser?.role ?? null,
        isAuthenticated: currentUser !== null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

// ── Hook kompatibilitas: supaya useRole() lama tetap bisa dipakai ─────────
// Ganti semua import useRole dengan useAuth, ATAU pakai alias ini sementara
export function useRole() {
  const { currentUser, role } = useAuth();
  return {
    role: role ?? 'guru',
    currentUser: currentUser ?? { name: '', email: '', initials: '' },
    // setRole tidak dipakai lagi, tapi disediakan agar tidak error
    setRole: (_: 'admin' | 'guru') => {},
  };
}
