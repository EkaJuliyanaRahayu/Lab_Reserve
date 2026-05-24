import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import BookingForm from "@/components/BookingForm";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { bookings, schedules, getLabName } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { ClipboardList, Clock, AlertCircle, Plus, Check, X as XIcon } from "lucide-react";
import { toast } from "sonner";

const getMonday = () => {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

export default function AdminDashboard() {
  const selectedLab = "lab-1";
  const [formOpen, setFormOpen] = useState(false);
  const [prefill, setPrefill] = useState<{ labId?: string; dayIndex?: number; hour?: number }>({});
  const [conflictSlot, setConflictSlot] = useState<{ dayIndex: number; startHour: number; endHour: number } | null>(null);
  const monday = getMonday();

  const pendingCount = bookings.filter(b => b.status === "pending").length;
  const approvedCount = bookings.filter(b => b.status === "approved").length;
  const totalSchedules = schedules.length;
  const pending = bookings.filter(b => b.status === "pending");

  const handleSlotClick = (dayIndex: number, hour: number) => {
    setPrefill({ labId: selectedLab, dayIndex, hour });
    setFormOpen(true);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Dashboard Admin</h1>
            <p className="text-sm text-muted-foreground">Kelola peminjaman & persetujuan lab.</p>
          </div>
          <Button className="gap-2" onClick={() => { setPrefill({}); setFormOpen(true); }}>
            <Plus className="h-4 w-4" />
            Pinjam Lab
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Jadwal Rutin" value={totalSchedules} icon={<Clock className="h-4 w-4 text-routine" />} accent="bg-routine-subtle" />
          <StatCard label="Disetujui" value={approvedCount} icon={<ClipboardList className="h-4 w-4 text-booking" />} accent="bg-booking-subtle" />
          <StatCard label="Menunggu" value={pendingCount} icon={<AlertCircle className="h-4 w-4 text-pending" />} accent="bg-pending-subtle" />
        </div>

        {/* Pending approvals */}
        {pending.length > 0 && (
          <div>
            <h2 className="mb-3 text-lg font-semibold text-foreground">Menunggu Persetujuan ({pending.length})</h2>
            <div className="space-y-3">
              {pending.map(b => (
                <div key={b.id} className="flex items-center justify-between rounded-lg border border-pending-border bg-pending-subtle p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{b.teacher}</span>
                      <StatusBadge status="pending" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getLabName(b.lab_id)} · {b.date} · {String(b.start_hour).padStart(2, "0")}:00–{String(b.end_hour).padStart(2, "0")}:00
                    </p>
                    <p className="text-sm text-muted-foreground">{b.purpose}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" className="gap-1 text-destructive hover:bg-destructive/10" onClick={() => toast.error("Permintaan ditolak.")}>
                      <XIcon className="h-3 w-3" />
                      Tolak
                    </Button>
                    <Button size="sm" className="gap-1" onClick={() => toast.success("Permintaan disetujui.")}>
                      <Check className="h-3 w-3" />
                      Setujui
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calendar */}
        <div>
          <h2 className="mb-3 text-lg font-semibold text-foreground">Kalender Mingguan</h2>
          <WeeklyCalendar selectedLabId={selectedLab} weekStartDate={monday} onSlotClick={handleSlotClick} conflictSlot={conflictSlot} />
        </div>
      </div>

      <BookingForm open={formOpen} onClose={() => { setFormOpen(false); setConflictSlot(null); }} prefill={prefill} onConflictFound={setConflictSlot} />
    </AppLayout>
  );
}
