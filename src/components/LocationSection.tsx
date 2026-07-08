"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/content/site-config";
import { PendingBadge } from "./PendingBadge";
import { FadeIn } from "./FadeIn";

export function LocationSection() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const address = siteConfig.address.en;

  useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const mapsEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  const appleMapsUrl = `https://maps.apple.com/?q=${encodeURIComponent(address)}`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable (older browser / no permission) — the
      // address is still visible on the page, so this fails silently.
    }
  }

  return (
    <section id="location" className="mx-auto max-w-5xl px-5 py-20">
      <FadeIn>
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-dark">
          Find Us <span lang="es">· Encuéntranos</span>
        </p>
        <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">
          Come Visit
        </h2>
        <p lang="es" className="mt-1 font-serif text-xl text-ink-soft">
          Venga a Visitarnos
        </p>

        <p className="mt-6 text-lg text-ink-soft">
          {address}
          {siteConfig.address.pending && <PendingBadge />}
        </p>
        <p lang="es" className="text-ink-soft">
          {siteConfig.address.es}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-full bg-primary px-6 py-3 font-medium text-white hover:bg-primary-dark"
          >
            Get Directions <span lang="es">/ Cómo Llegar</span>
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="rounded-full border border-primary px-6 py-3 font-medium text-primary hover:bg-primary-light"
          >
            {copied ? (
              <>
                Copied! <span lang="es">/ ¡Copiado!</span>
              </>
            ) : (
              <>
                Copy Address <span lang="es">/ Copiar Dirección</span>
              </>
            )}
          </button>
        </div>

        {open && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Map and directions"
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4"
            onClick={() => setOpen(false)}
          >
            <div
              className="w-full max-w-2xl rounded-2xl bg-white p-4 shadow-xl sm:p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-semibold text-ink">
                  Directions <span lang="es">/ Direcciones</span>
                </h3>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => setOpen(false)}
                  className="text-2xl leading-none text-ink-soft hover:text-ink"
                >
                  &times;
                </button>
              </div>

              <div className="mt-4 aspect-video overflow-hidden rounded-lg border border-primary-light">
                <iframe
                  title="Map to Southwood Community Iglesia UMC"
                  src={mapsEmbedSrc}
                  className="h-full w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline"
                >
                  Open in Google Maps
                </a>
                <a
                  href={appleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline"
                >
                  Open in Apple Maps
                </a>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="font-medium text-primary underline"
                >
                  {copied ? "Copied!" : "Copy address"}
                </button>
              </div>
            </div>
          </div>
        )}
      </FadeIn>
    </section>
  );
}
