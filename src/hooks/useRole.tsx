import { createContext, useContext, useState, ReactNode } from "react";

type Role = "admin" | "guru";

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
  currentUser: { name: string; email: string; initials: string };
}

const RoleContext = createContext<RoleContextType | null>(null);

const users: Record<Role, { name: string; email: string; initials: string }> = {
  admin: { name: "Admin Sekolah", email: "admin@smk.sch.id", initials: "AS" },
  guru: { name: "Pak Budi", email: "budi@smk.sch.id", initials: "PB" },
};

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("admin");
  return (
    <RoleContext.Provider value={{ role, setRole, currentUser: users[role] }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be inside RoleProvider");
  return ctx;
}
