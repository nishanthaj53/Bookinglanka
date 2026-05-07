import { Link } from "react-router-dom";

export default function AiPlannerTeaser() {
  return (
    <section className="section-space" style={{ paddingTop: 20, paddingBottom: 20 }}>
      <div className="container">
        <div
          style={{
            borderRadius: 16,
            border: "1px solid #e5e7eb",
            padding: "20px 22px",
            background: "linear-gradient(90deg,#f7fbf5,#ffffff)",
          }}
        >
          <div className="row align-items-center g-3">
            <div className="col-lg-8">
              <h3 style={{ marginBottom: 8 }}>AI Trip Planner</h3>
              <p style={{ marginBottom: 8, color: "#4b5563" }}>
                Get day-by-day travel suggestions, destination map flow, nearby hotels and total trip estimate.
              </p>
              <ul style={{ marginBottom: 0, color: "#374151", paddingLeft: 18 }}>
                <li>Smart destination route (Day 1 to Day N)</li>
                <li>Hotel suggestions from your platform</li>
                <li>One-click proceed to full planner</li>
              </ul>
            </div>
            <div className="col-lg-4 text-lg-end">
              <div style={{ fontSize: 48, marginBottom: 8 }}>🧭</div>
              <Link to="/ai-planner" className="gotur-btn">
                Open AI Planner
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
