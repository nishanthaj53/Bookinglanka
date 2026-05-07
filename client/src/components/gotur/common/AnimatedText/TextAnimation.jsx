import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const TextAnimation = ({ text, animationType }) => {
  const [words, setWords] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const textRef = useRef(null);

  // Split into words, then characters
  useEffect(() => {
    const splitWords = text.split(" ").map((word) => word.split(""));
    setWords(splitWords);
  }, [text]);

  // Trigger animation when visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (textRef.current) observer.observe(textRef.current);

    return () => {
      if (textRef.current) observer.unobserve(textRef.current);
    };
  }, []);

  const variants = {
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    right: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
    },
    left: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
    },
    up: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
    },
    down: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
    },
  };

  return (
    <div
      ref={textRef}
      className="text-animation"
      style={{
        display: "flex",
        position: "relative",
        flexWrap: "wrap",
        gap: "0.19em",
        rowGap: "0",
      }}
    >
      {words.map((word, wordIndex) => (
        <div key={wordIndex} style={{ display: "inline-flex" }}>
          {word.map((char, charIndex) => (
            <motion.div
              key={charIndex}
              variants={variants[animationType]}
              initial="initial"
              animate={isVisible ? "animate" : "initial"}
              transition={{
                delay: wordIndex * 0.2 + charIndex * 0.05,
                duration: 0.8,
                ease: "easeInOut",
              }}
              style={{ display: "inline-block" }}
            >
              {char}
            </motion.div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TextAnimation;
