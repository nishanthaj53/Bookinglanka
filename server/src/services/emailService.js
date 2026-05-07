import nodemailer from 'nodemailer'

/**
 * Configure reusable Nodemailer transporter
 */
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 465),
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

function appBaseUrl() {
  return (
    process.env.FRONTEND_URL ||
    process.env.CORS_ORIGIN ||
    'http://localhost:5173'
  ).replace(/\/$/, '')
}

function fmtDate(v) {
  if (!v) return '-'
  return new Date(v).toDateString()
}

/**
 * Send a generic email (HTML or plain text)
 */
export async function sendEmail({ to, subject, text, html }) {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text,
      html,
    })
    console.log(`📧 Email sent to ${to}: ${info.messageId}`)
    return info
  } catch (err) {
    console.error('❌ Email sending failed:', err.message)
    throw err
  }
}

/**
 * Example: send booking confirmation email
 */
export async function sendBookingConfirmationEmail(userEmail, bookingDetails) {
  const { id, hotel, checkIn, checkOut, totalAmount, currency } = bookingDetails

  const subject = `Your Booking Confirmation – ${hotel.name}`
  const html = `
    <h2>Booking Confirmed ✅</h2>
    <p>Thank you for booking with <b>BookingLanka.com</b>.</p>
    <p>Booking ID: <b>${id}</b></p>
    <p>Hotel: <b>${hotel.name}</b></p>
    <p>Check-in: ${fmtDate(checkIn)}</p>
    <p>Check-out: ${fmtDate(checkOut)}</p>
    <p>Total: ${currency} ${totalAmount}</p>
    <p><a href="${appBaseUrl()}/dashboard/bookings">View my bookings</a></p>
    <p>We look forward to your stay! 🌴</p>
  `
  await sendEmail({
    to: userEmail,
    subject,
    html,
  })
}

/**
 * Booking cancellation notification
 */
export async function sendBookingCancellationEmail(userEmail, bookingDetails, reasonText) {
  const { id, hotel, checkIn, checkOut } = bookingDetails
  const subject = `Booking Cancelled – ${hotel?.name || 'Booking Lanka'}`
  const html = `
    <h2>Booking Cancelled</h2>
    <p>Your booking request has been cancelled.</p>
    <p>Booking ID: <b>${id}</b></p>
    <p>Hotel: <b>${hotel?.name || '-'}</b></p>
    <p>Check-in: ${fmtDate(checkIn)}</p>
    <p>Check-out: ${fmtDate(checkOut)}</p>
    <p>Reason: <b>${reasonText || 'No space available'}</b></p>
    <p><a href="${appBaseUrl()}/dashboard/bookings">View bookings</a></p>
  `
  await sendEmail({
    to: userEmail,
    subject,
    html,
  })
}

export async function sendPasswordResetEmail(userEmail, resetToken) {
  const resetUrl = `${appBaseUrl()}/reset-password?token=${encodeURIComponent(resetToken)}`
  const subject = 'Reset your BookingLanka password'
  const html = `
    <h2>Password reset request</h2>
    <p>We received a request to reset your password.</p>
    <p><a href="${resetUrl}">Click here to reset password</a></p>
    <p>If you did not request this, you can ignore this email.</p>
    <p>This link expires in 30 minutes.</p>
  `
  await sendEmail({ to: userEmail, subject, html })
}

export async function sendBookingAcceptedEmail(userEmail, booking) {
  const subject = `Booking accepted – ${booking.hotel?.name || 'Booking Lanka'}`
  const html = `
    <h2>Your booking request was accepted ✅</h2>
    <p>Booking ID: <b>${booking.id}</b></p>
    <p>Hotel: <b>${booking.hotel?.name || '-'}</b></p>
    <p>Check-in: ${fmtDate(booking.checkIn)}</p>
    <p>Check-out: ${fmtDate(booking.checkOut)}</p>
    <p>Please complete your payment to confirm the booking.</p>
    <p><a href="${appBaseUrl()}/dashboard/bookings">Go to bookings</a></p>
  `
  await sendEmail({ to: userEmail, subject, html })
}

export async function sendBookingDecisionDeclinedEmail(userEmail, booking) {
  const subject = `Booking declined – ${booking.hotel?.name || 'Booking Lanka'}`
  const html = `
    <h2>Your booking request was declined</h2>
    <p>Booking ID: <b>${booking.id}</b></p>
    <p>Hotel: <b>${booking.hotel?.name || '-'}</b></p>
    <p>Check-in: ${fmtDate(booking.checkIn)}</p>
    <p>Check-out: ${fmtDate(booking.checkOut)}</p>
    <p>You may choose other dates or hotels.</p>
    <p><a href="${appBaseUrl()}/">Browse hotels</a></p>
  `
  await sendEmail({ to: userEmail, subject, html })
}

export async function sendBookingStatusUpdateEmail(userEmail, booking, nextStatus) {
  const subject = `Booking status update – ${booking.hotel?.name || 'Booking Lanka'}`
  const statusText =
    nextStatus === 'CHECKED_IN'
      ? 'You are checked in. Have a great stay!'
      : nextStatus === 'COMPLETED'
      ? 'Your stay is marked as completed. Thank you!'
      : `New status: ${nextStatus}`
  const html = `
    <h2>Booking status updated</h2>
    <p>Booking ID: <b>${booking.id}</b></p>
    <p>Hotel: <b>${booking.hotel?.name || '-'}</b></p>
    <p>${statusText}</p>
    <p><a href="${appBaseUrl()}/dashboard/bookings">View bookings</a></p>
  `
  await sendEmail({ to: userEmail, subject, html })
}

export async function sendRoomAvailableEmail(userEmail, hotelName, roomName, startDate, endDate) {
  const subject = `Room available again – ${hotelName}`
  const html = `
    <h2>Good news! Room is available again 🎉</h2>
    <p>Hotel: <b>${hotelName}</b></p>
    <p>Room: <b>${roomName || 'Room'}</b></p>
    <p>Available range: ${fmtDate(startDate)} to ${fmtDate(endDate)}</p>
    <p><a href="${appBaseUrl()}/">Book now</a></p>
  `
  await sendEmail({ to: userEmail, subject, html })
}
