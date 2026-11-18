import { AppProviders } from "@/components/providers/AppProviders";
import { SITE } from "@/lib/site";
import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "MAGIW MAGIW · Χειροποίητο Atelier Μόδας",
    template: "%s | MAGIW MAGIW",
  },
  description: SITE.description,
  keywords: [
    "MAGIW MAGIW",
    "χειροποίητα ρούχα",
    "atelier μόδας",
    "custom design",
    "γυναικεία ρούχα",
    "ανδρικά ρούχα",
    "παιδικά ρούχα",
    "ελληνική μόδα",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: SITE.locale,
    alternateLocale: ["en_US"],
    url: "/",
    title: "MAGIW MAGIW · Χειροποίητο Atelier Μόδας",
    description: SITE.description,
    images: [{ url: SITE.ogImage, alt: "MAGIW MAGIW" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "MAGIW MAGIW · Χειροποίητο Atelier Μόδας",
    description: SITE.description,
    images: [SITE.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
  applicationName: "MAGIW MAGIW",
  authors: [{ name: "HitechDoctor" }],
  creator: "HitechDoctor",
  publisher: "MAGIW MAGIW",
  generator: "HitechDoctor",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MAGIW MAGIW",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/icons/icon.svg",
    apple: "/icons/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="el"
      suppressHydrationWarning
      className={`${dmSans.variable} ${cormorant.variable} h-full`}
    >
      <body className="min-h-full bg-neutral-950 font-sans text-neutral-950 antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
