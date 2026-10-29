import type { Locale } from "@/lib/i18n/types";

export type FeaturedCollectionProduct = {
  image: string;
  alt: Record<Locale, string>;
  href: string;
};

export type FeaturedCollectionScheme = {
  /** Radial glow behind the section (Maya `--body-background-gradient`). */
  gradient: string;
  background: string;
  heading: string;
  text: string;
  buttonBackground: string;
  buttonText: string;
};

type TabCopy = {
  label: string;
  heading: string;
  description: string[];
  /** Text typed inside the white pill. */
  pillText: string;
};

export type FeaturedCollectionTab = {
  id: string;
  icon: string;
  copy: Record<Locale, TabCopy>;
  pillHref: string;
  main: string;
  products: [FeaturedCollectionProduct, FeaturedCollectionProduct, FeaturedCollectionProduct];
  scheme: FeaturedCollectionScheme;
};

/** A tab with its text already resolved for one language. */
export type LocalizedFeaturedTab = Omit<FeaturedCollectionTab, "copy" | "products"> &
  TabCopy & {
    products: { image: string; alt: string; href: string }[];
  };

export function localizeFeaturedTab(
  tab: FeaturedCollectionTab,
  locale: Locale,
): LocalizedFeaturedTab {
  const { copy, products, ...rest } = tab;
  return {
    ...rest,
    ...copy[locale],
    products: products.map((p) => ({ image: p.image, href: p.href, alt: p.alt[locale] })),
  };
}

/** Greek caps are written without tonos (as in print capitals). */
export const FEATURED_COLLECTIONS_COPY: Record<Locale, { heading: string; lede: string }> = {
  el: {
    heading: "ΣΤΥΛ ΦΤΙΑΓΜΕΝΟ ΜΕ ΑΓΑΠΗ",
    lede: "Τρεις σειρές, μία ιδέα. Ανακάλυψε τη σειρά που σου ταιριάζει — για εκείνη, για εκείνον και για τα μικρά μας — και άφησε το MAGIW MAGIW να σε ντύσει με στυλ.",
  },
  en: {
    heading: "STYLE CRAFTED WITH LOVE",
    lede: "Three series, one idea. Discover the series that suits you — for her, for him and for our little ones — and let MAGIW MAGIW dress you with style.",
  },
};

