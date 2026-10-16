export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="font-serif text-lg tracking-[0.15em] text-neutral-900">
          MAGIW MAGIW
        </p>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] uppercase tracking-[0.25em] text-neutral-500 transition hover:text-neutral-900"
          >
            Instagram
          </a>
          <p className="text-sm text-neutral-500">
            Ιδιαίτερα ρούχα · Shoppable Instagram Feed · Athens
          </p>
        </div>
      </div>
    </footer>
  );
}
