import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'
import { generateBookingVoucherPdf } from './bookingVoucherPdf.js'
import {
  appBaseUrl,
  bookingReference,
  emailLogoPath,
  fmtDate,
  fmtMoney,
  wrapEmailHtml,
} from './emailTemplates.js'

function emailUser() {
  return String(process.env.EMAIL_USER || '').trim()
}

function emailPass() {
  return String(process.env.EMAIL_PASS || '').replace(/\s+/g, '')
}

function mailFrom() {
  const user = emailUser()
  const named = process.env.EMAIL_FROM?.trim()
  // Gmail SMTP only allows the authenticated mailbox as From.
  if (user && /@gmail\.com$/i.test(user)) {
    return `Booking Lanka <${user}>`
  }
  return named || (user ? `Booking Lanka <${user}>` : undefined)
}

function isEmailConfigured() {
  return Boolean(process.env.EMAIL_HOST && emailUser() && emailPass())
}

let transporter

function getTransporter() {
  if (!isEmailConfigured()) {
    throw new Error(
      'Email is not configured. Set EMAIL_HOST, EMAIL_USER, and EMAIL_PASS on the API server.'
    )
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT || 465),
      secure: process.env.EMAIL_SECURE === 'true' || Number(process.env.EMAIL_PORT || 465) === 465,
      auth: {
        user: emailUser(),
        pass: emailPass(),
      },
    })
  }
  return transporter
}

export async function verifyEmailTransport() {
  if (!isEmailConfigured()) {
    console.warn(
      '⚠️ Email skipped: EMAIL_HOST / EMAIL_USER / EMAIL_PASS are not set on this server.'
    )
    return false
  }
  try {
    await getTransporter().verify()
    console.log(`✅ Email SMTP ready (${process.env.EMAIL_HOST} as ${emailUser()})`)
    return true
  } catch (err) {
    console.error('❌ Email SMTP verify failed:', err.message)
    return false
  }
}

export function createEmailVerificationToken(user, portal = 'user') {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      purpose: 'email-verify',
      portal,
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  )
}

/**
 * Send a generic email (HTML or plain text)
 */
export async function sendEmail({ to, subject, text, html, attachments }) {
  const logoFile = emailLogoPath()
  const logoAttach = logoFile
    ? [
        {
          filename: 'booking-lanka-logo.png',
          path: logoFile,
          cid: 'booking-lanka-logo',
        },
      ]
    : []

  const info = await getTransporter().sendMail({
    from: mailFrom(),
    to,
    subject,
    text,
    html,
    attachments: [...logoAttach, ...(attachments || [])],
  })
  console.log(`📧 Email sent to ${to}: ${info.messageId}`)
  return info
}

export async function sendEmailVerificationEmail(userEmail, token, portal = 'user') {
  const verifyUrl = `${appBaseUrl()}/verify-email?token=${encodeURIComponent(token)}&portal=${encodeURIComponent(portal)}`
  const portalLabel = portal === 'manager' ? 'hotel manager' : 'traveller'
  const loginPath = portal === 'manager' ? '/manager/login' : '/login'

  const subject = 'No reply - email verification for registration'
  const html = wrapEmailHtml({
    title: 'Verify your email',
    preheader: 'No reply - email verification for registration.',
    bodyHtml: `
      <p>Welcome to <strong>Booking Lanka</strong>!</p>
      <p>Please confirm your email address to activate your ${portalLabel} account and sign in securely.</p>
      <p style="margin:18px 0;padding:16px;background:#f9fafb;border-radius:12px;border:1px solid #e5e7eb;">
        <strong>Email:</strong> ${userEmail}<br/>
        <strong>Link expires in:</strong> 24 hours
      </p>
      <p>If you did not create this account, you can safely ignore this message.</p>
    `,
    ctaLabel: 'Verify email address',
    ctaUrl: verifyUrl,
  })

  const text = `Verify your Booking Lanka email: ${verifyUrl}\nAfter verification, sign in at ${appBaseUrl()}${loginPath}`

  await sendEmail({ to: userEmail, subject, html, text })
}

