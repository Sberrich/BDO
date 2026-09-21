import type { Metadata } from "next";
import { InscriptionForm } from "@/components/InscriptionForm";

export const metadata: Metadata = {
  title: "Inscription",
  description:
    "Formulaire d’inscription au certificat Transformation Digitale et Leadership Financier ISCAE × BDO.",
  alternates: { canonical: "/inscription" },
};

export default function InscriptionPage() {
  return (
    <section className="bg-cream py-16">
      <div className="mx-auto w-full max-w-3xl px-5">
        <p className="text-sm font-semibold uppercase tracking-wider text-navy">Candidature</p>
        <h1 className="mt-2 font-display text-4xl font-bold text-ink">Formulaire d’inscription</h1>
        <p className="mt-4 leading-relaxed text-muted">
          Ce formulaire vise à mieux comprendre votre profil et vos attentes afin d’optimiser
          votre expérience et vous offrir un accompagnement personnalisé tout au long de votre
          parcours.
        </p>
        <div className="mt-10 rounded-3xl bg-white p-6 shadow-sm sm:p-10">
          <InscriptionForm />
        </div>
      </div>
    </section>
  );
}
