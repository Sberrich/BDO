"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  IconBook,
  IconCal,
  IconFileText,
  IconInbox,
  IconLayers,
  IconPlay,
  IconUsers,
} from "@/components/icons";

type NavItem = {
  href: string;
  label: string;
  hint: string;
  exact?: boolean;
  Icon: React.ComponentType<{ size?: number }>;
};

type NavGroup = { id: string; label: string; items: NavItem[] };

const GROUPS: NavGroup[] = [
  {
    id: "ops",
    label: "Opérations",
    items: [
      { href: "/admin", label: "Tableau de bord", hint: "Priorités du jour", exact: true, Icon: IconLayers },
      { href: "/admin/leads", label: "Demandes", hint: "Candidatures & leads", Icon: IconInbox },
    ],
  },
  {
    id: "programme",
    label: "Programme",
    items: [
      { href: "/admin/seminars", label: "Séminaires", hint: "Séances du certificat", Icon: IconCal },
      { href: "/admin/speakers", label: "Intervenants", hint: "Corps professoral", Icon: IconUsers },
    ],
  },
  {
    id: "editorial",
    label: "Éditorial",
    items: [
      { href: "/admin/playlists", label: "Playlists", hint: "Groupes vidéo", Icon: IconPlay },
      { href: "/admin/videos", label: "Vidéos", hint: "Témoignages", Icon: IconPlay },
      { href: "/admin/insights", label: "Insights", hint: "Articles", Icon: IconBook },
      { href: "/admin/press", label: "Presse", hint: "Revue de presse", Icon: IconFileText },
      { href: "/admin/partners", label: "Partenaires", hint: "Logos & rôles", Icon: IconUsers },
      { href: "/admin/resources", label: "Ressources", hint: "Documents", Icon: IconBook },
      { href: "/admin/faq", label: "FAQ", hint: "Questions / réponses", Icon: IconLayers },
      { href: "/admin/pages", label: "Textes de page", hint: "Chapeaux", Icon: IconFileText },
      { href: "/admin/settings", label: "Paramètres", hint: "Contact & SEO", Icon: IconInbox },
    ],
  },
];

function pageTitle(pathname: string) {
  for (const g of GROUPS) {
    for (const item of g.items) {
      const match = item.exact
        ? pathname === item.href
        : pathname === item.href || pathname.startsWith(`${item.href}/`);
      if (match) return item.label;
    }
  }
  return "Administration";
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const title = pageTitle(pathname);

  async function logout() {
    await fetch("/api/cms/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="cms">
      <aside className="cms-rail" aria-label="Navigation administration">
        <div className="cms-rail__brand">
          <span className="cms-rail__logos">
            <Image src="/images/logo-iscae.png" alt="Groupe ISCAE" width={88} height={28} />
            <span className="cms-rail__sep" aria-hidden />
            <Image src="/images/logo-bdo.png" alt="BDO" width={60} height={22} />
          </span>
          <span className="cms-rail__product">
            <span className="cms-rail__kicker">Administration</span>
            <span className="cms-rail__title">CFO 4.0</span>
          </span>
        </div>

        <div className="cms-rail__scroll">
          {GROUPS.map((group) => (
            <div key={group.id} className="cms-rail__group">
              <p className="cms-rail__label">{group.label}</p>
              <nav className="cms-rail__nav">
                {group.items.map((item) => {
                  const active = item.exact
                    ? pathname === item.href
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
                  const Icon = item.Icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`cms-rail__link${active ? " is-active" : ""}`}
                      aria-current={active ? "page" : undefined}
                    >
                      <span className="cms-rail__icon" aria-hidden>
                        <Icon />
                      </span>
                      <span className="cms-rail__text">
                        <span className="cms-rail__name">{item.label}</span>
                        <span className="cms-rail__hint">{item.hint}</span>
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        <div className="cms-rail__foot">
          <button type="button" className="cms-rail__logout" onClick={logout}>
            Déconnexion
          </button>
        </div>
      </aside>

      <div className="cms-stage">
        {pathname !== "/admin" ? (
          <header className="cms-stage__top">
            <div>
              <p className="cms-stage__crumb">CFO 4.0 · Staff</p>
              <p className="cms-stage__page">{title}</p>
            </div>
          </header>
        ) : null}
        <main className="cms-stage__main is-wide">{children}</main>
      </div>
    </div>
  );
}
