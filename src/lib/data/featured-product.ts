import type { ProductDetail } from "@/lib/types/database";

export const handmadeSatinSet: ProductDetail = {
  id: "b1000000-0000-0000-0000-000000000001",
  name: "Handmade Satin Bustier & Skirt Set",
  slug: "handmade-satin-bustier-skirt-set",
  sku: "MW-SET-01",
  description:
    "Μαύρο σετ bustier & maxi φούστα από σατέν — structured top με ruffled shoulders και ζώνη στη μέση, ραμμένο στο ατελιέ MAGIW MAGIW.",
  price_cents: 12000,
  currency: "EUR",
  sizes: ["S", "M", "L", "XL"],
  stock: 6,
  is_active: true,
  images: ["/images/black-satin-set.jpg"],
  sections: [
    {
      id: "design",
      title: "Περιγραφή & Σχεδιασμός",
      content:
        "Two-piece σετ με bustier crop top και fluid satin maxi skirt. Σχεδιάζεται, κόβεται και ράβεται στο χέρι στο ατελιέ, με έμφαση στη structured σιλουέτα και τις editorial λεπτομέρειες (ruffles, belted waist).",
    },
    {
      id: "care",
      title: "Υλικό & Φροντίδα",
      content:
        "100% Σατέν · Στεγνό καθάρισμα ή πλύσιμο στο χέρι στους 30°C · Μην χρησιμοποιείτε λευκαντικό · Σιδερώστε σε χαμηλή θερμοκρασία με παράπηχο.",
    },
    {
      id: "shipping",
      title: "Αποστολή & Επιστροφές",
      content:
        "Αποστολή σε 3–5 εργάσιμες (Ελλάδα) · Διεθνής αποστολή κατόπιν συνεννόησης · Επιστροφές εντός 14 ημερών για μη εξατομικευμένα pieces σε άριστη κατάσταση.",
    },
  ],
};
