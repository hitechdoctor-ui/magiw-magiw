import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center px-4 py-24 text-center">
      <p className="text-[11px] uppercase tracking-[0.35em] text-neutral-400">
        MAGIW MAGIW
      </p>
      <h1 className="mt-4 font-serif text-3xl text-neutral-950">
        Το προϊόν δεν βρέθηκε
      </h1>
      <Link
        href="/"
        className="mt-8 rounded-full border border-neutral-200 px-6 py-3 text-xs uppercase tracking-[0.25em] text-neutral-700 transition hover:border-neutral-950 hover:text-neutral-950"
      >
        Επιστροφή στο Feed
      </Link>
    </div>
  );
}
