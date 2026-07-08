import type { Metadata } from "next";
import { siteConfig } from "@/content/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <h1 className="font-serif text-3xl font-semibold text-ink">Privacy Policy</h1>
      <p lang="es" className="mt-1 text-lg text-ink-soft">
        Política de Privacidad
      </p>
      <p className="mt-2 text-sm text-ink-soft">
        Para una traducción al español de esta política, contáctenos.
      </p>

      <div className="mt-8 space-y-4 leading-relaxed text-ink-soft">
        <p>
          {siteConfig.ministryName} respects your privacy. This page explains
          what information we collect through this website and how we use it.
        </p>

        <h2 className="font-serif text-xl font-semibold text-ink">
          What we collect
        </h2>
        <p>
          When you use the contact form, we collect the name, email address,
          and message you provide. We use this only to respond to you — we
          don&rsquo;t sell, rent, or share it with third parties, other than
          our email delivery provider (Resend), which processes the message
          on our behalf so it reaches our inbox.
        </p>

        <h2 className="font-serif text-xl font-semibold text-ink">
          Cookies and analytics
        </h2>
        <p>
          This site does not use advertising or tracking cookies. We may use
          basic, privacy-respecting hosting analytics (such as Vercel&rsquo;s
          built-in traffic metrics) to understand overall visitor counts —
          this does not identify you individually.
        </p>

        <h2 className="font-serif text-xl font-semibold text-ink">
          Third-party links
        </h2>
        <p>
          Our Location section links to Google Maps and Apple Maps. Those
          services have their own privacy policies, which we encourage you to
          review.
        </p>

        <h2 className="font-serif text-xl font-semibold text-ink">
          Contact us
        </h2>
        <p>
          If you have questions about this policy or want us to delete a
          message you sent us, contact us at{" "}
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
