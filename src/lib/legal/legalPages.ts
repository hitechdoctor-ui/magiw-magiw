import type { Locale } from "@/lib/i18n/types";
import { COMPANY, FREE_SHIPPING_FROM_EUR, RETURN_DAYS, SHIPPING_FLAT_EUR } from "./company";

export const LEGAL_SLUGS = [
  "terms",
  "privacy",
  "cookies",
  "returns",
  "shipping",
  "payments",
  "company",
] as const;

export type LegalSlug = (typeof LEGAL_SLUGS)[number];

export type LegalSection = {
  heading: string;
  body?: string[];
  list?: string[];
};

export type LegalDoc = {
  title: string;
  /** Short label for footers and side navigation. */
  navLabel: string;
  summary: string;
  sections: LegalSection[];
};

export function isLegalSlug(value: string): value is LegalSlug {
  return (LEGAL_SLUGS as readonly string[]).includes(value);
}

export const LEGAL_UI: Record<
  Locale,
  { hubTitle: string; hubLede: string; updated: string; demoNotice: string; otherPages: string; contact: string }
> = {
  el: {
    hubTitle: "Νομικές πληροφορίες",
    hubLede: "Όλοι οι όροι και οι πολιτικές του καταστήματος, γραμμένα απλά και καθαρά.",
    updated: "Τελευταία ενημέρωση",
    demoNotice:
      "Τα στοιχεία της επιχείρησης σε αυτή τη σελίδα είναι προσωρινά (demo) και θα αντικατασταθούν με τα επίσημα πριν την έναρξη πωλήσεων.",
    otherPages: "Νομικές σελίδες",
    contact: "Επικοινωνία",
  },
  en: {
    hubTitle: "Legal information",
    hubLede: "All of the shop's terms and policies, written plainly and clearly.",
    updated: "Last updated",
    demoNotice:
      "The business details on this page are placeholders (demo) and will be replaced with the official ones before sales begin.",
    otherPages: "Legal pages",
    contact: "Contact",
  },
};

const c = COMPANY;

