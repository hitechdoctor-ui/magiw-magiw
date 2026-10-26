"use client";

import { AdminCreateOrderForm } from "@/components/admin/AdminCreateOrderForm";
import type { AdminOrderProductOption } from "@/lib/orders/admin-create";
import type { CheckoutOrder } from "@/lib/orders/types";
import { formatPricePrecise } from "@/lib/utils/format";
import { AdminNav } from "@/components/admin/AdminNav";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type AdminOrdersPanelProps = {
  products: AdminOrderProductOption[];
};

function orderSourceLabel(status: string): string {
  return status === "admin_manual" ? "Admin" : "Shop";
}

export function AdminOrdersPanel({ products }: AdminOrdersPanelProps) {
  const router = useRouter();
  const [orders, setOrders] = useState<CheckoutOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const loadOrders = useCallback(async () => {
    const response = await fetch("/api/admin/orders", { credentials: "same-origin" });
    if (response.status === 401) {
      router.replace("/admin");
      return;
    }
    const data = (await response.json()) as { orders: CheckoutOrder[] };
    setOrders(data.orders ?? []);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    void loadOrders();
  }, [loadOrders]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-400">
            MAGIW MAGIW · Admin
          </p>
          <h1 className="mt-2 font-serif text-3xl">Παραγγελίες (demo checkout)</h1>
        </div>
        <AdminNav current="orders" />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {!showCreate && (
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="bg-neutral-950 px-5 py-3 text-[10px] uppercase tracking-[0.22em] text-white hover:bg-neutral-800"
          >
            Νέα παραγγελία
          </button>
        )}
      </div>

      {showCreate && (
        <AdminCreateOrderForm
          products={products}
          onCancel={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false);
            setLoading(true);
            void loadOrders();
          }}
        />
      )}

      {loading ? (
        <p className="mt-10 text-sm text-neutral-500">Φόρτωση...</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-sm border border-stone-200 bg-white">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b bg-neutral-50 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
              <tr>
                <th className="px-4 py-3">Email πελάτη</th>
                <th className="px-4 py-3">Όνομα</th>
                <th className="px-4 py-3">Γραμμές</th>
                <th className="px-4 py-3">Σύνολο</th>
                <th className="px-4 py-3">Πηγή</th>
                <th className="px-4 py-3">Ημερομηνία</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-neutral-500">
                    Καμία παραγγελία ακόμα — πάτα «Νέα παραγγελία».
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-stone-100">
                    <td className="px-4 py-3 font-mono text-xs">{order.email}</td>
                    <td className="px-4 py-3">
                      {order.first_name} {order.last_name}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {order.line_items.length}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {formatPricePrecise(order.total_cents, order.currency)}
                    </td>
                    <td className="px-4 py-3 text-xs uppercase tracking-wider text-neutral-500">
                      {orderSourceLabel(order.status)}
                    </td>
                    <td className="px-4 py-3 text-neutral-600">
                      {new Intl.DateTimeFormat("el-GR", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(new Date(order.created_at))}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
