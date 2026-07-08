import type { Metadata } from "next";
import { getEvents, type SiteEvent } from "@/lib/airtable";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Weekly Bible studies and upcoming events at Southwood Community Iglesia UMC.",
};

function isUpcoming(event: SiteEvent): boolean {
  if (!event.date) return true;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const eventDate = new Date(event.date);
  return eventDate >= today;
}

function formatDate(date?: string): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default async function EventsPage() {
  const { events } = await getEvents();

  const recurring = events.filter((e) => e.recurring);
  const oneOff = events
    .filter((e) => !e.recurring && isUpcoming(e))
    .sort((a, b) => (a.date ?? "").localeCompare(b.date ?? ""));

  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <header className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-accent-dark">
          Events
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-ink">
          Weekly Gatherings &amp; Events
        </h1>
        <p lang="es" className="mt-1 font-serif text-2xl text-ink-soft">
          Reuniones Semanales y Eventos
        </p>
      </header>

      <section className="mt-12">
        <h2 className="font-serif text-2xl font-semibold text-ink">
          Weekly Gatherings <span lang="es">/ Reuniones Semanales</span>
        </h2>
        <div className="mt-6 flex flex-wrap justify-center gap-6">
          {recurring.map((event) => (
            <div
              key={event.id}
              className="w-full rounded-2xl bg-primary-light/40 p-6 text-center ring-1 ring-primary-light md:w-[calc(50%-12px)]"
            >
              <h3 className="font-serif text-lg font-semibold text-ink">
                {event.title}
              </h3>
              {event.titleEs && event.titleEs !== event.title && (
                <p lang="es" className="text-ink-soft">
                  {event.titleEs}
                </p>
              )}
              <p className="mt-2 font-medium text-primary">
                {event.day ? `${event.day} · ` : ""}
                {event.startTime}
                {event.endTime ? ` – ${event.endTime}` : ""}
              </p>
              {event.description && (
                <p className="mt-2 text-sm text-ink-soft">{event.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-2xl font-semibold text-ink">
          Upcoming Events <span lang="es">/ Próximos Eventos</span>
        </h2>

        {oneOff.length === 0 ? (
          <p className="mt-6 text-lg text-ink-soft">
            More events coming soon — join us Wednesday or Thursday!
            <span lang="es" className="mt-1 block">
              Más eventos próximamente — ¡acompáñenos el miércoles o el jueves!
            </span>
          </p>
        ) : (
          <ul className="mt-6 space-y-4">
            {oneOff.map((event) => (
              <li
                key={event.id}
                className="rounded-2xl border border-primary-light p-6"
              >
                <p className="text-sm font-medium uppercase tracking-wide text-accent-dark">
                  {formatDate(event.date)}
                </p>
                <h3 className="mt-1 font-serif text-xl font-semibold text-ink">
                  {event.title}
                </h3>
                {event.titleEs && event.titleEs !== event.title && (
                  <p lang="es" className="text-ink-soft">
                    {event.titleEs}
                  </p>
                )}
                <p className="mt-1 text-ink-soft">
                  {event.startTime}
                  {event.endTime ? ` – ${event.endTime}` : ""}
                  {event.location ? ` · ${event.location}` : ""}
                </p>
                {event.description && (
                  <p className="mt-2 text-ink-soft">{event.description}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