export const LEGAL_PAGES: Record<Locale, Record<LegalSlug, LegalDoc>> = {
  el: {
    terms: {
      title: "Όροι Χρήσης & Πώλησης",
      navLabel: "Όροι χρήσης",
      summary:
        "Οι όροι που ισχύουν όταν περιηγείσαι στο κατάστημα MAGIW MAGIW και όταν ολοκληρώνεις μια αγορά.",
      sections: [
        {
          heading: "1. Ποιοι είμαστε",
          body: [
            `Το ηλεκτρονικό κατάστημα ${c.website} λειτουργεί από την επιχείρηση «${c.legalName}», ΑΦΜ ${c.vatNumber}, ${c.taxOffice}, ΓΕΜΗ ${c.gemiNumber}, με έδρα: ${c.address}.`,
            `Επικοινωνία: ${c.email} · ${c.phone}.`,
          ],
        },
        {
          heading: "2. Αποδοχή των όρων",
          body: [
            "Η χρήση του ιστότοπου και η υποβολή παραγγελίας σημαίνουν ότι διάβασες και αποδέχεσαι τους παρόντες όρους. Οι όροι διέπονται από το ελληνικό δίκαιο και ειδικά από τον Ν. 2251/1994 για την προστασία των καταναλωτών, όπως ισχύει.",
            "Μπορεί να ενημερώνουμε τους όρους. Για κάθε παραγγελία ισχύουν οι όροι που ήταν δημοσιευμένοι τη στιγμή της υποβολής της.",
          ],
        },
        {
          heading: "3. Προϊόντα και τιμές",
          list: [
            "Οι τιμές είναι σε ευρώ (€) και περιλαμβάνουν ΦΠΑ.",
            "Τα έξοδα αποστολής εμφανίζονται ξεχωριστά πριν την ολοκλήρωση της παραγγελίας.",
            "Οι φωτογραφίες αποδίδουν όσο πιο πιστά γίνεται τα προϊόντα· μικρές διαφορές στην απόχρωση λόγω οθόνης δεν θεωρούνται ελάττωμα.",
            "Σε περίπτωση προφανούς λάθους τιμής, θα επικοινωνήσουμε μαζί σου πριν την αποστολή και μπορείς να ακυρώσεις χωρίς χρέωση.",
          ],
        },
        {
          heading: "4. Παραγγελία και σύναψη σύμβασης",
          body: [
            "Η σύμβαση πώλησης ολοκληρώνεται όταν λάβεις email επιβεβαίωσης της παραγγελίας. Μέχρι τότε μπορούμε να απορρίψουμε μια παραγγελία, για παράδειγμα αν το προϊόν εξαντληθεί, και θα σε ενημερώσουμε άμεσα.",
          ],
        },
        {
          heading: "5. Πληρωμή, αποστολή, επιστροφές",
          body: [
            "Οι τρόποι πληρωμής, οι χρόνοι και τα κόστη αποστολής και η διαδικασία επιστροφής περιγράφονται στις αντίστοιχες σελίδες: Τρόποι Πληρωμής, Αποστολές και Επιστροφές & Υπαναχώρηση.",
          ],
        },
        {
          heading: "6. Πνευματική ιδιοκτησία",
          body: [
            "Τα κείμενα, οι φωτογραφίες, τα σχέδια, τα λογότυπα και το όνομα MAGIW MAGIW, καθώς και οι σειρές Evelina's, Gino και Evelina's kids and baby, ανήκουν στην επιχείρηση και δεν επιτρέπεται η αναπαραγωγή τους χωρίς γραπτή άδεια.",
          ],
        },
        {
          heading: "7. Ευθύνη",
          body: [
            "Καταβάλλουμε κάθε προσπάθεια ώστε ο ιστότοπος να λειτουργεί σωστά και οι πληροφορίες να είναι ακριβείς. Δεν ευθυνόμαστε για προσωρινή μη διαθεσιμότητα λόγω συντήρησης ή τεχνικών προβλημάτων τρίτων.",
          ],
        },
        {
          heading: "8. Επίλυση διαφορών",
          body: [
            "Για κάθε παράπονο επικοινώνησε πρώτα μαζί μας· απαντάμε μέσα σε 3 εργάσιμες ημέρες. Αν δεν βρεθεί λύση, μπορείς να απευθυνθείς στον Συνήγορο του Καταναλωτή ή στη Γενική Γραμματεία Εμπορίου και Προστασίας Καταναλωτή. Αρμόδια είναι τα δικαστήρια της Αθήνας, με την επιφύλαξη των δικαιωμάτων που σου δίνει ο νόμος ως καταναλωτή.",
          ],
        },
      ],
    },
    privacy: {
      title: "Πολιτική Απορρήτου",
      navLabel: "Απόρρητο",
      summary:
        "Πώς συλλέγουμε, χρησιμοποιούμε και προστατεύουμε τα προσωπικά σου δεδομένα, σύμφωνα με τον Γενικό Κανονισμό (ΕΕ) 2016/679 (GDPR) και τον Ν. 4624/2019.",
      sections: [
        {
          heading: "1. Υπεύθυνος επεξεργασίας",
          body: [`${c.legalName}, ${c.address}. Για κάθε θέμα δεδομένων: ${c.email}.`],
        },
        {
          heading: "2. Ποια δεδομένα συλλέγουμε",
          list: [
            "Στοιχεία παραγγελίας: ονοματεπώνυμο, email, τηλέφωνο, διεύθυνση αποστολής και τιμολόγησης.",
            "Στοιχεία πληρωμής: η πληρωμή με κάρτα γίνεται απευθείας στον πάροχο πληρωμών· εμείς δεν βλέπουμε ούτε αποθηκεύουμε τον αριθμό της κάρτας σου.",
            "Εγγραφή στο newsletter: το email σου.",
            "Τεχνικά στοιχεία: διεύθυνση IP, τύπος συσκευής και browser, μέσω απαραίτητων cookies (δες την Πολιτική Cookies).",
          ],
        },
        {
          heading: "3. Γιατί τα χρησιμοποιούμε",
          list: [
            "Για να εκτελέσουμε την παραγγελία σου (εκτέλεση σύμβασης).",
            "Για την έκδοση παραστατικών και τις φορολογικές μας υποχρεώσεις (νομική υποχρέωση).",
            "Για να σου στέλνουμε νέα και προσφορές, μόνο αν το ζήτησες (συγκατάθεση, που ανακαλείται οποτεδήποτε).",
            "Για την ασφάλεια και σωστή λειτουργία του ιστότοπου (έννομο συμφέρον).",
          ],
        },
        {
          heading: "4. Με ποιους τα μοιραζόμαστε",
          body: [
            "Μόνο με όσους χρειάζεται για να φτάσει η παραγγελία σου: την εταιρεία ταχυμεταφορών, τον πάροχο πληρωμών, τον πάροχο φιλοξενίας και βάσης δεδομένων του ιστότοπου και τον λογιστή μας. Δεν πουλάμε ποτέ δεδομένα σε τρίτους.",
          ],
        },
        {
          heading: "5. Πόσο καιρό τα κρατάμε",
          body: [
            "Τα στοιχεία παραγγελιών φυλάσσονται όσο ορίζει η φορολογική νομοθεσία (κατά κανόνα 5 έτη). Το email του newsletter κρατιέται μέχρι να διαγραφείς.",
          ],
        },
        {
          heading: "6. Τα δικαιώματά σου",
          list: [
            "Πρόσβαση στα δεδομένα σου και λήψη αντιγράφου.",
            "Διόρθωση ή διαγραφή τους.",
            "Περιορισμό ή εναντίωση στην επεξεργασία.",
            "Φορητότητα των δεδομένων.",
            "Ανάκληση της συγκατάθεσής σου οποτεδήποτε.",
          ],
          body: [
            `Στείλε μας στο ${c.email} και θα απαντήσουμε μέσα σε 30 ημέρες. Έχεις επίσης δικαίωμα καταγγελίας στην Αρχή Προστασίας Δεδομένων Προσωπικού Χαρακτήρα (www.dpa.gr).`,
          ],
        },
        {
          heading: "7. Ασφάλεια",
          body: [
            "Ο ιστότοπος λειτουργεί με κρυπτογραφημένη σύνδεση (HTTPS) και η πρόσβαση στα δεδομένα επιτρέπεται μόνο σε εξουσιοδοτημένα πρόσωπα.",
          ],
        },
      ],
    },
    cookies: {
      title: "Πολιτική Cookies",
      navLabel: "Cookies",
      summary: "Ποια cookies και ποια τοπική αποθήκευση χρησιμοποιεί ο ιστότοπος και γιατί.",
      sections: [
        {
          heading: "1. Τι είναι τα cookies",
          body: [
            "Μικρά αρχεία που αποθηκεύονται στη συσκευή σου όταν επισκέπτεσαι έναν ιστότοπο, ώστε να θυμάται τις επιλογές σου.",
          ],
        },
        {
          heading: "2. Απολύτως απαραίτητα",
          body: ["Χωρίς αυτά το κατάστημα δεν μπορεί να λειτουργήσει, γι' αυτό δεν απαιτούν συγκατάθεση:"],
          list: [
            "Καλάθι αγορών: θυμάται τα προϊόντα που πρόσθεσες.",
            "Γλώσσα: θυμάται αν προτιμάς Ελληνικά ή Αγγλικά.",
            "Ολοκλήρωση παραγγελίας: κρατά προσωρινά τα στοιχεία της φόρμας μέχρι να ολοκληρώσεις.",
            "Ασφάλεια: προστασία από κακόβουλη χρήση.",
          ],
        },
        {
          heading: "3. Στατιστικά και marketing",
          body: [
            "Αυτή τη στιγμή δεν χρησιμοποιούμε cookies στατιστικών ή διαφήμισης. Αν προστεθούν στο μέλλον, θα ενεργοποιούνται μόνο με τη ρητή συγκατάθεσή σου και θα ενημερωθεί αυτή η σελίδα.",
          ],
        },
        {
          heading: "4. Πώς τα διαχειρίζεσαι",
          body: [
            "Μπορείς να διαγράψεις ή να μπλοκάρεις τα cookies από τις ρυθμίσεις του browser σου. Αν μπλοκάρεις τα απαραίτητα, το καλάθι και η γλώσσα δεν θα θυμούνται τις επιλογές σου.",
          ],
        },
      ],
    },
    returns: {
      title: "Επιστροφές & Υπαναχώρηση",
      navLabel: "Επιστροφές",
      summary: `Έχεις ${RETURN_DAYS} ημέρες από την παραλαβή για να επιστρέψεις ένα προϊόν, χωρίς να χρειάζεται να δώσεις εξήγηση.`,
      sections: [
        {
          heading: "1. Δικαίωμα υπαναχώρησης",
          body: [
            `Σύμφωνα με το άρθρο 3ε του Ν. 2251/1994, μπορείς να υπαναχωρήσεις από την αγορά μέσα σε ${RETURN_DAYS} ημερολογιακές ημέρες από την ημέρα που παρέλαβες το προϊόν.`,
          ],
        },
        {
          heading: "2. Προϋποθέσεις",
          list: [
            "Το προϊόν να είναι αφόρετο, άπλυτο και χωρίς φθορές.",
            "Να έχει τις ετικέτες του και, αν γίνεται, τη συσκευασία του.",
            "Για λόγους υγιεινής, εσώρουχα, μαγιό και σκουλαρίκια επιστρέφονται μόνο αν δεν έχει ανοιχτεί η σφραγισμένη συσκευασία τους.",
            "Προϊόντα κατά παραγγελία ή με προσωποποίηση δεν επιστρέφονται, εκτός αν είναι ελαττωματικά.",
          ],
        },
        {
          heading: "3. Πώς κάνεις επιστροφή",
          list: [
            `Στείλε email στο ${c.email} με τον αριθμό παραγγελίας και το προϊόν που επιστρέφεις.`,
            "Θα σου στείλουμε οδηγίες και τη διεύθυνση επιστροφής.",
            "Συσκεύασε το προϊόν προσεκτικά και στείλε το μέσα στις επόμενες 14 ημέρες.",
          ],
        },
        {
          heading: "4. Επιστροφή χρημάτων",
          body: [
            "Επιστρέφουμε το ποσό του προϊόντος και τα αρχικά έξοδα αποστολής μέσα σε 14 ημέρες από τη στιγμή που θα λάβουμε το προϊόν, με τον ίδιο τρόπο που πλήρωσες. Για αντικαταβολή, η επιστροφή γίνεται σε τραπεζικό λογαριασμό που θα μας υποδείξεις.",
            "Τα έξοδα αποστολής της επιστροφής βαρύνουν εσένα, εκτός αν το προϊόν είναι ελαττωματικό ή λάθος.",
          ],
        },
        {
          heading: "5. Αλλαγές μεγέθους",
          body: [
            "Αν θέλεις άλλο μέγεθος ή χρώμα, γράψε το στο email σου. Η πρώτη αλλαγή μεγέθους γίνεται χωρίς χρέωση, εφόσον υπάρχει διαθεσιμότητα.",
          ],
        },
        {
          heading: "6. Ελαττωματικό ή λάθος προϊόν",
          body: [
            "Αν παρέλαβες κάτι ελαττωματικό ή διαφορετικό από αυτό που παρήγγειλες, στείλε μας φωτογραφίες μέσα σε 3 ημέρες από την παραλαβή. Αναλαμβάνουμε εμείς όλα τα έξοδα αντικατάστασης ή επιστροφής χρημάτων. Ισχύει επίσης η νόμιμη εγγύηση 2 ετών για πραγματικά ελαττώματα.",
          ],
        },
      ],
    },
    shipping: {
      title: "Αποστολές",
      navLabel: "Αποστολές",
      summary: `Αποστέλλουμε σε όλη την Ελλάδα. Κόστος ${SHIPPING_FLAT_EUR} € — δωρεάν για αγορές από ${FREE_SHIPPING_FROM_EUR} € και πάνω.`,
      sections: [
        {
          heading: "1. Κόστος αποστολής",
          list: [
            `${SHIPPING_FLAT_EUR} € για κάθε παραγγελία σε όλη την Ελλάδα.`,
            `Δωρεάν αποστολή για παραγγελίες από ${FREE_SHIPPING_FROM_EUR} € και πάνω.`,
            "Για δυσπρόσιτες περιοχές μπορεί να υπάρξει μικρή επιπλέον χρέωση από την εταιρεία ταχυμεταφορών· θα ενημερωθείς πριν την αποστολή.",
          ],
        },
        {
          heading: "2. Χρόνος παράδοσης",
          list: [
            "Ετοιμάζουμε την παραγγελία σε 1–2 εργάσιμες ημέρες.",
            "Παράδοση σε 1–3 εργάσιμες σε Αθήνα και Θεσσαλονίκη, 2–4 εργάσιμες στην υπόλοιπη Ελλάδα και τα νησιά.",
            "Σε περιόδους εκπτώσεων ή εορτών οι χρόνοι μπορεί να αυξηθούν ελαφρώς.",
          ],
        },
        {
          heading: "3. Παρακολούθηση",
          body: [
            "Μόλις φύγει η παραγγελία σου, θα λάβεις email με τον αριθμό αποστολής για να την παρακολουθείς.",
          ],
        },
        {
          heading: "4. Αποστολές εξωτερικού",
          body: [
            `Προς το παρόν αποστέλλουμε μόνο εντός Ελλάδας. Για αποστολή στο εξωτερικό, γράψε μας στο ${c.email}.`,
          ],
        },
        {
          heading: "5. Παραλαβή",
          body: [
            "Έλεγξε το δέμα κατά την παραλαβή. Αν η συσκευασία είναι εμφανώς κατεστραμμένη, σημείωσέ το στον courier και ενημέρωσέ μας την ίδια μέρα.",
          ],
        },
      ],
    },
    payments: {
      title: "Τρόποι Πληρωμής",
      navLabel: "Πληρωμές",
      summary: "Όλοι οι διαθέσιμοι τρόποι για να πληρώσεις την παραγγελία σου με ασφάλεια.",
      sections: [
        {
          heading: "1. Χρεωστική ή πιστωτική κάρτα",
          body: [
            "Visa, Mastercard και Maestro. Η πληρωμή γίνεται στο ασφαλές περιβάλλον του παρόχου πληρωμών (Stripe) με κρυπτογράφηση και 3D Secure. Δεν βλέπουμε ούτε αποθηκεύουμε τα στοιχεία της κάρτας σου.",
          ],
        },
        {
          heading: "2. Apple Pay / Google Pay",
          body: ["Γρήγορη πληρωμή από το κινητό ή τον υπολογιστή σου, όπου υποστηρίζεται από τη συσκευή σου."],
        },
        {
          heading: "3. Αντικαταβολή",
          body: [
            "Πληρώνεις μετρητά ή με κάρτα στον courier κατά την παραλαβή. Η εταιρεία ταχυμεταφορών μπορεί να έχει μικρή χρέωση αντικαταβολής, που θα εμφανίζεται πριν ολοκληρώσεις την παραγγελία.",
          ],
        },
        {
          heading: "4. Τραπεζική κατάθεση",
          body: [
            "Μετά την παραγγελία θα λάβεις email με τα στοιχεία του λογαριασμού. Βάλε τον αριθμό παραγγελίας στην αιτιολογία. Η παραγγελία αποστέλλεται μόλις πιστωθεί το ποσό· αν δεν γίνει κατάθεση μέσα σε 3 εργάσιμες, η παραγγελία ακυρώνεται αυτόματα.",
          ],
        },
        {
          heading: "5. Παραστατικά",
          body: ["Με κάθε παραγγελία εκδίδεται απόδειξη λιανικής ή, αν το ζητήσεις, τιμολόγιο."],
        },
      ],
    },
    company: {
      title: "Στοιχεία Επιχείρησης & Επικοινωνία",
      navLabel: "Στοιχεία επιχείρησης",
      summary: "Ποιοι είμαστε και πώς μπορείς να επικοινωνήσεις μαζί μας.",
      sections: [
        {
          heading: "Στοιχεία επιχείρησης",
          list: [
            `Επωνυμία: ${c.legalName}`,
            `Διακριτικός τίτλος: ${c.brand}`,
            `ΑΦΜ: ${c.vatNumber}`,
            `ΔΟΥ: ${c.taxOffice}`,
            `Αριθμός ΓΕΜΗ: ${c.gemiNumber}`,
            `Έδρα: ${c.address}`,
          ],
        },
        {
          heading: "Επικοινωνία",
          list: [`Email: ${c.email}`, `Τηλέφωνο: ${c.phone}`, `Ωράριο: ${c.hours.el}`],
        },
        {
          heading: "Σχεδιασμός & ανάπτυξη ιστότοπου",
          body: ["HitechDoctor"],
        },
      ],
    },
  },
  en: {
    terms: {
      title: "Terms of Use & Sale",
      navLabel: "Terms of use",
      summary:
        "The terms that apply when you browse the MAGIW MAGIW shop and when you complete a purchase.",
      sections: [
        {
          heading: "1. Who we are",
          body: [
            `The online shop ${c.website} is operated by "${c.legalName}", VAT no. ${c.vatNumber}, ${c.taxOffice}, GEMI no. ${c.gemiNumber}, registered at: ${c.address}.`,
            `Contact: ${c.email} · ${c.phone}.`,
          ],
        },
        {
          heading: "2. Acceptance of the terms",
          body: [
            "By using the website and placing an order you confirm that you have read and accept these terms. They are governed by Greek law, in particular Law 2251/1994 on consumer protection, as in force.",
            "We may update these terms. Each order is governed by the terms published at the time it was placed.",
          ],
        },
        {
          heading: "3. Products and prices",
          list: [
            "Prices are in euro (€) and include VAT.",
            "Shipping costs are shown separately before you complete your order.",
            "Photos show the products as faithfully as possible; small colour differences caused by screens are not considered defects.",
            "In case of an obvious pricing error we will contact you before dispatch, and you may cancel free of charge.",
          ],
        },
        {
          heading: "4. Orders and contract",
          body: [
            "The sales contract is concluded when you receive the order confirmation email. Until then we may decline an order, for example if an item sells out, and we will let you know right away.",
          ],
        },
        {
          heading: "5. Payment, shipping, returns",
          body: [
            "Payment methods, delivery times and costs, and the return process are described on the Payment Methods, Shipping and Returns & Withdrawal pages.",
          ],
        },
        {
          heading: "6. Intellectual property",
          body: [
            "Texts, photos, designs, logos and the MAGIW MAGIW name, as well as the Evelina's, Gino and Evelina's kids and baby series, belong to the business and may not be reproduced without written permission.",
          ],
        },
        {
          heading: "7. Liability",
          body: [
            "We do our best to keep the website working properly and the information accurate. We are not liable for temporary unavailability due to maintenance or third-party technical issues.",
          ],
        },
        {
          heading: "8. Dispute resolution",
          body: [
            "Please contact us first with any complaint; we reply within 3 business days. If no solution is found, you may turn to the Hellenic Consumer Ombudsman or the General Secretariat for Commerce and Consumer Protection. The courts of Athens have jurisdiction, without prejudice to your statutory rights as a consumer.",
          ],
        },
      ],
    },
    privacy: {
      title: "Privacy Policy",
      navLabel: "Privacy",
      summary:
        "How we collect, use and protect your personal data, in line with the General Data Protection Regulation (EU) 2016/679 (GDPR) and Greek Law 4624/2019.",
      sections: [
        {
          heading: "1. Data controller",
          body: [`${c.legalName}, ${c.address}. For any data matter: ${c.email}.`],
        },
        {
          heading: "2. What data we collect",
          list: [
            "Order details: full name, email, phone, shipping and billing address.",
            "Payment details: card payments go directly to the payment provider; we never see or store your card number.",
            "Newsletter sign-up: your email.",
            "Technical data: IP address, device and browser type, through essential cookies (see the Cookie Policy).",
          ],
        },
        {
          heading: "3. Why we use it",
          list: [
            "To fulfil your order (performance of a contract).",
            "To issue receipts and meet our tax obligations (legal obligation).",
            "To send you news and offers, only if you asked for them (consent, which you can withdraw at any time).",
            "To keep the website secure and working properly (legitimate interest).",
          ],
        },
        {
          heading: "4. Who we share it with",
          body: [
            "Only with those needed to get your order to you: the courier, the payment provider, the website hosting and database provider, and our accountant. We never sell data to third parties.",
          ],
        },
        {
          heading: "5. How long we keep it",
          body: [
            "Order data is kept for as long as tax law requires (usually 5 years). Your newsletter email is kept until you unsubscribe.",
          ],
        },
        {
          heading: "6. Your rights",
          list: [
            "Access your data and receive a copy.",
            "Correct or delete it.",
            "Restrict or object to processing.",
            "Data portability.",
            "Withdraw your consent at any time.",
          ],
          body: [
            `Write to ${c.email} and we will reply within 30 days. You may also lodge a complaint with the Hellenic Data Protection Authority (www.dpa.gr).`,
          ],
        },
        {
          heading: "7. Security",
          body: [
            "The website uses an encrypted connection (HTTPS) and only authorised people can access the data.",
          ],
        },
      ],
    },
    cookies: {
      title: "Cookie Policy",
      navLabel: "Cookies",
      summary: "Which cookies and local storage the website uses, and why.",
      sections: [
        {
          heading: "1. What cookies are",
          body: [
            "Small files saved on your device when you visit a website, so that it remembers your choices.",
          ],
        },
        {
          heading: "2. Strictly necessary",
          body: ["The shop cannot work without these, so they do not require consent:"],
          list: [
            "Shopping bag: remembers the products you added.",
            "Language: remembers whether you prefer Greek or English.",
            "Checkout: temporarily keeps your form details until you finish.",
            "Security: protection against misuse.",
          ],
        },
        {
          heading: "3. Analytics and marketing",
          body: [
            "We currently do not use analytics or advertising cookies. If they are added in the future, they will only be enabled with your explicit consent and this page will be updated.",
          ],
        },
        {
          heading: "4. Managing cookies",
          body: [
            "You can delete or block cookies in your browser settings. If you block the necessary ones, the bag and language will not remember your choices.",
          ],
        },
      ],
    },
    returns: {
      title: "Returns & Withdrawal",
      navLabel: "Returns",
      summary: `You have ${RETURN_DAYS} days from delivery to return an item, with no need to give a reason.`,
      sections: [
        {
          heading: "1. Right of withdrawal",
          body: [
            `Under article 3e of Greek Law 2251/1994 you may withdraw from your purchase within ${RETURN_DAYS} calendar days of the day you received the item.`,
          ],
        },
        {
          heading: "2. Conditions",
          list: [
            "The item must be unworn, unwashed and undamaged.",
            "It must have its tags and, where possible, its packaging.",
            "For hygiene reasons, underwear, swimwear and earrings can only be returned if their sealed packaging is unopened.",
            "Made-to-order or personalised items cannot be returned unless faulty.",
          ],
        },
        {
          heading: "3. How to return",
          list: [
            `Email ${c.email} with your order number and the item you are returning.`,
            "We will send you instructions and the return address.",
            "Pack the item carefully and send it within the next 14 days.",
          ],
        },
        {
          heading: "4. Refunds",
          body: [
            "We refund the item price and the original shipping cost within 14 days of receiving the item, using the same method you paid with. For cash on delivery, the refund goes to a bank account you give us.",
            "Return shipping costs are yours, unless the item is faulty or wrong.",
          ],
        },
        {
          heading: "5. Size exchanges",
          body: [
            "If you would like another size or colour, mention it in your email. Your first size exchange is free, subject to availability.",
          ],
        },
        {
          heading: "6. Faulty or wrong item",
          body: [
            "If you received something faulty or different from what you ordered, send us photos within 3 days of delivery. We cover all replacement or refund costs. The 2-year legal guarantee for genuine defects also applies.",
          ],
        },
      ],
    },
    shipping: {
      title: "Shipping",
      navLabel: "Shipping",
      summary: `We ship across Greece. Cost €${SHIPPING_FLAT_EUR} — free on orders of €${FREE_SHIPPING_FROM_EUR} or more.`,
      sections: [
        {
          heading: "1. Shipping cost",
          list: [
            `€${SHIPPING_FLAT_EUR} per order anywhere in Greece.`,
            `Free shipping on orders of €${FREE_SHIPPING_FROM_EUR} or more.`,
            "Remote areas may carry a small extra courier charge; we will let you know before dispatch.",
          ],
        },
        {
          heading: "2. Delivery time",
          list: [
            "We prepare your order within 1–2 business days.",
            "Delivery in 1–3 business days in Athens and Thessaloniki, 2–4 business days elsewhere in Greece and on the islands.",
            "During sales or holidays, times may be slightly longer.",
          ],
        },
        {
          heading: "3. Tracking",
          body: ["Once your order ships, you will receive an email with the tracking number."],
        },
        {
          heading: "4. International shipping",
          body: [`We currently ship within Greece only. For international delivery, write to ${c.email}.`],
        },
        {
          heading: "5. Receiving your parcel",
          body: [
            "Check the parcel on delivery. If the packaging is visibly damaged, note it with the courier and let us know the same day.",
          ],
        },
      ],
    },
    payments: {
      title: "Payment Methods",
      navLabel: "Payments",
      summary: "All the ways you can pay for your order securely.",
      sections: [
        {
          heading: "1. Debit or credit card",
          body: [
            "Visa, Mastercard and Maestro. Payment takes place in the payment provider's secure environment (Stripe) with encryption and 3D Secure. We never see or store your card details.",
          ],
        },
        {
          heading: "2. Apple Pay / Google Pay",
          body: ["Fast payment from your phone or computer, where your device supports it."],
        },
        {
          heading: "3. Cash on delivery",
          body: [
            "Pay the courier in cash or by card on delivery. The courier may add a small cash-on-delivery fee, shown before you complete your order.",
          ],
        },
        {
          heading: "4. Bank transfer",
          body: [
            "After ordering you will receive an email with the account details. Include your order number as the reference. The order ships once the payment clears; if no transfer is made within 3 business days, the order is cancelled automatically.",
          ],
        },
        {
          heading: "5. Receipts",
          body: ["Every order comes with a retail receipt or, if you ask, an invoice."],
        },
      ],
    },
    company: {
      title: "Business Details & Contact",
      navLabel: "Business details",
      summary: "Who we are and how to reach us.",
      sections: [
        {
          heading: "Business details",
          list: [
            `Legal name: ${c.legalName}`,
            `Trade name: ${c.brand}`,
            `VAT no.: ${c.vatNumber}`,
            `Tax office: ${c.taxOffice}`,
            `GEMI no.: ${c.gemiNumber}`,
            `Registered address: ${c.address}`,
          ],
        },
        {
          heading: "Contact",
          list: [`Email: ${c.email}`, `Phone: ${c.phone}`, `Hours: ${c.hours.en}`],
        },
        {
          heading: "Website design & development",
          body: ["HitechDoctor"],
        },
      ],
    },
  },
};
