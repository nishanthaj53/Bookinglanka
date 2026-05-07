import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import TinySlider from "tiny-slider-react";

import { aboutTestimonialsData } from "../../../../data/aboutTestimonialsData";
import TextAnimation from "../../common/AnimatedText/TextAnimation";
import ClientCarousel from "../ClientCarousel/ClientCarousel";

const AboutTestimonials = () => {
  const {
    sectionTitle,
    sectionTagline,
    testiThumb,
    testimonials,
    shapeImages,
    brands,
  } = aboutTestimonialsData;

  return (
    <section className="about-testimonials section-space" id="testimonials">
      <Container>
        <Row className="align-items-center gutter-y-40">
          {/* Left Image */}
          <Col lg={4}>
            <div
              className="about-testimonials__left wow fadeInLeft"
              data-wow-duration="1500ms"
              data-wow-delay="300ms"
            >
              <div className="about-testimonials__thumb">
                <div className="about-testimonials__thumb__item">
                  <img src={testiThumb} alt="man" />
                </div>
              </div>
            </div>
          </Col>

          {/* Right Content */}
          <Col lg={8}>
            <div className="about-testimonials__right">
              <div className="sec-title">
                <h6 className="sec-title__tagline bw-split-in-right">
                  <TextAnimation
                    text={sectionTagline}
                    animationType="right"
                  />
                </h6>
                <h3 className="sec-title__title bw-split-in-left">
                  <TextAnimation
                    text={sectionTitle}
                    animationType="left"
                  />
                </h3>
              </div>

              <div className="gotur-owl__carousel--basic-nav owl-carousel about-testimonials__carousel gotur-owl__carousel owl-theme wow fadeInUp">
                <TinySlider
                  settings={{
                    items: 1,
                    gutter: 30,
                    speed: 700,
                    loop: false,
                    nav: false,
                    autoplay: false,
                    mouseDrag: true,
                    controlsContainer:
                      ".gotur-owl__carousel--basic-nav .owl-nav",
                  }}
                >
                  {testimonials.map((testimonial, index) => (
                    <div
                      className="about-testimonials__item"
                      key={index}
                    >
                      <div className="about-testimonials__star">
                        <i className="icon-star"></i>
                        <i className="icon-star"></i>
                        <i className="icon-star"></i>
                        <i className="icon-star"></i>
                        <i className="icon-star"></i>
                      </div>

                      <p className="about-testimonials__text">
                        {testimonial.text}
                      </p>

                      <div className="about-testimonials__author">
                        <div className="about-testimonials__author__thumb">
                          <img
                            src={testimonial.image}
                            alt="author"
                          />
                        </div>
                        <div className="about-testimonials__content">
                          <h6 className="about-testimonials__title">
                            {testimonial.authorName}
                          </h6>
                          <span>{testimonial.position}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </TinySlider>

                {/* Slider Nav */}
                <div className="owl-nav">
                  <button
                    type="button"
                    className="owl-prev"
                    aria-label="carousel previous"
                  >
                    <span className="icon-arrow-left"></span>
                  </button>
                  <button
                    type="button"
                    className="owl-next"
                    aria-label="carousel next"
                  >
                    <span className="icon-arrow-right"></span>
                  </button>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Client Logos */}
        <ClientCarousel />
      </Container>

      {/* Decorative Shapes */}
      <div className="about-testimonials__element-one">
        <img src={shapeImages[0]} alt="shape" />
      </div>
      <div className="about-testimonials__element-two">
        <img src={shapeImages[1]} alt="shape" />
      </div>
    </section>
  );
};

export default AboutTestimonials;
