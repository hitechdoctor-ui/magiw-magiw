"use client";

import type { AdminOrderProductOption } from "@/lib/orders/admin-create";
import { formatPricePrecise } from "@/lib/utils/format";
import { FormEvent, useMemo, useState } from "react";

type LineDraft = {
  id: string;
  productSlug: string;
  size: string;
  color: string;
  quantity: number;
};

type AdminCreateOrderFormProps = {
  products: AdminOrderProductOption[];
  onCreated: () => void;
  onCancel: () => void;
};

function emptyLine(products: AdminOrderProductOption[]): LineDraft {
  const first = products[0];
  return {
    id: `${Date.now()}-${Math.random()}`,
    productSlug: first?.slug ?? "",
    size: first?.sizes[0] ?? "",
    color: first?.colors[0] ?? "",
    quantity: 1,
  };
}

export function AdminCreateOrderForm({
  products,
  onCreated,
  onCancel,
}: AdminCreateOrderFormProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [notes, setNotes] = useState("");
  const [shippingCents, setShippingCents] = useState(0);
  const [discountCents, setDiscountCents] = useState(0);
  const [lines, setLines] = useState<LineDraft[]>(() =>
    products.length ? [emptyLine(products)] : [],
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const productBySlug = useMemo(
    () => new Map(products.map((p) => [p.slug, p])),
    [products],
  );

  const preview = useMemo(() => {
    let subtotal = 0;
    for (const line of lines) {
      const product = productBySlug.get(line.productSlug);
      if (!product) continue;
      subtotal += product.price_cents * Math.max(1, line.quantity);
    }
    const total = subtotal + shippingCents - discountCents;
    return { subtotal, total: Math.max(0, total), currency: products[0]?.currency ?? "EUR" };
  }, [lines, productBySlug, shippingCents, discountCents, products]);

  const updateLine = (id: string, patch: Partial<LineDraft>) => {
    setLines((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const next = { ...row, ...patch };
        const product = productBySlug.get(next.productSlug);
        if (product && patch.productSlug) {
          next.size = product.sizes.includes(next.size)
            ? next.size
            : (product.sizes[0] ?? "");
          next.color =
            product.colors.length === 0
              ? ""
              : product.colors.includes(next.color)
                ? next.color
                : (product.colors[0] ?? "");
        }
        return next;
      }),
    );
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (submitting || products.length === 0) return;
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/orders", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            firstName,
            lastName,
            email,
            phone,
            addressLine1,
            city,
            postalCode,
            country: "GR",
            notes,
          },
          items: lines.map((line) => ({
            productSlug: line.productSlug,
            size: line.size,
            color: line.color || undefined,
            quantity: line.quantity,
          })),
          shippingCents,
          discountCents,
        }),
      });

      const data = (await response.json()) as { error?: string; ok?: boolean };
      if (response.status === 401) {
        window.location.assign("/admin");
        return;
      }
      if (!response.ok) {
        setError(errorMessage(data.error));
        return;
      }
      onCreated();
    } catch {
      setError("Σφάλμα δικτύου.");
    } finally {
      setSubmitting(false);
    }
  };

  if (products.length === 0) {
    return (
      <p className="mt-6 text-sm text-neutral-600">
        Δεν βρέθηκαν διαθέσιμα προϊόντα για παραγγελία.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-8 space-y-8 rounded-sm border border-stone-200 bg-white p-5 sm:p-6"
    >
      <div>
        <h2 className="font-serif text-xl text-neutral-950">Νέα παραγγελία (admin)</h2>
        <p className="mt-1 text-sm text-neutral-600">
          Χειροκίνητη καταχώρηση — δεν περνάει από το checkout του site.
        </p>
      </div>

      <fieldset className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
            Όνομα
          </span>
          <input
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1 w-full border border-stone-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
            Επώνυμο
          </span>
          <input
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1 w-full border border-stone-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
            Email
          </span>
          <input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full border border-stone-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
            Τηλέφωνο
          </span>
          <input
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full border border-stone-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
            Διεύθυνση
          </span>
          <input
            required
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            className="mt-1 w-full border border-stone-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
            Πόλη
          </span>
          <input
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1 w-full border border-stone-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
            Τ.Κ.
          </span>
          <input
            required
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            className="mt-1 w-full border border-stone-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm sm:col-span-2">
          <span className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
            Σημειώσεις
          </span>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="mt-1 w-full border border-stone-300 px-3 py-2 text-sm"
          />
        </label>
      </fieldset>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-500">
            Γραμμές παραγγελίας
          </p>
          <button
            type="button"
            onClick={() => setLines((prev) => [...prev, emptyLine(products)])}
            className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 underline hover:text-neutral-900"
          >
            + Γραμμή
          </button>
        </div>
        <ul className="mt-3 space-y-3">
          {lines.map((line) => {
            const product = productBySlug.get(line.productSlug);
            return (
              <li
                key={line.id}
                className="grid gap-2 border border-stone-200 p-3 sm:grid-cols-12 sm:items-end"
              >
                <label className="sm:col-span-4 block text-sm">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                    Προϊόν
                  </span>
                  <select
                    value={line.productSlug}
                    onChange={(e) =>
                      updateLine(line.id, { productSlug: e.target.value })
                    }
                    className="mt-1 w-full border border-stone-300 px-2 py-2 text-sm"
                  >
                    {products.map((p) => (
                      <option key={p.slug} value={p.slug}>
                        {p.name} · {formatPricePrecise(p.price_cents, p.currency)}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="sm:col-span-2 block text-sm">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                    Size
                  </span>
                  <select
                    value={line.size}
                    onChange={(e) => updateLine(line.id, { size: e.target.value })}
                    className="mt-1 w-full border border-stone-300 px-2 py-2 text-sm"
                  >
                    {(product?.sizes ?? []).map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </label>
                {product && product.colors.length > 0 ? (
                  <label className="sm:col-span-2 block text-sm">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                      Χρώμα
                    </span>
                    <select
                      value={line.color}
                      onChange={(e) => updateLine(line.id, { color: e.target.value })}
                      className="mt-1 w-full border border-stone-300 px-2 py-2 text-sm"
                    >
                      {product.colors.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : (
                  <div className="hidden sm:col-span-2 sm:block" />
                )}
                <label className="sm:col-span-2 block text-sm">
                  <span className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">
                    Ποσ.
                  </span>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={line.quantity}
                    onChange={(e) =>
                      updateLine(line.id, {
                        quantity: Number.parseInt(e.target.value, 10) || 1,
                      })
                    }
                    className="mt-1 w-full border border-stone-300 px-2 py-2 text-sm"
                  />
                </label>
                <div className="sm:col-span-2 flex justify-end">
                  {lines.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setLines((prev) => prev.filter((row) => row.id !== line.id))
                      }
                      className="text-[10px] uppercase tracking-[0.18em] text-neutral-500 hover:text-red-700"
                    >
                      Αφαίρεση
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
            Μεταφορικά (€)
          </span>
          <input
            type="number"
            min={0}
            step={0.01}
            value={shippingCents / 100}
            onChange={(e) =>
              setShippingCents(Math.round(Number.parseFloat(e.target.value || "0") * 100))
            }
            className="mt-1 w-full border border-stone-300 px-3 py-2 text-sm"
          />
        </label>
        <label className="block text-sm">
          <span className="text-[10px] uppercase tracking-[0.22em] text-neutral-500">
            Έκπτωση (€)
          </span>
          <input
            type="number"
            min={0}
            step={0.01}
            value={discountCents / 100}
            onChange={(e) =>
              setDiscountCents(Math.round(Number.parseFloat(e.target.value || "0") * 100))
            }
            className="mt-1 w-full border border-stone-300 px-3 py-2 text-sm"
          />
        </label>
      </div>

      <p className="font-mono text-sm text-neutral-800">
        Σύνολο (εκτίμηση):{" "}
        {formatPricePrecise(preview.total, preview.currency)}
      </p>

      {error && (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="bg-neutral-950 px-5 py-3 text-[10px] uppercase tracking-[0.22em] text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {submitting ? "Αποθήκευση…" : "Αποθήκευση παραγγελίας"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="border border-neutral-400 px-5 py-3 text-[10px] uppercase tracking-[0.22em] text-neutral-600 hover:border-neutral-900"
        >
          Ακύρωση
        </button>
      </div>
    </form>
  );
}

function errorMessage(code?: string): string {
  switch (code) {
    case "invalid_email":
      return "Μη έγκυρο email.";
    case "invalid_name":
      return "Συμπλήρωσε όνομα και επώνυμο.";
    case "invalid_phone":
      return "Συμπλήρωσε τηλέφωνο (τουλάχιστον 6 χαρακτήρες).";
    case "invalid_address":
      return "Συμπλήρωσε διεύθυνση, πόλη και Τ.Κ.";
    case "no_items":
      return "Πρόσθεσε τουλάχιστον μία γραμμή προϊόντος.";
    case "unknown_product":
      return "Άγνωστο προϊόν — κάνε refresh.";
    case "invalid_size":
      return "Επίλεξε έγκυρο size για κάθε γραμμή.";
    case "invalid_color":
    case "color_required":
      return "Επίλεξε χρώμα όπου απαιτείται.";
    default:
      return "Η αποθήκευση απέτυχε.";
  }
}
