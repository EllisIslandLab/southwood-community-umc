import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { isRateLimited } from "@/lib/rateLimit";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("A valid email is required").max(200),
  message: z.string().trim().min(1, "Message is required").max(2000),
  // Honeypot: real visitors never see or fill this field. If it has a
  // value, silently accept the request without sending anything.
  company: z.string().max(200).optional().default(""),
});

async function saveToAirtable(fields: {
  name: string;
  email: string;
  message: string;
}): Promise<boolean> {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableId = process.env.AIRTABLE_TABLE_ID;

  if (!apiKey || !baseId || !tableId) {
    console.warn("Airtable is not configured; skipping contact-form archive.");
    return false;
  }

  const response = await fetch(
    `https://api.airtable.com/v0/${baseId}/${tableId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          Name: fields.name,
          Email: fields.email,
          Message: fields.message,
          "Submitted At": new Date().toISOString(),
          Status: "New",
        },
      }),
    }
  );

  if (!response.ok) {
    console.error(
      `Airtable rejected contact submission: ${response.status} ${await response
        .text()
        .catch(() => "")}`
    );
    return false;
  }

  return true;
}

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
  const resendTo = process.env.RESEND_TO_EMAIL;

  if (!resendApiKey || !resendFrom || !resendTo) {
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

  // Archive to Airtable and send the email in parallel. Airtable failure is
  // logged but never blocks the visitor — email is the delivery guarantee.
  const airtablePromise = saveToAirtable({ name, email, message }).catch(
    (err) => {
      console.error("Airtable archive failed:", err);
      return false;
    }
  );

  const { error } = await resend.emails.send({
    from: resendFrom,
    to: resendTo,
    replyTo: email,
    subject: `New message from ${escapeHtml(name)} via the website`,
    html: `
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Message:</strong></p>
      <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
    `,
  });

  const savedToAirtable = await airtablePromise;

  if (error && !savedToAirtable) {
    return NextResponse.json(
      { error: "Could not send your message. Please try again shortly." },
      { status: 502 }
    );
  }

  if (error) {
    // The message is safe in Airtable even though the email failed.
    console.error("Resend send failed (submission archived in Airtable):", error);
  }

  return NextResponse.json({ ok: true });
}
