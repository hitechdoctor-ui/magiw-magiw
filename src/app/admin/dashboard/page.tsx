import { AdminDashboardPanel } from "@/components/admin/AdminDashboardPanel";
import { isAdminAuthenticated } from "@/lib/admin/session";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }

  return <AdminDashboardPanel />;
}
