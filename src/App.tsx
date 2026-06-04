import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage   from "./pages/LoginPage";
import Index       from "./pages/Index";
import BookingPage from "./pages/BookingPage";
import LabsPage    from "./pages/LabsPage";
import ProfilPage  from "./pages/ProfilPage";   // ← BARU
import NotFound    from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Sonner />
          <BrowserRouter>
            <Routes>

              {/* ── Public ── */}
              <Route path="/login" element={<LoginPage />} />

              {/* ── Protected: semua role ── */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } />

              <Route path="/booking" element={
                <ProtectedRoute>
                  <BookingPage />
                </ProtectedRoute>
              } />

              {/* ── Profil: semua role (admin & guru) ── */}
              <Route path="/profil" element={
                <ProtectedRoute>
                  <ProfilPage />
                </ProtectedRoute>
              } />

              {/* ── Data Lab: hanya admin ── */}
              <Route path="/labs" element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <LabsPage />
                </ProtectedRoute>
              } />

              {/* ── Fallback ── */}
              <Route path="/unauthorized" element={
                <div className="flex min-h-screen flex-col items-center justify-center gap-3">
                  <h1 className="text-2xl font-semibold">Akses Ditolak</h1>
                  <p className="text-sm text-muted-foreground">
                    Anda tidak memiliki izin untuk mengakses halaman ini.
                  </p>
                  <a href="/" className="text-sm text-primary underline">
                    Kembali ke Dashboard
                  </a>
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
