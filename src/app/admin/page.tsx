import { AdminLoginClient } from "@/components/admin/AdminLoginClient";
import { isAdminAuthenticated } from "@/lib/admin/session";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin/dashboard");
  }

  return <AdminLoginClient />;
}
