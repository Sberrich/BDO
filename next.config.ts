import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/confidentialite/", destination: "/confidentialite", permanent: true },
      {
        source:
          "/inscription-certificat-transformation-digital-et-leadership-financier-group-iscae-bdo",
        destination: "/inscription",
        permanent: true,
      },
      {
        source:
          "/inscription-certificat-transformation-digital-et-leadership-financier-group-iscae-bdo/",
        destination: "/inscription",
        permanent: true,
      },
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
          {
            key: "Permissions-Policy",
            value: "geolocation=(), microphone=(), camera=(), interest-cohort=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
