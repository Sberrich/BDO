import Link from "next/link";
import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-line bg-cream">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} Tous droits réservés par BDO Casablanca —
          Maroc
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href="/confidentialite" className="hover:text-navy">
            Confidentialité
          </Link>
          <Link href="/inscription" className="hover:text-navy">
            Inscription
          </Link>
          <a href={`mailto:${site.email}`} className="hover:text-navy">
            {site.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
