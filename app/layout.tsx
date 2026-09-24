import type { Metadata, Viewport } from "next";
import { Mulish } from "next/font/google";
import { BRAND, data } from "@/lib/content";
import "./globals.css";

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#001226",
};

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.url),
  title: {
    default: `${data.site.nom} — ${data.site.sousTitreOfficiel} | ISCAE × BDO`,
    template: `%s | ${data.site.nom}`,
  },
  description: data.site.promesse.sousTitre,
  alternates: { canonical: "/" },
  openGraph: {
    title: data.site.sousTitreOfficiel,
    description: data.site.promesse.sousTitre,
    url: BRAND.url,
    locale: "fr_MA",
    type: "website",
    siteName: "CFO 4.0 — Certificat ISCAE × BDO",
  },
  icons: { icon: "/favicon.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${mulish.variable} ${mulish.className} h-full antialiased`}>
      <body className="min-h-full bg-white text-ink">{children}</body>
    </html>
  );
}
