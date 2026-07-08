import "server-only";
import { siteConfig } from "@/content/site-config";

export type SiteEvent = {
  id: string;
  title: string;
  titleEs?: string;
  description?: string;
  date?: string; // ISO date, e.g. "2026-08-14"
  startTime?: string;
  endTime?: string;
  recurring: boolean;
  location?: string;
  /**
   * Display-ready weekday label for recurring events, e.g. "Wednesdays".
   * The Airtable schema has no dedicated day-of-week column — for a
   * recurring row, set `Date` to any one representative occurrence and the
   * weekday is derived from it here.
   */
  day?: string;
};

type AirtableRecord = {
  id: string;
  fields: {
    Title?: string;
    Title_ES?: string;
    Description?: string;
    Date?: string;
    StartTime?: string;
    EndTime?: string;
    Recurring?: boolean;
    Location?: string;
    Published?: boolean;
  };
};

type AirtableResponse = {
  records?: AirtableRecord[];
};

const AIRTABLE_TABLE = "Events";

/**
 * Static fallback so the Events page always renders something useful even
 * before the client's Airtable base is wired up — the two weekly studies
 * from site-config, not "no events found."
 */
function fallbackEvents(): SiteEvent[] {
  return siteConfig.weeklyGatherings.map((g, i) => ({
    id: `fallback-${i}`,
    title: g.titleEn,
    titleEs: g.titleEs,
    startTime: g.time,
    recurring: true,
    day: g.day,
  }));
}

function weekdayLabel(isoDate: string | undefined): string | undefined {
  if (!isoDate) return undefined;
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return undefined;
  const weekday = parsed.toLocaleDateString("en-US", { weekday: "long" });
  return `${weekday}s`;
}

export async function getEvents(): Promise<{
  events: SiteEvent[];
  source: "airtable" | "fallback";
}> {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!apiKey || !baseId) {
    return { events: fallbackEvents(), source: "fallback" };
  }

  try {
    const url = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(
      AIRTABLE_TABLE
    )}?filterByFormula=${encodeURIComponent("{Published}=1")}`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` },
      // ISR: pick up pastor's Airtable edits within an hour, no redeploy needed.
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return { events: fallbackEvents(), source: "fallback" };
    }

    const json = (await res.json()) as AirtableResponse;
    const events: SiteEvent[] = (json.records ?? []).map((r) => ({
      id: r.id,
      title: r.fields.Title ?? "Untitled event",
      titleEs: r.fields.Title_ES,
      description: r.fields.Description,
      date: r.fields.Date,
      startTime: r.fields.StartTime,
      endTime: r.fields.EndTime,
      recurring: Boolean(r.fields.Recurring),
      location: r.fields.Location,
      day: r.fields.Recurring ? weekdayLabel(r.fields.Date) : undefined,
    }));

    return { events, source: "airtable" };
  } catch {
    return { events: fallbackEvents(), source: "fallback" };
  }
}
