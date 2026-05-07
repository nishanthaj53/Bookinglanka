import { Link } from "react-router-dom";
import Layout from "../../components/gotur/layout/Layout/Layout";
import TopbarOne from "../../components/gotur/common/TopbarOne/TopbarOne";
import HeaderTwo from "../../components/gotur/layout/HeaderTwo/HeaderTwo";
import HeaderTwoCloned from "../../components/gotur/layout/HeaderTwoCloned/HeaderTwoCloned";
import FooterOne from "../../components/gotur/layout/FooterOne/FooterOne";

const ROLE_CARDS = [
  {
    id: "guest",
    title: "Guest - Book Stays",
    subtitle: "Discover destinations and reserve your ideal hotel stay.",
    to: "/login",
    image: "/images/login/user-sri-lanka.jpg",
    accent: "#f7931e",
  },
  {
    id: "manager",
    title: "Hotel Manager",
    subtitle: "Manage rooms, availability, booking requests and revenue.",
    to: "/manager/login",
    image: "/images/login/manager-hotel.jpg",
    accent: "#2d6a4f",
  },
  {
    id: "admin",
    title: "Administrator",
    subtitle: "Control platform operations, users, hotels and destinations.",
    to: "/admin/login",
    image: "/images/login/admin-system.jpg",
    accent: "#63ab45",
  },
];

export default function AccountEntry() {
  return (
    <Layout>
      <TopbarOne />
      <HeaderTwo />
      <HeaderTwoCloned />
      <section className="blog-page section-space" style={{ minHeight: "60vh" }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-11 col-xl-10">
              <h1 className="mb-2" style={{ fontWeight: 800 }}>
                Sign in to your account
              </h1>
              <p className="text-muted mb-4" style={{ maxWidth: "36rem", lineHeight: 1.55 }}>
                Choose how you use Booking Lanka. After you sign in, use <strong>Get in touch</strong> in the header to return
                straight to your dashboard.
              </p>
              <div className="row g-3">
                {ROLE_CARDS.map((card) => (
                  <div className="col-lg-4 col-md-6" key={card.id}>
                    <Link
                      to={card.to}
                      className="d-block"
                      style={{
                        textDecoration: "none",
                        borderRadius: 16,
                        overflow: "hidden",
                        border: "1px solid #e5e7eb",
                        position: "relative",
                        minHeight: 330,
                        backgroundImage: `linear-gradient(90deg, rgba(17,24,39,.72), rgba(17,24,39,.28)), url(${card.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        transition: "transform .25s ease, box-shadow .25s ease, border-color .25s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow = "0 12px 28px rgba(0,0,0,.22)";
                        e.currentTarget.style.borderColor = card.accent;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "none";
                        e.currentTarget.style.boxShadow = "none";
                        e.currentTarget.style.borderColor = "#e5e7eb";
                      }}
                    >
                      <div style={{ padding: "22px 20px", color: "#fff", maxWidth: "100%" }}>
                        <h3 style={{ marginBottom: 8, fontWeight: 800 }}>{card.title}</h3>
                        <p style={{ marginBottom: 14, color: "rgba(255,255,255,.9)" }}>{card.subtitle}</p>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "8px 14px",
                            borderRadius: 999,
                            background: card.accent,
                            color: "#fff",
                            fontWeight: 700,
                          }}
                        >
                          Continue
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
              <p className="small text-muted mt-4 mb-0">
                <Link to="/">← Back to home</Link>
                {" · "}
                <Link to="/contact">Contact us</Link>
              </p>
            </div>
          </div>
        </div>
      </section>
      <FooterOne />
    </Layout>
  );
}
