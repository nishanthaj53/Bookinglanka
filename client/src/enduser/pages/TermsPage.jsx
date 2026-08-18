import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import Layout from "../../components/gotur/layout/Layout/Layout";
import TopbarOne from "../../components/gotur/common/TopbarOne/TopbarOne";
import HeaderTwo from "../../components/gotur/layout/HeaderTwo/HeaderTwo";
import HeaderTwoCloned from "../../components/gotur/layout/HeaderTwoCloned/HeaderTwoCloned";
import FooterOne from "../../components/gotur/layout/FooterOne/FooterOne";
import PageHeader from "../../components/gotur/sections/PageHeader/PageHeader";
import { setPageSeo } from "../../utils/setPageSeo";
import { SITE_CONTACT } from "../../data/siteContact";

export default function TermsPage() {
  useEffect(() => {
    setPageSeo(
      "Terms & Conditions || Booking Lanka",
      "Booking Lanka terms and conditions for travellers and hotel managers: bookings, payments, cancellations, and account use."
    );
  }, []);

  return (
    <Layout>
      <TopbarOne />
      <HeaderTwo />
      <HeaderTwoCloned />
      <PageHeader title="Terms & Conditions" subTitle="Legal" extraClass="page-header--property" />
      <section className="section-space article-story" style={{ paddingTop: 0 }}>
        <Container>
          <div className="article-story__body" style={{ maxWidth: 820, margin: "0 auto 48px" }}>
            <p>
              These Terms & Conditions (“Terms”) apply to everyone who uses Booking Lanka
              ({SITE_CONTACT.companyName}), including travellers who book stays and hotel managers who
              list properties. By creating an account or completing a booking you agree to these Terms.
            </p>
            <p className="small text-muted">Last updated: 18 August 2026</p>

            <h2>1. Who we are</h2>
            <p>
              Booking Lanka is an online marketplace. We display hotels and rooms listed by independent
              managers and help travellers request or pay for stays. We are not the hotel operator unless
              a listing says otherwise.
            </p>

            <h2>2. Accounts</h2>
            <p>
              You must provide accurate details and keep your login secure. Traveller and manager portals
              are separate. You must be 18 or older to book or to list a property. We may suspend an
              account for fraud, abuse, or unpaid obligations.
            </p>

            <h2>3. Bookings</h2>
            <p>
              A booking is an agreement between the traveller and the hotel (the manager). Prices,
              photos, amenities, and cancellation rules shown on the listing at checkout apply. Always
              check dates, guest count, and room type before you confirm.
            </p>
            <p>
              Instant-pay bookings are confirmed when payment succeeds. Request-to-book stays are
              confirmed only after the manager accepts (or as shown on that listing).
            </p>

            <h2>4. Payments</h2>
            <p>
              Card payments are processed by our payment partner. Booking Lanka may collect a service
              or commission from the hotel as shown in the manager agreement. Travellers pay the total
              displayed at checkout, including taxes where stated. We do not store full card numbers on
              our servers.
            </p>

            <h2>5. Cancellations, no-shows and refunds</h2>
            <p>
              Cancellation and refund rules follow the hotel’s policy on the booking voucher and listing.
              If you cancel inside a non-refundable window, the stay may not be refunded. No-shows are
              usually charged as a full stay unless the hotel agrees otherwise. Manager-side
              cancellations should be rare; if a stay cannot be honoured we will help you find an
              alternative or a refund of amounts we still hold.
            </p>

            <h2>6. Check-in, ID and house rules</h2>
            <p>
              Hotels may require a valid photo ID, a security deposit, or a minimum age. You must follow
              reasonable house rules (noise, smoking, extra guests). The hotel may refuse check-in if
              details do not match the booking.
            </p>

            <h2>7. Manager listings</h2>
            <p>
              Managers must own or be authorised to list the property, keep rates and availability
              truthful, and honour confirmed bookings. Photos should represent the actual rooms.
              Misleading listings may be removed.
            </p>

            <h2>8. Reviews and content</h2>
            <p>
              Do not post unlawful, defamatory, or infringing content. We may remove material that
              breaks these Terms or applicable law.
            </p>

            <h2>9. Liability</h2>
            <p>
              We provide the platform “as is”. We are not liable for the hotel’s service quality, injury,
              or loss at the property, except where the law does not allow that limit. Our total
              liability for platform issues is limited to fees you paid us for the affected booking, to
              the extent permitted by Sri Lankan law.
            </p>

            <h2>10. Privacy</h2>
            <p>
              We use your contact details to run accounts, bookings, and support. See how we use data
              when you submit forms or complete checkout. Contact us at {SITE_CONTACT.email}.
            </p>

            <h2>11. Changes</h2>
            <p>
              We may update these Terms. Continued use after a change means you accept the new Terms
              for future bookings. Existing confirmed bookings keep the Terms in force on the booking
              date unless the law requires otherwise.
            </p>

            <h2>12. Contact</h2>
            <p>
              {SITE_CONTACT.companyName}
              <br />
              {SITE_CONTACT.addressLine}
              <br />
              {SITE_CONTACT.phone} · {SITE_CONTACT.email}
            </p>

            <p>
              <Link to="/signup">Back to traveller sign up</Link>
              {" · "}
              <Link to="/manager/signup">Manager sign up</Link>
            </p>
          </div>
        </Container>
      </section>
      <FooterOne />
    </Layout>
  );
}
