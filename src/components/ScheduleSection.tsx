import Image from "next/image";
import { siteConfig } from "@/content/site-config";
import { FadeIn } from "./FadeIn";

export function ScheduleSection() {
  return (
    <section id="schedule" className="bg-primary-light/40 py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-5">
        <FadeIn>
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-accent-dark">
              Weekly Gatherings
            </p>
            <p lang="es" className="text-sm font-semibold uppercase tracking-widest text-accent-dark">
              Reuniones Semanales
            </p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-ink">
              Join a Bible Study This Week
            </h2>
            <p lang="es" className="mt-1 font-serif text-xl text-ink-soft">
              Únase a un Estudio Bíblico Esta Semana
            </p>
          </div>

          <div className="mt-10 flex flex-wrap justify-center gap-6">
            {siteConfig.weeklyGatherings.map((g) => (
              <div
                key={`${g.day}-${g.time}`}
                className="w-full rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-primary-light md:w-[calc(50%-12px)]"
              >
                <div className="text-4xl" aria-hidden="true">
                  {g.icon}
                </div>
                <h3 className="mt-3 font-serif text-xl font-semibold text-ink">
                  {g.titleEn}
                </h3>
                {g.titleEs !== g.titleEn && (
                  <p lang="es" className="text-ink-soft">
                    {g.titleEs}
                  </p>
                )}
                <p className="mt-4 text-lg font-medium text-primary">
                  {g.day} · {g.time}
                </p>
                <p lang="es" className="text-ink-soft">
                  {g.dayEs}
                </p>
                <p className="mt-3 text-sm text-ink-soft">
                  ☕ {g.note}
                  <span className="text-ink-soft/70"> / </span>
                  <span lang="es">{g.noteEs} ☕</span>
                </p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-10 max-w-md overflow-hidden rounded-2xl shadow-sm">
            <div className="relative aspect-video">
              <Image
                src="/images/coffee-fellowship.jpg"
                alt="A warm cup of coffee on a wooden table, set for conversation"
                fill
                className="object-cover"
                sizes="(min-width: 640px) 400px, 90vw"
              />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
