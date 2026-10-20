"use client";

type ProductAccordionProps = {
  sections: { id: string; title: string; content: string }[];
  className?: string;
};

export function ProductAccordion({ sections, className }: ProductAccordionProps) {
  return (
    <div
      className={
        className ??
        "mt-10 divide-y divide-stone-200 border-t border-stone-200"
      }
    >
      {sections.map((section) => (
        <details key={section.id} className="group py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm tracking-wide text-neutral-800 marker:content-none">
            <span>{section.title}</span>
            <span className="text-neutral-400 transition group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-3 whitespace-pre-line text-sm leading-7 text-neutral-600">
            {section.content}
          </p>
        </details>
      ))}
    </div>
  );
}
