import { SpriteImage } from "@/components/ui/SpriteImage";
import type { MediaSprite } from "@/lib/utils/sprite";

const ICON_SHEET = "/images/image_3.png";

const atelierValues = [
  {
    title: "Designed & Hand-cut by the Artist",
    iconIndex: 0,
  },
  {
    title: "Made in Greece",
    iconIndex: 1,
  },
  {
    title: "Ethical Fashion",
    iconIndex: 2,
  },
  {
    title: "Tailored to You",
    iconIndex: 3,
  },
] as const;

function iconSprite(index: number): MediaSprite {
  return {
    sheet: ICON_SHEET,
    index,
    total: 4,
    axis: "x",
  };
}

export function AtelierSection() {
  return (
    <section className="border-y border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        <p className="text-center text-[11px] uppercase tracking-[0.4em] text-neutral-400">
          The Atelier
        </p>
        <h2 className="mt-4 text-center font-serif text-2xl tracking-tight text-neutral-950 sm:text-3xl">
          Crafted with intention
        </h2>

        <div className="mt-12 grid grid-cols-2 gap-8 sm:gap-10 lg:grid-cols-4 lg:gap-12">
          {atelierValues.map(({ title, iconIndex }) => (
            <div
              key={title}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-5 h-16 w-16 overflow-hidden sm:h-20 sm:w-20">
                <SpriteImage
                  sprite={iconSprite(iconIndex)}
                  alt=""
                  className="scale-110"
                />
              </div>
              <p className="max-w-[11rem] text-xs leading-relaxed tracking-wide text-neutral-700 sm:text-sm">
                {title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
