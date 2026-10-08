import type { Metadata } from "next";
import Image from "next/image";
import { safeNext } from "@/lib/cms-session";

export const metadata: Metadata = {
  title: "Connexion CMS",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ next?: string; error?: string; out?: string }> };

export default async function CmsLoginPage({ searchParams }: Props) {
  const { next, error, out } = await searchParams;

  return (
    <main className="cms-login">
      <div className="cms-login__card">
        <div className="cms-login__brand">
          <Image src="/images/logo-iscae.png" alt="Groupe ISCAE" width={120} height={38} priority />
          <span className="cms-login__sep" aria-hidden />
          <Image src="/images/logo-bdo.png" alt="BDO" width={84} height={30} priority />
        </div>
        <p className="cms-login__kicker">CFO 4.0 · Espace éditeur</p>
        <h1 className="cms-login__title">Connexion au CMS</h1>
        <p className="cms-login__lead">Insights et intervenants du certificat.</p>

        {error ? (
          <p className="cms-login__alert" role="alert">
            Identifiant ou mot de passe incorrect.
          </p>
        ) : out ? (
          <p className="cms-login__alert is-info" role="status">
            Vous êtes déconnecté.
          </p>
        ) : null}

        <form action="/api/cms-login" method="post" className="cms-login__form">
          <input type="hidden" name="next" value={safeNext(next)} />
          <label className="cms-login__field">
            <span>Identifiant</span>
            <input name="user" type="text" autoComplete="username" required autoFocus />
          </label>
          <label className="cms-login__field">
            <span>Mot de passe</span>
            <input name="password" type="password" autoComplete="current-password" required />
          </label>
          <button type="submit" className="cms-login__submit">
            Se connecter
          </button>
        </form>
        <p className="cms-login__note">Session valable 8 heures sur cet appareil.</p>
      </div>
    </main>
  );
}
