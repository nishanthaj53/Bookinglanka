import React, { useEffect, useState } from "react";
import ScrollToTop from "react-scroll-to-top";

const ScrollTop = () => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const bodyHeight = document.body.scrollHeight - window.innerHeight;
      const scrollPos = window.scrollY;
      let percent = (scrollPos / bodyHeight) * 100;
      if (percent > 100) percent = 100;
      setPercentage(percent);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <ScrollToTop
      smooth
      style={{
        background: `conic-gradient(var(--gotur-primary) ${percentage}%, var(--gotur-white) ${percentage}%)`,
      }}
      component={
        <span className="scroll-top-value">
          {percentage === 100 ? (
            <i className="fas fa-arrow-up"></i>
          ) : (
            `${Math.round(percentage)}%`
          )}
        </span>
      }
    />
  );
};

export default ScrollTop;
