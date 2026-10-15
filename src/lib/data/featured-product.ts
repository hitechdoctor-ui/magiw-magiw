import type { ProductDetail } from "@/lib/types/database";

export const handmadeSatinSet: ProductDetail = {
  id: "b1000000-0000-0000-0000-000000000001",
  name: "ΣΕΤ: ΜΑΤ ΜΑΥΡΟ ΜΠΟΥΣΤΙΕ & ΦΟΥΣΤΑ",
  slug: "handmade-satin-bustier-skirt-set",
  sku: "MM-BT001",
  description:
    "Ματ μαύρο σετ με bustier top και maxi φούστα — χειροποίητο πατρόν, structured εφαρμογή στη μέση και fluid όγκος στη φούστα.",
  price_cents: 7500,
  currency: "EUR",
  sizes: ["S", "M", "L"],
  stock: 6,
  is_active: true,
  statusLabel: "Χειροποίητο στο ατελιέ μας",
  showVirtualTryOn: true,
  images: [
    "/images/sample-set.jpg",
    "/images/black-satin-set.jpg",
    "/images/sample-set.jpg",
  ],
  sections: [
    {
      id: "details",
      title: "Λεπτομέρειες Προϊόντος",
      content:
        "Two-piece σετ bustier & φούστα με έμφαση στη μέση. Το design σχεδιάζεται στο ατελιέ, το πατρόν κόβεται στο χέρι και η εφαρμογή ρυθμίζεται για καθαρή, structured σιλουέτα. Το top τονίζει τους ώμους με ruffle λεπτομέρειες, ενώ η φούστα έχει ζώνη και fluid fall.",
    },
    {
      id: "care",
      title: "Υλικό & Φροντίδα",
      content:
        "Σατέν ύφασμα · Στεγνό καθάρισμα ή πλύσιμο στο χέρι στους 30°C · Μην χρησιμοποιείτε λευκαντικό · Σιδερώστε σε χαμηλή θερμοκρασία με παράπηχο.",
    },
  ],
};
