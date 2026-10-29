export type CollectionCarouselSlide = {
  id: string;
  title: string;
  tagline: string;
  image: string;
  /** CSS object-position — photos are portrait, cards are landscape. */
  objectPosition?: string;
  href: string;
  cta: string;
};

/** Horizontal collection carousel for the MAGIW MAGIW landing. */
export const COLLECTION_CAROUSEL_SLIDES: CollectionCarouselSlide[] = [
  {
    id: "evening",
    title: "Elegant Evening Wear",
    tagline: "Grace, Glamour, Style, Confidence",
    image: "/carousel/slide-1.jpg",
    objectPosition: "50% 55%",
    href: "/shop#editorial",
    cta: "Shop now",
  },
  {
    id: "winter",
    title: "Luxury Winter Collection",
    tagline: "Warm, Cozy, Elegant, Premium",
    image: "/carousel/slide-2.jpg",
    objectPosition: "50% 40%",
    href: "/shop#atelier",
    cta: "Shop now",
  },
  {
    id: "essentials",
    title: "Timeless Wardrobe Essentials",
    tagline: "Classic, Everyday, Stylish, Premium",
    image: "/carousel/slide-3.jpg",
    objectPosition: "50% 30%",
    href: "/shop",
    cta: "Shop now",
  },
];
