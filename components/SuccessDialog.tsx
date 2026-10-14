"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { IconArrowRight, IconDownload } from "@/components/icons";
import { cls } from "@/components/ui";
import { confirmationFor } from "@/lib/confirmation";

type Props = {
  type: string;
  /** PDF to offer again (document requests). */
  fichier?: string | null;
  onClose: () => void;
  /** Label of the secondary button, which closes the dialog. */
  closeLabel?: string;
};

/** Confirmation shown in place after a successful form submission. */
export function SuccessDialog({ type, fichier, onClose, closeLabel = "Fermer" }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const c = confirmationFor(type);

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
      <div className="success-dialog__panel">
        <div className="success-dialog__media">
          <Image src="/images/ui/success.png" alt="" width={545} height={618} priority className="success-dialog__art" />
          <button type="button" className="success-dialog__close" onClick={onClose} aria-label="Fermer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>
        <div className="success-dialog__body">
          <h2 id="success-dialog-title">{c.title}</h2>
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
          <button type="button" className={cls("ghost")} onClick={onClose}>
            {closeLabel}
          </button>
        </div>
      </div>
    </dialog>,
    document.body,
  );
}
