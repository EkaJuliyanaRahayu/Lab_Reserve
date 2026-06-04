import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { labs as initialLabs } from "@/data/mockData";
import { useRole } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Building2, MapPin, Users, Monitor, User, Mail,
  Briefcase, Plus, Pencil, Trash2, PowerOff, Power,
  Search, X as XIcon, Check,
} from "lucide-react";

// ── Tipe data lab ────────────────────────────────────────────────────────────
type Lab = {
  id: number;
  name: string;
  code: string;
  location: string;
  capacity: number;
  pc_count: number;
  facilities: string[];
  status: "available" | "busy" | "inactive";
};

const FACILITY_OPTIONS = [
  "Proyektor", "AC", "Whiteboard", "Headset",
  "Router & Switch", "Scanner", "Printer",
];

// Konversi data mockData ke format Lab (kalau belum ada field tambahan)
function toLabFormat(raw: typeof initialLabs[0], index: number): Lab {
  return {
    id: index + 1,
    name: raw.name,
    code: `LAB-${String.fromCharCode(65 + index)}`,
    location: raw.location,
    capacity: raw.capacity,
    pc_count: raw.capacity,          // asumsi jumlah PC = kapasitas
    facilities: raw.facilities ?? [],
    status: "available",
  };
}

const EMPTY_FORM: Omit<Lab, "id"> = {
  name: "",
  code: "",
  location: "",
  capacity: 30,
  pc_count: 30,
  facilities: [],
  status: "available",
};

// ── Komponen badge status ────────────────────────────────────────────────────
function StatusBadgeLab({ status }: { status: Lab["status"] }) {
  if (status === "available")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-950 dark:text-green-400">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
        Tersedia
      </span>
    );
  if (status === "busy")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 dark:bg-red-950 dark:text-red-400">
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        Dipakai
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
      <span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
      Nonaktif
    </span>
  );
}

