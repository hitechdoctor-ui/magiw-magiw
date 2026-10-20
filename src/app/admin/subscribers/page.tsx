import { AdminSubscribersPanel } from "@/components/admin/AdminSubscribersPanel";
import { isAdminAuthenticated } from "@/lib/admin/session";
import { redirect } from "next/navigation";

export default async function AdminSubscribersPage() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    redirect("/admin");
  }

  return <AdminSubscribersPanel />;
}
