import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { schedules, bookings, DAYS, HOURS, type Schedule, type Booking } from "@/data/mockData";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

interface WeeklyCalendarProps {
  selectedLabId: string;
  weekStartDate: Date;
  onSlotClick?: (dayIndex: number, hour: number) => void;
  conflictSlot?: { dayIndex: number; startHour: number; endHour: number } | null;
}

type SlotData = {
  type: 'routine' | 'booking' | 'pending';
  schedule?: Schedule;
  booking?: Booking;
};

export default function WeeklyCalendar({ selectedLabId, weekStartDate, onSlotClick, conflictSlot }: WeeklyCalendarProps) {
  const slotMap = useMemo(() => {
    const map = new Map<string, SlotData>();
    
    // 1. Tambahkan jadwal rutin statis
    schedules
      .filter(s => s.lab_id === selectedLabId)
      .forEach(s => {
        for (let h = s.start_hour; h < s.end_hour; h++) {
          map.set(`${s.day}-${h}`, { type: 'routine', schedule: s });
        }
      });

    // 2. Tambahkan booking statis
    bookings
      .filter(b => b.lab_id === selectedLabId && (b.status === 'approved' || b.status === 'pending'))
      .forEach(b => {
        const bDate = new Date(b.date);
        const dayDiff = Math.floor((bDate.getTime() - weekStartDate.getTime()) / (1000 * 60 * 60 * 24));
        if (dayDiff >= 0 && dayDiff <= 5) {
          for (let h = b.start_hour; h < b.end_hour; h++) {
            map.set(`${dayDiff}-${h}`, { type: b.status === 'approved' ? 'booking' : 'pending', booking: b });
          }
        }
      });

    return map;
  }, [selectedLabId, weekStartDate]);

  const isConflict = (dayIndex: number, hour: number) => {
    if (!conflictSlot) return false;
    return conflictSlot.dayIndex === dayIndex && hour >= conflictSlot.startHour && hour < conflictSlot.endHour;
  };

  const isBlockStart = (dayIndex: number, hour: number, data: SlotData) => {
    const prevKey = `${dayIndex}-${hour - 1}`;
    const prevData = slotMap.get(prevKey);
    if (!prevData) return true;
    if (data.schedule && prevData.schedule) return data.schedule.id !== prevData.schedule.id;
    if (data.booking && prevData.booking) return data.booking.id !== prevData.booking.id;
    return true;
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-border shadow-card">
      <div className="min-w-[700px]">
        {/* Header */}
        <div className="grid grid-cols-[60px_repeat(6,1fr)] bg-muted">
          <div className="p-2 text-xs font-medium text-muted-foreground border-b border-r border-border">Jam</div>
          {DAYS.map((day, i) => (
            <div key={day} className={cn(
              "p-2 text-xs font-medium text-center border-b border-border text-foreground",
              i < 5 ? "border-r" : ""
            )}>
              {day}
            </div>
          ))}
        </div>

        {/* Time slots */}
        {HOURS.map(hour => (
          <div key={hour} className="grid grid-cols-[60px_repeat(6,1fr)]">
            <div className="flex items-center justify-center border-b border-r border-border p-1 text-xs tabular-nums text-muted-foreground">
              {String(hour).padStart(2, '0')}:00
            </div>
            {DAYS.map((_, dayIndex) => {
              const key = `${dayIndex}-${hour}`;
              const data = slotMap.get(key);
              const conflict = isConflict(dayIndex, hour);
              const showLabel = data ? isBlockStart(dayIndex, hour, data) : false;

              return (
                <motion.div
                  key={key}
                  className={cn(
                    "relative min-h-[48px] border-b border-border p-1 transition-colors cursor-pointer group",
                    dayIndex < 5 && "border-r",
                    !data && "hover:bg-primary/5",
                    data?.type === 'routine' && "bg-routine-subtle",
                    data?.type === 'booking' && "bg-booking-subtle",
                    data?.type === 'pending' && "bg-pending-subtle",
                    conflict && "animate-conflict bg-routine-subtle ring-1 ring-routine"
                  )}
                  onClick={() => !data && onSlotClick?.(dayIndex, hour)}
                >
                  {showLabel && data?.type === 'routine' && data.schedule && (
                    <div className="text-[10px] leading-tight">
                      <p className="font-semibold text-routine">{data.schedule.class_name}</p>
                      <p className="text-muted-foreground">{data.schedule.teacher}</p>
                    </div>
                  )}
                  {showLabel && (data?.type === 'booking' || data?.type === 'pending') && data.booking && (
                    <div className="text-[10px] leading-tight">
                      <p className={cn("font-semibold", data.type === 'booking' ? "text-booking-foreground" : "text-pending-foreground")}>
                        {data.booking.teacher}
                      </p>
                      <p className="text-muted-foreground truncate">{data.booking.purpose}</p>
                    </div>
                  )}
                  {!data && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="h-4 w-4 text-muted-foreground" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 border-t border-border bg-muted/50 px-4 py-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="h-3 w-3 rounded-sm bg-routine-subtle border border-routine-border" />
          Jadwal Rutin
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="h-3 w-3 rounded-sm bg-booking-subtle border border-booking-border" />
          Disetujui
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="h-3 w-3 rounded-sm bg-pending-subtle border border-pending-border" />
          Pending
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <div className="h-3 w-3 rounded-sm bg-background border border-border" />
          Kosong
        </div>
      </div>
    </div>
  );
}