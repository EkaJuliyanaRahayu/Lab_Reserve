import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import { Building2, LogIn, Info } from "lucide-react";

// Fungsi untuk mendapatkan hari Senin pada minggu ini
const getMonday = () => {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

export default function CalenderPublic() {
  const navigate = useNavigate();
  const [weekStartDate] = useState(getMonday());
  const selectedLab = "lab-1"; // Default lab utama

  // Jika user publik mencoba mengklik slot kosong di kalender
  const handlePublicSlotClick = () => {
    // Arahkan mereka ke halaman login dengan membawa pesan/state
    navigate("/login", { 
      state: { message: "Silakan masuk (login) terlebih dahulu untuk mengajukan peminjaman lab." } 
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* ── Navbar Publik ── */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">SIPLAB</h1>
              <p className="text-[11px] font-medium text-slate-500">SMK SMART AR-RAHMAN</p>
            </div>
          </div>
          
          <Button onClick={() => navigate("/login")} className="gap-2 font-medium">
            <LogIn className="h-4 w-4" />
            Masuk / Login
          </Button>
        </div>
      </header>

      {/* ── Konten Utama ── */}
      <main className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Jadwal Penggunaan Laboratorium</h2>
            <p className="mt-1 text-sm text-slate-600">
              Pantau ketersediaan ruangan lab secara real-time.
            </p>
          </div>
          
          <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-800 border border-blue-100 max-w-md">
            <Info className="h-5 w-5 shrink-0 text-blue-600 mt-0.5" />
            <p>
              <strong>Informasi:</strong> Untuk mengajukan peminjaman, Anda diwajibkan untuk masuk (login) ke dalam sistem.
            </p>
          </div>
        </div>

        {/* ── Kalender (Read-Only untuk Publik) ── */}
        <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-200">
          <WeeklyCalendar 
            selectedLabId={selectedLab} 
            weekStartDate={weekStartDate} 
            onSlotClick={handlePublicSlotClick} 
          />
        </div>

      </main>
    </div>
  );
}