import { ButtonLink, Container, Kicker } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="bg-cream py-24">
      <Container className="max-w-xl text-center">
        <Kicker>Erreur 404</Kicker>
        <h1 className="mt-3 font-display text-4xl font-bold">Cette page n’existe pas</h1>
        <p className="mt-4 text-muted">Le lien est ancien ou incorrect.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/">Retour à l’accueil</ButtonLink>
          <ButtonLink href="/programme" variant="secondary">Le programme</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
