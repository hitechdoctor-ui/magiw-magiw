"use client";

import type { StoredProduct } from "@/lib/products/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AdminStoredProductShopControlsProps = {
  product: StoredProduct;
  compact?: boolean;
};

export function AdminStoredProductShopControls({
  product,
  compact = false,
}: AdminStoredProductShopControlsProps) {
  const router = useRouter();
  const [visible, setVisible] = useState(product.is_active);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const patchVisibility = async (isActive: boolean) => {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: isActive }),
      });
      if (response.status === 401) {
        window.location.assign("/admin");
        return;
      }
      if (!response.ok) {
        setError("Αποτυχία ενημέρωσης eShop.");
        return;
      }
      setVisible(isActive);
      router.refresh();
    } catch {
      setError("Σφάλμα δικτύου.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete || busy) return;
    setBusy(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      if (response.status === 401) {
        window.location.assign("/admin");
        return;
      }
      if (!response.ok) {
        setError("Η διαγραφή απέτυχε.");
        return;
      }
      router.refresh();
    } catch {
      setError("Σφάλμα δικτύου.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={compact ? "space-y-2" : "min-w-[200px] space-y-3"}>
      <label className="flex cursor-pointer items-start gap-2 text-xs text-neutral-700">
        <input
          type="checkbox"
          className="mt-0.5"
          checked={visible}
          disabled={busy}
          onChange={() => void patchVisibility(true)}
        />
        <span>Εμφάνιση στο eShop</span>
      </label>
      <label className="flex cursor-pointer items-start gap-2 text-xs text-neutral-700">
        <input
          type="checkbox"
          className="mt-0.5"
          checked={!visible}
          disabled={busy}
          onChange={() => void patchVisibility(false)}
        />
        <span>Μη εμφάνιση στο eShop</span>
      </label>
      <div className="border-t border-stone-100 pt-2">
        <label className="flex cursor-pointer items-start gap-2 text-xs text-red-800">
          <input
            type="checkbox"
            className="mt-0.5"
            checked={confirmDelete}
            disabled={busy}
            onChange={(e) => setConfirmDelete(e.target.checked)}
          />
          <span>Διαγραφή προϊόντος</span>
        </label>
        {confirmDelete && (
          <button
            type="button"
            disabled={busy}
            onClick={() => void handleDelete()}
            className="mt-2 w-full border border-red-800 px-2 py-1.5 text-[10px] uppercase tracking-[0.18em] text-red-800 hover:bg-red-800 hover:text-white disabled:opacity-50"
          >
            {busy ? "..." : "Οριστική διαγραφή"}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
