"use client";

import { portraitDisplayRotation } from "@/lib/utils/normalize-user-image";
import { useEffect, useState } from "react";

type TryOnResultImageProps = {
  src: string;
  alt: string;
};

export function TryOnResultImage({ src, alt }: TryOnResultImageProps) {
  const [rotationDeg, setRotationDeg] = useState(0);

  useEffect(() => {
    setRotationDeg(0);
  }, [src]);

  return (
    <div className="relative mx-auto mt-3 w-full max-w-sm">
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-sm bg-neutral-100">
        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
          style={
            rotationDeg
              ? { transform: `rotate(${rotationDeg}deg) scale(0.92)` }
              : undefined
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            className="max-h-full max-w-full object-contain [image-orientation:from-image]"
            onLoad={(event) => {
              const img = event.currentTarget;
              const fix = portraitDisplayRotation(
                img.naturalWidth,
                img.naturalHeight,
                true,
              );
              setRotationDeg(fix);
            }}
          />
        </div>
      </div>
    </div>
  );
}
