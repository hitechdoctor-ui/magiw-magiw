import Link from "next/link";

export type AdminNavSection =
  | "dashboard"
  | "subscribers"
  | "orders"
  | "copilot"
  | "catalog";

const LINKS: { section: AdminNavSection; href: string; label: string }[] = [
  { section: "dashboard", href: "/admin/dashboard", label: "Dashboard" },
  { section: "subscribers", href: "/admin/subscribers", label: "Εγγραφές launch" },
  { section: "orders", href: "/admin/orders", label: "Παραγγελίες" },
  { section: "copilot", href: "/admin/products", label: "AI Copilot" },
  { section: "catalog", href: "/admin/catalog", label: "Όλα τα προϊόντα" },
];

export function AdminNav({ current }: { current: AdminNavSection }) {
  return (
    <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] uppercase tracking-[0.22em]">
      {LINKS.map((link) => (
        <Link
          key={link.section}
          href={link.href}
          className={
            current === link.section
              ? "text-neutral-900"
              : "text-neutral-500 hover:text-neutral-900"
          }
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
