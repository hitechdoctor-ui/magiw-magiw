import { AdminOrdersPanel } from "@/components/admin/AdminOrdersPanel";
import { isAdminAuthenticated } from "@/lib/admin/session";
import { getAdminOrderProductOptions } from "@/lib/data/products-server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin");
  }

  const products = await getAdminOrderProductOptions();

  return <AdminOrdersPanel products={products} />;
}
