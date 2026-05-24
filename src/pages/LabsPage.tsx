import AppLayout from "@/components/AppLayout";
import { labs } from "@/data/mockData";
import { useRole } from "@/hooks/useRole";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Users, Monitor, User, Mail, Briefcase } from "lucide-react";

export default function LabsPage() {
  const { role, currentUser } = useRole();

  if (role === "guru") {
    return (
      <AppLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Profil</h1>
            <p className="text-sm text-muted-foreground">Informasi akun pengguna.</p>
          </div>

          <div className="max-w-xl">
            <div className="rounded-lg border border-border bg-card shadow-card p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{currentUser.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      {currentUser.email}
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

  const lab = labs[0];
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Data Lab</h1>
          <p className="text-sm text-muted-foreground">Informasi fasilitas dan kapasitas lab komputer.</p>
        </div>

        <div className="max-w-xl">
          <div className="rounded-lg border border-border bg-card shadow-card p-6 space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Building2 className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{lab.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {lab.location}
                  </div>
                </div>
              </div>
              <Badge variant="booking">Tersedia</Badge>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              Kapasitas: <span className="font-medium tabular-nums text-foreground">{lab.capacity}</span> siswa
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">Fasilitas</p>
              <div className="flex flex-wrap gap-2">
                {lab.facilities.map(f => (
                  <div key={f} className="flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-sm text-muted-foreground">
                    <Monitor className="h-3.5 w-3.5" />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
