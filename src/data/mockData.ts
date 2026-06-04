export interface Lab {
  id: string;
  name: string;
  capacity: number;
  facilities: string[];
  location: string;
  status: 'available' | 'in-use';
}

export interface Schedule {
  id: string;
  lab_id: string;
  day: number;
  start_hour: number;
  end_hour: number;
  class_name: string;
  teacher: string;
  subject: string;
}

export interface Booking {
  id: string;
  lab_id: string;
  date: string;
  start_hour: number;
  end_hour: number;
  teacher: string;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected';
  notes?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
  created_at: string;
}

// ── BARU: tipe user untuk login ─────────────────────────────────────────────
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;          // di produksi nyata ini harus di-hash di backend
  role: 'admin' | 'guru';
  initials: string;
}

// ── BARU: daftar akun yang bisa login ───────────────────────────────────────
export const users: User[] = [
  {
    id: 'u1',
    name: 'Admin Sekolah',
    email: 'admin@smk.sch.id',
    password: 'admin123',
    role: 'admin',
    initials: 'AS',
  },
  {
    id: 'u2',
    name: 'Pak Budi',
    email: 'budi@smk.sch.id',
    password: 'budi123',
    role: 'guru',
    initials: 'PB',
  },
  {
    id: 'u3',
    name: 'Bu Sari',
    email: 'sari@smk.sch.id',
    password: 'sari123',
    role: 'guru',
    initials: 'BS',
  },
  {
    id: 'u4',
    name: 'Pak Fajar',
    email: 'fajar@smk.sch.id',
    password: 'fajar123',
    role: 'guru',
    initials: 'PF',
  },
];

export const DAYS  = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
export const HOURS = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

export const labs: Lab[] = [
  {
    id: 'lab-1',
    name: 'Lab Komputer',
    capacity: 36,
    facilities: ['PC 36 Unit', 'Proyektor', 'AC', 'Whiteboard'],
    location: 'Gedung A Lt.2',
    status: 'available',
  },
];

export const schedules: Schedule[] = [
  { id: 's1', lab_id: 'lab-1', day: 0, start_hour: 7,  end_hour: 9,  class_name: 'XII RPL 1', teacher: 'Pak Ahmad', subject: 'Pemrograman Web' },
  { id: 's2', lab_id: 'lab-1', day: 0, start_hour: 10, end_hour: 12, class_name: 'XI RPL 2',  teacher: 'Bu Sari',   subject: 'Basis Data' },
  { id: 's3', lab_id: 'lab-1', day: 1, start_hour: 8,  end_hour: 10, class_name: 'XI TKJ 2',  teacher: 'Pak Budi',  subject: 'Pemrograman Dasar' },
  { id: 's4', lab_id: 'lab-1', day: 2, start_hour: 13, end_hour: 15, class_name: 'X RPL 1',   teacher: 'Pak Ahmad', subject: 'Dasar Pemrograman' },
  { id: 's5', lab_id: 'lab-1', day: 3, start_hour: 8,  end_hour: 10, class_name: 'XII TKJ 1', teacher: 'Pak Dedi',  subject: 'Administrasi Jaringan' },
  { id: 's6', lab_id: 'lab-1', day: 1, start_hour: 13, end_hour: 15, class_name: 'XI TKJ 1',  teacher: 'Pak Dedi',  subject: 'Jaringan Dasar' },
];

export const bookings: Booking[] = [
  { id: 'b1', lab_id: 'lab-1', date: '2026-05-19', start_hour: 13, end_hour: 15, teacher: 'Pak Budi',  purpose: 'Ujian Praktik Kelas XI', status: 'approved', created_at: '2026-05-16T08:00:00Z' },
  { id: 'b2', lab_id: 'lab-1', date: '2026-05-20', start_hour: 7,  end_hour: 9,  teacher: 'Bu Sari',   purpose: 'Rapat Kurikulum',        status: 'approved', created_at: '2026-05-17T09:00:00Z' },
  { id: 'b3', lab_id: 'lab-1', date: '2026-05-21', start_hour: 10, end_hour: 12, teacher: 'Pak Fajar', purpose: 'Workshop Desain',         status: 'pending',  created_at: '2026-05-18T10:00:00Z' },
  { id: 'b4', lab_id: 'lab-1', date: '2026-05-22', start_hour: 13, end_hour: 16, teacher: 'Bu Rina',   purpose: 'Pelatihan Guru',          status: 'pending',  created_at: '2026-05-18T14:00:00Z' },
  { id: 'b5', lab_id: 'lab-1', date: '2026-05-18', start_hour: 13, end_hour: 15, teacher: 'Pak Dedi',  purpose: 'Ujian Sertifikasi',       status: 'approved', created_at: '2026-05-12T08:00:00Z' },
  { id: 'b6', lab_id: 'lab-1', date: '2026-05-23', start_hour: 10, end_hour: 12, teacher: 'Pak Ahmad', purpose: 'Praktik Jaringan',        status: 'rejected', notes: 'Lab sedang maintenance', created_at: '2026-05-13T08:00:00Z' },
];

export const notifications: Notification[] = [
  { id: 'n1', message: 'Peminjaman Lab Komputer oleh Pak Budi telah disetujui.',      type: 'success', read: false, created_at: '2026-05-19T08:00:00Z' },
  { id: 'n2', message: 'Permintaan baru: Pak Fajar ingin meminjam Lab Komputer.',     type: 'info',    read: false, created_at: '2026-05-18T10:00:00Z' },
  { id: 'n3', message: 'Peminjaman Lab Komputer oleh Pak Ahmad ditolak.',             type: 'warning', read: true,  created_at: '2026-05-17T14:00:00Z' },
];

export function getLabName(labId: string): string {
  return labs.find(l => l.id === labId)?.name ?? labId;
}

export function checkRoutineConflict(
  labId: string, dayIndex: number, startHour: number, endHour: number
): Schedule | null {
  return schedules.find(s =>
    s.lab_id === labId && s.day === dayIndex &&
    s.start_hour < endHour && s.end_hour > startHour
  ) ?? null;
}

export function checkBookingConflict(
  labId: string, date: string, startHour: number, endHour: number
): Booking | null {
  return bookings.find(b =>
    b.lab_id === labId && b.date === date &&
    b.status === 'approved' &&
    b.start_hour < endHour && b.end_hour > startHour
  ) ?? null;
}