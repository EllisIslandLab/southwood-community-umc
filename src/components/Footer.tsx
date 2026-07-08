import Link from "next/link";
import { siteConfig } from "@/content/site-config";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-primary-light bg-primary-light/40">
      <div className="mx-auto max-w-5xl px-5 py-10 text-sm text-ink-soft">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <p className="font-serif text-base font-semibold text-ink">
              {siteConfig.ministryName}
            </p>
            <p className="mt-1">{siteConfig.location}</p>
            <a
              href={`mailto:${siteConfig.contactEmail.en}`}
              className="mt-1 block hover:text-primary"
            >
              {siteConfig.contactEmail.en}
            </a>
          </div>
          <div>
            <p className="font-semibold text-ink">
              Weekly Gatherings / Reuniones Semanales
            </p>
            <ul className="mt-1 space-y-0.5">
              {siteConfig.weeklyGatherings.map((g) => (
                <li key={g.day}>
                  {g.icon} {g.day} · {g.time}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-1">
            <Link href="/privacy" className="block hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="block hover:text-primary">
              Terms of Service
            </Link>
            <Link href="/#contact" className="block hover:text-primary">
              Contact
            </Link>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-primary-light pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {year} {siteConfig.ministryName} · {siteConfig.location}
          </p>
          <a
            href="https://weblaunchacademy.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:opacity-80"
          >
            Built with Web Launch Academy
          </a>
        </div>
      </div>
    </footer>
  );
}
