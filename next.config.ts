import type { NextConfig } from "next";

const csp = [
  "default-src 'self'",
  // Next.js App Router hydrates via inline <script> tags (streamed RSC
  // payloads) with no src attribute — 'self' alone blocks every one of
  // them and silently breaks all client-side JS (observed: FadeIn-wrapped
  // sections stuck at opacity:0 forever since hydration never completes).
  // This is Next.js's own documented approach for CSP setups that don't
  // use a nonce (see node_modules/next/dist/docs/.../content-security-policy.md)
  // — the nonce alternative requires dynamic rendering on every page,
  // which would break the /events ISR caching this site relies on.
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  // Google Maps keyless iframe embed used by the Location modal.
  "frame-src https://www.google.com",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
