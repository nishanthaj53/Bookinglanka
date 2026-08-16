import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

export function appBaseUrl() {
  return (
    process.env.FRONTEND_URL ||
    process.env.CORS_ORIGIN ||
    "https://www.bookinglanka.com"
  )
    .split(",")[0]
    .trim()
    .replace(/\/$/, "");
}

export function emailLogoPath() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const file = path.join(here, "../assets/email-logo-light.png");
  return existsSync(file) ? file : null;
}

export function emailLogoSrc() {
  if (emailLogoPath()) return "cid:booking-lanka-logo";
  return `${appBaseUrl()}/images/logo-light.png`;
}

export function fmtDate(v) {
  if (!v) return "-";
  return new Date(v).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function fmtMoney(amount, currency = "USD") {
  const n = Number(amount);
  if (!Number.isFinite(n)) return `${currency} -`;
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: String(currency || "USD").toUpperCase(),
    }).format(n);
  } catch {
    return `${currency} ${n.toFixed(2)}`;
  }
}

export function bookingReference(id) {
  if (!id) return "-";
  return String(id).slice(0, 8).toUpperCase();
}

/**
 * Branded HTML email matching Booking Lanka site (dark header, orange CTA, logo footer).
 */
export function wrapEmailHtml({ title, preheader, bodyHtml, ctaLabel, ctaUrl }) {
  const safePreheader = preheader || title || "Booking Lanka";
  const logo = emailLogoSrc();
  const site = appBaseUrl();
  const ctaBlock =
    ctaLabel && ctaUrl
      ? `<tr><td style="padding:8px 32px 24px;text-align:center;">
          <a href="${ctaUrl}" style="display:inline-block;background:#f7921e;color:#ffffff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 28px;border-radius:8px;">${ctaLabel}</a>
        </td></tr>`
      : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title || "Booking Lanka"}</title>
</head>
<body style="margin:0;padding:0;background:#eef1ef;font-family:Arial,Helvetica,sans-serif;color:#1d231f;">
  <span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;">${safePreheader}</span>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#eef1ef;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e5e5e5;">
          <tr>
            <td style="background:#1d231f;padding:22px 32px;border-bottom:3px solid #f7921e;">
              <div style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#f7921e;font-weight:700;">No reply</div>
              <h1 style="margin:8px 0 0;font-size:24px;line-height:1.3;font-weight:800;color:#ffffff;">${title || "Notification"}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;font-size:15px;line-height:1.7;color:#3d4440;">
              ${bodyHtml}
            </td>
          </tr>
          ${ctaBlock}
          <tr>
            <td style="background:#1d231f;padding:28px 32px;text-align:center;">
              <a href="${site}" style="text-decoration:none;">
                <img src="${logo}" alt="Booking Lanka" width="158" height="45" style="display:inline-block;max-width:158px;height:auto;border:0;" />
              </a>
              <p style="margin:14px 0 0;font-size:16px;font-weight:700;color:#ffffff;">Booking Lanka</p>
              <p style="margin:8px 0 0;font-size:12px;line-height:1.6;color:#c5c9c6;">
                Automated message — please do not reply.<br/>
                <a href="${site}" style="color:#f7921e;text-decoration:none;">www.bookinglanka.com</a>
                &nbsp;·&nbsp;
                <a href="${site}/contact" style="color:#f7921e;text-decoration:none;">Contact</a>
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
