import type { Locale } from "@/lib/i18n/types";

/**
 * All visible texts of the home landing (hero, trending, carousel, dedication) in both languages.
 * Greek caps are written without tonos, as in print capitals.
 */
export type LandingCopy = {
  nav: { home: string; shop: string };
  hero: {
    ariaLabel: string;
    titleLines: [string, string];
    descriptionLines: [string, string];
    cta: string;
    marquee: string;
  };
  dedication: { title: string; blocks: [string, string, string] };
  collectionPills: { men: string; women: string; popular: string };
  trending: {
    ariaLabel: string;
    wordLeft: string;
    wordRight: string;
    mobileTitle: string;
    viewAll: string;
  };
  carousel: {
    ariaLabel: string;
    headingStroke: string;
    headingRest: string;
    lede: string;
    explore: string;
    slides: Record<string, { title: string; tagline: string; cta: string }>;
  };
};

export const LANDING_COPY: Record<Locale, LandingCopy> = {
  el: {
    nav: { home: "Αρχική", shop: "Κατάστημα" },
    hero: {
      ariaLabel: "Κεντρικό banner",
      titleLines: ["Η ΟΥΣΙΑ ΤΗΣ", "ΑΧΡΟΝΗΣ ΜΟΔΑΣ"],
      descriptionLines: [
        "Ανακάλυψε μια μόδα που ξεπερνά τις τάσεις. Ανέβασε το στυλ σου",
        "με κλασικά, κομψά και διαχρονικά σχέδια.",
      ],
      cta: "ΑΝΑΚΑΛΥΨΕ ΤΗ ΣΥΛΛΟΓΗ",
      marquee: "ΕΛΕΓΑΝΤΖΑ • ΣΤΥΛ • ΠΟΛΥΤΕΛΕΙΑ • ΓΙΑ ΠΑΝΤΑ • ",
    },
    dedication: {
      title: "Αφιέρωση",
      blocks: [
        "Μια ιδέα εμπνευσμένη από ψηλά! Έρχεται και αφιερώνεται στον αδερφό μου Γεράσιμο Παπαγιαννόπουλο. Ο πρώτος που πίστεψε στην ιδέα αυτή και σε εμένα... ΤΟ MAGIW MAGIW είναι ιδέα!",
        "Χτίζεται και μετρά χρόνια πριν την υλοποίησή του. Με την γνώση και την αγάπη για δημιουργία, βασισμένα στην μελέτη πρώτης ύλης, σχεδιασμού και κατασκευής...",
        "Θα καλύψει με τις σειρές του: την γυναίκα με σειρά Evelina's, τον άνδρα με σειρά Gino, και παιδί με σειρά Evelina's kids and baby.",
      ],
    },
    collectionPills: {
      men: "Ανδρικές Συλλογές",
      women: "Γυναικείες Συλλογές",
      popular: "Δημοφιλείς Συλλογές",
    },
    trending: {
      ariaLabel: "Δημοφιλή προϊόντα",
      wordLeft: "Δημοφιλή",
      wordRight: "Προϊόντα",
      mobileTitle: "Δημοφιλή Προϊόντα",
      viewAll: "Δες όλα →",
    },
    carousel: {
      ariaLabel: "Καρουζέλ συλλογών",
      headingStroke: "Μόδα",
      headingRest: "που ρέει με τις εποχές",
      lede: "Ανακάλυψε τις τελευταίες μας συλλογές. Από κλασικές γραμμές μέχρι σύγχρονες τάσεις, βρες το ιδανικό look για κάθε εποχή.",
      explore: "Δες περισσότερα",
      slides: {
        evening: {
          title: "Κομψά Βραδινά Σύνολα",
          tagline: "Χάρη, Λάμψη, Στυλ, Αυτοπεποίθηση",
          cta: "Αγόρασε τώρα",
        },
        winter: {
          title: "Πολυτελής Χειμερινή Συλλογή",
          tagline: "Ζεστασιά, Άνεση, Κομψότητα, Ποιότητα",
          cta: "Αγόρασε τώρα",
        },
        essentials: {
          title: "Διαχρονικά Βασικά Κομμάτια",
          tagline: "Κλασικά, Καθημερινά, Στιλάτα, Ποιοτικά",
          cta: "Αγόρασε τώρα",
        },
      },
    },
  },
  en: {
    nav: { home: "Home", shop: "Shop" },
    hero: {
      ariaLabel: "Hero banner",
      titleLines: ["TIMELESS FASHION", "ESSENCE"],
      descriptionLines: [
        "Discover fashion that transcends trends. Elevate style with classic, elegant,",
        "and enduring designs.",
      ],
      cta: "EXPLORE NOW",
      marquee: "ELEGANCE • STYLE • LUXURY • FOREVER • ",
    },
    dedication: {
      title: "Dedication",
      blocks: [
        "An idea inspired from above! It comes and is dedicated to my brother Gerasimos Papagiannopoulos. The first who believed in this idea and in me... MAGIW MAGIW is an idea!",
        "It is built, and counts years before its realisation. With knowledge and a love of creating, based on the study of raw materials, design and construction...",
        "It will cover, with its series: women with the Evelina's series, men with the Gino series, and children with the Evelina's kids and baby series.",
      ],
    },
    collectionPills: {
      men: "Men Collections",
      women: "Women Collections",
      popular: "Popular Collections",
    },
    trending: {
      ariaLabel: "Trending products",
      wordLeft: "Trending",
      wordRight: "Products",
      mobileTitle: "Trending Products",
      viewAll: "View all →",
    },
    carousel: {
      ariaLabel: "Collections carousel",
      headingStroke: "Fashion",
      headingRest: "that flows with the seasons",
      lede: "Explore our latest collection of timeless fashion. From classic styles to modern trends, find the perfect look for every season.",
      explore: "Explore more",
      slides: {
        evening: {
          title: "Elegant Evening Wear",
          tagline: "Grace, Glamour, Style, Confidence",
          cta: "Shop now",
        },
        winter: {
          title: "Luxury Winter Collection",
          tagline: "Warm, Cozy, Elegant, Premium",
          cta: "Shop now",
        },
        essentials: {
          title: "Timeless Wardrobe Essentials",
          tagline: "Classic, Everyday, Stylish, Premium",
          cta: "Shop now",
        },
      },
    },
  },
};
