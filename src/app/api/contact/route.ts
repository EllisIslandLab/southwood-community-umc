import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { isRateLimited } from "@/lib/rateLimit";
import { siteConfig } from "@/content/site-config";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("A valid email is required").max(200),
  message: z.string().trim().min(1, "Message is required").max(2000),
  // Honeypot: real visitors never see or fill this field. If it has a
  // value, silently accept the request without sending anything.
  company: z.string().max(200).optional().default(""),
});

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: NextRequest) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const resendFrom = process.env.RESEND_FROM_EMAIL;

  if (!resendApiKey || !resendFrom) {
    return NextResponse.json(
      { error: "Email is not configured for this site yet." },
      { status: 503 }
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again in a few minutes." },
      { status: 429 }
    );
  }

  const json = await request.json().catch(() => null);
  const parsed = contactSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid submission." },
      { status: 400 }
    );
  }

  const { name, email, message, company } = parsed.data;

  // Honeypot tripped — pretend success, send nothing.
  if (company) {
    return NextResponse.json({ ok: true });
  }

  const resend = new Resend(resendApiKey);
  const contactEmail = siteConfig.contactEmail.pending
    ? resendFrom
    : siteConfig.contactEmail.en;

  const { error } = await resend.emails.send({
    from: resendFrom,
    to: contactEmail,
    replyTo: email,
    subject: `New message from ${escapeHtml(name)} via the website`,
    html: `
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
    `,
  });

  if (error) {
    return NextResponse.json(
      { error: "Could not send your message. Please try again shortly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
