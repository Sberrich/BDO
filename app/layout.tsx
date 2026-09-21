import type { Metadata } from "next";
import { Inter, Syne } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { site } from "@/content/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.title} | ISCAE & BDO Maroc`,
    template: `%s | ${site.title}`,
  },
  description: site.tagline,
  alternates: { canonical: "/" },
  openGraph: {
    title: site.title,
    description: site.tagline,
    url: site.url,
    locale: "fr_MA",
    type: "website",
    siteName: "Certificat ISCAE × BDO",
  },
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${syne.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-ink">
        <a className="skip-link" href="#contenu">
          Aller au contenu
        </a>
        <Header />
        <main id="contenu" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
