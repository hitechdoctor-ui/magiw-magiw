"use client";

import { FormEvent, useState } from "react";

const INSTAGRAM_URL = "https://www.instagram.com/magiwmagiw/";

export function ComingSoonPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = email.trim();

    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setStatus("error");
      setMessage("Παρακαλούμε εισάγετε έγκυρο email.");
      return;
    }

    setStatus("loading");
    setMessage(null);

    try {
      const response = await fetch("/api/coming-soon-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });

      const payload = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(payload.error ?? "Η εγγραφή απέτυχε.");
      }

      setStatus("success");
      setMessage("Ευχαριστούμε — θα σας ενημερώσουμε για το launch.");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Κάτι πήγε στραβά. Δοκίμασε ξανά.",
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#faf8f5] text-neutral-950">
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-[10px] uppercase tracking-[0.45em] text-neutral-400">
          magiwmagiw.gr
        </p>

        <h1 className="mt-8 font-serif text-[clamp(2.25rem,8vw,4rem)] leading-none tracking-[0.18em] text-neutral-950">
          MAGIW MAGIW
        </h1>

        <p className="mt-6 text-[11px] uppercase tracking-[0.32em] text-neutral-600 sm:text-xs">
          Handmade Atelier &amp; Custom Design
        </p>

        <p className="mt-10 max-w-md font-serif text-2xl leading-snug text-neutral-900 sm:text-3xl">
          Κάτι μαγικό ετοιμάζεται.
        </p>
        <p className="mt-3 text-sm text-neutral-500">Σύντομα κοντά σας.</p>

        <form
          onSubmit={handleSubmit}
          className="mt-12 w-full max-w-md"
          noValidate
        >
          <label htmlFor="launch-email" className="sr-only">
            Email για ενημέρωση launch
          </label>
          <p className="mb-4 text-[10px] uppercase tracking-[0.28em] text-neutral-500">
            Ενημερωθείτε πρώτοι για το launch
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="launch-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="email@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={status === "loading" || status === "success"}
              className="min-w-0 flex-1 border border-stone-300 bg-white px-4 py-3.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-neutral-900 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="shrink-0 border border-neutral-900 bg-neutral-950 px-8 py-3.5 text-[10px] font-medium uppercase tracking-[0.28em] text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "loading" ? "..." : "Εγγραφή"}
            </button>
          </div>
          {message && (
            <p
              className={`mt-4 text-sm ${
                status === "success" ? "text-neutral-700" : "text-red-700"
              }`}
              role={status === "error" ? "alert" : "status"}
            >
              {message}
            </p>
          )}
        </form>
      </main>

      <footer className="border-t border-stone-200/80 px-6 py-8 text-center">
        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] uppercase tracking-[0.35em] text-neutral-600 transition hover:text-neutral-950"
        >
          Instagram · @magiwmagiw
        </a>
        <p className="mt-4 text-xs text-neutral-400">
          Athens · Ιδιαίτερα ρούχα · Atelier
        </p>
      </footer>
    </div>
  );
}
