/**
 * Dev-only "CONTENT PENDING" flag. Renders nothing in production so an
 * early deploy never exposes internal placeholder status to a visitor.
 */
export function PendingBadge() {
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <span className="ml-2 inline-block whitespace-nowrap rounded-full bg-amber-100 px-2 py-0.5 align-middle text-xs font-sans font-semibold uppercase tracking-wide text-amber-800">
      Content pending
    </span>
  );
}
