import { useEffect } from "react";

import TopbarOne from "../../components/gotur/common/TopbarOne/TopbarOne";
import HeaderTwo from "../../components/gotur/layout/HeaderTwo/HeaderTwo";
import HeaderTwoCloned from "../../components/gotur/layout/HeaderTwoCloned/HeaderTwoCloned";
import FooterOne from "../../components/gotur/layout/FooterOne/FooterOne";
import Layout from "../../components/gotur/layout/Layout/Layout";
import DestinationDetails from "../../components/gotur/sections/DestinationDetails/DestinationSigirya";

export const metadata = {
  title: "Destination Details || Booking Lanka",
  description:
    "Gotur is a modern travel & tour booking NextJS Template. It is perfect for travel agencies, tour operators, trip holiday booking websites, adventure and booking companies looking for a unique and intuitive search function and all other travel & tourism websites and businesses.",
  icons: {
    icon: "/favicon-32x32.png",
  },
};

export default function DestinationDetailsPage() {
  return (
    <Layout>
      <TopbarOne />
      <HeaderTwo />
      <HeaderTwoCloned/>
      <DestinationDetails />
      <FooterOne />
    </Layout>
  );
}