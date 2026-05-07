import { useEffect } from "react";

import TopbarOne from "../../components/gotur/common/TopbarOne/TopbarOne";
import FooterOne from "../../components/gotur/layout/FooterOne/FooterOne";
import Layout from "../../components/gotur/layout/Layout/Layout";
import HeaderTwo from "../../components/gotur/layout/HeaderTwo/HeaderTwo";
import HeaderTwoCloned from "../../components/gotur/layout/HeaderTwoCloned/HeaderTwoCloned";
import PageHeader from "../../components/gotur/sections/PageHeader/PageHeader";
import ContactTop from "../../components/gotur/sections/ContactTop/ContactTop";
import ContactPage from "../../components/gotur/sections/ContactPage/ContactPage";


export default function Contact() {
  useEffect(() => {
    document.title = "Contact || Booking Lanka";

    const metaDesc = document.querySelector("meta[name='description']");
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Booking Lanka is a modern travel & tour platform for bookings, tours, and travel services."
      );
    }
  }, []);

  return (
    <Layout>
      <TopbarOne />
      <HeaderTwo />    
      <HeaderTwoCloned />
      {/* <PageHeader title="Contact Us" subTitle="Contact Us" /> */}
      <ContactTop />
      <ContactPage />
      <FooterOne />
    </Layout>
  );
}
