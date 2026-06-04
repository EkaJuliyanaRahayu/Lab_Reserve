import { useRole } from "@/hooks/useAuth";
import AdminDashboard from "./AdminDashboard";
import GuruDashboard from "./GuruDashboard";

export default function Index() {
  const { role } = useRole();
  return role === "admin" ? <AdminDashboard /> : <GuruDashboard />;
}
