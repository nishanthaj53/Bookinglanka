import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import GetInTouchNavLink from "../gotur/common/GetInTouchNavLink";
import logo from "../../assets/images/logo-dark.png";

/**
 * Same shell as landing HeaderTwo, with authenticated primary links.
 */
export default function UserHeaderTwo({ onLogout, cloned = false }) {
  const location = useLocation();
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    if (!cloned) return undefined;
    const onScroll = () => setIsSticky(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [cloned]);

  const isHotels = location.pathname.startsWith("/dashboard/hotels");
  const isBookings = location.pathname.startsWith("/dashboard/bookings");
  const isFavouriteDestination = location.pathname.startsWith("/dashboard/favourite-destination");

  const headerClass = [
    "main-header",
    "main-header--two",
    "main-header--user-dashboard",
    "sticky-header",
    "sticky-header--normal",
    cloned ? "sticky-header--cloned" : "",
    cloned && isSticky ? "active" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={headerClass}>
      <div className="container-fluid">
        <div className="main-header__inner">
          <div className="main-header__logo logo-retina">
            <Link to="/">
              <img src={logo} alt="Booking Lanka" width="160" height="45" />
            </Link>
          </div>

          <nav className="main-header__nav main-header__nav--two main-menu" style={{ display: "block" }}>
            <ul className="main-menu__list">
              <li className="dropdown megamenu">
                <Link to="/">Home</Link>
              </li>
              <li className={isHotels && !isFavouriteDestination ? "current" : ""}>
                <Link to="/dashboard/hotels">Hotels</Link>
              </li>
              <li className={isBookings ? "current" : ""}>
                <Link to="/dashboard/bookings">My bookings</Link>
              </li>
              <li className={isFavouriteDestination ? "current" : ""}>
                <Link to="/dashboard/favourite-destination">Favourite destination</Link>
              </li>
              <li>
                <a
                  href="#logout"
                  onClick={(e) => {
                    e.preventDefault();
                    onLogout?.();
                  }}
                >
                  Logout
                </a>
              </li>
            </ul>
          </nav>

          <div className="main-header__right">
            <GetInTouchNavLink className="gotur-btn main-header__btn" />

            <div className="main-header__call">
              <div className="main-header__call__icon">
                <i className="icon-telephone" />
              </div>
              <div className="main-header__call__content">
                <span className="main-header__call__subtitle">Call us now</span>
                <a href="tel:+94112020400">+94 11 2020 400</a>
              </div>
            </div>

            <div className="mobile-nav__btn mobile-nav__toggler" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
