/** Map color labels (EL/EN) to CSS swatch hex for PDP chips. Keys are accent-insensitive. */

const SWATCH_ENTRIES: [string, string][] = [
  ["λευκό", "#f8f6f2"],
  ["white", "#f8f6f2"],
  ["πράσινο", "#2d5a3d"],
  ["green", "#2d5a3d"],
  ["μαύρο", "#1a1a1a"],
  ["black", "#1a1a1a"],
  ["μπλε", "#1e3a5f"],
  ["blue", "#1e3a5f"],
  ["navy", "#1a2744"],
  ["μπεζ", "#c4a574"],
  ["beige", "#c4a574"],
  ["κόκκινο", "#8b2635"],
  ["red", "#8b2635"],
  ["ροζ", "#c9a8a8"],
  ["pink", "#c9a8a8"],
  ["χρυσό", "#b8860b"],
  ["gold", "#b8860b"],
  ["ασημί", "#a8a8a8"],
  ["silver", "#a8a8a8"],
  ["κρεμ", "#f5f0e6"],
  ["cream", "#f5f0e6"],
  ["ελεφαντόδοντο", "#fffff0"],
  ["ivory", "#fffff0"],
  ["καφέ", "#6b4423"],
  ["brown", "#6b4423"],
  ["γκρι", "#9ca3af"],
  ["grey", "#9ca3af"],
  ["gray", "#9ca3af"],
  ["μπορντό", "#722f37"],
  ["burgundy", "#722f37"],
  ["μωβ", "#5b4b8a"],
  ["purple", "#5b4b8a"],
];

function normalizeColorKey(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const SWATCH_BY_KEY: Record<string, string> = {};
for (const [label, hex] of SWATCH_ENTRIES) {
  SWATCH_BY_KEY[normalizeColorKey(label)] = hex;
}

export function colorSwatchHex(label: string): string {
  const key = normalizeColorKey(label);
  return SWATCH_BY_KEY[key] ?? "#d6d3d1";
}

/** Light fills need a visible border on white PDP background. */
export function colorSwatchNeedsBorder(hex: string): boolean {
  const h = hex.replace("#", "");
  if (h.length !== 6) return true;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.82;
}