// ── Halaman utama ────────────────────────────────────────────────────────────
export default function LabsPage() {
  const { role, currentUser } = useRole();

  // ── State ──────────────────────────────────────────────────────────────────
  const [labList, setLabList] = useState<Lab[]>(
    initialLabs.map(toLabFormat)
  );
  const [search, setSearch] = useState("");

  // Modal form (tambah / edit)
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Lab | null>(null);
  const [form, setForm] = useState<Omit<Lab, "id">>(EMPTY_FORM);

  // Modal hapus
  const [deleteTarget, setDeleteTarget] = useState<Lab | null>(null);

  // ── Helper ─────────────────────────────────────────────────────────────────
  const filtered = labList.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.code.toLowerCase().includes(search.toLowerCase()) ||
    l.location.toLowerCase().includes(search.toLowerCase())
  );

  const totalKapasitas = labList.reduce((s, l) => s + l.capacity, 0);
  const totalTersedia  = labList.filter((l) => l.status === "available").length;

  function openAddForm() {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  }

  function openEditForm(lab: Lab) {
    setEditTarget(lab);
    setForm({
      name: lab.name, code: lab.code, location: lab.location,
      capacity: lab.capacity, pc_count: lab.pc_count,
      facilities: [...lab.facilities], status: lab.status,
    });
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditTarget(null);
  }

  function toggleFacility(f: string) {
    setForm((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(f)
        ? prev.facilities.filter((x) => x !== f)
        : [...prev.facilities, f],
    }));
  }

  function saveForm() {
    if (!form.name.trim() || !form.code.trim()) return;
    if (editTarget) {
      // Update
      setLabList((prev) =>
        prev.map((l) => (l.id === editTarget.id ? { ...l, ...form } : l))
      );
    } else {
      // Tambah baru
      const newId = Math.max(0, ...labList.map((l) => l.id)) + 1;
      setLabList((prev) => [...prev, { id: newId, ...form }]);
    }
    closeForm();
  }

  function toggleStatus(lab: Lab) {
    setLabList((prev) =>
      prev.map((l) =>
        l.id === lab.id
          ? { ...l, status: l.status === "inactive" ? "available" : "inactive" }
          : l
      )
    );
  }

  function confirmDelete() {
    if (!deleteTarget) return;
    setLabList((prev) => prev.filter((l) => l.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  // ── Tampilan guru: hanya profil ───────────────────────────────────────────
  if (role === "guru") {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Profil</h1>
            <p className="text-sm text-muted-foreground">Informasi akun pengguna.</p>
          </div>
          <div className="max-w-xl">
            <div className="space-y-5 rounded-lg border border-border bg-card p-6 shadow-card">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{currentUser.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" /> {currentUser.email}
                    </div>
                  </div>
                </div>
                <Badge variant="booking">Guru</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Briefcase className="h-4 w-4" />
                Peran: <span className="font-medium text-foreground">Guru / Staff</span>
              </div>
              <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                Data profil lengkap akan tersedia setelah sistem login diaktifkan.
              </div>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  // ── Tampilan admin: CRUD lab ───────────────────────────────────────────────
  return (
    <AppLayout>
      <div className="space-y-6">

        {/* ── Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Data Lab</h1>
            <p className="text-sm text-muted-foreground">
              Informasi fasilitas dan kapasitas lab komputer.
            </p>
          </div>
          <Button className="gap-2" onClick={openAddForm}>
            <Plus className="h-4 w-4" />
            Tambah Lab
          </Button>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-3 gap-4">
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-card">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total lab</p>
              <p className="text-xl font-semibold text-foreground">{labList.length}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-card">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100 dark:bg-green-950">
              <Check className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Tersedia sekarang</p>
              <p className="text-xl font-semibold text-foreground">{totalTersedia}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 shadow-card">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-950">
              <Users className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total kapasitas</p>
              <p className="text-xl font-semibold text-foreground">{totalKapasitas}</p>
            </div>
          </div>
        </div>

        {/* ── Toolbar pencarian ── */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 w-64 focus-within:ring-1 focus-within:ring-ring">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Cari lab..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {search && (
              <button onClick={() => setSearch("")} aria-label="Hapus pencarian">
                <XIcon className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
          <span className="text-sm text-muted-foreground">
            {filtered.length} lab ditemukan
          </span>
        </div>

        {/* ── Grid lab cards ── */}
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border py-16 text-center text-muted-foreground">
            <Building2 className="mx-auto mb-3 h-8 w-8 opacity-30" />
            <p className="text-sm">Tidak ada lab yang ditemukan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filtered.map((lab) => (
              <div
                key={lab.id}
                className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 shadow-card"
              >
                {/* Card header */}
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{lab.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{lab.location}</span>
                    </div>
                  </div>
                  <StatusBadgeLab status={lab.status} />
                </div>

                <hr className="border-border" />

                {/* Kapasitas & PC */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Users className="h-4 w-4 shrink-0" />
                    Kapasitas:{" "}
                    <span className="font-medium text-foreground tabular-nums">
                      {lab.capacity} siswa
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Monitor className="h-4 w-4 shrink-0" />
                    PC:{" "}
                    <span className="font-medium text-foreground tabular-nums">
                      {lab.pc_count} unit
                    </span>
                  </div>
                </div>

                {/* Fasilitas */}
                {lab.facilities.length > 0 && (
                  <div>
                    <p className="mb-2 text-xs font-medium text-muted-foreground">Fasilitas</p>
                    <div className="flex flex-wrap gap-1.5">
                      {lab.facilities.map((f) => (
                        <span
                          key={f}
                          className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground"
                        >
                          <Monitor className="h-3 w-3" />
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Aksi */}
                <div className="flex items-center gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-primary border-primary/40 hover:bg-primary/5"
                    onClick={() => openEditForm(lab)}
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-amber-600 border-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950"
                    onClick={() => toggleStatus(lab)}
                  >
                    {lab.status === "inactive" ? (
                      <><Power className="h-3.5 w-3.5" /> Aktifkan</>
                    ) : (
                      <><PowerOff className="h-3.5 w-3.5" /> Nonaktifkan</>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="ml-auto gap-1.5 text-destructive border-destructive/40 hover:bg-destructive/5"
                    onClick={() => setDeleteTarget(lab)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Hapus
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ══ Modal: Tambah / Edit Lab ══════════════════════════════════════════ */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-background shadow-lg">
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-sm font-semibold text-foreground">
                {editTarget ? `Edit — ${editTarget.name}` : "Tambah Lab Baru"}
              </h2>
              <button
                onClick={closeForm}
                className="rounded-md p-1 hover:bg-muted"
                aria-label="Tutup"
              >
                <XIcon className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Modal body */}
            <div className="space-y-4 p-5">
              {/* Nama & Kode */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Nama lab <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="cth: Lab Komputer C"
                    className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Kode lab <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.code}
                    onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
                    placeholder="cth: LAB-C"
                    className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>

              {/* Lokasi */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Lokasi / Gedung</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
                  placeholder="cth: Gedung A, Lantai 2"
                  className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              {/* Kapasitas & PC */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Kapasitas (siswa)</label>
                  <input
                    type="number"
                    min={1}
                    value={form.capacity}
                    onChange={(e) => setForm((p) => ({ ...p, capacity: Number(e.target.value) }))}
                    className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground">Jumlah PC</label>
                  <input
                    type="number"
                    min={1}
                    value={form.pc_count}
                    onChange={(e) => setForm((p) => ({ ...p, pc_count: Number(e.target.value) }))}
                    className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>

              {/* Fasilitas */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Fasilitas tersedia</label>
                <div className="flex flex-wrap gap-2">
                  {FACILITY_OPTIONS.map((f) => {
                    const checked = form.facilities.includes(f);
                    return (
                      <button
                        key={f}
                        type="button"
                        onClick={() => toggleFacility(f)}
                        className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
                          checked
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-input bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {checked && <Check className="h-3 w-3" />}
                        {f}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Status awal</label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, status: e.target.value as Lab["status"] }))
                  }
                  className="w-full rounded-md border border-input bg-muted px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="available">Tersedia</option>
                  <option value="busy">Dipakai</option>
                  <option value="inactive">Nonaktif</option>
                </select>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex justify-end gap-2 border-t border-border px-5 py-4">
              <Button variant="outline" size="sm" onClick={closeForm}>
                Batal
              </Button>
              <Button
                size="sm"
                onClick={saveForm}
                disabled={!form.name.trim() || !form.code.trim()}
              >
                <Check className="mr-1.5 h-3.5 w-3.5" />
                {editTarget ? "Simpan perubahan" : "Tambah lab"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ══ Modal: Konfirmasi Hapus ══════════════════════════════════════════ */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl border border-border bg-background p-6 shadow-lg text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <Trash2 className="h-6 w-6 text-destructive" />
            </div>
            <h3 className="mb-1 text-sm font-semibold text-foreground">
              Hapus lab ini?
            </h3>
            <p className="mb-5 text-xs text-muted-foreground">
              Data <strong>{deleteTarget.name}</strong> akan dihapus permanen
              dan tidak bisa dipulihkan.
            </p>
            <div className="flex justify-center gap-3">
              <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>
                Batal
              </Button>
              <Button variant="destructive" size="sm" onClick={confirmDelete}>
                <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                Ya, hapus
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
