import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "SkyBazz — Next-Gen Shopping & Worldwide Express Delivery",
  description: "Curated electronics, luxury goods, and premium lifestyle products delivered worldwide with express doorstep shipping. Join the SkyBazz waitlist today.",
  keywords: ["SkyBazz", "online shopping", "global delivery", "express shipping", "electronics", "luxury goods"],
  openGraph: {
    title: "SkyBazz — Next-Gen Shopping & Worldwide Express Delivery",
    description: "Curated electronics, luxury goods, and premium lifestyle products delivered worldwide.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#f5f5f7] text-[#1d1d1f]">
        {children}
      </body>
    </html>
  );
}
