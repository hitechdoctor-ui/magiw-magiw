import type { CSSProperties } from "react";

export type MediaSprite = {
  sheet: string;
  index: number;
  total: number;
  axis?: "x" | "y";
};

export function getSpriteStyle(sprite: MediaSprite): CSSProperties {
  const { sheet, index, total, axis = "y" } = sprite;
  const percent = total > 1 ? (index / (total - 1)) * 100 : 0;

  if (axis === "x") {
    return {
      backgroundImage: `url(${sheet})`,
      backgroundSize: `${total * 100}% 100%`,
      backgroundPosition: `${percent}% center`,
      backgroundRepeat: "no-repeat",
    };
  }

  return {
    backgroundImage: `url(${sheet})`,
    backgroundSize: `100% ${total * 100}%`,
    backgroundPosition: `center ${percent}%`,
    backgroundRepeat: "no-repeat",
  };
}
