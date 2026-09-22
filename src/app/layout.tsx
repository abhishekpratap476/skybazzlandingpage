import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";

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
  icons: {
    icon: "/Skybazz2-removebg-preview.png",
    shortcut: "/Skybazz2-removebg-preview.png",
    apple: "/Skybazz2-removebg-preview.png",
  },
  openGraph: {
    title: "SkyBazz — Next-Gen Shopping & Worldwide Express Delivery",
    description: "Curated electronics, luxury goods, and premium lifestyle products delivered worldwide.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="gold" className={`${inter.variable} h-full antialiased`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                localStorage.removeItem('skybazz_theme');
                document.documentElement.setAttribute('data-theme', 'gold');
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col transition-colors duration-300">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
