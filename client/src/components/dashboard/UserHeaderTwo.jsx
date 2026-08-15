import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import GetInTouchNavLink from "../gotur/common/GetInTouchNavLink";
import logo from "../../assets/images/logo-dark.png";
import { SITE_CONTACT } from "../../data/siteContact";
import useStore from "../../store/useStore";

/**
 * Same shell as landing HeaderTwo, with authenticated primary links.
 */
export default function UserHeaderTwo({ onLogout, cloned = false }) {
  const location = useLocation();
  const [isSticky, setIsSticky] = useState(false);
  const changeMobileDrawerTwoStatus = useStore(
    (state) => state.changeMobileDrawerTwoStatus
  );
  const mobileDrawerTwoStatus = useStore((state) => state.mobileDrawerTwoStatus);

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

            <a
              className="main-header__call"
              href={SITE_CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp us"
            >
              <div className="main-header__call__icon">
                <i className="icon-telephone" />
              </div>
              <div className="main-header__call__content">
                <span className="main-header__call__subtitle">WhatsApp us</span>
                <span className="main-header__call__number">{SITE_CONTACT.phone}</span>
              </div>
            </a>

            <button
              type="button"
              className={`mobile-nav__btn mobile-nav__toggler${
                mobileDrawerTwoStatus ? " is-open" : ""
              }`}
              aria-label={mobileDrawerTwoStatus ? "Close menu" : "Open menu"}
              aria-expanded={mobileDrawerTwoStatus}
              onClick={changeMobileDrawerTwoStatus}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
