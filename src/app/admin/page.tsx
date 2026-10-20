"use client";

import { LanguageSwitch } from "@/components/i18n/LanguageSwitch";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        setError("Λάθος κωδικός ή το admin δεν είναι ρυθμισμένο.");
        return;
      }

      router.push("/admin/subscribers");
      router.refresh();
    } catch {
      setError("Σφάλμα σύνδεσης.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <div className="absolute right-6 top-6">
        <LanguageSwitch variant="site" />
      </div>
      <p className="text-[10px] uppercase tracking-[0.35em] text-neutral-400">
        MAGIW MAGIW · Admin
      </p>
      <h1 className="mt-3 font-serif text-3xl text-neutral-950">Σύνδεση</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Διαχείριση εγγραφών launch & κωδικών έκπτωσης.
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-4">
        <label className="block text-left text-[10px] uppercase tracking-[0.28em] text-neutral-500">
          Κωδικός admin
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full border border-stone-300 bg-white px-4 py-3 text-sm outline-none focus:border-neutral-900"
            autoComplete="current-password"
          />
        </label>
        {error && (
          <p className="text-sm text-red-700" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-neutral-950 py-3 text-[10px] uppercase tracking-[0.28em] text-white hover:bg-neutral-800 disabled:opacity-60"
        >
          {loading ? "..." : "Είσοδος"}
        </button>
      </form>
    </div>
  );
}
