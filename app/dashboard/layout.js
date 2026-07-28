import DashboardLayoutClient from "@/components/dashboard/DashboardLayoutClient";
import { getCurrentDashboardRole } from "@/lib/dashboard-role-server";

// Server Component: hitung role dashboard user yang login SEKALI di sini,
// lalu diteruskan ke client layout (DashboardLayoutClient) lewat
// DashboardRoleProvider. Middleware sudah menjamin cuma admin (master
// atau admin divisi) yang bisa nyampe ke sini.
export default async function DashboardLayout({ children }) {
  const role = await getCurrentDashboardRole();

  return (
    <DashboardLayoutClient role={role}>{children}</DashboardLayoutClient>
  );
}
