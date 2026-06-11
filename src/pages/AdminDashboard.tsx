import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import WeeklyCalendar from "@/components/WeeklyCalendar";
import RoutineScheduleForm from "@/components/RoutineScheduleForm";
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
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Jadwal Rutin" value={totalSchedules} icon={<Clock className="h-4 w-4 text-routine" />} accent="bg-routine-subtle" />
          <StatCard label="Disetujui" value={approvedCount} icon={<ClipboardList className="h-4 w-4 text-booking" />} accent="bg-booking-subtle" />
          <StatCard label="Menunggu" value={pendingCount} icon={<AlertCircle className="h-4 w-4 text-pending" />} accent="bg-pending-subtle" />
        </div>

        {/* Calendar */}
        <div>
          <h2 className="mb-3 text-lg font-semibold text-foreground">Kalender Mingguan</h2>
          <WeeklyCalendar selectedLabId={selectedLab} weekStartDate={monday} onSlotClick={handleSlotClick} conflictSlot={conflictSlot} />
        </div>
      </div>

      <RoutineScheduleForm 
        open={formOpen} 
        onClose={() => setFormOpen(false)} 
      />
    </AppLayout>
  );
}
