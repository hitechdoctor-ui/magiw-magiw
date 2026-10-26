import { AiProductCopilot } from "@/app/admin/components/AiProductCopilot";
import { isAdminAuthenticated } from "@/lib/admin/session";
import { AdminNav } from "@/components/admin/AdminNav";
import { redirect } from "next/navigation";

type AdminProductsPageProps = {
  searchParams: Promise<{ edit?: string; new?: string }>;
};

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    redirect("/admin");
  }

  const params = await searchParams;
  const startFresh =
    params.new === "1" || params.new === "true" || params.new === "yes";
  const editId = startFresh ? "" : (params.edit?.trim() ?? "");

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-400">
            MAGIW MAGIW · Admin
          </p>
          <h1 className="mt-2 font-serif text-3xl text-neutral-950">
            {editId ? "AI · Επεξεργασία προϊόντος" : "AI Product Copilot"}
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            GPT-4o · δομημένο JSON · αποθήκευση στο Supabase{" "}
            <code className="text-xs">products</code>
          </p>
        </div>
        <AdminNav current="copilot" />
      </div>

      <div className="mt-10">
        <AiProductCopilot
          editProductId={editId || undefined}
          startFresh={startFresh}
        />
      </div>
    </div>
  );
}
