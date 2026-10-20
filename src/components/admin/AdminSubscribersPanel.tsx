"use client";

import type { LaunchSubscriber } from "@/lib/subscribers/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AdminSubscribersPanel() {
  const router = useRouter();
  const [rows, setRows] = useState<LaunchSubscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const response = await fetch("/api/admin/subscribers");
        if (response.status === 401) {
          router.replace("/admin");
          return;
        }
        if (!response.ok) throw new Error("load_failed");
        const data = (await response.json()) as { subscribers: LaunchSubscriber[] };
        setRows(data.subscribers ?? []);
      } catch {
        setError("Δεν φορτώθηκαν τα δεδομένα.");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin");
    router.refresh();
  };

  const exportCsv = () => {
    const header = "email,discount_code,discount_percent,locale,created_at\n";
    const body = rows
      .map((row) =>
        [
          row.email,
          row.discount_code,
          row.discount_percent,
          row.locale,
          row.created_at,
        ].join(","),
      )
      .join("\n");
    const blob = new Blob([header + body], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "magiw-launch-subscribers.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-400">
            MAGIW MAGIW · Admin
          </p>
          <h1 className="mt-2 font-serif text-3xl text-neutral-950">
            Εγγραφές & πελάτες launch
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            {rows.length} εγγραφές · έκπτωση 5% ανά email
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={exportCsv}
            disabled={rows.length === 0}
            className="border border-neutral-900 px-4 py-2 text-[10px] uppercase tracking-[0.22em] hover:bg-neutral-950 hover:text-white disabled:opacity-40"
          >
            Export CSV
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-neutral-500 hover:text-neutral-900"
          >
            Έξοδος
          </button>
        </div>
      </div>

      {loading && (
        <p className="mt-10 text-sm text-neutral-500">Φόρτωση...</p>
      )}
      {error && (
        <p className="mt-10 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="mt-8 overflow-x-auto rounded-sm border border-stone-200 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-stone-200 bg-neutral-50 text-[10px] uppercase tracking-[0.22em] text-neutral-500">
              <tr>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Κωδικός -5%</th>
                <th className="px-4 py-3 font-medium">Γλώσσα</th>
                <th className="px-4 py-3 font-medium">Ημερομηνία</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-neutral-500">
                    Καμία εγγραφή ακόμα.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="border-b border-stone-100 last:border-0">
                    <td className="px-4 py-3 font-mono text-xs">{row.email}</td>
                    <td className="px-4 py-3 font-mono text-xs">{row.discount_code}</td>
                    <td className="px-4 py-3 uppercase text-neutral-600">{row.locale}</td>
                    <td className="px-4 py-3 text-neutral-600">
                      {new Intl.DateTimeFormat("el-GR", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(new Date(row.created_at))}
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
