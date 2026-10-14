"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { IconArrowRight, IconDownload } from "@/components/icons";
import { cls } from "@/components/ui";
import { confirmationFor } from "@/lib/confirmation";

/** Illustration, title, text and actions — shared by the popup and the /merci page. */
export function SuccessCard({
  type,
  fichier,
  secondary,
  corner,
  page = false,
}: {
  type: string;
  /** PDF to offer again (document requests). */
  fichier?: string | null;
  secondary: ReactNode;
  corner?: ReactNode;
  /** On the /merci page the title is the page heading. */
  page?: boolean;
}) {
  const c = confirmationFor(type);
  const Title = page ? "h1" : "h2";
  return (
    <div className="success-dialog__panel">
      <div className="success-dialog__media">
        <Image src="/images/ui/success.png" alt="" width={545} height={618} priority className="success-dialog__art" />
        {corner}
      </div>
      <div className="success-dialog__body">
        <Title id="success-dialog-title">{c.title}</Title>
        <p id="success-dialog-text">{c.text}</p>
      </div>
      <div className="success-dialog__actions">
        {fichier ? (
          <a className={cls("primary")} href={fichier} download={fichier.split("/").pop() || "document.pdf"}>
            <IconDownload />
            Télécharger maintenant
          </a>
        ) : (
          <Link className={cls("primary")} href="/programme">
            Parcourir le programme
            <IconArrowRight />
          </Link>
        )}
        {secondary}
      </div>
    </div>
  );
}

type Props = {
  type: string;
  fichier?: string | null;
  onClose: () => void;
  /** Label of the secondary button, which closes the dialog. */
  closeLabel?: string;
};

/** Confirmation shown in place after a successful form submission. */
export function SuccessDialog({ type, fichier, onClose, closeLabel = "Fermer" }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return createPortal(
    <dialog
      ref={ref}
      className="success-dialog"
      aria-labelledby="success-dialog-title"
      aria-describedby="success-dialog-text"
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <SuccessCard
        type={type}
        fichier={fichier}
        corner={
          <button type="button" className="success-dialog__close" onClick={onClose} aria-label="Fermer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        }
        secondary={
          <button type="button" className={cls("ghost")} onClick={onClose}>
            {closeLabel}
          </button>
        }
      />
    </dialog>,
    document.body,
  );
}
