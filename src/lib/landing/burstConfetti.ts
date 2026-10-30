const STAR_PATH =
  "M43.767 59.6698L31.4327 53.1854L19.094 59.6698C14.3183 62.187 8.68819 58.1198 9.60225 52.7741L11.9573 39.0363L1.97805 29.3081C-1.89655 25.5351 0.242508 18.9273 5.60265 18.1492L19.396 16.1429L25.5655 3.64453C27.971 -1.22187 34.901 -1.20781 37.2995 3.64453L43.467 16.1429L57.2604 18.1492C62.6135 18.9265 64.7643 25.5308 60.885 29.3081L50.9057 39.0363L53.2608 52.7741C54.1737 58.1143 48.5592 62.1831 43.767 59.6698Z";
const HEART_PATH =
  "M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z";

const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

/** Side cannons (stars + hearts) for `durationMs`, then the pieces fall across the page. */
export async function burstSideConfetti(durationMs = 1000) {
  const { default: confetti } = await import("canvas-confetti");

  const star = confetti.shapeFromPath({
    path: STAR_PATH,
    matrix: new DOMMatrix([
      0.03597122302158273, 0, 0, 0.03597122302158273, -4.856115107913669, -5.071942446043165,
    ]),
  });
  const heart = confetti.shapeFromPath({
    path: HEART_PATH,
    matrix: new DOMMatrix([
      0.03333333333333333, 0, 0, 0.03333333333333333, -5.566666666666666, -5.533333333333333,
    ]),
  });

  const end = Date.now() + durationMs;
  const defaults: confetti.Options = {
    particleCount: 3,
    startVelocity: 80,
    spread: 33,
    colors: ["#ffff00", "#bb0000", "#ffffff"],
    zIndex: 999,
    disableForReducedMotion: true,
  };

  (function frame() {
    confetti({ ...defaults, angle: 60, origin: { x: 0 } });
    confetti({
      ...defaults,
      angle: 60,
      origin: { x: 0 },
      shapes: [star, heart],
      scalar: randomInRange(1, 1.5),
    });
    confetti({ ...defaults, angle: 120, origin: { x: 1 } });
    confetti({
      ...defaults,
      angle: 120,
      origin: { x: 1 },
      shapes: [star, heart],
      scalar: randomInRange(1, 1.5),
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
