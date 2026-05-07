import { useCallback, useEffect, useMemo, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import Layout from "../gotur/layout/Layout/Layout";
import ManagerHeader from "./ManagerHeader";
import ManagerHeaderCloned from "./ManagerHeaderCloned";
import { isManagerNavActive, MANAGER_ROUTES } from "./managerNav";
import apiClient from "../../services/apiClient";
import { BASE_URL } from "../../services/apiClient";

function resolveHotelImageUrl(url) {
  if (!url) return null;
  const t = (url + "").trim();
  if (t.startsWith("http://") || t.startsWith("https://")) return encodeURI(t);
  const path = t.startsWith("/") ? t : `/${t}`;
  const base = (BASE_URL || "").replace(/\/?$/, "");
  return base ? encodeURI(`${base}${path}`) : encodeURI(path);
}

export default function ManagerGoturDashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hotels, setHotels] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [hRes, bRes] = await Promise.all([
        apiClient.get("/manager/hotels"),
        apiClient.get("/manager/bookings"),
      ]);
      setHotels(hRes.data || []);
      setBookings(bRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  const handleLogout = () => {
    localStorage.removeItem("managerAccessToken");
    localStorage.removeItem("managerRefreshToken");
    navigate("/manager/login");
  };

  const activeCount = useMemo(() => hotels.filter((h) => h.status === "ACTIVE").length, [hotels]);
  const inactiveCount = useMemo(() => hotels.filter((h) => h.status === "DRAFT").length, [hotels]);

  const recentHotels = useMemo(() => {
    return [...hotels]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [hotels]);

  /** Full-width guest-style room preview: no manager sidebar, headers, or listing chrome */
  const isManagerRoomGuestPreview = /^\/manager\/dashboard\/hotels\/[^/]+\/rooms\/[^/]+$/.test(location.pathname);

  const categories = [
    { to: MANAGER_ROUTES.bookings, label: "Our Bookings", count: bookings.length },
    { to: MANAGER_ROUTES.hotelsActive, label: "Active Hotels", count: activeCount },
    { to: MANAGER_ROUTES.hotelsInactive, label: "Inactive Hotels", count: inactiveCount },
    { to: MANAGER_ROUTES.hotelsNew, label: "Create New Hotels", count: null },
    { to: MANAGER_ROUTES.income, label: "Income", count: null },
    { to: MANAGER_ROUTES.payoutAccount, label: "Payout Account", count: null },
  ];

  if (isManagerRoomGuestPreview) {
    return (
      <Layout>
        <Outlet context={{ hotels, bookings, loading, refreshDashboard }} />
      </Layout>
    );
  }

  return (
    <Layout>
      <style>{`
        .sidebar__categories a.manager-sidebar-active {
          color: var(--gotur-base, #c29d48) !important;
          font-weight: 600;
        }
      `}</style>
      <ManagerHeader onLogout={handleLogout} />
      <ManagerHeaderCloned onLogout={handleLogout} />

      <section className="blog-page section-space">
        <Container>
          <Row className="gutter-y-40">
            <Col lg={4}>
              <div className="sidebar">
                <aside className="widget-area">
                  <div className="sidebar__categories-wrapper sidebar__single wow fadeInUp animated">
                    <h4 className="sidebar__title">Categories</h4>
                    <ul className="sidebar__categories list-unstyled">
                      {categories.map((cat) => (
                        <li key={cat.to}>
                          <Link
                            to={cat.to}
                            className={isManagerNavActive(cat.to, location.pathname) ? "manager-sidebar-active" : ""}
                          >
                            {cat.label}
                            {cat.count != null ? <span>({cat.count})</span> : null}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="sidebar__posts-wrapper sidebar__single wow fadeInUp animated">
                    <h4 className="sidebar__title">Recent Hotels</h4>
                    {loading ? (
                      <p className="text-muted small mb-0">Loading…</p>
                    ) : recentHotels.length === 0 ? (
                      <p className="text-muted small mb-0">No hotels yet.</p>
                    ) : (
                      <ul className="sidebar__posts list-unstyled">
                        {recentHotels.map((h) => {
                          const coverImg =
                            h.images?.find((img) => img.isCover) || h.images?.[0];
                          const src = coverImg ? resolveHotelImageUrl(coverImg.url) : null;
                          const roomsPath = `/manager/dashboard/hotels/${h.id}`;
                          return (
                            <li key={h.id} className="sidebar__posts__item">
                              <div className="sidebar__posts__image">
                                {src ? (
                                  <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                ) : (
                                  <div
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      background: "#e9ecef",
                                      fontSize: "10px",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      color: "#6c757d",
                                    }}
                                  >
                                    —
                                  </div>
                                )}
                              </div>
                              <div className="sidebar__posts__content">
                                <div className="sidebar__posts__meta">
                                  <Link to={roomsPath}>
                                    <span className="sidebar__posts__meta__icon">
                                      <i className="icon-calendar"></i>
                                    </span>
                                    {new Date(h.createdAt).toLocaleDateString()}
                                  </Link>
                                </div>
                                <h4 className="sidebar__posts__title">
                                  <Link to={roomsPath}>{h.name}</Link>
                                </h4>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </aside>
              </div>
            </Col>
            <Col lg={8}>
              <Outlet context={{ hotels, bookings, loading, refreshDashboard }} />
            </Col>
          </Row>
        </Container>
      </section>
    </Layout>
  );
}
