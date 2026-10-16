export type CollectionKey = "editorial" | "atelier";

export type CollectionDefinition = {
  key: CollectionKey;
  navLabel: string;
  title: string;
  description: string;
  productSlugs: string[];
};

export const COLLECTIONS: Record<CollectionKey, CollectionDefinition> = {
  editorial: {
    key: "editorial",
    navLabel: "Editorial",
    title: "Editorial Collection",
    description:
      "Runway-inspired looks · layered sets · limited drops από τη σειρά Angel Inspiration.",
    productSlugs: [
      "november-tulle-set",
      "evelina-shimmer-set",
      "angel-inspiration-set",
    ],
  },
  atelier: {
    key: "atelier",
    navLabel: "Atelier",
    title: "Atelier Collection",
    description:
      "Χειροποίητα κομμάτια του ατελιέ · φορέματα, σετ και outerwear με premium finish.",
    productSlugs: [
      "atelier-green-satin-dress",
      "handmade-satin-bustier-skirt-set",
      "red-velvet-coat",
    ],
  },
};

export const COLLECTION_KEYS = Object.keys(COLLECTIONS) as CollectionKey[];
