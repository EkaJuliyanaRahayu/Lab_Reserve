import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import BookingForm from "@/components/BookingForm";
import StatusBadge from "@/components/StatusBadge";
import { bookings, getLabName } from "@/data/mockData";
import { useRole } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Check, X as XIcon, FileText, Printer } from "lucide-react";
import { toast } from "sonner";

export default function BookingPage() {
  const { role, currentUser } = useRole();

  // State: form & filter utama
  const [formOpen, setFormOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");

  // State: panel cetak PDF
  const [pdfPanelOpen, setPdfPanelOpen] = useState(false);
  const [pdfFilterType, setPdfFilterType] = useState<"bulan" | "tahun" | "rentang">("bulan");
  const [pdfBulan, setPdfBulan] = useState(
    String(new Date().getMonth() + 1).padStart(2, "0")
  );
  const [pdfTahun, setPdfTahun] = useState(String(new Date().getFullYear()));
  const [pdfDari, setPdfDari] = useState("");
  const [pdfSampai, setPdfSampai] = useState("");
  const [pdfStatus, setPdfStatus] = useState("all");

  // State: modal tolak
  const [tolakTarget, setTolakTarget] = useState<string | null>(null);
  const [tolakAlasan, setTolakAlasan] = useState("");

  // ── Data ────────────────────────────────────────────────────────────────────
  const allBookings =
    role === "guru"
      ? bookings.filter((b) => b.teacher === currentUser.name)
      : bookings;

  const filtered =
    filterStatus === "all"
      ? allBookings
      : allBookings.filter((b) => b.status === filterStatus);

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const pending = role === "admin" ? sorted.filter((b) => b.status === "pending") : [];
  const listItems =
    role === "admin" ? sorted.filter((b) => b.status !== "pending") : sorted;

  // ── Handler: cetak PDF ───────────────────────────────────────────────────────
  function handleCetakPDF() {
    let data =
      role === "admin"
        ? bookings
        : bookings.filter((b) => b.teacher === currentUser.name);

    if (pdfStatus !== "all") {
      data = data.filter((b) => b.status === pdfStatus);
    }

    if (pdfFilterType === "bulan") {
      data = data.filter((b) => {
        const d = new Date(b.date);
        return (
          String(d.getMonth() + 1).padStart(2, "0") === pdfBulan &&
          String(d.getFullYear()) === pdfTahun
        );
      });
    } else if (pdfFilterType === "tahun") {
      data = data.filter(
        (b) => String(new Date(b.date).getFullYear()) === pdfTahun
      );
    } else if (pdfFilterType === "rentang" && pdfDari && pdfSampai) {
      data = data.filter((b) => b.date >= pdfDari && b.date <= pdfSampai);
    }

    const filterLabel =
      pdfFilterType === "bulan"
        ? `Bulan ${pdfBulan}/${pdfTahun}`
        : pdfFilterType === "tahun"
        ? `Tahun ${pdfTahun}`
        : `${pdfDari} s/d ${pdfSampai}`;

    const rows = data
      .map(
        (b) => `
        <tr>
          <td>${b.teacher}</td>
          <td>${getLabName(b.lab_id)}</td>
          <td>${b.date}</td>
          <td>${String(b.start_hour).padStart(2, "0")}:00–${String(b.end_hour).padStart(2, "0")}:00</td>
          <td>${b.purpose}</td>
          <td>${b.status}</td>
        </tr>`
      )
      .join("");

    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>Laporan Peminjaman Lab</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; font-size: 13px; }
            h2  { margin-bottom: 4px; }
            p   { color: #666; margin-bottom: 16px; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; }
            th  { background: #f3f4f6; text-align: left; padding: 8px 10px; font-size: 12px; }
            td  { padding: 8px 10px; border-bottom: 1px solid #e5e7eb; }
            @media print { button { display: none; } }
          </style>
        </head>
        <body>
          <h2>Laporan Peminjaman Lab — LabReserve</h2>
          <p>
            Filter: ${filterLabel} &nbsp;|&nbsp;
            Status: ${pdfStatus === "all" ? "Semua" : pdfStatus} &nbsp;|&nbsp;
            Total: ${data.length} data
          </p>
          <table>
            <thead>
              <tr>
                <th>Guru</th><th>Lab</th><th>Tanggal</th>
                <th>Jam</th><th>Keperluan</th><th>Status</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <br>
          <button onclick="window.print()">🖨️ Print / Save PDF</button>
        </body>
      </html>`);
    win.document.close();
    win.focus();
  }

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <AppLayout>
      <div className="space-y-6">

        {/* ── Panel filter cetak PDF ── */}
        {pdfPanelOpen && (
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-background p-3 text-sm shadow-sm">
            <FileText className="h-4 w-4 shrink-0 text-red-500" />
            <span className="font-medium text-muted-foreground">Filter laporan:</span>

            {/* Tipe filter */}
            <Select
              value={pdfFilterType}
              onValueChange={(v) => setPdfFilterType(v as typeof pdfFilterType)}
            >
              <SelectTrigger className="h-8 w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bulan">Per bulan</SelectItem>
                <SelectItem value="tahun">Per tahun</SelectItem>
                <SelectItem value="rentang">Rentang tanggal</SelectItem>
              </SelectContent>
            </Select>

            {/* Input dinamis sesuai tipe */}
            {pdfFilterType === "bulan" && (
              <>
                <select
                  value={pdfBulan}
                  onChange={(e) => setPdfBulan(e.target.value)}
                  className="h-8 rounded-md border border-input bg-background px-2 text-sm"
                >
                  {["01","02","03","04","05","06","07","08","09","10","11","12"].map(
                    (m, i) => (
                      <option key={m} value={m}>
                        {["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"][i]}
                      </option>
                    )
                  )}
                </select>
                <select
                  value={pdfTahun}
                  onChange={(e) => setPdfTahun(e.target.value)}
                  className="h-8 rounded-md border border-input bg-background px-2 text-sm"
                >
                  {["2024", "2025", "2026"].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </>
            )}

            {pdfFilterType === "tahun" && (
              <select
                value={pdfTahun}
                onChange={(e) => setPdfTahun(e.target.value)}
                className="h-8 rounded-md border border-input bg-background px-2 text-sm"
              >
                {["2024", "2025", "2026"].map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            )}

            {pdfFilterType === "rentang" && (
              <>
                <span className="text-muted-foreground">Dari</span>
                <input
                  type="date"
                  value={pdfDari}
                  onChange={(e) => setPdfDari(e.target.value)}
                  className="h-8 rounded-md border border-input bg-background px-2 text-sm"
                />
                <span className="text-muted-foreground">Sampai</span>
                <input
                  type="date"
                  value={pdfSampai}
                  onChange={(e) => setPdfSampai(e.target.value)}
                  className="h-8 rounded-md border border-input bg-background px-2 text-sm"
                />
              </>
            )}

            {/* Filter status PDF */}
            <Select value={pdfStatus} onValueChange={setPdfStatus}>
              <SelectTrigger className="h-8 w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua status</SelectItem>
                <SelectItem value="approved">Disetujui</SelectItem>
                <SelectItem value="rejected">Ditolak</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Button size="sm" className="ml-auto gap-1" onClick={handleCetakPDF}>
              <Printer className="h-3.5 w-3.5" />
              Cetak PDF
            </Button>
            <Button
              size="sm"
              variant="ghost"
              aria-label="Tutup panel"
              onClick={() => setPdfPanelOpen(false)}
            >
              <XIcon className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}

        {/* ── Header halaman ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              {role === "admin" ? "Peminjaman Lab" : "Peminjaman Saya"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {role === "admin"
                ? "Kelola permintaan dan riwayat peminjaman."
                : "Lihat riwayat dan ajukan peminjaman baru."}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Cetak PDF — semua role */}
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setPdfPanelOpen((prev) => !prev)}
            >
              <FileText className="h-4 w-4 text-red-600" />
              Cetak Laporan PDF
            </Button>

            {/* Ajukan — hanya guru / siswa / staff, bukan admin */}
            {role !== "admin" && (
              <Button className="gap-2" onClick={() => setFormOpen(true)}>
                <Plus className="h-4 w-4" />
                Ajukan Peminjaman
              </Button>
            )}
          </div>
        </div>

        {/* ── Pending (admin only) ── */}
        {role === "admin" && pending.length > 0 && (
          <div>
            <h2 className="mb-3 text-base font-semibold text-foreground">
              Menunggu Persetujuan ({pending.length})
            </h2>
            <div className="space-y-3">
              {pending.map((b) => (
                <div
                  key={b.id}
                  className="flex items-center justify-between rounded-lg border border-pending-border bg-pending-subtle p-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{b.teacher}</span>
                      <StatusBadge status="pending" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getLabName(b.lab_id)} · {b.date} ·{" "}
                      {String(b.start_hour).padStart(2, "0")}:00–
                      {String(b.end_hour).padStart(2, "0")}:00
                    </p>
                    <p className="text-sm text-muted-foreground">{b.purpose}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 text-destructive hover:bg-destructive/10"
                      onClick={() => {
                        setTolakTarget(b.teacher);
                        setTolakAlasan("");
                      }}
                    >
                      <XIcon className="h-3 w-3" />
                      Tolak
                    </Button>
                    <Button
                      size="sm"
                      className="gap-1"
                      onClick={() => toast.success("Permintaan disetujui.")}
                    >
                      <Check className="h-3 w-3" />
                      Setujui
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Riwayat peminjaman ── */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">
              Riwayat Peminjaman
            </h2>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="approved">Disetujui</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Ditolak</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-hidden rounded-lg border border-border shadow-card">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted">
                  {role === "admin" && (
                    <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">
                      Guru
                    </th>
                  )}
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Lab</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Tanggal</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Jam</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Keperluan</th>
                  <th className="px-4 py-2.5 text-left font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {listItems.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-border last:border-0 transition-colors hover:bg-muted/50"
                  >
                    {role === "admin" && (
                      <td className="px-4 py-3 font-medium text-foreground">{b.teacher}</td>
                    )}
                    <td className="px-4 py-3 text-muted-foreground">{getLabName(b.lab_id)}</td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">{b.date}</td>
                    <td className="px-4 py-3 tabular-nums text-muted-foreground">
                      {String(b.start_hour).padStart(2, "0")}:00–
                      {String(b.end_hour).padStart(2, "0")}:00
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{b.purpose}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={b.status} />
                    </td>
                  </tr>
                ))}
                {listItems.length === 0 && (
                  <tr>
                    <td
                      colSpan={role === "admin" ? 6 : 5}
                      className="px-4 py-8 text-center text-muted-foreground"
                    >
                      Tidak ada data peminjaman.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Modal: konfirmasi tolak ── */}
      {tolakTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-xl border border-border bg-background p-5 shadow-lg">
            <h3 className="mb-1 text-sm font-semibold text-foreground">
              Tolak peminjaman
            </h3>
            <p className="mb-3 text-xs text-muted-foreground">
              Berikan alasan penolakan untuk{" "}
              <strong>{tolakTarget}</strong>
            </p>
            <textarea
              value={tolakAlasan}
              onChange={(e) => setTolakAlasan(e.target.value)}
              placeholder="Contoh: Jadwal bentrok dengan kelas reguler..."
              className="h-20 w-full resize-none rounded-md border border-input bg-muted px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <div className="mt-3 flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setTolakTarget(null)}
              >
                Batal
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => {
                  toast.error(`Peminjaman ${tolakTarget} ditolak.`);
                  setTolakTarget(null);
                }}
              >
                <XIcon className="mr-1 h-3 w-3" />
                Konfirmasi Tolak
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Form ajukan peminjaman ── */}
      <BookingForm open={formOpen} onClose={() => setFormOpen(false)} prefill={{}} />
    </AppLayout>
  );
}
