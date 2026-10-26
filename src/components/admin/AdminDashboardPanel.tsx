import { AdminNav } from "@/components/admin/AdminNav";
import { AdminProductThumbnail } from "@/components/admin/AdminProductThumbnail";
import { AdminStoredProductShopControls } from "@/components/admin/AdminStoredProductShopControls";
import { listAllStoredProducts } from "@/lib/products/store";
import { listCheckoutOrders } from "@/lib/orders/store";
import { listSubscribers } from "@/lib/subscribers/store";
import { formatPricePrecise } from "@/lib/utils/format";
import Link from "next/link";

export async function AdminDashboardPanel() {
  const [products, orders, subscribers] = await Promise.all([
    listAllStoredProducts(),
    listCheckoutOrders(),
    listSubscribers(),
  ]);

  const drafts = products.filter((p) => !p.is_active);
  const published = products.filter((p) => p.is_active);
  const recent = products.slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-400">
            MAGIW MAGIW · Admin
          </p>
          <h1 className="mt-2 font-serif text-3xl text-neutral-950">Dashboard</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Καλημέρα — εδώ ξεκινάς: προϊόντα, AI επεξεργασία, δημοσίευση.
          </p>
        </div>
        <AdminNav current="dashboard" />
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Πρόχειρα", value: drafts.length },
          { label: "Δημοσιευμένα (DB)", value: published.length },
          { label: "Παραγγελίες", value: orders.length },
          { label: "Launch εγγραφές", value: subscribers.length },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-sm border border-stone-200 bg-white px-4 py-5"
          >
            <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-400">
              {stat.label}
            </p>
            <p className="mt-2 font-serif text-3xl text-neutral-950">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/admin/products?new=1"
          className="bg-neutral-950 px-5 py-3 text-[10px] uppercase tracking-[0.22em] text-white hover:bg-neutral-800"
        >
          Νέο προϊόν (AI)
        </Link>
        <Link
          href="/admin/catalog"
          className="border border-neutral-900 px-5 py-3 text-[10px] uppercase tracking-[0.22em] hover:bg-neutral-950 hover:text-white"
        >
          Όλα τα προϊόντα
        </Link>
      </div>

      <div className="mt-12">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-serif text-xl text-neutral-950">Πρόσφατα προϊόντα (AI / DB)</h2>
          <Link
            href="/admin/catalog"
            className="text-[10px] uppercase tracking-[0.22em] text-neutral-500 hover:text-neutral-900"
          >
            Όλα →
          </Link>
        </div>

        {recent.length === 0 ? (
          <p className="mt-4 text-sm text-neutral-500">
            Δεν υπάρχουν ακόμα προϊόντα στη βάση —{" "}
            <Link href="/admin/products?new=1" className="underline">
              δημιούργησε με AI
            </Link>
            .
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-stone-200 rounded-sm border border-stone-200 bg-white">
            {recent.map((product) => (
              <li
                key={product.id}
                className="flex flex-wrap items-start justify-between gap-4 px-4 py-4 sm:gap-6"
              >
                <div className="flex min-w-0 flex-1 gap-4">
                  <AdminProductThumbnail product={product} />
                  <div className="min-w-0 flex-1">
                  <p className="font-medium text-neutral-950">{product.name}</p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {product.sku} ·{" "}
                    {formatPricePrecise(product.price_cents, product.currency)}
                  </p>
                  <div className="mt-3 max-w-xs">
                    <AdminStoredProductShopControls product={product} compact />
                  </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/admin/products?edit=${product.id}`}
                    className="border border-neutral-900 px-3 py-2 text-[10px] uppercase tracking-[0.18em] hover:bg-neutral-950 hover:text-white"
                  >
                    Επεξεργασία AI
                  </Link>
                  <Link
                    href={
                      product.is_active
                        ? `/product/${product.slug}`
                        : `/product/${product.slug}?preview=draft`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-neutral-500 underline hover:text-neutral-900"
                  >
                    PDP
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
