import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

import { mainSliderData } from "../../../../data/mainSliderThreeData";
import { resolveGetInTouchTo } from "../../../../utils/resolveDashboardEntry";
import TextAnimation from "../../common/AnimatedText/TextAnimation";
import VideoModal from "../../common/VideoModal/VideoModal";


const MainSliderThree = () => {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 🔥 CRITICAL: force Gotur animation reflow
    setTimeout(() => {
      window.dispatchEvent(new Event("scroll"));
    }, 100);
  }, []);

  if (!mounted) return null;

  const { buttonBg, sliderItems, imageElements, elementTwo } = mainSliderData;
  const {
    // thumbImage = insert the image correctly,// otherwise it will cause error.
    tagLine,
    title,
    titleSpan,
    text,
    thumbImage,
    buttonLink: _buttonLinkUnused,
    videoId,
  } = sliderItems;

  const numberWords = [
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
  ];

  return (
    <>
      <section className="main-slider-three" id="home">
        <Container>
          <Row className="justify-content-start">
            <Col xxl={6} lg={12}>
              <div className="main-slider-three__content">
                <h5 className="main-slider-three__sub-title main-three bw-split-in-left">
                  <TextAnimation text={tagLine} animationType="left" />
                </h5>

                <h2 className="main-slider-three__title main-three bw-split-in-left">
                  <TextAnimation text={`${title} ${titleSpan}`} animationType="left" />
                </h2>

                <div className="main-slider-three__text main-three bw-split-in-down">
                  <TextAnimation text={text} animationType="down" />
                </div>

                <div
                  className="main-slider-three__button"
                  style={{ justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: "14px" }}
                >
                  <Link to={resolveGetInTouchTo()} className="gotur-btn gotur-btn--primary">
                    get in touch <i className="icon-paper-plane"></i>
                  </Link>

                  <div className="main-slider-three__item-video">
                    <a
                      href="#"
                      className="video-popup"
                      onClick={(e) => {
                        e.preventDefault();
                        setOpen(true);
                      }}
                    >
                      <i className="fas fa-play"></i>
                    </a>
                    <span>play reel</span>
                  </div>

                  <Link to="/ai-planner" className="gotur-btn">
                    get into AI planner <i className="icon-paper-plane"></i>
                  </Link>
                </div>
              </div>
            </Col>

            <Col xxl={6}>
              <div className="main-slider-three__thumb">
                <img
                  src={thumbImage}
                  alt="Sri Lanka — Sigiriya, hill country train, beaches, and iconic places"
                  width={797}
                  height={713}
                  decoding="async"
                />
              </div>
            </Col>
          </Row>
        </Container>

        {/* Floating Elements */}
        <div className="main-slider-three__element">
          {imageElements.map((item, idx) => (
            <div
              key={item.id}
              className={
                idx === 0
                  ? "main-slider-three__element__item"
                  : `main-slider-three__element__item-${
                      numberWords[idx - 1] || idx
                    }`
              }
            >
              <img src={item.image} alt={`shape-${idx + 1}`} />
            </div>
          ))}
        </div>

        <div className="main-slider-three__element-two">
          <img src={elementTwo} alt="tree element" />
        </div>

        <div className="main-slider-three__element-three">
          <span className="main-slider-three__element-three-item"></span>
          <span className="main-slider-three__element-three-item"></span>
          <span className="main-slider-three__element-three-item"></span>
        </div>
      </section>

      <VideoModal isOpen={isOpen} setOpen={setOpen} id={videoId} />
    </>
  );
};

export default MainSliderThree;
