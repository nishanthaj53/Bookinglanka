import React from "react";
import { mainSliderOneData } from "../../../../data/mainSliderOneData";
import TinySlider from "tiny-slider-react";

import TextAnimation from "../../common/AnimatedText/TextAnimation";
import BannerForm from "../BannerForm/BannerForm";

const MainSliderOne = () => {
  const settings = {
    loop: true,
    autoplay: true,
    items: 3,
    gutter: 40,
    mouseDrag: true,
    nav: false,
    autoplayButtonOutput: false,
    controls: true,
    controlsContainer: ".main-slider-one__bottom__nav",
    autoplayTimeout: 6000,
    speed: 1000,
  };

  return (
    <section className="main-slider-one" id="home">
      <div className="main-slider-one__item">
        <div className="container">
          <div className="row">
            <div className="col-xl-7 col-lg-8 col-md-10">
              <div className="main-slider-one__content">
                <h5 className="main-slider-one__sub-title main-three bw-split-in-top">
                  {mainSliderOneData.subtitle}
                </h5>

                <h2 className="main-slider-one__title main-three bw-split-in-down">
                  <TextAnimation text="Next Step" animationType="down" />
                </h2>
                <h2 className="main-slider-one__title main-three bw-split-in-down">
                  <TextAnimation text="Destination" animationType="down" />
                </h2>

                <p className="main-slider-one__text main-three bw-split-in-down">
                  {mainSliderOneData.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* DESTINATIONS SLIDER */}
        <div className="main-slider-one__destinations">
          <div className="container">
            <div className="destinations-two__inner gotur-owl__carousel--with-shadow">
              <TinySlider
                settings={settings}
                className="main-slider-one__carousel"
              >
                {mainSliderOneData.destinations.map((dest) => (
                  <div className="item" key={dest.id}>
                    <div className="destinations-card-two">
                      <div className="destinations-card-two__thumb">
                        <img src={dest.image} alt="destination" />
                      </div>
                    </div>
                  </div>
                ))}
              </TinySlider>
            </div>
          </div>

          <div className="main-slider-one__destinations__hover">
            <img
              src={mainSliderOneData.hoverImage}
              alt="hover destination"
            />
          </div>
        </div>

        {/* SLIDER NAV */}
        <div className="main-slider-one__bottom__nav">
          <button className="main-slider-one__carousel__nav--left">
            <span className="icon-arrow-left"></span>
          </button>
          <button className="main-slider-one__carousel__nav--right">
            <span className="icon-arrow-right"></span>
          </button>
        </div>

        {/* SEARCH / ACTION FORM */}
        <div className="main-slider-one__action-form">
          <div className="container">
            <div className="main-slider-one__form">
              <BannerForm />
            </div>
          </div>
        </div>

        {/* SHAPE IMAGES */}
        {mainSliderOneData.images.map((img) => (
          <div
            key={img.id}
            className={`main-slider-one__element${img.class}`}
          >
            <img src={img.image} alt={`element ${img.class}`} />
          </div>
        ))}

        <div className="main-slider-one__element-four"></div>
      </div>
    </section>
  );
};

export default MainSliderOne;
