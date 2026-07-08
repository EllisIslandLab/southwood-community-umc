# Southwood Community Iglesia UMC

A small, bilingual (English/Spanish) ministry website for Southwood Community
Iglesia UMC, a new United Methodist ministry plant in the Southwood
community of Charlottesville, VA. Built by Web Launch Academy — client owns
the code, hosting, and domain outright ("Build Once, Own Forever").

## Tech stack

- Next.js 16 (App Router, TypeScript) — note: newer than the Next 14
  originally scoped; fully compatible, just a more current major version.
- Tailwind CSS v4 (CSS-first theme in `src/app/globals.css`, no
  `tailwind.config.ts` needed)
- Airtable REST API for the `/events` page (optional — see below)
- Resend for the contact form (optional — see below)
- Deploys to Vercel

## Getting started locally

```bash
npm install
cp .env.example .env.local   # fill in what you have; every var is optional locally
npm run dev
```

Open http://localhost:3000. Nothing above is required to see a working
site — Airtable and Resend both have graceful fallbacks (see below).

## The one file that matters most: `src/content/site-config.ts`

Every piece of copy the pastor still needs to send — the ministry story, the
pastor's story, the church address, contact email/phone, Sunday service
times — lives in this single file, in both English and Spanish.

- Fields wrapped in `pending(en, es)` show a small amber "Content pending"
  badge in development only (`npm run dev`), and fall back to tasteful
  generic copy in production. **A live deploy never shows a raw
  `{{TOKEN}}` to a visitor.**
- To drop in real content: change `pending(...)` to `ready(...)` — same two
  arguments — once the text is final. That's the whole update.
- `serviceTimes` is the one exception: it's plain `{ en: "", es: "" }`, not
  wrapped in `pending()`. Leave it empty and nothing renders; fill it in
  once there's a Sunday service to announce.

## Images

`public/images/` currently has two generic, royalty-free (CC0) photos used
as placeholders — an open Bible by candlelight, and a café coffee cup, tied
to the "coffee included" detail in the weekly schedule. See
`public/images/ATTRIBUTIONS.md` for sources and for why we deliberately did
**not** use a stock photo of a church building or congregation (this
ministry doesn't have a confirmed building yet, and a stock photo of an
unrelated place or group of people would misrepresent this specific
community). Swap in real photos whenever they arrive — same folder,
same filenames work if you just replace the files, or update the `src` in
`MinistryStory.tsx` / `ScheduleSection.tsx` for new filenames.

## Environment variables

See `.env.example` for the full list with explanations. Summary:

| Variable | Required? | What happens if unset |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Recommended | Metadata/sitemap fall back to `http://localhost:3000` |
| `AIRTABLE_API_KEY` / `AIRTABLE_BASE_ID` | Optional | `/events` shows just the two weekly studies from `site-config.ts` |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` | Optional | Contact section shows a plain mailto/tel link instead of a form |

### Setting up Airtable (for the `/events` page)

1. Create a free base at airtable.com with one table named exactly `Events`.
2. Add these fields (types in parentheses):
   - `Title` (single line text)
   - `Title_ES` (single line text, optional)
   - `Description` (long text, optional)
   - `Date` (date) — see note below
   - `StartTime` (single line text, e.g. `7:00 PM` — plain text, not
     Airtable's time type, so it displays exactly as typed)
   - `EndTime` (single line text, optional)
   - `Recurring` (checkbox)
   - `Location` (single line text, optional)
   - `Published` (checkbox) — only checked rows appear on the site
3. Import `docs/airtable-events-seed.csv` (or add the two rows by hand) to
   pre-seed the weekly studies.
4. Create a personal access token at airtable.com/create/tokens with
   `data.records:read` scope on this base, and set `AIRTABLE_API_KEY`. Find
   `AIRTABLE_BASE_ID` in the base's API documentation URL (starts with
   `app...`).

**Note on `Date` for recurring rows:** the schema has no separate
day-of-week field. For a `Recurring` row, set `Date` to any one upcoming
occurrence on the correct weekday (e.g. any Wednesday for the English
study) — the site reads the weekday off that date and labels the card
"Wednesdays," "Thursdays," etc. It doesn't matter which specific Wednesday;
just keep it roughly current if you ever reuse the row.

The events page uses ISR with a 1-hour revalidation window
(`next: { revalidate: 3600 }` in `src/lib/airtable.ts`), so edits in
Airtable show up on the live site within an hour with no redeploy.

### Setting up Resend (for the contact form)

1. Sign up free at resend.com and verify a sending domain (or use their
   test domain while developing).
2. Create an API key and set `RESEND_API_KEY`.
3. Set `RESEND_FROM_EMAIL` to a verified sending address.

Until both are set, the Contact section just shows the ministry's email and
phone as plain links — no broken form, no error.

## Security

- All secrets are server-only env vars — nothing Airtable- or
  Resend-related is ever in `NEXT_PUBLIC_*` or the client bundle.
- The contact route (`src/app/api/contact/route.ts`) validates input with
  zod, has a honeypot field, and throttles to 3 submissions per IP per 10
  minutes (in-memory — see the comment in `src/lib/rateLimit.ts` about
  swapping to Upstash if real abuse ever shows up).
- Security headers (CSP, X-Frame-Options, X-Content-Type-Options,
  Referrer-Policy) are set in `next.config.ts`. The CSP's `frame-src`
  specifically allows `https://www.google.com` for the keyless Maps embed
  in the Location modal — no Google Maps API key is used anywhere.
- `npm audit` reports a moderate PostCSS advisory nested inside Next.js's
  own bundled build tooling (not our dependency tree). The suggested "fix"
  is to downgrade Next.js to v9, which is not a real fix — this is a known
  npm audit false-positive-shaped result for this class of nested
  dependency. Re-check `npm audit` after any future `next` upgrade.
- No auth, no database, no user accounts — nothing to lock down there by
  design.

## Deploying to Vercel

1. Push this repo to GitHub (client-owned repo — see delivery notes below).
2. Import it in Vercel → New Project.
3. Framework preset: Next.js (auto-detected).
4. Add the environment variables from `.env.example` under Project
   Settings → Environment Variables (Production and Preview).
5. Deploy. Attach the client's Namecheap domain once they confirm it
   (Project Settings → Domains), and update `NEXT_PUBLIC_SITE_URL`
   accordingly.

## What's intentionally not built yet

- A standalone `/about` page — the brief said to build this only if the
  pastor's story runs long. It currently lives inline on the home page
  inside `MinistryStory.tsx`, structured so splitting it into its own route
  is a small, mechanical change once there's enough content to justify it.
- Full i18n routing — bilingual content is handled inline via
  `site-config.ts`'s `{ en, es }` fields per the brief, not a full
  next-intl/routing setup. If the site ever needs real per-language URLs,
  that config shape makes the migration straightforward.

---

Built with [Web Launch Academy](https://weblaunchacademy.com/).
