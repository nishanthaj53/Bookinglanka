import React from "react";
import { Link, useLocation } from "react-router-dom";

import GetInTouchNavLink from "../../common/GetInTouchNavLink";
import { navItems } from "../../../../data/navItems";
import mainLogo from "../../../../assets/images/logo-dark.png";
import useStore from "../../../../store/useStore";
import { SITE_CONTACT } from "../../../../data/siteContact";

export default function HeaderInner() {
  const { pathname } = useLocation();
  const { changeSearchPopupStatus, changeMobileDrawerTwoStatus, mobileDrawerTwoStatus } = useStore();

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
    <header className="main-header main-header--two sticky-header sticky-header--normal">
      <div className="container-fluid">
        <div className="main-header__inner">

          {/* Logo */}
          <div className="main-header__logo logo-retina">
            <Link to="/">
              <img
                src={mainLogo}
                alt="Booking Lanka"
                width="160"
                height="45"
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="main-header__nav main-menu">
            <ul className="main-menu__list">
              {navItems.map((item) => (
                <li
                  key={item.id}
                  className={`${item.subMenu ? "dropdown" : ""} ${
                    item.link && pathname.includes(item.link) ? "current" : ""
                  }`}
                >
                  <Link to={item.link || "#"}>{item.title}</Link>
                  {item.subMenu && renderSubMenu(item.subMenu)}
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Section */}
          <div className="main-header__right">

            <div className="main-header__info">
              <a
                href="#"
                className="search-toggler main-header__info__item"
                onClick={(e) => {
                  e.preventDefault();
                  changeSearchPopupStatus();
                }}
              >
                <i className="icon-search-interface-symbol"></i>
                <span className="sr-only">Search</span>
              </a>

              <Link to="/cart" className="main-header__info__item">
                <i className="icon-shopping-carts"></i>
                <span className="sr-only">Cart</span>
              </Link>
            </div>

            <GetInTouchNavLink className="gotur-btn main-header__btn" />

            <a
              className="main-header__call"
              href={SITE_CONTACT.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp us"
            >
              <div className="main-header__call__icon">
                <i className="icon-telephone"></i>
              </div>
              <div className="main-header__call__content">
                <span className="main-header__call__subtitle">WhatsApp us</span>
                <span className="main-header__call__number">{SITE_CONTACT.phone}</span>
              </div>
            </a>

            <div
              className={`mobile-nav__btn mobile-nav__toggler${
                mobileDrawerTwoStatus ? " is-open" : ""
              }`}
              onClick={changeMobileDrawerTwoStatus}
              aria-label={mobileDrawerTwoStatus ? "Close menu" : "Open menu"}
              aria-expanded={mobileDrawerTwoStatus}
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
}
