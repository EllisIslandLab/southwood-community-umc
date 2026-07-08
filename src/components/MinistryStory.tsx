import Image from "next/image";
import { siteConfig } from "@/content/site-config";
import { PendingBadge } from "./PendingBadge";
import { FadeIn } from "./FadeIn";

export function MinistryStory() {
  return (
    <section id="about" className="mx-auto max-w-5xl px-5 py-20">
      <FadeIn>
        <div className="grid gap-10 sm:grid-cols-5 sm:items-center">
          <div className="sm:col-span-3">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent-dark">
              Our Story <span lang="es">· Nuestra Historia</span>
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-ink">
              Why We&rsquo;re Here
            </h2>
            <p lang="es" className="mt-1 font-serif text-xl text-ink-soft">
              Por Qué Estamos Aquí
            </p>
            <p className="mt-6 text-lg leading-relaxed text-ink-soft">
              {siteConfig.ministryStory.en}
              {siteConfig.ministryStory.pending && <PendingBadge />}
            </p>
            <p lang="es" className="mt-4 leading-relaxed text-ink-soft">
              {siteConfig.ministryStory.es}
            </p>
          </div>
          <div className="sm:col-span-2">
            <div className="relative aspect-4/5 overflow-hidden rounded-2xl shadow-lg">
              <Image
                src="/images/ministry-bible-candle.jpg"
                alt="An open Bible and reading glasses lit by candlelight"
                fill
                className="object-cover"
                sizes="(min-width: 640px) 40vw, 90vw"
              />
            </div>
          </div>
        </div>

        <div className="mt-16 rounded-2xl bg-primary-light/50 p-8 sm:p-10">
          <h3 className="font-serif text-2xl font-semibold text-ink">
            Meet the Pastor
          </h3>
          <p lang="es" className="text-lg text-ink-soft">
            Conozca al Pastor
          </p>
          <p className="mt-4 leading-relaxed text-ink-soft">
            {siteConfig.pastorStory.en}
            {siteConfig.pastorStory.pending && <PendingBadge />}
          </p>
          <p lang="es" className="mt-4 leading-relaxed text-ink-soft">
            {siteConfig.pastorStory.es}
          </p>
        </div>
      </FadeIn>
    </section>
  );
}
