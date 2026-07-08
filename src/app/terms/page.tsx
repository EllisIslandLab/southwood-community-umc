import type { Metadata } from "next";
import { siteConfig } from "@/content/site-config";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <h1 className="font-serif text-3xl font-semibold text-ink">Terms of Service</h1>
      <p lang="es" className="mt-1 text-lg text-ink-soft">
        Términos de Servicio
      </p>
      <p className="mt-2 text-sm text-ink-soft">
        Para una traducción al español de estos términos, contáctenos.
      </p>

      <div className="mt-8 space-y-4 leading-relaxed text-ink-soft">
        <p>
          This website is provided by {siteConfig.ministryName} as an
          informational resource about our ministry, weekly gatherings, and
          events. By using this site, you agree to the following.
        </p>

        <h2 className="font-serif text-xl font-semibold text-ink">
          Informational use
        </h2>
        <p>
          Content on this site — including schedules, event details, and
          contact information — is provided in good faith but may change
          without notice. Please confirm meeting times and locations directly
          with us if you&rsquo;re planning to visit for the first time.
        </p>

        <h2 className="font-serif text-xl font-semibold text-ink">
          No warranties
        </h2>
        <p>
          This site is provided &ldquo;as is&rdquo; without warranties of any
          kind. We do our best to keep it accurate and available, but we
          don&rsquo;t guarantee uninterrupted access or error-free content.
        </p>

        <h2 className="font-serif text-xl font-semibold text-ink">
          Third-party services
        </h2>
        <p>
          Links to Google Maps, Apple Maps, and any other external site are
          provided for convenience. We aren&rsquo;t responsible for the
          content or practices of those third-party services.
        </p>

        <h2 className="font-serif text-xl font-semibold text-ink">Contact</h2>
        <p>
          Questions about these terms can be sent to{" "}
          <a href={`mailto:${siteConfig.contactEmail.en}`} className="underline">
            {siteConfig.contactEmail.en}
          </a>
          .
        </p>

        <p className="text-sm">Last updated: 2026.</p>
      </div>
    </div>
  );
}
