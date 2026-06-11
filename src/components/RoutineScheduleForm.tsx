import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// Daftar hari untuk dropdown
const DAYS = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];

interface RoutineScheduleFormProps {
  open: boolean;
  onClose: () => void;
  prefill?: { dayIndex?: number; hour?: number };
}

export default function RoutineScheduleForm({ open, onClose, prefill }: RoutineScheduleFormProps) {
  // State untuk form
  const [dayIndex, setDayIndex] = useState<number>(1); // Default Senin
  const [startTime, setStartTime] = useState<string>("07:00");
  const [endTime, setEndTime] = useState<string>("08:30");
  const [className, setClassName] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [teacher, setTeacher] = useState<string>("");

  // Mengisi form secara otomatis jika admin mengklik slot kosong di kalender
  useEffect(() => {
    if (prefill?.dayIndex !== undefined) setDayIndex(prefill.dayIndex);
    if (prefill?.hour !== undefined) {
      const formattedHour = prefill.hour.toString().padStart(2, "0") + ":00";
      const endHour = (prefill.hour + 1).toString().padStart(2, "0") + ":00";
      setStartTime(formattedHour);
      setEndTime(endHour);
    }
  }, [prefill, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi dasar di frontend
    if (!className || !subject || !teacher) {
      toast.error("Harap isi semua kolom data jadwal rutin.");
      return;
    }

    if (startTime >= endTime) {
      toast.error("Jam selesai harus lebih besar dari jam mulai.");
      return;
    }

    // Payload yang nantinya akan dikirim ke backend/state global
    const payload = {
      dayOfWeek: dayIndex,
      startTime,
      endTime,
      className,
      subject,
      teacher,
      type: "routine" 
    };

    console.log("Menyimpan Jadwal Rutin:", payload);
    toast.success("Jadwal rutin berhasil ditambahkan!");
    
    // Reset form & tutup modal
    setClassName("");
    setSubject("");
    setTeacher("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Jadwal Rutin Lab</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Hari</Label>
            <select 
              className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={dayIndex}
              onChange={(e) => setDayIndex(Number(e.target.value))}
            >
              {DAYS.map((day, index) => (
                <option key={index} value={index}>{day}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Waktu</Label>
            <div className="col-span-3 flex items-center gap-2">
              <Input 
                type="time" 
                value={startTime} 
                onChange={(e) => setStartTime(e.target.value)} 
                required 
              />
              <span>-</span>
              <Input 
                type="time" 
                value={endTime} 
                onChange={(e) => setEndTime(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Kelas</Label>
            <Input 
              className="col-span-3" 
              placeholder="Contoh: XII RPL 1" 
              value={className} 
              onChange={(e) => setClassName(e.target.value)} 
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Mata Pelajaran</Label>
            <Input 
              className="col-span-3" 
              placeholder="Contoh: Basis Data" 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)} 
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Guru</Label>
            <Input 
              className="col-span-3" 
              placeholder="Nama Guru Pengampu" 
              value={teacher} 
              onChange={(e) => setTeacher(e.target.value)} 
            />
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>Batal</Button>
            <Button type="submit">Simpan Jadwal</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}