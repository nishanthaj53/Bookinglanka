import "dotenv/config";
import {
  sendBookingConfirmationEmail,
  sendEmailVerificationEmail,
  sendPasswordResetEmail,
  verifyEmailTransport,
} from "../src/services/emailService.js";

const to = process.argv[2] || process.env.EMAIL_USER;

async function main() {
  if (!to) {
    console.error("Pass a recipient email, e.g. node scripts/sendTestTransactionalEmails.js you@example.com");
    process.exit(1);
  }

  console.log(`SMTP host: ${process.env.EMAIL_HOST}`);
  console.log(`SMTP user: ${process.env.EMAIL_USER}`);
  console.log(`From:      ${process.env.EMAIL_FROM}`);
  console.log(`Sending 3 test emails to: ${to}`);

  const ok = await verifyEmailTransport();
  if (!ok) process.exit(1);

  await sendEmailVerificationEmail(to, "test-verify-token", "user");
  console.log("1/3 sent: registration verification");

  await sendPasswordResetEmail(to, "test-reset-token");
  console.log("2/3 sent: forgot password");

  await sendBookingConfirmationEmail(to, {
    id: "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
    checkIn: new Date("2026-09-01"),
    checkOut: new Date("2026-09-04"),
    guests: 2,
    rooms: 1,
    totalAmount: 189,
    currency: "USD",
    hotel: { name: "Nallur Kovil View" },
    roomType: { name: "Deluxe Double" },
    user: { displayName: "Test Guest", email: to },
  });
  console.log("3/3 sent: hotel booking reference (PDF attached)");
  console.log("Done. Check inbox and spam for that address.");
}

main().catch((err) => {
  console.error("Send failed:", err.message);
  process.exit(1);
});
