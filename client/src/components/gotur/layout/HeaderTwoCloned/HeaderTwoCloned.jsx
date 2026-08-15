import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import GetInTouchNavLink from "../../common/GetInTouchNavLink";
import { navItems } from "../../../../data/navItems";
import useStore from "../../../../store/useStore";
import main_logo from "./../../../../assets/images/logo-dark.png";

const HeaderTwoCloned = () => {
  const location = useLocation();
  const [isSticky, setIsSticky] = useState(false);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const [destinations, setDestinations] = useState([]);
  const changeMobileDrawerTwoStatus = useStore(
    (state) => state.changeMobileDrawerTwoStatus
  );
  const mobileDrawerTwoStatus = useStore((state) => state.mobileDrawerTwoStatus);

  useEffect(() => {
    const onScroll = () => {
      setIsSticky(window.scrollY > 500);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let mounted = true;
    async function loadDestinations() {
      try {
        const res = await fetch(`${API_BASE}/destinations`);
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) setDestinations(Array.isArray(data) ? data : []);
      } catch {
        if (mounted) setDestinations([]);
      }
    }
    loadDestinations();
    return () => {
      mounted = false;
    };
  }, [API_BASE]);

  const dynamicNavItems = useMemo(() => {
    if (!destinations.length) return navItems;
    return navItems.map((item) => {
      if (String(item.title || "").toLowerCase() !== "destination") return item;
      return {
        ...item,
        subMenu: destinations.map((destination) => ({
          id: destination.id,
          title: destination.name,
          link: `/destinations/${destination.slug}`,
        })),
      };
    });
  }, [destinations]);

  const renderSubMenu = (subMenu) => (
    <ul>
      {subMenu.map((item, index) => (
        <li key={index} className={item.subMenu ? "dropdown" : ""}>
          <Link to={item.link || "#"}>{item.title}</Link>
          {item.subMenu && renderSubMenu(item.subMenu)}
        </li>
      ))}
    </ul>
  );

  return (
    <header
      className={`main-header main-header--two sticky-header sticky-header--normal sticky-header--cloned ${
        isSticky ? "active" : ""
      }`}
    >
      <div className="container-fluid">
        <div className="main-header__inner">
          <div className="main-header__brand">
            <div className="main-header__logo logo-retina">
              <Link to="/">
                <img
                  src={main_logo}
                  alt="Booking Lanka"
                  width="160"
                  height="45"
                />
              </Link>
            </div>
          </div>

          <nav className="main-header__nav main-header__nav--two main-menu">
            <ul className="main-menu__list">
              <li>
                <Link to="/">Home</Link>
              </li>

              {dynamicNavItems.map((item) => (
                <li
                  key={item.id}
                  className={`${item.subMenu ? "dropdown" : ""} ${
                    item.link &&
                    item.link !== "/#properties" &&
                    location.pathname.includes(item.link)
                      ? "current"
                      : ""
                  }`}
                >
                  <Link to={item.link || "#"}>{item.title}</Link>
                  {item.subMenu && renderSubMenu(item.subMenu)}
                </li>
              ))}
            </ul>
          </nav>

          <div className="main-header__right">
            <GetInTouchNavLink className="gotur-btn main-header__btn" />

            <button
              type="button"
              className={`mobile-nav__btn mobile-nav__toggler${
                mobileDrawerTwoStatus ? " is-open" : ""
              }`}
              aria-label={mobileDrawerTwoStatus ? "Close menu" : "Open menu"}
              aria-expanded={mobileDrawerTwoStatus}
              onClick={changeMobileDrawerTwoStatus}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>

            <div className="main-header__call">
              <div className="main-header__call__icon">
                <i className="icon-paper-plane"></i>
              </div>
              <div className="main-header__call__content">
                <span className="main-header__call__subtitle">
                  AI Trip Planner
                </span>
                <Link to="/ai-planner">Start Planning</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderTwoCloned;
