export function appBaseUrl() {
  return (
    process.env.FRONTEND_URL ||
    process.env.CORS_ORIGIN ||
    'http://localhost:5173'
  )
    .split(',')[0]
    .trim()
    .replace(/\/$/, '')
}

export function fmtDate(v) {
  if (!v) return '-'
  return new Date(v).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function fmtMoney(amount, currency = 'USD') {
  const n = Number(amount)
  if (!Number.isFinite(n)) return `${currency} -`
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: String(currency || 'USD').toUpperCase(),
    }).format(n)
  } catch {
    return `${currency} ${n.toFixed(2)}`
  }
}

export function bookingReference(id) {
  if (!id) return '-'
  return String(id).slice(0, 8).toUpperCase()
}

/**
 * Branded HTML email wrapper matching Booking Lanka / Gotur palette.
 */
export function wrapEmailHtml({ title, preheader, bodyHtml, ctaLabel, ctaUrl }) {
  const safePreheader = preheader || title || 'Booking Lanka'
  const ctaBlock =
    ctaLabel && ctaUrl
      ? `<tr><td style="padding:28px 32px 8px;text-align:center;">
          <a href="${ctaUrl}" style="display:inline-block;background:#15803d;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:14px 28px;border-radius:999px;">${ctaLabel}</a>
        </td></tr>`
      : ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title || 'Booking Lanka'}</title>
</head>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
  <span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;">${safePreheader}</span>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f6f8;padding:24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 30px rgba(15,23,42,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#14532d 0%,#15803d 100%);padding:28px 32px;color:#ffffff;">
              <div style="font-size:13px;letter-spacing:0.08em;text-transform:uppercase;opacity:0.9;">Booking Lanka</div>
              <h1 style="margin:8px 0 0;font-size:26px;line-height:1.3;font-weight:700;">${title || 'Notification'}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;font-size:15px;line-height:1.7;">
              ${bodyHtml}
            </td>
          </tr>
          ${ctaBlock}
          <tr>
            <td style="padding:8px 32px 28px;font-size:13px;line-height:1.6;color:#6b7280;">
              Need help? Visit <a href="${appBaseUrl()}/contact" style="color:#15803d;">Contact us</a> or reply to this email.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
