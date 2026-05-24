import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import BookingForm from "@/components/BookingForm";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { bookings, getLabName } from "@/data/mockData";
import { useRole } from "@/hooks/useRole";
import { Button } from "@/components/ui/button";
import { ClipboardList, Clock, AlertCircle, Plus } from "lucide-react";

const getMonday = () => {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

export default function GuruDashboard() {
  const { currentUser } = useRole();
  const selectedLab = "lab-1";
  const [formOpen, setFormOpen] = useState(false);
  const [prefill, setPrefill] = useState<{ labId?: string; dayIndex?: number; hour?: number }>({});
  const [conflictSlot, setConflictSlot] = useState<{ dayIndex: number; startHour: number; endHour: number } | null>(null);
  const monday = getMonday();

  // Filter bookings for current guru
  const myBookings = bookings.filter(b => b.teacher === currentUser.name);
  const myPending = myBookings.filter(b => b.status === "pending").length;
  const myApproved = myBookings.filter(b => b.status === "approved").length;
  const myTotal = myBookings.length;

  const handleSlotClick = (dayIndex: number, hour: number) => {
    setPrefill({ labId: selectedLab, dayIndex, hour });
    setFormOpen(true);
  };

  const recentBookings = [...myBookings].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Dashboard Guru</h1>
            <p className="text-sm text-muted-foreground">Selamat datang, {currentUser.name}.</p>
          </div>
          <Button className="gap-2" onClick={() => { setPrefill({}); setFormOpen(true); }}>
            <Plus className="h-4 w-4" />
            Pinjam Lab
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Total Peminjaman" value={myTotal} icon={<ClipboardList className="h-4 w-4 text-primary" />} accent="bg-primary/10" />
          <StatCard label="Disetujui" value={myApproved} icon={<Clock className="h-4 w-4 text-booking" />} accent="bg-booking-subtle" />
          <StatCard label="Menunggu" value={myPending} icon={<AlertCircle className="h-4 w-4 text-pending" />} accent="bg-pending-subtle" />
        </div>

        {/* Calendar */}
        <div>
          <h2 className="mb-3 text-lg font-semibold text-foreground">Kalender Mingguan</h2>
          <WeeklyCalendar selectedLabId={selectedLab} weekStartDate={monday} onSlotClick={handleSlotClick} conflictSlot={conflictSlot} />
        </div>

        {/* Recent personal bookings */}
        {recentBookings.length > 0 && (
          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">Peminjaman Saya</h2>
            <div className="rounded-lg border border-border shadow-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted">
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Tanggal</th>
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Jam</th>
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Keperluan</th>
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map(b => (
                    <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 tabular-nums text-muted-foreground">{b.date}</td>
                      <td className="px-4 py-3 tabular-nums text-muted-foreground">{String(b.start_hour).padStart(2, "0")}:00–{String(b.end_hour).padStart(2, "0")}:00</td>
                      <td className="px-4 py-3 text-foreground">{b.purpose}</td>
                      <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <BookingForm open={formOpen} onClose={() => { setFormOpen(false); setConflictSlot(null); }} prefill={prefill} onConflictFound={setConflictSlot} />
    </AppLayout>
  );
}
