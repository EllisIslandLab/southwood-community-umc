import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ConsoleCapture } from "@/components/ConsoleCapture";
import { siteConfig } from "@/content/site-config";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.ministryName} | ${siteConfig.location}`,
    template: `%s | ${siteConfig.ministryName}`,
  },
  description:
    "A new bilingual United Methodist ministry in the Southwood community of Charlottesville, VA. All are welcome — Todos son bienvenidos. Weekly Bible study in English and Spanish.",
  openGraph: {
    title: siteConfig.ministryName,
    description: "All are welcome / Todos son bienvenidos.",
    url: siteUrl,
    siteName: siteConfig.ministryName,
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const churchJsonLd = {
    "@context": "https://schema.org",
    "@type": "Church",
    name: siteConfig.ministryName,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address.pending
        ? undefined
        : siteConfig.address.en,
      addressLocality: "Charlottesville",
      addressRegion: "VA",
      addressCountry: "US",
    },
    email: siteConfig.contactEmail.pending
      ? undefined
      : siteConfig.contactEmail.en,
    telephone: siteConfig.contactPhone.pending
      ? undefined
      : siteConfig.contactPhone.en,
    url: siteUrl,
    availableLanguage: ["English", "Spanish"],
  };

  return (
    <html
      lang="en"
      className={`${lora.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(churchJsonLd) }}
        />
        <ConsoleCapture />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
