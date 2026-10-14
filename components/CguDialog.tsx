"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui";
import { IconTick } from "@/components/icons";
import { CGU_TITLE, cguLead, cguSections } from "@/lib/cgu";

/** « conditions générales » link that opens the CGU in a modal instead of leaving the form. */
export function CguLink({ onAccept }: { onAccept?: () => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <>
      <button
        type="button"
        className="cursor-pointer font-semibold text-blue underline"
        aria-haspopup="dialog"
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        conditions générales
      </button>
      {open
        ? createPortal(
            <dialog
              ref={ref}
              className="cgu-dialog"
              aria-labelledby="cgu-dialog-title"
              onClose={() => setOpen(false)}
              onClick={(e) => e.target === e.currentTarget && setOpen(false)}
            >
              <div className="cgu-dialog__panel">
                <header className="cgu-dialog__head">
                  <h2 id="cgu-dialog-title">{CGU_TITLE}</h2>
                  <button type="button" className="cgu-dialog__close" onClick={() => setOpen(false)} aria-label="Fermer">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                      <path d="M6 6l12 12M18 6 6 18" />
                    </svg>
                  </button>
                </header>
                <div className="cgu-dialog__body">
                  <p className="cgu-dialog__lead">{cguLead()}</p>
                  {cguSections().map((s) => (
                    <section key={s.id}>
                      <h3>{s.title}</h3>
                      {s.body}
                    </section>
                  ))}
                </div>
                <footer className="cgu-dialog__foot">
                  <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                    Fermer
                  </Button>
                  {onAccept ? (
                    <Button
                      type="button"
                      onClick={() => {
                        onAccept();
                        setOpen(false);
                      }}
                    >
                      J’accepte
                      <IconTick size={16} />
                    </Button>
                  ) : null}
                </footer>
              </div>
            </dialog>,
            document.body,
          )
        : null}
    </>
  );
}
