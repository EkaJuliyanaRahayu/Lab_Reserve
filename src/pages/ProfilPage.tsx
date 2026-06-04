import AppLayout from "@/components/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { ShieldCheck, User, Mail, Briefcase, Building2, IdCard } from "lucide-react";
import { ReactNode } from "react";

export default function ProfilPage() {
  const { currentUser, role } = useAuth();

  if (!currentUser) return null;

  const isAdmin = role === "admin";

  return (
    <AppLayout>
      <div className="space-y-6">

        {/* Header halaman */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Profil</h1>
          <p className="text-sm text-muted-foreground">
            Informasi akun dan data pengguna.
          </p>
        </div>

        {/* Card profil */}
        <div className="max-w-sm overflow-hidden rounded-xl border border-border bg-card shadow-card">

          {/* Cover banner */}
          <div className={`h-20 w-full ${isAdmin ? "bg-blue-50 dark:bg-blue-950" : "bg-green-50 dark:bg-green-950"}`} />

          {/* Avatar — mengambang di atas banner */}
          <div className="flex items-end gap-3 px-5" style={{ marginTop: "-28px" }}>
            <div
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border-[3px] border-card text-lg font-semibold
                ${isAdmin
                  ? "bg-primary text-primary-foreground"
                  : "bg-green-700 text-white"
                }`}
            >
              {currentUser.initials}
            </div>

            {/* Badge role di samping avatar */}
            {isAdmin ? (
              <span className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-800 dark:bg-blue-950 dark:text-blue-200">
                <ShieldCheck className="h-3 w-3" />
                Admin
              </span>
            ) : (
              <span className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-medium text-green-800 dark:bg-green-950 dark:text-green-200">
                <User className="h-3 w-3" />
                Guru
              </span>
            )}
          </div>

          {/* Nama & email */}
          <div className="px-5 pb-4 pt-3">
            <p className="text-base font-semibold text-foreground">
              {currentUser.name}
            </p>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Mail className="h-3 w-3 shrink-0" />
              {currentUser.email}
            </p>
          </div>

          <hr className="border-border" />

          {/* Info rows */}
          <div className="divide-y divide-border px-1">
            <InfoRow icon={<Briefcase className="h-4 w-4" />} label="Peran"
              value={isAdmin ? "Administrator Sistem" : "Guru / Staff"} />
            <InfoRow icon={<Building2 className="h-4 w-4" />} label="Instansi"
              value="SMK Manajemen Lab" />
            <InfoRow icon={<IdCard className="h-4 w-4" />} label="ID Akun"
              value={currentUser.id} mono />
          </div>

        </div>
      </div>
    </AppLayout>
  );
}

function InfoRow({
  icon, label, value, mono = false,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`mt-0.5 text-sm font-medium text-foreground ${mono ? "font-mono" : ""}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
