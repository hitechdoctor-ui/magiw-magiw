import { AdminOrdersPanel } from "@/components/admin/AdminOrdersPanel";
import { isAdminAuthenticated } from "@/lib/admin/session";
import { redirect } from "next/navigation";

export default async function AdminOrdersPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }

  return <AdminOrdersPanel />;
}
