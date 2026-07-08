"use client";

import { useState, type FormEvent } from "react";
import { siteConfig } from "@/content/site-config";
import { PendingBadge } from "./PendingBadge";
import { FadeIn } from "./FadeIn";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactSection({ resendConfigured }: { resendConfigured: boolean }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          company: data.get("company"),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  const phoneHref = siteConfig.contactPhone.en.replace(/[^\d+]/g, "");

  return (
    <section id="contact" className="mx-auto max-w-3xl px-5 py-20">
      <FadeIn>
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-dark">
          Get In Touch <span lang="es">· Póngase en Contacto</span>
        </p>
        <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">Contact Us</h2>
        <p lang="es" className="mt-1 font-serif text-xl text-ink-soft">
          Contáctenos
        </p>

        <p className="mt-6 text-lg text-ink-soft">
          <a href={`mailto:${siteConfig.contactEmail.en}`} className="underline hover:text-primary">
            {siteConfig.contactEmail.en}
          </a>
          {siteConfig.contactEmail.pending && <PendingBadge />}
          <span className="px-2">·</span>
          <a href={`tel:${phoneHref}`} className="underline hover:text-primary">
            {siteConfig.contactPhone.en}
          </a>
          {siteConfig.contactPhone.pending && <PendingBadge />}
        </p>

        {resendConfigured ? (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4" noValidate>
            {/* Honeypot — hidden from real visitors via CSS, not display:none,
                so unsophisticated bots that skip hidden fields still fill it. */}
            <div className="absolute left-[-9999px]" aria-hidden="true">
              <label htmlFor="company">Company</label>
              <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-ink">
                Name <span lang="es">/ Nombre</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                maxLength={120}
                className="mt-1 w-full rounded-lg border border-primary-light px-4 py-2.5 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ink">
                Email <span lang="es">/ Correo Electrónico</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                maxLength={200}
                className="mt-1 w-full rounded-lg border border-primary-light px-4 py-2.5 focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-ink">
                Message <span lang="es">/ Mensaje</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                maxLength={2000}
                className="mt-1 w-full rounded-lg border border-primary-light px-4 py-2.5 focus:border-primary focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="rounded-full bg-primary px-6 py-3 font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
            >
              {status === "submitting" ? "Sending…" : "Send Message"}
              <span lang="es" className="ml-1">
                {status === "submitting" ? "/ Enviando…" : "/ Enviar Mensaje"}
              </span>
            </button>

            {status === "success" && (
              <p className="text-accent-dark" role="status">
                Thank you — we&rsquo;ll be in touch soon.{" "}
                <span lang="es">Gracias — nos pondremos en contacto pronto.</span>
              </p>
            )}
            {status === "error" && (
              <p className="text-red-600" role="alert">
                {errorMsg}
              </p>
            )}
          </form>
        ) : (
          <p className="mt-6 text-ink-soft">
            Email us or call anytime using the details above — our online contact
            form isn&rsquo;t set up quite yet.
            <span lang="es" className="mt-1 block">
              Escríbanos o llámenos usando los datos anteriores — nuestro
              formulario de contacto en línea aún no está listo.
            </span>
          </p>
        )}
      </FadeIn>
    </section>
  );
}