export async function sendBookingConfirmationEmail(userEmail, bookingDetails) {
  const booking = bookingDetails
  const ref = bookingReference(booking.id)
  const hotelName = booking.hotel?.name || 'Hotel'
  const roomName = booking.roomType?.name || 'Room'
  const subject = `No reply - hotel booking reference ${ref}`

  let pdfBuffer
  try {
    pdfBuffer = await generateBookingVoucherPdf(booking)
  } catch (err) {
    console.error('PDF voucher generation failed:', err.message)
  }

  const html = wrapEmailHtml({
    title: 'Your booking is confirmed',
    preheader: `${hotelName} • ${fmtDate(booking.checkIn)} to ${fmtDate(booking.checkOut)}`,
    bodyHtml: `
      <p>Thank you for booking with <strong>Booking Lanka</strong>. Your payment was received successfully.</p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:20px 0;background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;">
        <tr><td style="padding:16px 18px;">
          <p style="margin:0 0 8px;"><strong>Reference:</strong> ${ref}</p>
          <p style="margin:0 0 8px;"><strong>Hotel:</strong> ${hotelName}</p>
          <p style="margin:0 0 8px;"><strong>Room:</strong> ${roomName}</p>
          <p style="margin:0 0 8px;"><strong>Stay:</strong> ${fmtDate(booking.checkIn)} → ${fmtDate(booking.checkOut)}</p>
          <p style="margin:0 0 8px;"><strong>Guests:</strong> ${booking.guests ?? 1} · <strong>Rooms:</strong> ${booking.rooms ?? 1}</p>
          <p style="margin:0;"><strong>Paid:</strong> ${fmtMoney(booking.totalAmount, booking.currency)}</p>
        </td></tr>
      </table>
      <p>A printable booking reference PDF is attached. Show it at hotel reception along with your photo ID.</p>
    `,
    ctaLabel: 'View my bookings',
    ctaUrl: `${appBaseUrl()}/dashboard/bookings`,
  })

  const attachments = pdfBuffer
    ? [
        {
          filename: `BookingLanka-Reference-${ref}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ]
    : undefined

  await sendEmail({
    to: userEmail,
    subject,
    html,
    attachments,
  })
}

export async function sendBookingCancellationEmail(userEmail, bookingDetails, reasonText) {
  const { id, hotel, checkIn, checkOut } = bookingDetails
  const subject = `No reply - hotel booking cancelled`
  const html = wrapEmailHtml({
    title: 'Booking cancelled',
    bodyHtml: `
      <p>Your booking request has been cancelled.</p>
      <p><strong>Booking ID:</strong> ${id}</p>
      <p><strong>Hotel:</strong> ${hotel?.name || '-'}</p>
      <p><strong>Check-in:</strong> ${fmtDate(checkIn)}</p>
      <p><strong>Check-out:</strong> ${fmtDate(checkOut)}</p>
      <p><strong>Reason:</strong> ${reasonText || 'No space available'}</p>
    `,
    ctaLabel: 'View bookings',
    ctaUrl: `${appBaseUrl()}/dashboard/bookings`,
  })
  await sendEmail({ to: userEmail, subject, html })
}

export async function sendPasswordResetEmail(userEmail, resetToken) {
  const resetUrl = `${appBaseUrl()}/reset-password?token=${encodeURIComponent(resetToken)}`
  const subject = 'No reply - forgot password'
  const html = wrapEmailHtml({
    title: 'Reset your password',
    preheader: 'No reply - forgot password.',
    bodyHtml: `
      <p>We received a request to reset the password for <strong>${userEmail}</strong>.</p>
      <p>Click the button below to choose a new password. This link expires in <strong>30 minutes</strong>.</p>
      <p>If you did not request a password reset, you can ignore this email — your password will stay the same.</p>
    `,
    ctaLabel: 'Reset password',
    ctaUrl: resetUrl,
  })
  await sendEmail({ to: userEmail, subject, html })
}

export async function sendBookingAcceptedEmail(userEmail, booking) {
  const subject = `Booking accepted — ${booking.hotel?.name || 'Booking Lanka'}`
  const html = wrapEmailHtml({
    title: 'Booking request accepted',
    bodyHtml: `
      <p>Great news — the hotel accepted your booking request.</p>
      <p><strong>Booking ID:</strong> ${booking.id}</p>
      <p><strong>Hotel:</strong> ${booking.hotel?.name || '-'}</p>
      <p><strong>Check-in:</strong> ${fmtDate(booking.checkIn)}</p>
      <p><strong>Check-out:</strong> ${fmtDate(booking.checkOut)}</p>
      <p>Please complete payment to confirm your reservation.</p>
    `,
    ctaLabel: 'Complete payment',
    ctaUrl: `${appBaseUrl()}/dashboard/bookings`,
  })
  await sendEmail({ to: userEmail, subject, html })
}

export async function sendBookingDecisionDeclinedEmail(userEmail, booking) {
  const subject = `Booking declined — ${booking.hotel?.name || 'Booking Lanka'}`
  const html = wrapEmailHtml({
    title: 'Booking request declined',
    bodyHtml: `
      <p>Unfortunately, the hotel could not accept your booking request.</p>
      <p><strong>Booking ID:</strong> ${booking.id}</p>
      <p><strong>Hotel:</strong> ${booking.hotel?.name || '-'}</p>
      <p><strong>Check-in:</strong> ${fmtDate(booking.checkIn)}</p>
      <p><strong>Check-out:</strong> ${fmtDate(booking.checkOut)}</p>
      <p>You can browse other hotels and dates on Booking Lanka.</p>
    `,
    ctaLabel: 'Browse hotels',
    ctaUrl: `${appBaseUrl()}/`,
  })
  await sendEmail({ to: userEmail, subject, html })
}

export async function sendBookingStatusUpdateEmail(userEmail, booking, nextStatus) {
  const subject = `Booking status update — ${booking.hotel?.name || 'Booking Lanka'}`
  const statusText =
    nextStatus === 'CHECKED_IN'
      ? 'You are checked in. Have a great stay!'
      : nextStatus === 'COMPLETED'
        ? 'Your stay is marked as completed. Thank you!'
        : `New status: ${nextStatus}`
  const html = wrapEmailHtml({
    title: 'Booking status updated',
    bodyHtml: `
      <p><strong>Booking ID:</strong> ${booking.id}</p>
      <p><strong>Hotel:</strong> ${booking.hotel?.name || '-'}</p>
      <p>${statusText}</p>
    `,
    ctaLabel: 'View bookings',
    ctaUrl: `${appBaseUrl()}/dashboard/bookings`,
  })
  await sendEmail({ to: userEmail, subject, html })
}

export async function sendRoomAvailableEmail(userEmail, hotelName, roomName, startDate, endDate) {
  const subject = `Room available again — ${hotelName}`
  const html = wrapEmailHtml({
    title: 'Room is available again',
    bodyHtml: `
      <p>Good news — a room you were interested in is available again.</p>
      <p><strong>Hotel:</strong> ${hotelName}</p>
      <p><strong>Room:</strong> ${roomName || 'Room'}</p>
      <p><strong>Available:</strong> ${fmtDate(startDate)} to ${fmtDate(endDate)}</p>
    `,
    ctaLabel: 'Book now',
    ctaUrl: `${appBaseUrl()}/`,
  })
  await sendEmail({ to: userEmail, subject, html })
}
