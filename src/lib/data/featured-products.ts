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
  tryOnCategory: "dresses",
  garmentDescription:
    "matte black satin two-piece set: structured bustier top and high-waisted maxi skirt, skirt full length to ankle or floor, long hem not mini, fluid A-line volume, preserve maxi skirt length from reference photo",
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
  tryOnCategory: "dresses",
  garmentDescription:
    "long emerald green satin maxi dress, full length below knee to ankle, floor-length hem, not mini or short dress, V-neck structured bodice, pleated waistband, A-line flowing skirt, preserve full dress length from garment image",
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

export const angelInspirationSet: ProductDetail = {
  id: "d3000000-0000-0000-0000-000000000003",
  name: "ANGEL INSPIRATION SET",
  slug: "angel-inspiration-set",
  sku: "MM-AI001",
  description:
    "Τριών τεμαχίων editorial σετ: λευκό hooded zip top με balloon sleeves, structured denim corset στη μέση, ριγέ shirt που φαίνεται στο λαιμό και κάτω από το corset, και wide-leg παντελόνι με bold μπλε denim λωρίδα στο πλάι. Σχεδιασμένο στο ατελιέ ως hybrid layering look.",
  price_cents: 22800,
  currency: "EUR",
  sizes: ["XS", "S", "M", "L"],
  stock: 4,
  is_active: true,
  pageLayout: "editorial",
  statusLabel: "Limited · February 2026",
  showVirtualTryOn: true,
  tryOnCategory: "dresses",
  garmentDescription:
    "three-piece fashion set: white hooded zip-up top with puffed sleeves and blue denim corset waist panel, blue and white vertically striped shirt layered underneath with long shirt tail below hem, full-length white wide-leg trousers with thick blue denim side stripe down each leg, preserve full trouser length not cropped or mini",
  editorial: {
    collectionLine: "Angel Inspiration",
    seasonLabel: "Feb 2026",
    slides: [
      {
        image: "/images/products/angel-inspiration/01-full.jpg",
        caption: "Full silhouette · marble atelier",
      },
      {
        image: "/images/products/angel-inspiration/02-detail-top.jpg",
        caption: "Denim corset · layered collar",
      },
      {
        image: "/images/products/angel-inspiration/03-editorial.jpg",
        caption: "Vertical editorial frame",
      },
      {
        image: "/images/products/angel-inspiration/04-trouser.jpg",
        caption: "Side stripe · gold emblem",
      },
      {
        image: "/images/products/angel-inspiration/05-lookbook-grid.jpg",
        caption: "Four-angle lookbook",
      },
      {
        image: "/images/products/angel-inspiration/06-duo.jpg",
        caption: "Atelier pairing study",
      },
    ],
  },
  images: [
    "/images/products/angel-inspiration/01-full.jpg",
    "/images/products/angel-inspiration/02-detail-top.jpg",
    "/images/products/angel-inspiration/03-editorial.jpg",
    "/images/products/angel-inspiration/04-trouser.jpg",
    "/images/products/angel-inspiration/05-lookbook-grid.jpg",
    "/images/products/angel-inspiration/06-duo.jpg",
  ],
  sizeGuide: {
    rows: [
      { size: "XS", bust: "80", waist: "62", hips: "86" },
      { size: "S", bust: "84", waist: "66", hips: "90" },
      { size: "M", bust: "88", waist: "70", hips: "94" },
      { size: "L", bust: "92", waist: "74", hips: "98" },
    ],
    customFitNote:
      "Το σετ πωλείται ως complete look· για προσαρμογή corset ή μήκους παντελονιού, επικοινώνησε με το ατελιέ.",
  },
  sections: [
    {
      id: "composition",
      title: "Σύνθεση Look",
      content:
        "Hooded top σε fine knit/jersey, denim corset με front zip, ριγέ shirt ως base layer, wide-leg trouser με architectural side stripe. Ιδανικό για layered styling ή ως ενιαίο runway set.",
    },
    {
      id: "care",
      title: "Φροντίδα",
      content:
        "Ξεχωριστό πλύσιμο ανά κομμάτι · Denim corset: στεγνό καθάρισμα · Knit top & trouser: χαμηλή θερμοκρασία · Μην λευκάνετε τα gold-print τμήματα.",
    },
  ],
};

