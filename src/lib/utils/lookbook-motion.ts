/** Smooth deceleration — editorial / luxury feel */
export function easeOutQuint(t: number): number {
  return 1 - Math.pow(1 - t, 5);
}

export function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/** Legacy duration for wheel cooldown math */
export const LOOKBOOK_TRANSITION_MS = 520;

const SPRING_STIFFNESS = 360;
const SPRING_DAMPING = 38;

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

/** iOS-like snap — interruptible, velocity-aware */
export function animateSpringTo(
  from: number,
  to: number,
  onUpdate: (value: number) => void,
  onComplete?: () => void,
  options?: {
    stiffness?: number;
    damping?: number;
    /** px/s */
    velocity?: number;
  },
): () => void {
  const stiffness = options?.stiffness ?? SPRING_STIFFNESS;
  const damping = options?.damping ?? SPRING_DAMPING;
  let value = from;
  let velocity = options?.velocity ?? 0;
  let lastTime = performance.now();
  let frameId = 0;

  const tick = (now: number) => {
    const dt = Math.min(0.032, (now - lastTime) / 1000);
    lastTime = now;

    const displacement = value - to;
    const springForce = -stiffness * displacement;
    const dampForce = -damping * velocity;
    velocity += (springForce + dampForce) * dt;
    value += velocity * dt;

    const settled =
      Math.abs(displacement) < 0.35 && Math.abs(velocity) < 12;

    if (settled) {
      onUpdate(to);
      onComplete?.();
      return;
    }

    onUpdate(value);
    frameId = requestAnimationFrame(tick);
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
    return minOffset + overflow * 0.28;
  }
  if (offsetPx < maxOffset) {
    const overflow = offsetPx - maxOffset;
    return maxOffset + overflow * 0.28;
  }
  return offsetPx;
}

/** Pick snap index from release position + flick velocity (px/ms) */
export function snapIndexFromRelease(
  offsetPx: number,
  slideHeight: number,
  slideCount: number,
  velocityPxPerMs: number,
  swipeThresholdPx: number,
  activeIndex: number,
  startDeltaPx: number,
): number {
  if (slideHeight <= 0 || slideCount === 0) return 0;

  const minIndex = 0;
  const maxIndex = slideCount - 1;

  const projectionMs = 340;
  const projected = offsetPx + velocityPxPerMs * projectionMs;
  let index = Math.round(-projected / slideHeight);

  const flingThreshold = 0.35;
  if (Math.abs(velocityPxPerMs) >= flingThreshold) {
    index = activeIndex + (velocityPxPerMs < 0 ? 1 : -1);
  } else if (Math.abs(startDeltaPx) >= swipeThresholdPx) {
    index = activeIndex + (startDeltaPx > 0 ? 1 : -1);
  }

  return Math.min(maxIndex, Math.max(minIndex, index));
}
