import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { labs, DAYS, HOURS, checkRoutineConflict, checkBookingConflict } from "@/data/mockData";
import { AlertTriangle, CheckCircle2, X, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface BookingFormProps {
  open: boolean;
  onClose: () => void;
  prefill?: { labId?: string; dayIndex?: number; hour?: number };
  onConflictFound?: (conflict: { dayIndex: number; startHour: number; endHour: number } | null) => void;
}

export default function BookingForm({ open, onClose, prefill, onConflictFound }: BookingFormProps) {
  const [labId, setLabId] = useState(prefill?.labId ?? "");
  const [date, setDate] = useState("");
  const [startHour, setStartHour] = useState(prefill?.hour?.toString() ?? "");
  const [endHour, setEndHour] = useState(prefill?.hour ? (prefill.hour + 1).toString() : "");
  const [purpose, setPurpose] = useState("");

  const dateObj = date ? new Date(date) : null;
  // getDay: 0=Sun, 1=Mon... We need 0=Mon
  const dayIndex = dateObj ? (dateObj.getDay() === 0 ? 6 : dateObj.getDay() - 1) : -1;

  const validation = useMemo(() => {
    if (!labId || !date || !startHour || !endHour) return { valid: false, message: null };
    const start = parseInt(startHour);
    const end = parseInt(endHour);
    if (end <= start) return { valid: false, message: "Jam selesai harus setelah jam mulai.", type: "error" as const };
    if (dayIndex < 0 || dayIndex > 5) return { valid: false, message: "Lab hanya tersedia Senin–Sabtu.", type: "error" as const };

    // Gate 1: Routine check
    const routineConflict = checkRoutineConflict(labId, dayIndex, start, end);
    if (routineConflict) {
      onConflictFound?.({ dayIndex, startHour: routineConflict.start_hour, endHour: routineConflict.end_hour });
      return {
        valid: false,
        type: "routine" as const,
        message: `Lab sedang digunakan oleh ${routineConflict.class_name} — ${routineConflict.teacher} (Jadwal Rutin).`,
      };
    }

    // Gate 2: Booking check
    const bookingConflict = checkBookingConflict(labId, date, start, end);
    if (bookingConflict) {
      onConflictFound?.({ dayIndex, startHour: bookingConflict.start_hour, endHour: bookingConflict.end_hour });
      return {
        valid: false,
        type: "booking" as const,
        message: `Lab sudah dipesan oleh ${bookingConflict.teacher} untuk ${bookingConflict.purpose}.`,
      };
    }

    onConflictFound?.(null);
    return { valid: true, type: "success" as const, message: "Slot tersedia! Anda dapat mengajukan peminjaman." };
  }, [labId, date, startHour, endHour, dayIndex, onConflictFound]);

  const handleSubmit = () => {
    if (!validation.valid || !purpose.trim()) return;
    toast.success("Permintaan dikirim. Menunggu persetujuan Admin.");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-lg rounded-lg border border-border bg-card shadow-modal mx-4"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Ajukan Peminjaman Lab</h2>
                <p className="text-sm text-muted-foreground">Pesan ruang praktikum tanpa bentrok.</p>
              </div>
              <button onClick={onClose} className="rounded-md p-1 text-muted-foreground hover:bg-muted transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4 p-6">
              <div>
                <Label className="text-sm font-medium">Lab</Label>
                <Select value={labId} onValueChange={setLabId}>
                  <SelectTrigger className="mt-1.5"><SelectValue placeholder="Pilih lab" /></SelectTrigger>
                  <SelectContent>
                    {labs.map(lab => (
                      <SelectItem key={lab.id} value={lab.id}>{lab.name} — {lab.location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium">Tanggal</Label>
                <Input type="date" className="mt-1.5 tabular-nums" value={date} onChange={e => setDate(e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm font-medium">Jam Mulai</Label>
                  <Select value={startHour} onValueChange={setStartHour}>
                    <SelectTrigger className="mt-1.5 tabular-nums"><SelectValue placeholder="Mulai" /></SelectTrigger>
                    <SelectContent>
                      {HOURS.map(h => (
                        <SelectItem key={h} value={h.toString()}>{String(h).padStart(2, '0')}:00</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm font-medium">Jam Selesai</Label>
                  <Select value={endHour} onValueChange={setEndHour}>
                    <SelectTrigger className="mt-1.5 tabular-nums"><SelectValue placeholder="Selesai" /></SelectTrigger>
                    <SelectContent>
                      {HOURS.map(h => (
                        <SelectItem key={h + 1} value={(h + 1).toString()}>{String(h + 1).padStart(2, '0')}:00</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Validation feedback */}
              {validation.message && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex items-start gap-2 rounded-lg border p-3 text-sm",
                    validation.type === 'success' && "border-booking-border bg-booking-subtle text-booking-foreground",
                    (validation.type === 'routine' || validation.type === 'error') && "border-routine-border bg-routine-subtle text-routine",
                    validation.type === 'booking' && "border-pending-border bg-pending-subtle text-pending-foreground",
                  )}
                >
                  {validation.type === 'success' ? (
                    <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                  )}
                  <span>{validation.message}</span>
                </motion.div>
              )}

              <div>
                <Label className="text-sm font-medium">Keperluan</Label>
                <Textarea
                  className="mt-1.5 resize-none"
                  rows={2}
                  placeholder="Praktik, ujian, rapat, pelatihan..."
                  value={purpose}
                  onChange={e => setPurpose(e.target.value)}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-2 border-t border-border px-6 py-4">
              <Button variant="outline" onClick={onClose}>Batal</Button>
              <Button
                disabled={!validation.valid || !purpose.trim()}
                onClick={handleSubmit}
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                Kirim Permintaan
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
