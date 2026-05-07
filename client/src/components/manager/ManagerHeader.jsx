import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo-dark.png";
import { isManagerNavActive, MANAGER_HEADER_LINKS, MANAGER_ROUTES } from "./managerNav";

export default function ManagerHeader({ onLogout }) {
  const location = useLocation();

  return (
    <header className="main-header main-header--two sticky-header sticky-header--normal">
      <div className="container-fluid">
        <div className="main-header__inner">
          <div className="main-header__logo logo-retina">
            <Link to={MANAGER_ROUTES.hotelsActive}>
              <img src={logo} alt="Booking Lanka Manager" width={160} height={45} />
            </Link>
          </div>

          <nav className="main-header__nav main-header__nav--two main-menu" style={{ display: "block" }}>
            <ul className="main-menu__list">
              {MANAGER_HEADER_LINKS.map((item) => (
                <li key={item.to} className={isManagerNavActive(item.to, location.pathname) ? "current" : ""}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onClick={onLogout}
                  className="gotur-btn"
                  style={{ border: "none", background: "transparent", cursor: "pointer", padding: "0.5rem 0", color: "inherit", font: "inherit" }}
                >
                  Logout
                </button>
              </li>
            </ul>
          </nav>

          <div className="main-header__right">
            <Link to={MANAGER_ROUTES.hotelsNew} className="gotur-btn main-header__btn">
              New Hotel <i className="icon-arrow-right"></i>
            </Link>
            <div className="mobile-nav__btn mobile-nav__toggler">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
