import type { Locale } from "@/lib/i18n/types";
import { FREE_SHIPPING_FROM_EUR, RETURN_DAYS } from "@/lib/legal/company";

export type ProductPageCopy = {
  tabs: { overview: string; description: string; specifications: string };
  taxesIncluded: string;
  shippingLink: string;
  shippingAtCheckout: string;
  color: string;
  size: string;
  sizeChart: string;
  quantity: string;
  decrease: string;
  increase: string;
  inStock: string;
  lowStock: string;
  outOfStock: string;
  freeDelivery: string;
  easyReturns: string;
  social: string;
  shareOn: string;
  addToCart: string;
  buyNow: string;
  soldOut: string;
  detailsTitle: string;
  descriptionTitle: string;
  shippingTitle: string;
  shippingText: string;
  shippingMore: string;
  sizeTitle: string;
  sizeText: string;
  sizeOpen: string;
  highlightsTitle: string;
  highlightLabels: [string, string, string];
  fallbackHighlights: { title: string; text: string }[];
  pairsWithTitle: string;
  pairsWithText: (name: string) => string;
  imageAlt: (name: string, index: number) => string;
};

export const PRODUCT_PAGE_COPY: Record<Locale, ProductPageCopy> = {
  el: {
    tabs: { overview: "Επισκόπηση", description: "Περιγραφή", specifications: "Χαρακτηριστικά" },
    taxesIncluded: "Οι τιμές περιλαμβάνουν ΦΠΑ.",
    shippingLink: "Τα μεταφορικά",
    shippingAtCheckout: "υπολογίζονται στο ταμείο.",
    color: "Χρώμα",
    size: "Μέγεθος",
    sizeChart: "Οδηγός μεγεθών",
    quantity: "Ποσότητα",
    decrease: "Μείωση ποσότητας",
    increase: "Αύξηση ποσότητας",
    inStock: "Διαθέσιμο",
    lowStock: "Μόνο {count} διαθέσιμα",
    outOfStock: "Εξαντλήθηκε",
    freeDelivery: `Δωρεάν αποστολή από ${FREE_SHIPPING_FROM_EUR} €`,
    easyReturns: `Επιστροφή σε ${RETURN_DAYS} ημέρες`,
    social: "Κοινοποίηση",
    shareOn: "Κοινοποίηση στο {network}",
    addToCart: "Στο καλάθι",
    buyNow: "Αγόρασέ το τώρα",
    soldOut: "Εξαντλήθηκε",
    detailsTitle: "Λεπτομέρειες προϊόντος",
    descriptionTitle: "Περιγραφή",
    shippingTitle: "Αποστολές & Επιστροφές",
    shippingText: `Αποστολή σε όλη την Ελλάδα σε 1–4 εργάσιμες, δωρεάν από ${FREE_SHIPPING_FROM_EUR} €. Έχεις ${RETURN_DAYS} ημέρες για επιστροφή ή αλλαγή, και η πρώτη αλλαγή μεγέθους είναι δωρεάν.`,
    shippingMore: "Δες τις αποστολές",
    sizeTitle: "Βρες το μέγεθός σου",
    sizeText:
      "Δες τις μετρήσεις για κάθε μέγεθος. Για custom εφαρμογή, το ατελιέ μας προσαρμόζει το κομμάτι στις διαστάσεις σου.",
    sizeOpen: "Άνοιξε τον οδηγό μεγεθών",
    highlightsTitle: "Χαρακτηριστικά Προϊόντος",
    highlightLabels: ["Σιλουέτα", "Λεπτομέρεια", "Ύφασμα"],
    fallbackHighlights: [
      {
        title: "Φτιαγμένο στο ατελιέ",
        text: "Κάθε κομμάτι σχεδιάζεται, κόβεται και ράβεται με προσοχή στη λεπτομέρεια.",
      },
      {
        title: "Επιλεγμένα υφάσματα",
        text: "Πρώτες ύλες που μελετάμε προσεκτικά, για άνεση που κρατά στον χρόνο.",
      },
      {
        title: "Τέλεια εφαρμογή",
        text: "Οδηγός μεγεθών για κάθε κομμάτι και δυνατότητα custom εφαρμογής.",
      },
    ],
    pairsWithTitle: "Ολοκλήρωσε το look",
    pairsWithText: (name) => `Ταιριάζει τέλεια με το ${name}, για ένα ολοκληρωμένο σύνολο.`,
    imageAlt: (name, index) => `${name} — φωτογραφία ${index + 1}`,
  },
  en: {
    tabs: { overview: "Overview", description: "Description", specifications: "Specifications" },
    taxesIncluded: "Taxes included.",
    shippingLink: "Shipping",
    shippingAtCheckout: "calculated at checkout.",
    color: "Color",
    size: "Size",
    sizeChart: "Size chart",
    quantity: "Quantity",
    decrease: "Decrease quantity",
    increase: "Increase quantity",
    inStock: "In stock",
    lowStock: "Only {count} left",
    outOfStock: "Out of stock",
    freeDelivery: `Free delivery from €${FREE_SHIPPING_FROM_EUR}`,
    easyReturns: `${RETURN_DAYS}-day easy returns`,
    social: "Social",
    shareOn: "Share on {network}",
    addToCart: "Add to bag",
    buyNow: "Buy it now",
    soldOut: "Sold out",
    detailsTitle: "Product details",
    descriptionTitle: "Description",
    shippingTitle: "Shipping & Returns",
    shippingText: `Delivery across Greece in 1–4 business days, free from €${FREE_SHIPPING_FROM_EUR}. You have ${RETURN_DAYS} days to return or exchange, and your first size exchange is free.`,
    shippingMore: "Read about shipping",
    sizeTitle: "Discover your perfect size",
    sizeText:
      "See the measurements for every size. For a custom fit, our atelier tailors the piece to your measurements.",
    sizeOpen: "Open the size guide",
    highlightsTitle: "Product Highlights",
    highlightLabels: ["Silhouette", "Detail", "Fabric"],
    fallbackHighlights: [
      {
        title: "Made in our atelier",
        text: "Every piece is designed, cut and sewn with close attention to detail.",
      },
      {
        title: "Selected fabrics",
        text: "Carefully studied raw materials, for comfort that lasts.",
      },
      {
        title: "The perfect fit",
        text: "A size guide for every piece, plus a custom-fit option.",
      },
    ],
    pairsWithTitle: "Complete the look",
    pairsWithText: (name) => `Pairs perfectly with ${name} for a complete outfit.`,
    imageAlt: (name, index) => `${name} — photo ${index + 1}`,
  },
};
