import type { Locale } from "@/lib/i18n/types";
import { COMPANY, FREE_SHIPPING_FROM_EUR, RETURN_DAYS, SHIPPING_FLAT_EUR } from "@/lib/legal/company";

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
  designedGrid: {
    ariaLabel: string;
    headingStroke: string;
    headingSolid: string;
    overlay: string;
    collections: [string, string, string];
  };
  helpCenter: {
    ariaLabel: string;
    title: string;
    intro: string;
    items: { question: string; answer: string; link?: { href: string; label: string } }[];
    legalLinksLabel: string;
    copyright: string;
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
    designedGrid: {
      ariaLabel: "Μόδα σχεδιασμένη για εσένα",
      headingStroke: "ΜΟΔΑ",
      headingSolid: "ΣΧΕΔΙΑΣΜΕΝΗ",
      overlay: "ΓΙΑ ΕΣΕΝΑ",
      collections: ["Δες τη σειρά Gino", "Δες τη σειρά Evelina's", "Δες τη σειρά για παιδί & μωρό"],
    },
    helpCenter: {
      ariaLabel: "Κέντρο εξυπηρέτησης",
      title: "Κέντρο Εξυπηρέτησης",
      intro:
        "Καλώς ήρθες! Είμαστε εδώ για κάθε απορία σου. Για παραγγελίες, αποστολές, επιστροφές ή λεπτομέρειες προϊόντων, θα βρεις όλες τις απαντήσεις ακριβώς εδώ.",
      items: [
        {
          question: "Ποια είναι η πολιτική επιστροφών και αλλαγών;",
          answer: `Έχεις ${RETURN_DAYS} ημέρες από την παραλαβή για να επιστρέψεις ή να αλλάξεις ένα προϊόν, χωρίς να δώσεις εξήγηση. Το προϊόν πρέπει να είναι αφόρετο, με τις ετικέτες του. Η πρώτη αλλαγή μεγέθους γίνεται χωρίς χρέωση.`,
          link: { href: "/legal/returns", label: "Δες την πολιτική επιστροφών" },
        },
        {
          question: "Τι κάνω αν παρέλαβα ελαττωματικό ή λάθος προϊόν;",
          answer: `Στείλε μας φωτογραφίες στο ${COMPANY.email} μέσα σε 3 ημέρες από την παραλαβή. Αναλαμβάνουμε εμείς όλα τα έξοδα για αντικατάσταση ή επιστροφή χρημάτων.`,
        },
        {
          question: "Πώς παρακολουθώ την παραγγελία μου;",
          answer:
            "Μόλις φύγει η παραγγελία σου, θα λάβεις email με τον αριθμό αποστολής. Με αυτόν βλέπεις σε πραγματικό χρόνο πού βρίσκεται το δέμα σου.",
        },
        {
          question: "Πόσο κοστίζει και πόσο χρόνο κάνει η αποστολή;",
          answer: `Η αποστολή κοστίζει ${SHIPPING_FLAT_EUR} € σε όλη την Ελλάδα και είναι δωρεάν για αγορές από ${FREE_SHIPPING_FROM_EUR} € και πάνω. Παράδοση σε 1–4 εργάσιμες ημέρες.`,
          link: { href: "/legal/shipping", label: "Δες τις αποστολές" },
        },
        {
          question: "Ποιους τρόπους πληρωμής δέχεστε;",
          answer:
            "Κάρτα (Visa, Mastercard, Maestro), Apple Pay, Google Pay, αντικαταβολή και τραπεζική κατάθεση. Οι πληρωμές με κάρτα γίνονται με ασφάλεια, χωρίς να αποθηκεύουμε τα στοιχεία σου.",
          link: { href: "/legal/payments", label: "Δες τους τρόπους πληρωμής" },
        },
        {
          question: "Μπορώ να αλλάξω ή να ακυρώσω την παραγγελία μου;",
          answer: `Ναι, όσο δεν έχει αποσταλεί. Γράψε μας στο ${COMPANY.email} ή πάρε τηλέφωνο στο ${COMPANY.phone} με τον αριθμό παραγγελίας σου και θα το τακτοποιήσουμε αμέσως.`,
        },
      ],
      legalLinksLabel: "Νομικές πληροφορίες",
      copyright: "Με αγάπη από την Αθήνα",
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
    designedGrid: {
      ariaLabel: "Fashion designed for you",
      headingStroke: "FASHION",
      headingSolid: "DESIGNED",
      overlay: "FOR YOU",
      collections: ["View the Gino series", "View the Evelina's series", "View the kids & baby series"],
    },
    helpCenter: {
      ariaLabel: "Customer help center",
      title: "Customer Help Center",
      intro:
        "Welcome! We're here for any question you may have. Whether you need help with orders, shipping, returns or product details, you'll find all the answers right here.",
      items: [
        {
          question: "What is your return and exchange policy?",
          answer: `You have ${RETURN_DAYS} days from delivery to return or exchange an item, no reason needed. Items must be unworn, with tags attached. Your first size exchange is free.`,
          link: { href: "/legal/returns", label: "Read the returns policy" },
        },
        {
          question: "What if I received a damaged or incorrect item?",
          answer: `Send photos to ${COMPANY.email} within 3 days of delivery. We cover all costs for a replacement or a refund.`,
        },
        {
          question: "How can I track my order?",
          answer:
            "As soon as your order ships, you'll receive an email with the tracking number, so you can follow your parcel in real time.",
        },
        {
          question: "How much does shipping cost and how long does it take?",
          answer: `Shipping is €${SHIPPING_FLAT_EUR} anywhere in Greece and free on orders of €${FREE_SHIPPING_FROM_EUR} or more. Delivery takes 1–4 business days.`,
          link: { href: "/legal/shipping", label: "Read about shipping" },
        },
        {
          question: "What payment methods do you accept?",
          answer:
            "Card (Visa, Mastercard, Maestro), Apple Pay, Google Pay, cash on delivery and bank transfer. Card payments are secure and we never store your details.",
          link: { href: "/legal/payments", label: "See payment methods" },
        },
        {
          question: "Can I modify or cancel my order after placing it?",
          answer: `Yes, as long as it hasn't shipped. Email ${COMPANY.email} or call ${COMPANY.phone} with your order number and we'll sort it out right away.`,
        },
      ],
      legalLinksLabel: "Legal information",
      copyright: "Made with love in Athens",
    },
  },
};
