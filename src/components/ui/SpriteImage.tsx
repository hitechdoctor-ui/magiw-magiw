import { getSpriteStyle, type MediaSprite } from "@/lib/utils/sprite";

type SpriteImageProps = {
  sprite: MediaSprite;
  alt: string;
  className?: string;
};

export function SpriteImage({ sprite, alt, className = "" }: SpriteImageProps) {
  return (
    <div
      role="img"
      aria-label={alt}
      className={`h-full w-full bg-neutral-200 ${className}`}
      style={getSpriteStyle(sprite)}
    />
  );
}
