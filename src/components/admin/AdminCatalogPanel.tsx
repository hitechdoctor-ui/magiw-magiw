import { AdminProductThumbnail } from "@/components/admin/AdminProductThumbnail";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminStoredProductShopControls } from "@/components/admin/AdminStoredProductShopControls";
import { getAllProducts } from "@/lib/data/products";
import { listStaticCatalogOverrides } from "@/lib/products/static-catalog-overrides";
import { listAllStoredProducts } from "@/lib/products/store";
import { AdminStaticProductShopControls } from "@/components/admin/AdminStaticProductShopControls";
import { formatPricePrecise } from "@/lib/utils/format";
import Link from "next/link";

export async function AdminCatalogPanel() {
  const [stored, staticCatalog, staticOverrides] = await Promise.all([
    listAllStoredProducts(),
    Promise.resolve(getAllProducts()),
    listStaticCatalogOverrides(),
  ]);

  const overrideBySlug = new Map(staticOverrides.map((row) => [row.slug, row]));
  const storedSlugs = new Set(stored.map((p) => p.slug));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-400">
            MAGIW MAGIW · Admin
          </p>
          <h1 className="mt-2 font-serif text-3xl text-neutral-950">Όλα τα προϊόντα</h1>
          <p className="mt-2 text-sm text-neutral-600">
            {staticCatalog.length} στο static catalog · {stored.length} στη βάση /
            Copilot
          </p>
        </div>
        <AdminNav current="catalog" />
      </div>

      {stored.length > 0 && (
        <div className="mt-10 overflow-x-auto rounded-sm border border-stone-200 bg-white">
          <p className="border-b border-stone-200 bg-neutral-50 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500">
            AI Copilot / Database
          </p>
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-stone-200 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">Προϊόν</th>
                <th className="px-4 py-3 font-medium">SKU</th>
                <th className="px-4 py-3 font-medium">Τιμή</th>
                <th className="px-4 py-3 font-medium">eShop / Διαγραφή</th>
                <th className="px-4 py-3 font-medium">Ενέργειες</th>
              </tr>
            </thead>
            <tbody>
              {stored.map((product) => (
                <tr key={product.id} className="border-b border-stone-100 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-start gap-3">
                      <AdminProductThumbnail product={product} />
                      <div className="min-w-0">
                        <p className="font-medium text-neutral-950">{product.name}</p>
                        <p className="mt-0.5 font-mono text-xs text-neutral-500">
                          {product.slug}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{product.sku}</td>
                  <td className="px-4 py-3 font-mono text-sm">
                    {formatPricePrecise(product.price_cents, product.currency)}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <AdminStoredProductShopControls product={product} />
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-wrap gap-3 text-[10px] uppercase tracking-[0.18em]">
                      <Link
                        href={
                          product.is_active
                            ? `/product/${product.slug}`
                            : `/product/${product.slug}?preview=draft`
                        }
                        className="text-neutral-600 underline hover:text-neutral-900"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        PDP
                      </Link>
                      <Link
                        href={`/admin/products?edit=${product.id}`}
                        className="text-neutral-600 underline hover:text-neutral-900"
                      >
                        AI επεξεργασία
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-10 overflow-x-auto rounded-sm border border-stone-200 bg-white">
        <p className="border-b border-stone-200 bg-neutral-50 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500">
          Static catalog (κώδικας) — checkboxes eShop &amp; διαγραφή (αποθηκεύονται στο admin)
        </p>
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-stone-200 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">Προϊόν</th>
              <th className="px-4 py-3 font-medium">SKU</th>
              <th className="px-4 py-3 font-medium">Τιμή</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">eShop / Διαγραφή</th>
              <th className="px-4 py-3 font-medium">PDP</th>
            </tr>
          </thead>
          <tbody>
            {staticCatalog.map((product) => {
              const override = overrideBySlug.get(product.slug);
              const deleted = override?.deleted === true;
              const visibleInEshop = override
                ? override.visible_in_eshop && !override.deleted
                : true;

              return (
              <tr
                key={product.id}
                className={`border-b border-stone-100 last:border-0 ${deleted ? "opacity-50" : ""}`}
              >
                <td className="px-4 py-3 font-medium text-neutral-950">{product.name}</td>
                <td className="px-4 py-3 font-mono text-xs">{product.sku}</td>
                <td className="px-4 py-3 font-mono text-sm">
                  {formatPricePrecise(product.price_cents, product.currency)}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-neutral-500">
                  {product.slug}
                  {storedSlugs.has(product.slug) ? " · + DB" : ""}
                </td>
                <td className="px-4 py-3 align-top">
                  <AdminStaticProductShopControls
                    slug={product.slug}
                    visibleInEshop={visibleInEshop}
                    deleted={deleted}
                  />
                </td>
                <td className="px-4 py-3 align-top">
                  {!deleted && (
                    <Link
                      href={`/product/${product.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] uppercase tracking-[0.18em] text-neutral-600 underline hover:text-neutral-900"
                    >
                      Άνοιγμα
                    </Link>
                  )}
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {staticCatalog.length === 0 && stored.length === 0 && (
        <p className="mt-10 text-sm text-neutral-500">Δεν βρέθηκαν προϊόντα.</p>
      )}
    </div>
  );
}
