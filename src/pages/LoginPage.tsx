import { useState, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Monitor, Loader2, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { login, isAuthenticated } = useAuth();

  // Kalau sudah login, langsung redirect ke dashboard
  if (isAuthenticated) {
    navigate("/", { replace: true });
  }

  // ── State ──────────────────────────────────────────────────────────────────
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [showPass,    setShowPass]    = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);

  // Halaman tujuan setelah login (kalau user tadi dicegat ProtectedRoute)
  const from = (location.state as { from?: Location })?.from?.pathname ?? "/";

  // ── Submit: sesuai alur sequence diagram ──────────────────────────────────
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    // Validasi dasar sebelum kirim
    if (!email.trim())    return setError("Email tidak boleh kosong.");
    if (!password.trim()) return setError("Password tidak boleh kosong.");

    setLoading(true);

    // ── Kirim data login → AuthController (mock) ──────────────────────────
    // Di produksi: ganti dengan fetch("http://localhost:8000/api/login", {...})
            const result = await login(email.trim(), password);
        setLoading(false);

        if ('message' in result) {
        // TypeScript sekarang pasti tahu result.message ada
        setError(result.message);
        } else {
        navigate(from, { replace: true });
        }
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-sm">

        {/* ── Logo & judul ── */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
            <Monitor className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground">LabReserve</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sistem Informasi Peminjaman Lab Komputer
          </p>
        </div>

        {/* ── Card form login ── */}
        <div className="rounded-xl border border-border bg-background p-6 shadow-card">
          <h2 className="mb-5 text-base font-semibold text-foreground">
            Masuk ke akun Anda
          </h2>

          {/* ── Pesan error (Data tidak valid) ── */}
          {error && (
            <div className="mb-4 flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            {/* ── Field email ── */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-xs font-medium text-muted-foreground"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={e => { setEmail(e.target.value); setError(null); }}
                placeholder="contoh@smk.sch.id"
                disabled={loading}
                className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm transition
                  placeholder:text-muted-foreground/60
                  focus:outline-none focus:ring-2 focus:ring-ring
                  disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* ── Field password ── */}
            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="text-xs font-medium text-muted-foreground"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(null); }}
                  placeholder="Masukkan password"
                  disabled={loading}
                  className="w-full rounded-md border border-input bg-muted px-3 py-2 pr-10 text-sm transition
                    placeholder:text-muted-foreground/60
                    focus:outline-none focus:ring-2 focus:ring-ring
                    disabled:cursor-not-allowed disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(p => !p)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPass ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPass
                    ? <EyeOff className="h-4 w-4" />
                    : <Eye    className="h-4 w-4" />
                  }
                </button>
              </div>
            </div>

            {/* ── Tombol submit ── */}
            <Button
              type="submit"
              className="w-full gap-2"
              disabled={loading}
            >
              {loading
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Memverifikasi...</>
                : "Masuk"
              }
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          SMK SMART AR-RAHMAN · {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
