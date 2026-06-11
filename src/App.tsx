import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage          from "./pages/LoginPage";
import Index              from "./pages/Index"; // Ini dashboard autentikasi
import BookingPage        from "./pages/BookingPage";
import LabsPage           from "./pages/LabsPage";
import ProfilPage         from "./pages/ProfilPage";
import ManageSchedules    from "./pages/ManageSchedules";
import NotFound           from "./pages/NotFound";
import CalenderPublic from "./pages/calenderPublic";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Sonner />
          <BrowserRouter>
            <Routes>

              {/* ── JALUR PUBLIK (Tidak Perlu Login) ── */}
              <Route path="/" element={<CalenderPublic />} /> {/* ← HOME SEKARANG PUBLIK */}
              <Route path="/login" element={<LoginPage />} />

              {/* ── JALUR PROTEKSI (Wajib Login) ── */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />

              <Route path="/booking" element={
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              } />

              <Route path="/profil" element={
                <ProtectedRoute>
                  <ProfilPage />
                </ProtectedRoute>
              } />

              {/* ── Jalur Khusus Admin ── */}
              <Route path="/labs" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <LabsPage />
                </ProtectedRoute>
              } />

              <Route path="/admin/schedules" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <ManageSchedules />
                </ProtectedRoute>
              } />

              {/* ── Fallback ── */}
              <Route path="/unauthorized" element={
                <div className="flex min-h-screen flex-col items-center justify-center gap-3">
                  <h1 className="text-2xl font-semibold">Akses Ditolak</h1>
                  <p className="text-sm text-muted-foreground">Anda tidak memiliki izin.</p>
                  <a href="/" className="text-sm text-primary underline">Kembali ke Beranda</a>
                </div>
              } />
              
              <Route path="*" element={<NotFound />} />

            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;