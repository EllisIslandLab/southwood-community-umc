import Link from "next/link";
import { siteConfig } from "@/content/site-config";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-primary-light bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link
          href="/"
          className="font-serif text-lg font-semibold text-primary sm:text-xl"
        >
          {siteConfig.shortName}
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium sm:text-base">
          <Link href="/#schedule" className="text-ink hover:text-primary">
            Schedule
          </Link>
          <Link href="/events" className="text-ink hover:text-primary">
            Events
          </Link>
          <Link href="/#contact" className="text-ink hover:text-primary">
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
