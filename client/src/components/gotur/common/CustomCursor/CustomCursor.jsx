import React, { useEffect, useRef, useState } from "react";

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const cursorTwoRef = useRef(null);

  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const links = document.querySelectorAll("a");

    const handleMouseMove = (e) => {
      setPosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    const handleMouseDown = () => {
      cursorRef.current?.classList.add("click");
      cursorTwoRef.current?.classList.add("custom-cursor__innerhover");
    };

    const handleMouseUp = () => {
      cursorRef.current?.classList.remove("click");
      cursorTwoRef.current?.classList.remove("custom-cursor__innerhover");
    };

    const handleMouseOver = () => {
      cursorRef.current?.classList.add("custom-cursor__hover");
    };

    const handleMouseLeave = () => {
      cursorRef.current?.classList.remove("custom-cursor__hover");
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);

    links.forEach((item) => {
      item.addEventListener("mouseover", handleMouseOver);
      item.addEventListener("mouseleave", handleMouseLeave);
    });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);

      links.forEach((item) => {
        item.removeEventListener("mouseover", handleMouseOver);
        item.removeEventListener("mouseleave", handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <div
        ref={cursorRef}
        className="custom-cursor__cursor"
        style={{
          transform: `translate3d(calc(${position.x}px - 50%), calc(${position.y}px - 50%), 0)`,
        }}
      />
      <div
        ref={cursorTwoRef}
        className="custom-cursor__cursor-two"
        style={{ top: position.y, left: position.x }}
      />
    </>
  );
};

export default CustomCursor;
