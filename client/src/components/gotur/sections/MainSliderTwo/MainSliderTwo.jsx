import { useEffect, useState } from "react";
import TinySlider from "tiny-slider-react";
import { sliderTowData } from "../../../../data/mainSliderTwoData";
import BannerForm from "../BannerForm/BannerForm";

const MainSliderTwo = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 🔥 FORCE Gotur animation trigger (CRITICAL)
    setTimeout(() => {
      document
        .querySelectorAll(".main-slider-two__content")
        .forEach((el) => el.classList.add("active"));
    }, 300);
  }, []);

  if (!mounted) return null;

  const settings = {
    loop: true,
    autoplay: true,
    mode: "gallery",
    animateOut: "tns-fadeOut",
    animateIn: "tns-fadeIn",
    items: 1,
    gutter: 0,
    mouseDrag: true,
    nav: false,
    autoplayButtonOutput: false,
    controlsContainer: ".owl-nav",
    autoplayTimeout: 6000,
    speed: 1000,
  };

  const { tagline, title, titleSpan, sliderItems } = sliderTowData;

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
    <section className="main-slider-two" id="home">
      <div className="main-slider-two__carousel owl-carousel gotur-owl__carousel--basic-nav">
        <TinySlider settings={settings}>
          {sliderItems.map((item) => (
            <div key={item.id} className="item">
              <div className="main-slider-two__item">
                {/* Background */}
                <div
                  className="main-slider-two__bg"
                  style={{
                    backgroundImage: `url(${item.backgroundImage})`,
                  }}
                ></div>

                <div className="container">
                  <div className="row">
                    <div className="col-xl-8 col-lg-12">
                      <div className="main-slider-two__content">
                        <h5 className="main-slider-two__sub-title">
                          {tagline}
                        </h5>

                        <h2 className="main-slider-two__title">
                          {title} <br />
                          {titleSpan}
                          <span className="main-slider-two__title__overlay-group">
                            <span className="main-slider-two__title__overlay"></span>
                            <span className="main-slider-two__title__overlay"></span>
                            <span className="main-slider-two__title__overlay"></span>
                            <span className="main-slider-two__title__overlay"></span>
                            <span className="main-slider-two__title__overlay"></span>
                            <span className="main-slider-two__title__overlay"></span>
                          </span>
                        </h2>

                        <p className="main-slider-two__text">{item.text}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                {item.imageElements.map((img, idx) => (
                  <div
                    key={idx}
                    className={
                      idx === 0
                        ? "main-slider-two__element"
                        : `main-slider-two__element-${
                            numberWords[idx - 1] || idx
                          }`
                    }
                  >
                    <img src={img} alt={`slider element ${idx + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </TinySlider>

        {/* Controls */}
        <div className="owl-nav">
          <button type="button" className="owl-prev">
            <span className="icon-arrow-left"></span>
          </button>
          <button type="button" className="owl-next">
            <span className="icon-arrow-right"></span>
          </button>
        </div>
      </div>

      {/* Search / Banner form */}
      <div className="main-slider-two__action-form">
        <div className="container">
          <div className="main-slider-two__form">
            <BannerForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MainSliderTwo;