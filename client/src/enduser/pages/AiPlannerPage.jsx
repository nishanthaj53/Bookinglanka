import Layout from "../../components/gotur/layout/Layout/Layout";
import TopbarOne from "../../components/gotur/common/TopbarOne/TopbarOne";
import HeaderTwo from "../../components/gotur/layout/HeaderTwo/HeaderTwo";
import HeaderTwoCloned from "../../components/gotur/layout/HeaderTwoCloned/HeaderTwoCloned";
import FooterOne from "../../components/gotur/layout/FooterOne/FooterOne";
import TripPlannerWidget from "../components/TripPlannerWidget";
import DestinationExplorerSection from "../components/DestinationExplorerSection";

export default function AiPlannerPage() {
  return (
    <Layout>
      <TopbarOne />
      <HeaderTwo />
      <HeaderTwoCloned />
      <section className="section-space" style={{ paddingBottom: 12 }}>
        <div className="container">
          <div className="sec-title text-center" style={{ marginBottom: 18 }}>
            <h3 className="sec-title__title">
              AI Agent Planner <span>✨</span>
            </h3>
          </div>
          <TripPlannerWidget />
        </div>
      </section>
      <DestinationExplorerSection />
      <FooterOne />
    </Layout>
  );
}
