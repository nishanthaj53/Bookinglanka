import React from "react";
import TinySlider from "tiny-slider-react";

import { clientCarouselData } from "../../../../data/clientCarouselData";

const ClientCarousel = ({ extraClass = "" }) => {
  const settings = {
    items: 5,
    gutter: 65,
    loop: true,
    autoplay: false,
    autoplayTimeout: 6000,
    mouseDrag: true,
    nav: false,
    controls: false,
    autoplayButtonOutput: false,

    responsive: {
      0: {
        items: 2,
        gutter: 30,
      },
      431: {
        items: 1,
        gutter: 30,
      },
      500: {
        items: 2,
        gutter: 30,
      },
      768: {
        items: 3,
        gutter: 50,
      },
      992: {
        items: 4,
        gutter: 60,
      },
      1200: {
        items: 5,
        gutter: 100,
      },
    },
  };

  return (
    <div
      className={`client-carousel wow fadeInUp ${extraClass}`}
      data-wow-duration="1500ms"
      data-wow-delay="500ms"
    >
      <div className="container">
        <h6 className="client-carousel__title">
          {clientCarouselData.title}
        </h6>

        <TinySlider
          settings={settings}
          className="client-carousel__one gotur-owl__carousel owl-theme owl-carousel"
        >
          {clientCarouselData.items.map((item) => (
            <div className="item" key={item.id}>
              <div className="client-carousel__one__item">
                <img
                  src={item.image}
                  alt="gotur"
                  className="client-carousel__one__image"
                />
                <img
                  src={item.hoverImage}
                  alt="gotur hover"
                  className="client-carousel__one__hover-image"
                />
              </div>
            </div>
          ))}
        </TinySlider>
      </div>
    </div>
  );
};

export default ClientCarousel;
