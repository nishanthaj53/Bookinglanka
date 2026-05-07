import React from "react";
import { Link, useLocation } from "react-router-dom";
import { navItems, headerOneNavItems } from "../../../../data/navItems";
import DemoPages from "../../common/DemoPages/DemoPages";
import GetInTouchNavLink from "../../common/GetInTouchNavLink";

const HeaderOne = () => {
  const location = useLocation();
  const pathname = location.pathname; 

  // 🔧 TEMP replacements for Gotur store (safe no-op)
  const changeSearchPopupStatus = () => {};
  const changeMobileDrawerStatus = () => {};
  const changeSideBarDrawerStatus = () => {};

  const renderSubMenu = (subMenu = []) => (
    <ul>
      {subMenu.map((item, index) => (
        <li key={index} className={item.subMenu ? "dropdown" : ""}>
          <Link to={item.link || "#"}>{item.title}</Link>
          {item.subMenu && renderSubMenu(item.subMenu)}
        </li>
      ))}
    </ul>
  );

  const nav =
    pathname === "/home1-one" || pathname === "/home3-one"
      ? headerOneNavItems
      : navItems;

  return (
    <header className="main-header main-header--one sticky-header sticky-header--normal">
      <div className="container-fluid">
        <div className="main-header__inner">
          {/* LOGO */}
          <div className="main-header__logo logo-retina">
            <Link to="/">
              <img
                src="/images/logo-dark.png"
                alt="Gotur"
                width="160"
                height="45"
              />
            </Link>
          </div>

          <div className="main-header__right">
            {/* NAV */}
            <nav className="main-header__nav main-menu">
              <ul className="main-menu__list">
                <li className="dropdown megamenu">
                  <Link to="/">Home</Link>
                  <DemoPages />
                </li>

                {nav.map((item) => (
                  <li
                    key={item.id}
                    className={`${item.subMenu ? "dropdown" : ""} ${
                      pathname === item.link ? "current" : ""
                    }`}
                  >
                    <Link to={item.link || "#"}>{item.title}</Link>
                    {item.subMenu && renderSubMenu(item.subMenu)}
                  </li>
                ))}
              </ul>
            </nav>

            {/* ICONS */}
            <div className="main-header__info">
              <button
                className="search-toggler main-header__info__item"
                onClick={changeSearchPopupStatus}
              >
                <i className="icon-search-interface-symbol"></i>
                <span className="sr-only">Search</span>
              </button>

              <Link to="/cart" className="main-header__info__item">
                <i className="icon-shopping-carts"></i>
                <span className="sr-only">Cart</span>
              </Link>
            </div>

            {/* SIDEBAR */}
            <div
              className="main-header__btn-popup main-header__element__btn"
              onClick={changeSideBarDrawerStatus}
            >
              <i className="icon-menu-bar"></i>
            </div>

            <GetInTouchNavLink className="gotur-btn main-header__btn" />

            {/* MOBILE */}
            <div
              className="mobile-nav__btn mobile-nav__toggler"
              onClick={changeMobileDrawerStatus}
            >
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderOne;
