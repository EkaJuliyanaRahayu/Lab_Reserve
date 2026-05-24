import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import BookingForm from "@/components/BookingForm";
import StatusBadge from "@/components/StatusBadge";
import { bookings, getLabName } from "@/data/mockData";
import { useRole } from "@/hooks/useRole";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Check, X as XIcon, Download } from "lucide-react";
import { toast } from "sonner";

function exportCSV(data: typeof bookings, filename: string) {
  const header = "Guru,Lab,Tanggal,Jam Mulai,Jam Selesai,Keperluan,Status\n";
  const rows = data.map(b =>
    `"${b.teacher}","${getLabName(b.lab_id)}","${b.date}","${String(b.start_hour).padStart(2, '0')}:00","${String(b.end_hour).padStart(2, '0')}:00","${b.purpose}","${b.status}"`
  ).join("\n");
  const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function BookingPage() {
  const { role, currentUser } = useRole();
  const [formOpen, setFormOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  const allBookings = role === "guru"
    ? bookings.filter(b => b.teacher === currentUser.name)
    : bookings;

  const filtered = filterStatus === "all" ? allBookings : allBookings.filter(b => b.status === filterStatus);
  const sorted = [...filtered].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  const pending = role === "admin" ? sorted.filter(b => b.status === "pending") : [];
  const listItems = role === "admin" ? sorted.filter(b => b.status !== "pending") : sorted;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              {role === "admin" ? "Peminjaman Lab" : "Peminjaman Saya"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {role === "admin" ? "Kelola permintaan dan riwayat peminjaman." : "Lihat riwayat dan ajukan peminjaman baru."}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2" onClick={() => exportCSV(filtered, `riwayat-peminjaman-${new Date().toISOString().slice(0, 10)}.csv`)}>
              <Download className="h-4 w-4" />
              Unduh CSV
            </Button>
            <Button className="gap-2" onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4" />
              Ajukan Peminjaman
            </Button>
          </div>
        </div>

        {/* Pending requests - admin only */}
        {role === "admin" && pending.length > 0 && (
          <div>
            <h2 className="mb-3 text-base font-semibold text-foreground">Menunggu Persetujuan ({pending.length})</h2>
            <div className="space-y-3">
              {pending.map(b => (
                <div key={b.id} className="flex items-center justify-between rounded-lg border border-pending-border bg-pending-subtle p-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{b.teacher}</span>
                      <StatusBadge status="pending" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getLabName(b.lab_id)} · {b.date} · {String(b.start_hour).padStart(2, '0')}:00–{String(b.end_hour).padStart(2, '0')}:00
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

        {/* Riwayat */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Riwayat Peminjaman</h2>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="Semua Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="approved">Disetujui</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Ditolak</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="rounded-lg border border-border shadow-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted">
                  {role === "admin" && <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Guru</th>}
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Lab</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Tanggal</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Jam</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Keperluan</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {listItems.map(b => (
                  <tr key={b.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                    {role === "admin" && <td className="px-4 py-3 font-medium text-foreground">{b.teacher}</td>}
                    <td className="px-4 py-3 text-muted-foreground">{getLabName(b.lab_id)}</td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">{b.date}</td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">{String(b.start_hour).padStart(2, '0')}:00–{String(b.end_hour).padStart(2, '0')}:00</td>
                    <td className="px-4 py-3 text-muted-foreground">{b.purpose}</td>
                    <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
                {listItems.length === 0 && (
                  <tr>
                    <td colSpan={role === "admin" ? 6 : 5} className="px-4 py-8 text-center text-muted-foreground">
                      Tidak ada data peminjaman.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <BookingForm open={formOpen} onClose={() => setFormOpen(false)} prefill={{}} />
    </AppLayout>
  );
}
