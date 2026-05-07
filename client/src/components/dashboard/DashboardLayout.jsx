/**
 * Shared responsive dashboard layout: sidebar + top header.
 * Mobile: hamburger toggles sidebar overlay. Tablet/Laptop: sidebar visible.
 * Matches end-user design (gotur) styling.
 */
import { useState } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import "./dashboard-pages.css";

const defaultNavItems = [
  { to: "/dashboard/hotels", label: "Hotels", icon: "icon-hotel" },
  { to: "/dashboard/bookings", label: "My Bookings", icon: "icon-calendar" },
];

export default function DashboardLayout({
  title = "Dashboard",
  navItems = defaultNavItems,
  logoutLabel = "Logout",
  onLogout,
  basePath = "/dashboard",
  /** When false, no left sidebar — use in-page nav (e.g. user dashboard hotels header). */
  showSidebar = true,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (onLogout) onLogout();
    else {
      const loginPath = basePath.includes("/manager") ? "/manager/login" : basePath.includes("/admin") ? "/admin/login" : "/login";
      navigate(loginPath);
    }
  };

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <div className={`dashboard-layout${showSidebar ? " dashboard-layout--with-sidebar" : ""}`}>
      <style>{`
        .dashboard-layout { display: flex; min-height: 100vh; background: #f8f9fa; }
        .dashboard-layout__sidebar {
          width: 260px; background: #fff; border-right: 1px solid #e9ecef;
          display: flex; flex-direction: column; flex-shrink: 0;
          box-shadow: 2px 0 12px rgba(0,0,0,0.04);
        }
        .dashboard-layout__header {
          padding: 1rem 1.25rem; border-bottom: 1px solid #e9ecef;
          font-weight: 600; font-size: 1.1rem; color: #1a1a1a;
        }
        .dashboard-layout__nav { padding: 1rem 0; }
        .dashboard-layout__nav a, .dashboard-layout__nav button {
          display: flex; align-items: center; gap: 0.75rem;
          width: 100%; padding: 0.75rem 1.25rem; border: none; background: none;
          text-align: left; text-decoration: none; color: #495057;
          font-size: 0.95rem; cursor: pointer; transition: background 0.2s;
        }
        .dashboard-layout__nav a:hover, .dashboard-layout__nav button:hover {
          background: #f0f4f8; color: #0d6efd;
        }
        .dashboard-layout__nav a.active, .dashboard-layout__nav button.active {
          background: rgba(13, 110, 253, 0.08); color: #0d6efd; font-weight: 600;
          border-right: 3px solid #0d6efd;
        }
        .dashboard-layout__nav .icon { font-size: 1.1rem; opacity: 0.85; }
        .dashboard-layout__main {
          flex: 1; display: flex; flex-direction: column; min-width: 0;
        }
        .dashboard-layout__topbar {
          padding: 0.75rem 1.5rem; background: #fff; border-bottom: 1px solid #e9ecef;
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 0.75rem 1rem;
        }
        .dashboard-layout__menu-btn {
          display: none; background: none; border: 1px solid #dee2e6;
          padding: 0.5rem 0.75rem; border-radius: 6px; cursor: pointer;
          font-size: 1.25rem; color: #495057;
        }
        .dashboard-layout__content { flex: 1; padding: 1.5rem; }
        .dashboard-layout__topbar-nav {
          display: flex; flex-wrap: wrap; align-items: center; gap: 0.35rem 1.25rem;
          justify-content: flex-end;
        }
        .dashboard-layout__topbar-nav a {
          font-weight: 600; font-size: 0.95rem; color: #374151; text-decoration: none;
        }
        .dashboard-layout__topbar-nav a:hover { color: #0d6efd; }
        .dashboard-layout__topbar-nav a.is-active {
          color: #0d6efd; text-decoration: underline; text-underline-offset: 4px;
        }
        .dashboard-layout__topbar-logout {
          border: none; background: none; padding: 0;
          font-weight: 600; font-size: 0.95rem; color: #6c757d; cursor: pointer;
        }
        .dashboard-layout__topbar-logout:hover { color: #dc3545; }
        @media (max-width: 991px) {
          .dashboard-layout__sidebar {
            position: fixed; left: 0; top: 0; bottom: 0; z-index: 1050;
            transform: translateX(-100%); transition: transform 0.25s ease;
          }
          .dashboard-layout__sidebar.open { transform: translateX(0); }
          .dashboard-layout__overlay {
            display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.4);
            z-index: 1040;
          }
          .dashboard-layout__overlay.open { display: block; }
          .dashboard-layout--with-sidebar .dashboard-layout__menu-btn { display: block; }
        }
        @media (min-width: 992px) {
          .dashboard-layout__overlay { display: none !important; }
        }
      `}</style>

      {showSidebar ? (
        <>
          <aside className={`dashboard-layout__sidebar ${sidebarOpen ? "open" : ""}`}>
            <div className="dashboard-layout__header">{title}</div>
            <nav className="dashboard-layout__nav">
              {navItems.filter((n) => n.to).map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={isActive(item.to) ? "active" : ""}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className={`icon ${item.icon || "icon-list"}`} />
                  {item.label}
                </Link>
              ))}
              <button type="button" onClick={handleLogout} className="dashboard-layout__nav-logout">
                <span className="icon icon-logout" />
                {logoutLabel}
              </button>
            </nav>
          </aside>

          <div
            className={`dashboard-layout__overlay ${sidebarOpen ? "open" : ""}`}
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        </>
      ) : null}

      <div className="dashboard-layout__main">
        <header className="dashboard-layout__topbar">
          {showSidebar ? (
            <button
              type="button"
              className="dashboard-layout__menu-btn"
              onClick={() => setSidebarOpen((o) => !o)}
              aria-label="Toggle menu"
            >
              ☰
            </button>
          ) : (
            <span className="dashboard-layout__topbar-nav" style={{ fontWeight: 700, color: "#1a1a1a" }}>
              {title}
            </span>
          )}
          <nav className="dashboard-layout__topbar-nav" aria-label="Dashboard">
            {!showSidebar &&
              navItems
                .filter((n) => n.to)
                .map((item) => (
                  <Link key={item.to} to={item.to} className={isActive(item.to) ? "is-active" : ""}>
                    {item.label}
                  </Link>
                ))}
            {!showSidebar ? (
              <button type="button" className="dashboard-layout__topbar-logout" onClick={handleLogout}>
                {logoutLabel}
              </button>
            ) : null}
            <Link to="/" style={{ fontSize: "0.9rem", color: "#6c757d", fontWeight: 500 }}>
              ← Back to site
            </Link>
          </nav>
        </header>
        <main className="dashboard-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
