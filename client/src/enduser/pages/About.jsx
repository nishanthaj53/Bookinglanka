import { useEffect } from "react";

import TopbarOne from "../../components/gotur/common/TopbarOne/TopbarOne";
import HeaderTwo from "../../components/gotur/layout/HeaderTwo/HeaderTwo";
import HeaderTwoCloned from "../../components/gotur/layout/HeaderTwoCloned/HeaderTwoCloned";
import FooterOne from "../../components/gotur/layout/FooterOne/FooterOne";
import Layout from "../../components/gotur/layout/Layout/Layout";
import PageHeader from "../../components/gotur/sections/PageHeader/PageHeader";
import AboutOne from "../../components/gotur/sections/AboutOne/AboutOne";
import CtaTwo from "../../components/gotur/sections/CtaTwo/CtaTwo";
import HowItWorks from "../../components/gotur/sections/HowItWorks/HowItWorks";
import AboutTestimonials from "../../components/gotur/sections/AboutTestimonials/AboutTestimonials";

export default function About() {
  useEffect(() => {
    document.title = "About Us || Booking Lanka";

    const metaDesc = document.querySelector("meta[name='description']");
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Booking Lanka is a modern travel & tour platform. It is perfect for travel agencies, tour operators, trip holiday booking websites, adventure and booking companies."
      );
    }
  }, []);

  return (
    <Layout>
      <TopbarOne />
      <HeaderTwo />
      <HeaderTwoCloned />  
      {/* <PageHeader title="About Us" subTitle="About Us" /> */}
      <AboutOne />
      <CtaTwo />
      <HowItWorks />
      <AboutTestimonials />
      <FooterOne />
    </Layout>
  );
}
