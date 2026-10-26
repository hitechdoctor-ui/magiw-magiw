const GREEK_MAP: Record<string, string> = {
  α: "a",
  β: "v",
  γ: "g",
  δ: "d",
  ε: "e",
  ζ: "z",
  η: "i",
  θ: "th",
  ι: "i",
  κ: "k",
  λ: "l",
  μ: "m",
  ν: "n",
  ξ: "x",
  ο: "o",
  π: "p",
  ρ: "r",
  σ: "s",
  ς: "s",
  τ: "t",
  υ: "y",
  φ: "f",
  χ: "ch",
  ψ: "ps",
  ω: "o",
};

export function slugifyProductName(name: string): string {
  const lower = name.trim().toLowerCase();
  let out = "";
  for (const char of lower) {
    if (GREEK_MAP[char]) {
      out += GREEK_MAP[char];
    } else {
      out += char;
    }
  }

  return out
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

export function uniqueSlug(base: string, suffix: string): string {
  const clean = slugifyProductName(base) || "product";
  const tail = suffix.replace(/[^a-z0-9]/gi, "").slice(0, 8).toLowerCase();
  return tail ? `${clean}-${tail}` : clean;
}
