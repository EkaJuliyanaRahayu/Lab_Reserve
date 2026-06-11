import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus } from "lucide-react";
// Asumsi kamu memiliki komponen UI dasar seperti Input, Label, Select, atau Modal/Dialog
// import { Input } from "@/components/ui/input"; 
// import { Dialog } from "@/components/ui/dialog";

// Tipe Data untuk Ruangan Lab
interface LabRoom {
  id: string;
  name: string;
  capacity: number;
  facilities: string; // Teks deskriptif, misal: "AC, Proyektor, Papan Tulis"
  status: "Tersedia" | "Maintenance";
}

export default function ManageLabs() {
  // State sementara (Mock Data) sebelum dihubungkan ke backend
  const [labs, setLabs] = useState<LabRoom[]>([
    {
      id: "lab-1",
      name: "Laboratorium Komputer Utama",
      capacity: 36,
      facilities: "AC, 36 PC Siswa, 1 PC Guru, Proyektor",
      status: "Tersedia",
    },
  ]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLab, setEditingLab] = useState<LabRoom | null>(null);

  // Handler untuk membuka modal tambah data
  const handleAddClick = () => {
    setEditingLab(null);
    setIsFormOpen(true);
  };

  // Handler untuk membuka modal edit data
  const handleEditClick = (lab: LabRoom) => {
    setEditingLab(lab);
    setIsFormOpen(true);
  };

  // Handler untuk menghapus data (Contoh alert)
  const handleDeleteClick = (id: string) => {
    if (window.confirm("Yakin ingin menghapus data laboratorium ini?")) {
      setLabs(labs.filter((lab) => lab.id !== id));
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Kelola Laboratorium</h1>
            <p className="text-sm text-muted-foreground">Tambah, edit, atau hapus data ruangan laboratorium.</p>
          </div>
          <Button onClick={handleAddClick} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Tambah Lab Baru
          </Button>
        </div>

        {/* Tabel Data Laboratorium */}
        <div className="rounded-md border bg-card text-card-foreground shadow-sm">
          <div className="p-6 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-4 py-3">Nama Ruangan</th>
                  <th className="px-4 py-3">Kapasitas</th>
                  <th className="px-4 py-3">Fasilitas Ruangan</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {labs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                      Belum ada data laboratorium.
                    </td>
                  </tr>
                ) : (
                  labs.map((lab) => (
                    <tr key={lab.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{lab.name}</td>
                      <td className="px-4 py-3">{lab.capacity} Siswa</td>
                      <td className="px-4 py-3 text-muted-foreground">{lab.facilities}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          lab.status === "Tersedia" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {lab.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEditClick(lab)}>
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteClick(lab.id)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Form Tambah/Edit akan diletakkan di sini */}
        {/* Kamu bisa menggunakan Dialog component dari shadcn untuk membungkus form */}
      </div>
    </AppLayout>
  );
}