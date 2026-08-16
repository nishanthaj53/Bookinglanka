import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/** Always open a new route at the top so users never land on the footer. */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    const toTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    toTop();
    const frame = requestAnimationFrame(toTop);
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