export const evelinaShimmerSet: ProductDetail = {
  id: "e4000000-0000-0000-0000-000000000004",
  name: "EVELINA SHIMMER SET",
  slug: "evelina-shimmer-set",
  sku: "MM-EV001",
  description:
    "Evening σετ τριών τεμαχίων: pleated metallic gold/champagne blouse με high mock neck, bishop sleeves και keyhole πίσω, high-waisted black mini φούστα με λεπτή ζώνη, και structured open black blazer για draped styling στους ώμους.",
  price_cents: 19600,
  currency: "EUR",
  sizes: ["XS", "S", "M", "L"],
  stock: 5,
  is_active: true,
  pageLayout: "editorial",
  statusLabel: "Angel Inspiration · January 2026",
  showVirtualTryOn: true,
  tryOnCategory: "dresses",
  garmentDescription:
    "three-piece evening set: champagne gold metallic pleated long-sleeve blouse with high mock neck and puff bishop sleeves tucked in, high-waisted black mini skirt mid-thigh length with thin black belt, black structured open blazer worn over shoulders, preserve mini skirt length as shown not lengthened to maxi",
  editorial: {
    collectionLine: "Evelina",
    seasonLabel: "Jan 2026",
    slides: [
      {
        image: "/images/products/evelina-set/01-front.jpg",
        caption: "Gold shimmer · black mini",
      },
      {
        image: "/images/products/evelina-set/02-blazer.jpg",
        caption: "Open blazer · cinched waist",
      },
      {
        image: "/images/products/evelina-set/03-back.jpg",
        caption: "Back view · fluid pleats",
      },
      {
        image: "/images/products/evelina-set/04-skirt.jpg",
        caption: "High waist · belt detail",
      },
      {
        image: "/images/products/evelina-set/05-collar.jpg",
        caption: "Mock neck · pearl button",
      },
      {
        image: "/images/products/evelina-set/06-triptych.jpg",
        caption: "Triptych lookbook",
      },
    ],
  },
  images: [
    "/images/products/evelina-set/01-front.jpg",
    "/images/products/evelina-set/02-blazer.jpg",
    "/images/products/evelina-set/03-back.jpg",
    "/images/products/evelina-set/04-skirt.jpg",
    "/images/products/evelina-set/05-collar.jpg",
    "/images/products/evelina-set/06-triptych.jpg",
  ],
  sizeGuide: {
    rows: [
      { size: "XS", bust: "80", waist: "60", hips: "84" },
      { size: "S", bust: "84", waist: "64", hips: "88" },
      { size: "M", bust: "88", waist: "68", hips: "92" },
      { size: "L", bust: "92", waist: "72", hips: "96" },
    ],
    customFitNote:
      "Η mini φούστα έχει bodycon εφαρμογή· για μήκος κάτω από το γόνατο, δυνατή custom adjustment στο ατελιέ.",
  },
  sections: [
    {
      id: "composition",
      title: "Σύνθεση Set",
      content:
        "Metallic pleated blouse με volume στα μανίκια, mini skirt με matte black finish, blazer χωρίς κούμπωμα για caped styling. Φορέστε τα μαζί ή χωριστά για evening looks.",
    },
    {
      id: "care",
      title: "Φροντίδα",
      content:
        "Blouse: δέλικτο πλύσιμο ή στεγνό καθάρισμα · Μην σιδερώνετε απευθείας το metallic ύφασμα · Skirt & blazer: στεγνό καθάρισμα.",
    },
  ],
};

