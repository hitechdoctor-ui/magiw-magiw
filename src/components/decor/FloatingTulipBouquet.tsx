import Image from "next/image";

type FloatingTulipBouquetProps = {
  /** hero = landing (clearly visible), soft = shop pages */
  prominence?: "hero" | "soft";
};

/**
 * White tulip bouquet on transparent/black PNG — `mix-blend-screen` drops the black on cream backgrounds.
 */
export function FloatingTulipBouquet({
  prominence = "soft",
}: FloatingTulipBouquetProps) {
  const opacity =
    prominence === "hero"
      ? "opacity-[0.82] sm:opacity-[0.88]"
      : "opacity-[0.5] sm:opacity-[0.58]";

  return (
    <div
      className="tulip-backdrop-hide-when-reduced pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      aria-hidden
    >
      <div
        className={`tulip-float absolute -right-6 bottom-0 h-[min(54vh,440px)] w-[min(68vw,340px)] ${opacity} sm:-right-3 sm:h-[min(60vh,500px)] sm:w-[380px] lg:-right-2 lg:h-[min(64vh,540px)] lg:w-[420px]`}
      >
        <Image
          src="/brand/tulips-bouquet-right.png"
          alt=""
          fill
          className="object-contain object-bottom mix-blend-screen"
          sizes="(max-width: 1024px) 340px, 420px"
          priority={prominence === "hero"}
        />
      </div>
    </div>
  );
}
