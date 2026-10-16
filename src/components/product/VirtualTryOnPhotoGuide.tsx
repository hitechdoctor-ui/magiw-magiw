const TIPS = [
  "Όρθια στάση, χέρια χαλαρά στο πλάι",
  "Φωτεινός χώρος · αποφυγή σκιάς στο πρόσωπο",
  "Ολόκληρο το σώμα ή τουλάχιστον μέση–κεφάλι στο κάδρο",
  "Portrait (κάθετη) φωτογραφία, όχι landscape",
] as const;

function PhotoGuideIllustration() {
  return (
    <svg
      viewBox="0 0 400 300"
      className="h-full w-full p-3"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Οδηγός κάδρου: όρθια στάση, πλήρες σώμα μέσα στο πλαίσιο"
    >
      <rect width="400" height="300" fill="#f5f5f4" />
      <rect
        x="118"
        y="24"
        width="164"
        height="252"
        rx="12"
        fill="#fff"
        stroke="#171717"
        strokeWidth="2"
      />
      <rect x="178" y="32" width="44" height="6" rx="3" fill="#e7e5e4" />
      <rect
        x="134"
        y="48"
        width="132"
        height="212"
        rx="4"
        stroke="#a8a29e"
        strokeWidth="1.5"
        strokeDasharray="6 4"
      />
      <ellipse cx="200" cy="78" rx="22" ry="26" fill="#d6d3d1" />
      <path
        d="M200 104 L200 168"
        stroke="#78716c"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M200 120 L168 150 M200 120 L232 150"
        stroke="#78716c"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="M200 168 L178 228 M200 168 L222 228"
        stroke="#78716c"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M72 150 L108 150"
        stroke="#171717"
        strokeWidth="1.5"
        markerEnd="url(#tryon-arrow)"
      />
      <text
        x="24"
        y="154"
        fontFamily="system-ui, sans-serif"
        fontSize="11"
        fill="#44403c"
      >
        Portrait
      </text>
      <path
        d="M292 150 L328 150"
        stroke="#171717"
        strokeWidth="1.5"
        markerEnd="url(#tryon-arrow)"
      />
      <text
        x="336"
        y="142"
        fontFamily="system-ui, sans-serif"
        fontSize="10"
        fill="#44403c"
      >
        Μέση
      </text>
      <text
        x="336"
        y="156"
        fontFamily="system-ui, sans-serif"
        fontSize="10"
        fill="#44403c"
      >
        – κεφάλι
      </text>
      <circle cx="200" cy="248" r="14" fill="#171717" />
      <path
        d="M194 248 L198 252 L206 244"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <marker
          id="tryon-arrow"
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L6,3 L0,6 Z" fill="#171717" />
        </marker>
      </defs>
    </svg>
  );
}

export function VirtualTryOnPhotoGuide() {
  return (
    <div className="overflow-hidden rounded-sm border border-stone-200 bg-white">
      <div className="aspect-[4/3] w-full bg-gradient-to-b from-neutral-50 to-neutral-100">
        <PhotoGuideIllustration />
      </div>
      <div className="border-t border-stone-100 px-4 py-3">
        <p className="text-[10px] uppercase tracking-[0.28em] text-neutral-500">
          Πώς να βγάλεις τη φωτογραφία
        </p>
        <ul className="mt-2 space-y-1.5">
          {TIPS.map((tip) => (
            <li
              key={tip}
              className="flex gap-2 text-xs leading-relaxed text-neutral-700"
            >
              <span className="text-neutral-900" aria-hidden>
                ✓
              </span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
