import { AdminCatalogPanel } from "@/components/admin/AdminCatalogPanel";
import { isAdminAuthenticated } from "@/lib/admin/session";
import { redirect } from "next/navigation";

export default async function AdminCatalogPage() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    redirect("/admin");
  }

  return <AdminCatalogPanel />;
}
