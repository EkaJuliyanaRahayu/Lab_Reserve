import { Badge } from "@/components/ui/badge";

type StatusType = 'routine' | 'approved' | 'pending' | 'rejected';

const statusConfig: Record<StatusType, { label: string; variant: 'routine' | 'booking' | 'pending' | 'destructive' }> = {
  routine: { label: 'Jadwal Rutin', variant: 'routine' },
  approved: { label: 'Disetujui', variant: 'booking' },
  pending: { label: 'Pending', variant: 'pending' },
  rejected: { label: 'Ditolak', variant: 'destructive' },
};

export default function StatusBadge({ status }: { status: StatusType }) {
  const config = statusConfig[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
