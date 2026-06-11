import { useState, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Loader2, AlertCircle, School } from "lucide-react";
import { toast } from "sonner"; // Tambahkan import toast untuk notifikasi

export default function LoginPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login, isAuthenticated } = useAuth();

  // Kalau sudah login, langsung redirect ke dashboard
  if (isAuthenticated) {
    navigate("/dashboard", { replace: true });
  }

  // ── State ──────────────────────────────────────────────────────────────────
  const [isLoginView, setIsLoginView] = useState(true); // true = Login, false = Sign Up
  
  const [name,        setName]        = useState(""); // State baru untuk nama
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [showPass,    setShowPass]    = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);

  // Halaman tujuan setelah login
  const from = (location.state as { from?: Location })?.from?.pathname ?? "/dashboard";

  // ── Submit ─────────────────────────────────────────────────────────────────
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    // Validasi input
    if (!isLoginView && !name.trim()) return setError("Nama lengkap wajib diisi.");
    if (!email.trim())    return setError("Alamat email wajib diisi.");
    if (!password.trim()) return setError("Kata sandi wajib diisi.");

    setLoading(true);

    if (isLoginView) {
      // PROSES LOGIN
      const result = await login(email.trim(), password);
      setLoading(false);

      if ('message' in result) {
        setError(result.message);
      } else {
        navigate(from, { replace: true });
      }
    } else {
      // SIMULASI PROSES REGISTRASI (Sign Up)
      setTimeout(() => {
        setLoading(false);
        toast.success("Registrasi berhasil! Silakan masuk menggunakan akun baru Anda.");
        
        // Kembalikan tampilan ke mode Login setelah berhasil mendaftar
        setIsLoginView(true);
        setPassword(""); // Kosongkan password demi keamanan
      }, 1500); // Simulasi loading 1.5 detik
    }
  }

  // Fungsi untuk reset form saat pindah antara Login & Sign Up
  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError(null);
    setName("");
    setEmail("");
    setPassword("");
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        
        {/* Card Portal */}
        <div className="overflow-hidden rounded-lg bg-white shadow-md border border-slate-200 transition-all duration-300">
          
          {/* Header Card (Bagian Biru/Primary Sekolah) */}
          <div className="bg-primary px-6 py-8 text-center sm:px-8 transition-colors">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <School className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-wide uppercase">
              Sistem Peminjaman Lab
            </h1>
            <p className="mt-1 text-sm font-medium text-primary-foreground/80">
              SMK SMART AR-RAHMAN
            </p>
          </div>

          {/* Form Login / Sign Up */}
          <div className="px-10 py-8 sm:px-10">
            <div className="mb-6 text-center">
              <h2 className="text-lg font-semibold text-slate-900">
                {isLoginView ? "Login" : "Registrasi Akun"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                {isLoginView 
                  ? "Silakan masukkan email dan kata sandi Anda." 
                  : "Isi data diri Anda untuk membuat akun baru."}
              </p>
            </div>

            {/* Pesan error */}
            {error && (
              <div className="mb-5 flex items-start gap-2.5 rounded border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              
              {/* Field Nama (HANYA MUNCUL SAAT SIGN UP) */}
              {!isLoginView && (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2">
                  <label htmlFor="name" className="text-sm font-medium text-slate-700">
                    Nama Lengkap
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={e => { setName(e.target.value); setError(null); }}
                    placeholder="Contoh: Budi Santoso"
                    disabled={loading}
                    className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-50 disabled:text-slate-500"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium text-slate-700">
                  Email Terdaftar
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(null); }}
                  placeholder="email@smksmartarrahman.sch.id"
                  disabled={loading}
                  className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-50 disabled:text-slate-500"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Kata Sandi
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPass ? "text" : "password"}
                    autoComplete={isLoginView ? "current-password" : "new-password"}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(null); }}
                    placeholder="Masukkan kata sandi"
                    disabled={loading}
                    className="block w-full rounded-md border border-slate-300 px-3 py-2 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:bg-slate-50 disabled:text-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(p => !p)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                  >
                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full text-sm font-semibold tracking-wide h-10 transition-all" 
                  disabled={loading}
                >
                  {loading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sedang Memproses...</>
                  ) : (
                    isLoginView ? "MASUK" : "DAFTAR SEKARANG"
                  )}
                </Button>
              </div>

            </form>

            {/* Tombol Toggle (Ganti antara Login dan Sign Up) */}
            <div className="mt-6 text-center text-sm text-slate-600">
              {isLoginView ? (
                <p>
                  Belum memiliki akun?{" "}
                  <button type="button" onClick={toggleView} className="font-semibold text-primary hover:underline focus:outline-none">
                    Daftar di sini
                  </button>
                </p>
              ) : (
                <p>
                  Sudah memiliki akun?{" "}
                  <button type="button" onClick={toggleView} className="font-semibold text-primary hover:underline focus:outline-none">
                    Masuk di sini
                  </button>
                </p>
              )}
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} SMK Smart Ar-Rahman</p>
        </div>

      </div>
    </div>
  );
}