export const novemberTulleSet: ProductDetail = {
  id: "f5000000-0000-0000-0000-000000000005",
  name: "NOVEMBER TULLE SET",
  slug: "november-tulle-set",
  sku: "MM-NT001",
  description:
    "Two-piece Angel Inspiration look: μαύρο long-sleeve top με cream ρίγες στα μανίκια και voluminous black tulle maxi φούστα σε πολλαπλά layers — full length μέχρι το πάτωμα, ζώνη με gold buckle, sporty-chic meets evening glamour.",
  price_cents: 18400,
  currency: "EUR",
  sizes: ["XS", "S", "M", "L", "XL"],
  stock: 6,
  is_active: true,
  pageLayout: "editorial",
  statusLabel: "Angel Inspiration · November",
  showVirtualTryOn: true,
  tryOnCategory: "dresses",
  garmentDescription:
    "two-piece set: black long-sleeve top with cream vertical stripes on sleeves tucked into high-waisted black pleated tulle maxi skirt, skirt full floor-length to ankles not mini, voluminous layered tulle overlay with opaque lining, thin black belt with gold buckle, preserve maxi skirt length from reference image",
  editorial: {
    collectionLine: "November Tulle",
    seasonLabel: "Nov 2025",
    slides: [
      {
        image: "/images/products/november-tulle-set/01-motion.jpg",
        caption: "Tulle in motion · Evelina",
      },
      {
        image: "/images/products/november-tulle-set/02-duo.jpg",
        caption: "Dual styling · marble studio",
      },
      {
        image: "/images/products/november-tulle-set/03-duo-front.jpg",
        caption: "Stripe sleeve detail",
      },
      {
        image: "/images/products/november-tulle-set/04-front.jpg",
        caption: "Full length · gold belt",
      },
      {
        image: "/images/products/november-tulle-set/05-recline.jpg",
        caption: "Editorial recline",
      },
      {
        image: "/images/products/november-tulle-set/06-editorial.jpg",
        caption: "Volume & movement",
      },
    ],
  },
  images: [
    "/images/products/november-tulle-set/01-motion.jpg",
    "/images/products/november-tulle-set/02-duo.jpg",
    "/images/products/november-tulle-set/03-duo-front.jpg",
    "/images/products/november-tulle-set/04-front.jpg",
    "/images/products/november-tulle-set/05-recline.jpg",
    "/images/products/november-tulle-set/06-editorial.jpg",
  ],
  sizeGuide: {
    rows: [
      { size: "XS", bust: "80", waist: "60", hips: "86" },
      { size: "S", bust: "84", waist: "64", hips: "90" },
      { size: "M", bust: "88", waist: "68", hips: "94" },
      { size: "L", bust: "92", waist: "72", hips: "98" },
      { size: "XL", bust: "96", waist: "76", hips: "102" },
    ],
    customFitNote:
      "Η tulle φούστα έχει ενδιάμεσο ύφασμα· για μήκος ή ζώνη κατόπιν συνεννόησης στο ατελιέ.",
  },
  sections: [
    {
      id: "composition",
      title: "Σύνθεση Look",
      content:
        "Top σε technical/satin finish με contrast stripes, maxi skirt με pleated tulle και opaque underskirt. Ιδανικό για editorial styling ή complete evening exit.",
    },
    {
      id: "care",
      title: "Φροντίδα",
      content:
        "Top: πλύσιμο στο χέρι · Tulle skirt: στεγνό καθάρισμα ή δελικό πλύσιμο · Αποφύγετε σιδέρωμα πάνω στο tulle.",
    },
  ],
};

const DEMO_DENIM_OUTFIT_GALLERY = [
  "/images/products/demo-denim-jeans/01-front.jpg",
  "/images/products/demo-denim-jeans/02-side.jpg",
  "/images/products/demo-denim-jeans/03-side-shirt.jpg",
  "/images/products/demo-denim-jeans/04-back.jpg",
  "/images/products/demo-denim-jeans/05-shirt.jpg",
  "/images/products/demo-denim-jeans/06-pocket.jpg",
] as const;

export const demoDenimJeans: ProductDetail = {
  id: "f6000000-0000-0000-0000-000000000006",
  name: "DEMO ΤΖΙΝ ΠΑΝΤΕΛΟΝΙ",
  slug: "demo-denim-jeans",
  sku: "MM-DJ-DEMO001",
  description:
    "Demo τζιν παντελόνι Evelina Collection · ψηλόμεσο, wide-leg σιλουέτα, ανοιχτό μπλε wash και raw hem. Editorial styling σε μαντόμα — ιδανικό για δοκιμή καταλόγου.",
  price_cents: 10000,
  currency: "EUR",
  sizes: ["XS", "S", "M", "L", "XL"],
  stock: 8,
  is_active: true,
  statusLabel: "Evelina Collection · Demo",
  showVirtualTryOn: false,
  styleWith: {
    slug: "demo-denim-shirt",
    galleryImages: [...DEMO_DENIM_OUTFIT_GALLERY],
  },
  images: [
    "/images/products/demo-denim-jeans/01-front.jpg",
    "/images/products/demo-denim-jeans/02-side.jpg",
    "/images/products/demo-denim-jeans/03-side-shirt.jpg",
    "/images/products/demo-denim-jeans/04-back.jpg",
    "/images/products/demo-denim-jeans/05-shirt.jpg",
    "/images/products/demo-denim-jeans/06-pocket.jpg",
  ],
  sizeGuide: {
    rows: [
      { size: "XS", bust: "—", waist: "62", hips: "86" },
      { size: "S", bust: "—", waist: "66", hips: "90" },
      { size: "M", bust: "—", waist: "70", hips: "94" },
      { size: "L", bust: "—", waist: "74", hips: "98" },
      { size: "XL", bust: "—", waist: "78", hips: "102" },
    ],
    customFitNote: "Demo μεγέθη · επικοινωνήστε για μήκος και ρύθμιση στη μέση.",
  },
  sections: [
    {
      id: "details",
      title: "Λεπτομέρειες",
      content:
        "Ψηλόμεσο τζιν με crossover ζώνη, wide-leg κόψη και raw edge στο τελείωμα. Ελαφρύ stone wash · 100% βαμβακερό denim (demo specs).",
    },
    {
      id: "care",
      title: "Φροντίδα",
      content:
        "Πλύσιμο στο χέρι ή 30°C · Αποστροφή · Μην λευκαίνετε · Σιδερώστε χαμηλά.",
    },
  ],
};

