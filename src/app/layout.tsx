import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "MAGIW MAGIW",
  description: "Handmade Atelier & Custom Design · magiwmagiw.gr",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="el" className={`${dmSans.variable} ${cormorant.variable} h-full`}>
      <body className="min-h-full bg-neutral-950 font-sans text-neutral-950 antialiased">
        {children}
      </body>
    </html>
  );
}
