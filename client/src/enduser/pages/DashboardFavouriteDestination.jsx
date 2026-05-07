import FooterOne from "../../components/gotur/layout/FooterOne/FooterOne";
import TripPlannerWidget from "../components/TripPlannerWidget";
import DestinationExplorerSection from "../components/DestinationExplorerSection";

/**
 * Mirrors the public /ai-planner page (planner section + destination explorer + footer),
 * under the authenticated dashboard shell. AI and availability calls use apiClient (Bearer).
 */
export default function DashboardFavouriteDestination() {
  return (
    <div className="dashboard-page user-dash-favourite-page">
      <section className="section-space" style={{ paddingBottom: 12 }}>
        <div className="container">
          <div className="sec-title text-center" style={{ marginBottom: 18 }}>
            <h3 className="sec-title__title">
              AI Agent Planner <span>✨</span>
            </h3>
            <p className="text-muted small mb-0 mx-auto" style={{ maxWidth: "38rem" }}>
              You are signed in. Trip planning and “book all” actions run with your guest account (same tools as the
              public planner, authenticated requests).
            </p>
          </div>
          <TripPlannerWidget authenticatedPlanner />
        </div>
      </section>

      <DestinationExplorerSection />
      <FooterOne />
    </div>
  );
}
