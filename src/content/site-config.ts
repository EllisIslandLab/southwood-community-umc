/**
 * SINGLE SOURCE OF CONTENT for Southwood Community Iglesia UMC.
 *
 * Every piece of copy the pastor still needs to send lives here, wrapped in
 * `pending(...)`. In development, fields created with `pending()` render a
 * visible amber "CONTENT PENDING" badge next to them. In production they
 * silently fall back to tasteful generic copy instead — so an early deploy
 * never shows a raw {{TOKEN}} to a visitor.
 *
 * To drop in real content: replace the `pending(...)` call with `ready(...)`
 * (same arguments) once the text is final. That single line change removes
 * the dev badge and starts using the real copy everywhere on the site.
 */

export type ContentField = {
  en: string;
  es: string;
  pending: boolean;
};

function pending(en: string, es: string): ContentField {
  return { en, es, pending: true };
}

function ready(en: string, es: string): ContentField {
  return { en, es, pending: false };
}

export type WeeklyGathering = {
  icon: string;
  titleEn: string;
  titleEs: string;
  day: string;
  dayEs: string;
  time: string;
  note: string;
  noteEs: string;
};

export const siteConfig = {
  ministryName: "Southwood Community Iglesia UMC",
  shortName: "Southwood Community Iglesia UMC",
  location: "Charlottesville, VA",

  tagline: {
    en: "All are welcome",
    es: "Todos son bienvenidos",
  },

  heroSubline: {
    en: "A new bilingual ministry taking root in the Southwood community.",
    es: "Un nuevo ministerio bilingüe que está echando raíces en la comunidad de Southwood.",
  },

  // {{MINISTRY_STORY}} — what the ministry is, what it wants to do, and why.
  // Structure this as the emotional centerpiece of the About section, not a biography.
  ministryStory: pending(
    "We're a brand-new ministry taking root right here in Southwood — and we're just getting started. Our full story is on its way from the pastor and will appear here soon. In the meantime, the best way to meet us is in person: join us for Bible study on Wednesday or Thursday evening.",
    "Somos un ministerio nuevo que está echando raíces aquí mismo en Southwood, y apenas estamos comenzando. Nuestra historia completa viene en camino de parte del pastor y aparecerá aquí pronto. Mientras tanto, la mejor manera de conocernos es en persona: acompáñenos a un estudio bíblico el miércoles o el jueves por la noche."
  ),

  // {{PASTOR_STORY}} — how (and more importantly why) he became a pastor.
  pastorStory: pending(
    "Our pastor's story — how he came to this calling, and why — is being written and will be shared here soon.",
    "La historia de nuestro pastor — cómo llegó a este llamado, y por qué — se está escribiendo y se compartirá aquí pronto."
  ),

  // {{CHURCH_ADDRESS}} — exact street address, needed for the Maps modal.
  address: pending(
    "Address to be announced — contact us for our current meeting location.",
    "Dirección por anunciar — contáctenos para conocer el lugar de reunión actual."
  ),

  // {{CONTACT_EMAIL}}
  contactEmail: pending("hello@southwoodumc.org", "hello@southwoodumc.org"),

  // {{CONTACT_PHONE}}
  contactPhone: pending("(434) 555-0100", "(434) 555-0100"),

  // {{SERVICE_TIMES}} — Sunday service info, if/when it exists.
  // Intentionally NOT wrapped in pending(): if this is empty, components
  // render nothing at all (no badge, no placeholder line) rather than a
  // "content pending" notice, since a Sunday service may genuinely not
  // exist yet for a brand-new ministry plant.
  serviceTimes: {
    en: "",
    es: "",
  },

  weeklyGatherings: [
    {
      icon: "📖",
      titleEn: "Bible Study",
      titleEs: "Estudio Bíblico",
      day: "Wednesdays",
      dayEs: "Miércoles",
      time: "7:00 PM – 8:30 PM",
      note: "Coffee included",
      noteEs: "Café incluido",
    },
    {
      icon: "📖",
      titleEn: "Estudio Bíblico",
      titleEs: "Estudio Bíblico",
      day: "Thursdays",
      dayEs: "Jueves",
      time: "7:00 PM",
      note: "Coffee included",
      noteEs: "Café incluido",
    },
  ] satisfies WeeklyGathering[],
} as const;

export { pending, ready };
