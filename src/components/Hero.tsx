import Link from "next/link";
import { siteConfig } from "@/content/site-config";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-ink px-5 py-24 text-center text-white sm:py-32">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

      <div className="relative mx-auto max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
          {siteConfig.ministryName}
        </p>
        <h1 className="mt-4 font-serif text-4xl font-semibold sm:text-5xl">
          {siteConfig.tagline.en}
        </h1>
        <p lang="es" className="mt-2 font-serif text-2xl text-white/90 sm:text-3xl">
          {siteConfig.tagline.es}
        </p>
        <p className="mx-auto mt-6 max-w-xl text-lg text-white/85">
          {siteConfig.heroSubline.en}
        </p>
        <p lang="es" className="mx-auto mt-2 max-w-xl text-white/75">
          {siteConfig.heroSubline.es}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="#schedule"
            className="rounded-full bg-white px-6 py-3 font-semibold text-primary hover:bg-white/90"
          >
            Join Us This Week
            <span lang="es" className="block text-xs font-normal">
              Únase Esta Semana
            </span>
          </Link>
          <Link
            href="#location"
            className="rounded-full border border-white/60 px-6 py-3 font-semibold text-white hover:bg-white/10"
          >
            Get Directions
            <span lang="es" className="block text-xs font-normal">
              Cómo Llegar
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
