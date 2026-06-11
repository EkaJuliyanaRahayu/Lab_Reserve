import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import RoutineScheduleForm from "@/components/RoutineScheduleForm"; 

interface RoutineSchedule {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  className: string;
  subject: string;
  teacher: string;
}

export default function ManageSchedules() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Data dummy lokal khusus untuk tampilan halaman ini
  const [schedules, setSchedules] = useState<RoutineSchedule[]>([
    {
      id: "sch-1",
      day: "Senin",
      startTime: "07:00",
      endTime: "08:30",
      className: "XII RPL 1",
      subject: "Pemrograman Web",
      teacher: "Bpk. Budi Santoso",
    },
    {
      id: "sch-2",
      day: "Selasa",
      startTime: "09:00",
      endTime: "10:30",
      className: "XI TKJ 2",
      subject: "Jaringan Dasar",
      teacher: "Ibu Siti Aminah",
    }
  ]);

  const handleDelete = (id: string) => {
    if (window.confirm("Yakin ingin menghapus jadwal rutin ini?")) {
      setSchedules(schedules.filter(sch => sch.id !== id));
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Kelola Jadwal Rutin</h1>
            <p className="text-sm text-muted-foreground">
              Atur jadwal tetap pembelajaran sekolah untuk mencegah bentrok peminjaman.
            </p>
          </div>
          <Button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Tambah Jadwal
          </Button>
        </div>

        {/* Tabel Jadwal Rutin */}
        <div className="rounded-md border bg-card text-card-foreground shadow-sm">
          <div className="p-6 overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-4 py-3">Hari</th>
                  <th className="px-4 py-3">Waktu</th>
                  <th className="px-4 py-3">Kelas</th>
                  <th className="px-4 py-3">Mata Pelajaran</th>
                  <th className="px-4 py-3">Guru Pengampu</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {schedules.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                      Belum ada jadwal rutin yang terdaftar.
                    </td>
                  </tr>
                ) : (
                  schedules.map((sch) => (
                    <tr key={sch.id} className="border-b last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium">{sch.day}</td>
                      <td className="px-4 py-3">{sch.startTime} - {sch.endTime}</td>
                      <td className="px-4 py-3">{sch.className}</td>
                      <td className="px-4 py-3">{sch.subject}</td>
                      <td className="px-4 py-3">{sch.teacher}</td>
                      <td className="px-4 py-3 flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => alert("Fitur edit menyusul di versi backend")}>
                          <Edit className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDelete(sch.id)}>
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
      </div>

      <RoutineScheduleForm 
        open={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
      />
    </AppLayout>
  );
}