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
  sizeGuide: {
    rows: [
      { size: "S", bust: "82", waist: "64", hips: "88" },
      { size: "M", bust: "86", waist: "68", hips: "92" },
      { size: "L", bust: "90", waist: "72", hips: "96" },
    ],
    customFitNote:
      "Για custom fit στο ατελιέ, στείλε μας τις διαστάσεις σου μετά την παραγγελία.",
  },
  sections: [
    {
      id: "details",
      title: "Λεπτομέρειες Προϊόντος",
      content:
        "Two-piece σετ bustier & φούστα με έμφαση στη μέση. Το design σχεδιάζεται στο ατελιέ, το πατρόν κόβεται στο χέρι και η εφαρμογή ρυθμίζεται για καθαρή, structured σιλουέτα.",
    },
    {
      id: "care",
      title: "Υλικό & Φροντίδα",
      content:
        "Σατέν ύφασμα · Στεγνό καθάρισμα ή πλύσιμο στο χέρι στους 30°C · Μην χρησιμοποιείτε λευκαντικό.",
    },
  ],
};

export const atelierGreenSatinDress: ProductDetail = {
  id: "c2000000-0000-0000-0000-000000000002",
  name: "ATELIER GREEN SATIN DRESS",
  slug: "atelier-green-satin-dress",
  sku: "AIG-GW001",
  description:
    "Χειροποίητο maxi φόρεμα από εξαιρετικής ποιότητας σατέν ύφασμα σε σμαραγδί απόχρωση. Σχεδιάζεται, κόβεται και ράβεται εξ ολοκλήρου στο ατελιέ μας με ιδιαίτερη έμφαση στη λεπτομέρεια και στο πατρόν.",
  price_cents: 11000,
  currency: "EUR",
  sizes: ["S", "M", "L", "XL"],
  stock: 5,
  is_active: true,
  statusLabel: "Χειροποίητο στο ατελιέ μας",
  showVirtualTryOn: true,
  images: [
    "/images/products/aig-gw001-1.jpg",
    "/images/products/aig-gw001-2.jpg",
    "/images/products/aig-gw001-3.jpg",
    "/images/products/aig-gw001-4.jpg",
  ],
  sizeGuide: {
    rows: [
      { size: "S", bust: "84", waist: "66", hips: "90" },
      { size: "M", bust: "88", waist: "70", hips: "94" },
      { size: "L", bust: "92", waist: "74", hips: "98" },
      { size: "XL", bust: "96", waist: "78", hips: "102" },
    ],
    customFitNote:
      "Τα μεγέθη είναι ενδεικτικά για maxi φόρεμα. Προσφέρουμε custom fit adjustments στο ατελιέ MAGIW MAGIW κατόπιν συνεννόησης.",
  },
  sections: [
    {
      id: "details",
      title: "Λεπτομέρειες Προϊόντος",
      content:
        "Maxi φόρεμα με V-neckline, structured bodice και pleated waistband. Το πατρόν σχεδιάζεται και κόβεται στο χέρι, με έμφαση στη ροή του σατέν και στην κομψή A-line σιλουέτα.",
    },
    {
      id: "care",
      title: "Υλικό & Φροντίδα",
      content:
        "Premium σατέν ύφασμα · Στεγνό καθάρισμα ή πλύσιμο στο χέρι στους 30°C · Σιδερώστε σε χαμηλή θερμοκρασία με παράπηχο.",
    },
  ],
};

export const FEATURED_PRODUCTS: ProductDetail[] = [
  atelierGreenSatinDress,
  handmadeSatinSet,
];
