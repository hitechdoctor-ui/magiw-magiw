"use client";

import type { CheckoutOrder } from "@/lib/orders/types";
import { formatPricePrecise } from "@/lib/utils/format";
import { AdminNav } from "@/components/admin/AdminNav";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AdminOrdersPanel() {
  const router = useRouter();
  const [orders, setOrders] = useState<CheckoutOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const response = await fetch("/api/admin/orders");
      if (response.status === 401) {
        router.replace("/admin");
        return;
      }
      const data = (await response.json()) as { orders: CheckoutOrder[] };
      setOrders(data.orders ?? []);
      setLoading(false);
    })();
  }, [router]);

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

      {loading ? (
        <p className="mt-10 text-sm text-neutral-500">Φόρτωση...</p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-sm border border-stone-200 bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b bg-neutral-50 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
              <tr>
                <th className="px-4 py-3">Email πελάτη</th>
                <th className="px-4 py-3">Όνομα</th>
                <th className="px-4 py-3">Σύνολο</th>
                <th className="px-4 py-3">Ημερομηνία</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-neutral-500">
                    Καμία παραγγελία ακόμα.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b border-stone-100">
                    <td className="px-4 py-3 font-mono text-xs">{order.email}</td>
                    <td className="px-4 py-3">
                      {order.first_name} {order.last_name}
                    </td>
                    <td className="px-4 py-3 font-mono">
                      {formatPricePrecise(order.total_cents, order.currency)}
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