/** Order: the middle tab (index 1) is the one active on load. */
export const FEATURED_COLLECTION_TABS: FeaturedCollectionTab[] = [
  {
    id: "gino",
    icon: "/featured/tab-0-icon.png",
    pillHref: "/shop",
    main: "/featured/t0-main.jpg",
    copy: {
      el: {
        label: "Gino · Άνδρας",
        heading: "ΔΥΝΑΜΗ ΣΕ ΚΑΘΕ ΚΙΝΗΣΗ",
        description: [
          "Η σειρά Gino ντύνει τον άνδρα που ξέρει τι θέλει. Καθαρές γραμμές, επιλεγμένα υφάσματα και άνετα, προσεγμένα κοψίματα για κάθε στιγμή της ημέρας.",
          "Με την ίδια φροντίδα που δίνουμε στην πρώτη ύλη, κάθε κομμάτι σχεδιάζεται και κατασκευάζεται για να σου ταιριάζει και να διαρκεί.",
        ],
        pillText: "Ανακάλυψε τη σειρά Gino",
      },
      en: {
        label: "Gino · Men",
        heading: "STRENGTH IN EVERY MOVE",
        description: [
          "The Gino series dresses the man who knows what he wants. Clean lines, carefully chosen fabrics and comfortable, well-made cuts for every moment of the day.",
          "With the same care we give to the raw material, every piece is designed and made to fit you and to last.",
        ],
        pillText: "Discover the Gino series",
      },
    },
    products: [
      { image: "/featured/t0-a.webp", alt: { el: "Gino — κομμάτι 1", en: "Gino — piece 1" }, href: "/shop" },
      { image: "/featured/t0-b.webp", alt: { el: "Gino — κομμάτι 2", en: "Gino — piece 2" }, href: "/shop" },
      { image: "/featured/t0-c.webp", alt: { el: "Gino — κομμάτι 3", en: "Gino — piece 3" }, href: "/shop" },
    ],
    scheme: {
      gradient: "radial-gradient(rgb(142 9 67), rgb(2 2 1) 65%)",
      background: "#000000",
      heading: "#ffffff",
      text: "#ffffff",
      buttonBackground: "#000000",
      buttonText: "#ffffff",
    },
  },
  {
    id: "evelinas",
    icon: "/featured/tab-1-icon.png",
    pillHref: "/shop",
    main: "/featured/t1-main.webp",
    copy: {
      el: {
        label: "Evelina's · Γυναίκα",
        heading: "ΕΜΠΝΕΥΣΜΕΝΟ ΑΠΟ ΨΗΛΑ, ΦΤΙΑΓΜΕΝΟ ΓΙΑ ΕΣΕΝΑ",
        description: [
          "Η σειρά Evelina's γεννήθηκε από την αγάπη για τη δημιουργία. Φορέματα, σετ και κομμάτια που αναδεικνύουν τη θηλυκότητα με φινέτσα και άνεση.",
          "Από το πρωί ως το βράδυ, κάθε σχέδιο μελετάται προσεκτικά — από την πρώτη ύλη μέχρι την τελευταία λεπτομέρεια — για να νιώθεις όμορφα σε κάθε σου εμφάνιση.",
        ],
        pillText: "Ανακάλυψε τη σειρά Evelina's",
      },
      en: {
        label: "Evelina's · Women",
        heading: "INSPIRED FROM ABOVE, MADE FOR YOU",
        description: [
          "The Evelina's series was born from a love of creating. Dresses, sets and pieces that celebrate femininity with elegance and comfort.",
          "From morning to evening, every design is carefully studied — from the raw material to the final detail — so you feel beautiful at every appearance.",
        ],
        pillText: "Discover the Evelina's series",
      },
    },
    products: [
      { image: "/featured/t1-a.webp", alt: { el: "Evelina's — κομμάτι 1", en: "Evelina's — piece 1" }, href: "/shop" },
      { image: "/featured/t1-b.webp", alt: { el: "Evelina's — κομμάτι 2", en: "Evelina's — piece 2" }, href: "/shop" },
      { image: "/featured/t1-c.webp", alt: { el: "Evelina's — κομμάτι 3", en: "Evelina's — piece 3" }, href: "/shop" },
    ],
    scheme: {
      gradient: "radial-gradient(rgba(37, 45, 0, 1), rgba(0, 0, 0, 1) 73%)",
      background: "#000000",
      heading: "#dddddd",
      text: "#c4c4c4",
      buttonBackground: "#ffffff",
      buttonText: "#000000",
    },
  },
  {
    id: "kids-baby",
    icon: "/featured/tab-2-icon.png",
    pillHref: "/shop",
    main: "/featured/t2-main.jpg",
    copy: {
      el: {
        label: "Παιδί & Μωρό",
        heading: "ΜΙΚΡΕΣ ΣΤΙΓΜΕΣ, ΜΕΓΑΛΗ ΑΓΑΠΗ",
        description: [
          "Η σειρά Evelina's kids and baby ντύνει τα μικρά μας με απαλά υφάσματα και χαρούμενα σχέδια, φτιαγμένα για παιχνίδι, άνεση και τρυφερότητα.",
          "Γιατί τα πιο όμορφα κομμάτια είναι εκείνα που φροντίζουν όσους αγαπάμε περισσότερο.",
        ],
        pillText: "Ανακάλυψε το Kids & Baby",
      },
      en: {
        label: "Kids & Baby",
        heading: "SMALL MOMENTS, BIG LOVE",
        description: [
          "The Evelina's kids and baby series dresses our little ones in soft fabrics and joyful designs, made for play, comfort and tenderness.",
          "Because the most beautiful pieces are the ones that care for those we love the most.",
        ],
        pillText: "Discover Evelina's kids & baby",
      },
    },
    products: [
      { image: "/featured/t2-a.webp", alt: { el: "Kids & Baby — κομμάτι 1", en: "Kids & Baby — piece 1" }, href: "/shop" },
      { image: "/featured/t2-b.webp", alt: { el: "Kids & Baby — κομμάτι 2", en: "Kids & Baby — piece 2" }, href: "/shop" },
      { image: "/featured/t2-c.webp", alt: { el: "Kids & Baby — κομμάτι 3", en: "Kids & Baby — piece 3" }, href: "/shop" },
    ],
    scheme: {
      gradient: "radial-gradient(rgb(228 100 21), rgb(2 2 1) 65%)",
      background: "#242427",
      heading: "#eceaea",
      text: "#eceaea",
      buttonBackground: "#ffffff",
      buttonText: "#000000",
    },
  },
];

export const FEATURED_DEFAULT_TAB = 1;
