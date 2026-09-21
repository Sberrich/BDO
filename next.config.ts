import type { NextConfig } from "next";

const htmlPages = [
  "programme",
  "admissions",
  "intervenants",
  "ressources",
  "faq",
  "candidater",
  "a-propos",
  "mentions-legales",
  "confidentialite",
  "merci",
];

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/inscription", destination: "/candidater", permanent: false },
      { source: "/confidentialite/", destination: "/confidentialite", permanent: true },
      ...htmlPages.map((p) => ({
        source: `/${p}.html`,
        destination: `/${p}`,
        permanent: true,
      })),
      {
        source: "/seminaires/:n.html",
        destination: "/seminaires/:n",
        permanent: true,
      },
      {
        source: "/inscription-certificat-transformation-digital-et-leadership-financier-group-iscae-bdo",
        destination: "/candidater",
        permanent: true,
      },
      { source: "/lp/session-info.html", destination: "/", permanent: true },
      { source: "/lp/session-info", destination: "/", permanent: true },
      { source: "/lp/livre-blanc.html", destination: "/ressources/livre-blanc", permanent: true },
      { source: "/lp/livre-blanc", destination: "/ressources/livre-blanc", permanent: true },
      { source: "/lp/barometre.html", destination: "/ressources/barometre", permanent: true },
      { source: "/lp/barometre", destination: "/ressources/barometre", permanent: true },
      { source: "/lp/brochure.html", destination: "/ressources/brochure", permanent: true },
      { source: "/lp/brochure", destination: "/ressources/brochure", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
