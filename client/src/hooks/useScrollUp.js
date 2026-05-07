import { useCallback, useEffect, useRef, useState } from "react";

export default function useScrollUp(scrollSize = 0) {
  const [scrollTop, setScrollTop] = useState(false);
  const lastScrollTop = useRef(0);

  const handleScroll = useCallback(() => {
    const currentScrollTop = window.scrollY;

    if (currentScrollTop > scrollSize) {
      if (currentScrollTop > lastScrollTop.current) {
        setScrollTop(false);
      } else {
        setScrollTop(true);
      }
    } else {
      setScrollTop(false);
    }

    lastScrollTop.current = currentScrollTop;
  }, [scrollSize]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return scrollTop;
}
