import Link from "next/link";

export default function NotFound() {
  return (
    <section className="bg-cream py-24">
      <div className="mx-auto max-w-xl px-5 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-navy">Erreur 404</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-ink">Cette page n’existe pas</h1>
        <p className="mt-4 text-muted">Le lien que vous avez suivi est ancien ou incorrect.</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-full bg-navy px-7 py-3 text-sm font-semibold text-white hover:bg-navy-dark"
          >
            Retour à l’accueil
          </Link>
          <Link
            href="/inscription"
            className="rounded-full border border-navy px-7 py-3 text-sm font-semibold text-navy"
          >
            S’inscrire
          </Link>
        </div>
      </div>
    </section>
  );
}
