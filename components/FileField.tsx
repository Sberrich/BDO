"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import type { UploadRule } from "@/lib/candidature";

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} Mo`;
}

function extension(name: string) {
  return (name.split(".").pop() || "").toUpperCase().slice(0, 4);
}

/**
 * File picker with a light button, then a chip showing the chosen file (thumbnail for images)
 * with view, replace and remove icon buttons. The native input stays in the form for FormData
 * and constraint validation.
 */
export function FileField({
  rule,
  error,
  onFileChange,
}: {
  rule: UploadRule;
  error?: string;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [chosen, setChosen] = useState<{ file: File; url: string } | null>(null);
  const urlRef = useRef<string | null>(null);
  const describedBy = `cand-${rule.field}-error`;
  const file = chosen?.file ?? null;
  const url = chosen?.url ?? null;

  useEffect(() => () => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
  }, []);

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current);
    const next = e.currentTarget.files?.[0];
    urlRef.current = next ? URL.createObjectURL(next) : null;
    setChosen(next && urlRef.current ? { file: next, url: urlRef.current } : null);
    onFileChange(e);
  }

  function remove() {
    const input = inputRef.current;
    if (!input) return;
    input.value = "";
    input.dispatchEvent(new Event("change", { bubbles: true }));
    input.focus();
  }

  const isImage = file?.type.startsWith("image/");

  return (
    <div className="block min-w-0 text-sm font-semibold">
      <span id={`cand-${rule.field}-label`}>
        {rule.label}
        {rule.required ? " *" : " (facultatif)"}
      </span>
      <div className={`file-field${file ? " has-file" : ""}${error ? " is-invalid" : ""}`}>
        <input
          ref={inputRef}
          className="file-field__input"
          type="file"
          name={rule.field}
          accept={rule.accept}
          required={rule.required}
          onChange={onChange}
          aria-labelledby={`cand-${rule.field}-label`}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          tabIndex={file ? -1 : 0}
        />
        {file ? (
          <>
            <span className="file-field__thumb" aria-hidden>
              {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview */}
              {isImage && url ? <img src={url} alt="" /> : <span>{extension(file.name)}</span>}
            </span>
            <span className="file-field__meta">
              <span className="file-field__name" title={file.name}>
                {file.name}
              </span>
              <span className="file-field__size">
                {extension(file.name)} · {formatSize(file.size)}
              </span>
            </span>
            <span className="file-field__actions">
              {url ? (
                <a
                  className="file-field__btn"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Voir ${file.name}`}
                  title="Voir"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </a>
              ) : null}
              <button
                type="button"
                className="file-field__btn"
                onClick={() => inputRef.current?.click()}
                aria-label={`Remplacer ${file.name}`}
                title="Remplacer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M21 12a9 9 0 0 1-15.5 6.2L3 16" />
                  <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8" />
                  <path d="M21 3v5h-5M3 21v-5h5" />
                </svg>
              </button>
              <button
                type="button"
                className="file-field__btn is-danger"
                onClick={remove}
                aria-label={`Retirer ${file.name}`}
                title="Retirer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2" />
                  <path d="M19 6l-1 14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1L5 6M10 11v6M14 11v6" />
                </svg>
              </button>
            </span>
          </>
        ) : (
          <span className="file-field__empty" aria-hidden>
            <span className="file-field__pick">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 16V4M7 9l5-5 5 5" />
                <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
              </svg>
              Choisir un fichier
            </span>
            <span className="file-field__hint">ou glissez-le ici</span>
          </span>
        )}
      </div>
      <span
        id={describedBy}
        role={error ? "alert" : undefined}
        className={error ? "field-error" : "mt-1 block text-xs font-normal text-muted"}
      >
        {error || `Fichiers acceptés : ${rule.hint}`}
      </span>
    </div>
  );
}
