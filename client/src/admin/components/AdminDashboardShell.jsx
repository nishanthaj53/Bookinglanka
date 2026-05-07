import { useLayoutEffect, useMemo, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import AdminDashboardTopNav from "./AdminDashboardTopNav";
import AdminDashboardGoturTopbar from "./AdminDashboardGoturTopbar";
import { filterAdminNav, adminNavPathIsActive } from "../adminNavConfig";
import "../admin-dashboard-shell.css";

const ROUTE_TITLES = [
  { match: "/admin/dashboard/hotels/active", title: "Active hotels", sub: "Admin" },
  { match: "/admin/dashboard/hotels/draft", title: "Draft hotels", sub: "Admin" },
  { match: "/admin/dashboard/bookings", title: "Bookings", sub: "Admin" },
  { match: "/admin/dashboard/members/users", title: "Users", sub: "Members" },
  { match: "/admin/dashboard/members/managers", title: "Branch managers", sub: "Members" },
  { match: "/admin/dashboard/destinations", title: "Destinations", sub: "Content" },
  { match: "/admin/dashboard/revenue", title: "Revenue & stats", sub: "Admin" },
];

export default function AdminDashboardShell({ navItems, onLogout }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [filter, setFilter] = useState("");
  /** Sidebar accordion: which groups (Hotels, Members) are expanded */
  const [openSidebarGroups, setOpenSidebarGroups] = useState(() => new Set());

  useLayoutEffect(() => {
    setOpenSidebarGroups((prev) => {
      const next = new Set(prev);
      navItems.forEach((item) => {
        if (item.children && adminNavPathIsActive(location.pathname, item)) {
          next.add(item.label);
        }
      });
      return next;
    });
  }, [location.pathname, navItems]);

  const header = useMemo(() => {
    const path = location.pathname.replace(/\/$/, "") || "/admin/dashboard";
    const hit = [...ROUTE_TITLES]
      .sort((a, b) => b.match.length - a.match.length)
      .find((r) => path === r.match || path.startsWith(`${r.match}/`));
    return hit || { title: "Admin panel", sub: "Dashboard" };
  }, [location.pathname]);

  const filteredNav = useMemo(() => filterAdminNav(navItems, filter), [navItems, filter]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const toggleSidebarGroup = (label) => {
    setOpenSidebarGroups((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  return (
    <div className="page-wrapper admin-dashboard-shell" dir="ltr">
      <AdminDashboardGoturTopbar pageTitle={header.title} />
      <AdminDashboardTopNav
        navItems={navItems}
        onLogout={onLogout}
        pageTitle={header.title}
        subTitle={header.sub}
      />

      <div className="admin-dashboard-shell__toolbar">
        <button
          type="button"
          className="gotur-btn"
          style={{ padding: "10px 20px", fontSize: "13px" }}
          onClick={() => setSidebarOpen(true)}
        >
          Menu
        </button>
      </div>

      <div
        className={`admin-dashboard-shell__overlay ${sidebarOpen ? "is-open" : ""}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      <section className="admin-dashboard-shell__body">
        <Container>
          <Row className="justify-content-center gutter-y-40 admin-dashboard-shell__row">
            <Col lg={3}>
              <aside className={`product__sidebar admin-dashboard-sidebar ${sidebarOpen ? "is-open" : ""}`}>
                <div className="product__search-box product__sidebar__item">
                  <Form className="product__search" onSubmit={handleSearch}>
                    <Form.Control
                      type="text"
                      name="search"
                      placeholder="Filter sections"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      autoComplete="off"
                    />
                    <Button variant="outline-secondary" type="submit" aria-label="Search">
                      <span className="icon-search" />
                    </Button>
                  </Form>
                </div>

                <div className="product__categories product__sidebar__item">
                  <h3 className="product__sidebar__title product__categories__title">Panel sections</h3>
                  <ul className="list-unstyled">
                    {filteredNav.map((item) =>
                      item.children ? (
                        <li key={item.label} className="admin-sidebar-group">
                          <button
                            type="button"
                            className={`admin-sidebar-accordion__trigger${openSidebarGroups.has(item.label) ? " is-open" : ""}${adminNavPathIsActive(location.pathname, item) ? " has-active-child" : ""}`}
                            aria-expanded={openSidebarGroups.has(item.label)}
                            onClick={() => toggleSidebarGroup(item.label)}
                          >
                            <span>{item.label}</span>
                            <span className="admin-sidebar-accordion__chevron" aria-hidden="true">
                              ▼
                            </span>
                          </button>
                          <div
                            className={`admin-sidebar-accordion__panel${openSidebarGroups.has(item.label) ? " is-open" : ""}`}
                          >
                            <ul className="list-unstyled admin-sidebar-group__list">
                              {item.children.map((c) => (
                                <li key={c.to}>
                                  <NavLink
                                    to={c.to}
                                    end
                                    onClick={() => setSidebarOpen(false)}
                                    className={({ isActive }) =>
                                      `admin-sidebar-nav-link admin-sidebar-nav-link--nested${isActive ? " is-active" : ""}`
                                    }
                                  >
                                    <span className="admin-sidebar-nav-link__icon product-categories__icon">‹</span>
                                    {c.label}
                                  </NavLink>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </li>
                      ) : (
                        <li key={item.to}>
                          <NavLink
                            to={item.to}
                            end
                            onClick={() => setSidebarOpen(false)}
                            className={({ isActive }) =>
                              `admin-sidebar-nav-link${isActive ? " is-active" : ""}`
                            }
                          >
                            <span className="admin-sidebar-nav-link__icon product-categories__icon">‹</span>
                            {item.label}
                          </NavLink>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div className="product__sidebar__item" style={{ paddingTop: 8 }}>
                  <button type="button" className="gotur-btn admin-dashboard-sidebar__logout" onClick={onLogout}>
                    Logout
                  </button>
                </div>
              </aside>
            </Col>

            <Col lg={9}>
              <Outlet />
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}
