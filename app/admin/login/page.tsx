"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { Button, Kicker, fieldClass } from "@/components/ui";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/cms/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || "Connexion impossible.");
        return;
      }
      router.replace(next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch {
      setError("Le serveur d’administration est indisponible. Vérifiez que Django tourne sur :8000.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="cms-login">
      <div className="cms-login__panel is-brand" aria-hidden>
        <div className="cms-login__glow" />
        <div className="cms-login__brand">
          <Image src="/images/logo-iscae.png" alt="" width={120} height={38} className="is-light" />
          <span className="cms-login__x">×</span>
          <Image src="/images/logo-bdo.png" alt="" width={84} height={30} className="is-light" />
        </div>
        <Kicker light>Groupe ISCAE × BDO Maroc</Kicker>
        <h1 className="cms-login__headline">
          Pilotez le certificat
          <em> CFO 4.0</em>
        </h1>
        <p className="cms-login__sub">
          Demandes d’admission, contenus éditoriaux et suivi des leads — le même design que le site public.
        </p>
        <ul className="cms-login__points">
          <li>Traiter les candidatures et rappels</li>
          <li>Publier vidéos, insights et intervenants</li>
          <li>Prévisualiser immédiatement sur le site</li>
        </ul>
      </div>

      <div className="cms-login__panel is-form">
        <p className="cms-login__eyebrow">Connexion staff</p>
        <h2 className="cms-login__form-title">Accéder à l’administration</h2>
        <p className="cms-login__form-lead">Réservé à l’équipe programme ISCAE × BDO.</p>

        <form className="cms-login__form" onSubmit={onSubmit}>
          <label>
            Identifiant
            <input
              className={fieldClass}
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </label>
          <label>
            Mot de passe
            <input
              className={fieldClass}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {error ? (
            <p className="cms-login__error" role="alert">
              {error}
            </p>
          ) : null}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Connexion…" : "Se connecter"}
          </Button>
        </form>
      </div>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <main className="cms-login">
          <p className="cms-login__form-lead">Chargement…</p>
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
