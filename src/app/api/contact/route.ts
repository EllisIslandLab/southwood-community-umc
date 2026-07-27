import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { isRateLimited } from "@/lib/rateLimit";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("A valid email is required").max(200),
  message: z.string().trim().min(1, "Message is required").max(2000),
  isMember: z.boolean().optional().default(false),
  // Honeypot: real visitors never see or fill this field. If it has a
  // value, silently accept the request without sending anything.
  company: z.string().max(200).optional().default(""),
});

async function saveToAirtable(fields: {
  name: string;
  email: string;
  message: string;
  isMember: boolean;
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
          Member: fields.isMember,
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

/**
 * Records the person in the "Members" or "Visitors" people table, keyed on
 * Email so repeat submissions update the existing row instead of duplicating
 * it. A repeat submission does bump First Contact to the latest date.
 */
async function savePersonToAirtable(fields: {
  name: string;
  email: string;
  isMember: boolean;
}): Promise<void> {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!apiKey || !baseId) {
    return;
  }

  const table = fields.isMember ? "Members" : "Visitors";
  const response = await fetch(
    `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        performUpsert: { fieldsToMergeOn: ["Email"] },
        records: [
          {
            fields: {
              Name: fields.name,
              Email: fields.email,
              "First Contact": new Date().toISOString(),
            },
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    console.error(
      `Airtable rejected ${table} upsert: ${response.status} ${await response
        .text()
        .catch(() => "")}`
    );
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildConfirmationHtml(name: string): string {
  // Build greeting — drop the comma entirely when no name is provided
  const safeName = name ? escapeHtml(name) : "";
  const greetingEn = safeName
    ? `Thank you for reaching out to Southwood Community Church, ${safeName}.`
    : "Thank you for reaching out to Southwood Community Church.";
  const greetingEs = safeName
    ? `Gracias por comunicarse con Southwood Community Church, ${safeName}.`
    : "Gracias por comunicarse con Southwood Community Church.";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Message Received / Mensaje Recibido</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f4f9;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f4f9;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
          style="max-width:600px;width:100%;background:#ffffff;border-radius:10px;overflow:hidden;
                 box-shadow:0 2px 12px rgba(0,0,0,0.09);">

          <!-- ── Header ── -->
          <tr>
            <td style="background-color:#1e5aa8;padding:36px 40px 28px;text-align:center;">
              <p style="margin:0 0 6px;font-size:11px;letter-spacing:3px;color:#b8d0ef;
                         text-transform:uppercase;font-family:Arial,sans-serif;">
                Southwood Community Church
              </p>
              <p style="margin:0;font-size:13px;letter-spacing:1px;color:#b8d0ef;
                         text-transform:uppercase;font-family:Arial,sans-serif;">
                United Methodist
              </p>
              <div style="margin:18px auto 0;width:48px;height:2px;background-color:#6fa287;"></div>
              <h1 style="margin:16px 0 0;font-size:24px;color:#ffffff;
                          font-family:Georgia,serif;font-weight:normal;letter-spacing:0.5px;">
                Message Received
              </h1>
            </td>
          </tr>

          <!-- ── Body ── -->
          <tr>
            <td style="padding:40px 40px 8px;">

              <!-- English -->
              <p style="margin:0 0 10px;font-size:17px;color:#1f2a37;line-height:1.65;">
                ${greetingEn}
              </p>
              <p style="margin:0 0 32px;font-size:16px;color:#1f2a37;line-height:1.65;">
                Your message has been received. We look forward to serving you.
              </p>

              <!-- Bilingual divider -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="border-top:1px solid #d0dde8;"></td>
                  <td style="padding:0 12px;white-space:nowrap;font-size:12px;
                              color:#6fa287;font-family:Arial,sans-serif;letter-spacing:1px;
                              text-transform:uppercase;">
                    En Español
                  </td>
                  <td style="border-top:1px solid #d0dde8;"></td>
                </tr>
              </table>

              <!-- Spanish -->
              <p style="margin:0 0 10px;font-size:17px;color:#1f2a37;line-height:1.65;">
                ${greetingEs}
              </p>
              <p style="margin:0 0 40px;font-size:16px;color:#1f2a37;line-height:1.65;">
                Su mensaje ha sido recibido. Esperamos poder servirle.
              </p>

            </td>
          </tr>

          <!-- ── Footer ── -->
          <tr>
            <td style="background-color:#eaf1fa;border-top:3px solid #6fa287;
                        padding:20px 40px;text-align:center;">
              <p style="margin:0;font-size:13px;color:#4b5a6b;font-family:Arial,sans-serif;
                          line-height:1.5;">
                Southwood Community Church &mdash; United Methodist
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
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

  const { name, email, message, isMember, company } = parsed.data;

  // Honeypot tripped — pretend success, send nothing.
  if (company) {
    return NextResponse.json({ ok: true });
  }

  const resend = new Resend(resendApiKey);

  // Archive to Airtable, record the person in the Members/Visitors table,
  // send church notification, and send visitor confirmation — all in
  // parallel. Airtable failure is logged but never blocks the visitor.
  const airtablePromise = saveToAirtable({ name, email, message, isMember }).catch(
    (err) => {
      console.error("Airtable archive failed:", err);
      return false;
    }
  );

  const personPromise = savePersonToAirtable({ name, email, isMember }).catch(
    (err) => {
      console.error("Airtable people-table upsert failed:", err);
    }
  );

  const [{ error: notifyError }, { error: confirmError }] = await Promise.all([
    // Notification to the church inbox
    resend.emails.send({
      from: resendFrom,
      to: resendTo,
      replyTo: email,
      subject: `New message from ${escapeHtml(name)} via the website`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Member:</strong> ${isMember ? "Yes" : "No"}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, "<br />")}</p>
      `,
    }),

    // Confirmation to the visitor. The idempotency key dedupes on the
    // recipient address for 24h — a retried request won't send twice, and
    // the form can't be abused to flood a third party's inbox.
    resend.emails.send(
      {
        from: resendFrom,
        to: email,
        replyTo: resendTo,
        subject: "Message Received / Mensaje Recibido — Southwood Community Church",
        html: buildConfirmationHtml(name),
      },
      { idempotencyKey: `contact-thank-you/${email.toLowerCase()}` }
    ),
  ]);

  const savedToAirtable = await airtablePromise;
  await personPromise;

  if (notifyError) {
    console.error("Resend notification failed:", notifyError);
  }
  if (confirmError) {
    // Non-fatal — visitor's submission is still captured; log and move on.
    console.error("Resend confirmation failed:", confirmError);
  }

  // Only return an error to the visitor if BOTH the notification email and
  // Airtable archive failed — i.e., the submission was truly lost.
  if (notifyError && !savedToAirtable) {
    return NextResponse.json(
      { error: "Could not send your message. Please try again shortly." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
