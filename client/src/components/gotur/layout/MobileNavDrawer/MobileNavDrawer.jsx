import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import useStore from "../../../../store/useStore";
import { navItems } from "../../../../data/navItems";
import logo from "../../../../assets/images/logo-light.png";

export default function MobileNavDrawer() {
  const { mobileDrawerTwoStatus, changeMobileDrawerTwoStatus } = useStore();
  const [destinations, setDestinations] = useState([]);
  const [openItemId, setOpenItemId] = useState(null);
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

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

  const items = useMemo(() => {
    const withHome = [{ id: "home", title: "Home", link: "/" }, ...navItems];
    if (!destinations.length) return withHome;
    return withHome.map((item) => {
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

  useEffect(() => {
    document.body.style.overflow = mobileDrawerTwoStatus ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileDrawerTwoStatus]);

  const close = () => changeMobileDrawerTwoStatus();

  return (
    <div className={`mobile-nav__wrapper ${mobileDrawerTwoStatus ? "expanded" : ""}`}>
      <div className="mobile-nav__overlay" onClick={close} />
      <div className="mobile-nav__content">
        <button type="button" className="mobile-nav__close" onClick={close} aria-label="Close menu">
          <i className="fa fa-times" />
        </button>

        <div className="logo-box">
          <Link to="/" aria-label="Booking Lanka" onClick={close}>
            <img src={logo} width={155} height={41} alt="Booking Lanka" />
          </Link>
        </div>

        <div className="mobile-nav__container">
          <ul className="main-menu__list">
            {items.map((item) => {
              const hasSub = Array.isArray(item.subMenu) && item.subMenu.length > 0;
              const isOpen = openItemId === item.id;
              return (
                <li key={item.id} className={hasSub ? "dropdown" : ""}>
                  {hasSub ? (
                    <a
                      href={item.link || "#"}
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenItemId(isOpen ? null : item.id);
                      }}
                    >
                      {item.title}
                    </a>
                  ) : (
                    <Link to={item.link || "#"} onClick={close}>
                      {item.title}
                    </Link>
                  )}
                  {hasSub && (
                    <ul className={isOpen ? "open" : "close"}>
                      {item.subMenu.map((sub) => (
                        <li key={sub.id}>
                          <Link to={sub.link || "#"} onClick={close}>
                            {sub.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