export const demoDenimShirt: ProductDetail = {
  id: "f6000000-0000-0000-0000-000000000007",
  name: "Ασύμμετρο βαμβακερό πουκάμισο",
  slug: "demo-denim-shirt",
  sku: "MM-DS-DEMO001",
  description:
    "Ηρεμη κομψότητα, σύγχρονο layering · ασύμμετρο βαμβακερό πουκάμισο σε διχρωμία γαλάζιου και ρίγας, με rib top και wide-leg denim που ολοκληρώνουν το look.",
  price_cents: 10000,
  currency: "EUR",
  sizes: ["XS", "S", "M", "L", "XL"],
  stock: 8,
  is_active: true,
  statusLabel: "Evelina Collection · Demo",
  showVirtualTryOn: false,
  styleWith: {
    slug: "demo-denim-jeans",
    galleryImages: [...DEMO_DENIM_OUTFIT_GALLERY],
  },
  images: [
    "/images/products/demo-denim-jeans/05-shirt.jpg",
    "/images/products/demo-denim-jeans/03-side-shirt.jpg",
    "/images/products/demo-denim-jeans/04-back.jpg",
    "/images/products/demo-denim-jeans/01-front.jpg",
  ],
  sizeGuide: {
    rows: [
      { size: "XS", bust: "84", waist: "—", hips: "—" },
      { size: "S", bust: "88", waist: "—", hips: "—" },
      { size: "M", bust: "92", waist: "—", hips: "—" },
      { size: "L", bust: "96", waist: "—", hips: "—" },
      { size: "XL", bust: "100", waist: "—", hips: "—" },
    ],
    customFitNote: "Oversized cut · για πιο fitted εμφάνιση, επιλέξτε ένα νούμερο κάτω.",
  },
  sections: [
    {
      id: "pieces",
      title: "Περιγραφή & Κομμάτια",
      content:
        "ΑΣΥΜΜΕΤΡΟ ΒΑΜΒΑΚΕΡΟ ΠΟΥΚΑΜΙΣΟ ΣΕ ΔΙΧΡΩΜΙΑ ΓΑΛΑΖΙΟΥ ΚΑΙ ΡΙΓΑΣ.\n\nRIB TOP ΣΕ ΑΠΑΛΟ ΓΑΛΑΖΙΟ ΓΙΑ ΚΑΘΑΡΗ ΒΑΣΗ.\n\nWIDE-LEG DENIM ΜΕ ΕΝΣΩΜΑΤΩΜΕΝΗ ΖΩΝΗ ΠΟΥ ΟΛΟΚΛΗΡΩΝΕΙ ΤΟ LOOK.",
    },
    {
      id: "style",
      title: "Σλόγκαν / Στυλ",
      content: "ΗΡΕΜΗ ΚΟΜΨΩΤΗΤΑ, ΣΥΓΧΡΟΝΟ LAYERING.",
    },
    {
      id: "care",
      title: "Φροντίδα",
      content:
        "Πλύσιμο στο χέρι ή 30°C · Αποστροφή · Μην λευκαίνετε · Σιδερώστε χαμηλά.",
    },
  ],
};

export const FEATURED_PRODUCTS: ProductDetail[] = [
  demoDenimJeans,
  demoDenimShirt,
  novemberTulleSet,
  evelinaShimmerSet,
  angelInspirationSet,
  atelierGreenSatinDress,
  handmadeSatinSet,
];
