/** Smooth deceleration — editorial / luxury feel */
export function easeOutQuint(t: number): number {
  return 1 - Math.pow(1 - t, 5);
}

export function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export const LOOKBOOK_TRANSITION_MS = 1150;

export function animateValue(
  from: number,
  to: number,
  durationMs: number,
  onUpdate: (value: number) => void,
  onComplete?: () => void,
  ease: (t: number) => number = easeOutQuint,
): () => void {
  const start = performance.now();
  let frameId = 0;

  const tick = (now: number) => {
    const elapsed = now - start;
    const t = Math.min(1, elapsed / durationMs);
    const value = from + (to - from) * ease(t);
    onUpdate(value);

    if (t < 1) {
      frameId = requestAnimationFrame(tick);
    } else {
      onComplete?.();
    }
  };

  frameId = requestAnimationFrame(tick);

  return () => cancelAnimationFrame(frameId);
}

/** Rubber-band resistance near first/last slide */
export function applyEdgeResistance(
  offsetPx: number,
  minOffset: number,
  maxOffset: number,
): number {
  if (offsetPx > minOffset) {
    const overflow = offsetPx - minOffset;
    return minOffset + overflow * 0.35;
  }
  if (offsetPx < maxOffset) {
    const overflow = offsetPx - maxOffset;
    return maxOffset + overflow * 0.35;
  }
  return offsetPx;
}
