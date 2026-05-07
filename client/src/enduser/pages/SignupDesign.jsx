import { useEffect } from "react";

import TopbarOne from "../../components/gotur/common/TopbarOne/TopbarOne";
import HeaderTwo from "../../components/gotur/layout/HeaderTwo/HeaderTwo";
import HeaderTwoCloned from "../../components/gotur/layout/HeaderTwoCloned/HeaderTwoCloned";
import FooterOne from "../../components/gotur/layout/FooterOne/FooterOne";
import Layout from "../../components/gotur/layout/Layout/Layout";
import PageHeader from "../../components/gotur/sections/PageHeader/PageHeader";
import SignupSection from "../../components/gotur/sections/LoginSection/SignupSection";


export default function SignInPage() {
  useEffect(() => {
    document.title = "Sign In || Booking Lanka";

    const metaDesc = document.querySelector("meta[name='description']");
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Booking Lanka is a modern travel & tour booking platform. It is perfect for travel agencies, tour operators, and booking businesses."
      );
    }
  }, []);

  return (
    <Layout>
      <TopbarOne />
      <HeaderTwo />
      <HeaderTwoCloned />
      {/* <PageHeader title="Sign In" subTitle="Sign In" /> */}
      <SignupSection />
      <FooterOne />
    </Layout>
  );
}
