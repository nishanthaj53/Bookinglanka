import { Link, NavLink, useLocation } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";
import { adminNavPathIsActive } from "../adminNavConfig";

/**
 * Compact sticky bar with dropdown groups (Hotels, Members).
 */
export default function AdminDashboardTopNav({ navItems, onLogout, pageTitle, subTitle = "Admin" }) {
  const location = useLocation();

  return (
    <header className="admin-dashboard-topnav">
      <div className="container">
        <div className="admin-dashboard-topnav__main">
          <Link to="/admin/dashboard/hotels/active" className="admin-dashboard-topnav__brand">
            Admin
          </Link>

          <nav className="admin-dashboard-topnav__links" aria-label="Admin sections">
            {navItems.map((item) => {
              if (item.children) {
                const open = adminNavPathIsActive(location.pathname, item);
                return (
                  <NavDropdown
                    key={item.label}
                    title={item.label}
                    id={`admin-nav-${item.label.replace(/\s+/g, "-")}`}
                    className={`admin-dashboard-topnav__dropdown${open ? " is-child-active" : ""}`}
                    align="start"
                    menuVariant="light"
                  >
                    {item.children.map((c) => (
                      <NavDropdown.Item key={c.to} as="div" className="p-0">
                        <NavLink
                          to={c.to}
                          end
                          className={({ isActive }) =>
                            "admin-dashboard-topnav__dd-link" + (isActive ? " is-active" : "")
                          }
                        >
                          {c.label}
                        </NavLink>
                      </NavDropdown.Item>
                    ))}
                  </NavDropdown>
                );
              }
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end
                  className={({ isActive }) =>
                    "admin-dashboard-topnav__link" + (isActive ? " is-active" : "")
                  }
                >
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="admin-dashboard-topnav__actions">
            <button type="button" className="admin-dashboard-topnav__logout" onClick={onLogout}>
              Logout
            </button>
          </div>
        </div>

        <div className="admin-dashboard-topnav__meta">
          <span className="admin-dashboard-topnav__page">{pageTitle}</span>
          <span className="admin-dashboard-topnav__crumb-sep" aria-hidden="true">
            ·
          </span>
          <span>{subTitle}</span>
        </div>
      </div>
    </header>
  );
}
