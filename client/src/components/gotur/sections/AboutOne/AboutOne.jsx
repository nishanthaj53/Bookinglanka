import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

import { aboutOneData } from "../../../../data/aboutOne";
import TextAnimation from "../../common/AnimatedText/TextAnimation";

const AboutOne = ({ extraclass = "" }) => {
  const {
    title,
    subtitle,
    description,
    features,
    mission,
    button,
    images,
  } = aboutOneData;

  return (
    <section
      className={`about-one section-space ${extraclass}`}
      id="about"
    >
      <Container>
        <Row className="gutter-y-40">
          {/* Left Images */}
          <Col lg={6}>
            <div
              className="about-one__thumb wow fadeInLeft"
              data-wow-duration="1500ms"
              data-wow-delay="300ms"
            >
              <div className="about-one__thumb__item about-one__thumb__item--back">
                <img
                  src={images.mainImage}
                  alt="Wildlife safari experience in Sri Lanka"
                  className="img-fluid"
                />
              </div>

              <div className="about-one__thumb__item-small about-one__thumb__item-small--front">
                <img
                  src={images.smallImage}
                  alt="Colombo skyline and coastline"
                  className="img-fluid"
                />
              </div>

              <div className="about-one__thumb__item-popup">
                <img
                  src={images.popupImage}
                  alt="gotur image"
                  className="img-fluid"
                />
              </div>
            </div>
          </Col>

          {/* Right Content */}
          <Col lg={6}>
            <div className="about-one__right">
              <div className="sec-title">
                <h6 className="sec-title__tagline bw-split-in-right">
                  <TextAnimation
                    text={subtitle}
                    animationType="right"
                  />
                </h6>

                <h3
                  className="sec-title__title bw-split-in-left"
                  style={{ maxWidth: "555px" }}
                >
                  <TextAnimation
                    text={title}
                    animationType="left"
                  />
                </h3>
              </div>

              <p
                className="about-one__top__text wow fadeInUp"
                data-wow-duration="1500ms"
                data-wow-delay="300ms"
              >
                {description}
              </p>

              <div className="about-one__feature">
                <Row className="gutter-y-20">
                  <Col
                    xl={6}
                    lg={12}
                    md={6}
                    className="wow fadeInUp"
                    data-wow-duration="1500ms"
                    data-wow-delay="300ms"
                  >
                    <ul className="about-one__feature-list">
                      {features.map((feature, index) => (
                        <li key={index}>
                          <i className="icon-check-star"></i>{" "}
                          {feature.text}
                        </li>
                      ))}
                    </ul>
                  </Col>

                  <Col
                    xl={6}
                    lg={12}
                    md={6}
                    className="wow fadeInUp"
                    data-wow-duration="1500ms"
                    data-wow-delay="400ms"
                  >
                    <div className="about-one__feature-vestion">
                      <div className="about-one__feature_icon">
                        <i className={mission.icon}></i>
                      </div>
                      <div className="about-one__feature-content">
                        <h5 className="about-one__feature-title">
                          {mission.title}
                        </h5>
                        <p className="about-one__feature-text">
                          {mission.text}
                        </p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              <div
                className="about-one__button wow fadeInUp"
                data-wow-duration="1500ms"
                data-wow-delay="300ms"
              >
                <Link
                  to={button.link}
                  className="gotur-btn gotur-btn--primary"
                >
                  {button.text}
                  <span className="icon">
                    <i className="icon-right"></i>
                  </span>
                </Link>

                <div className="about-one__button__call">
                  <div className="about-one__button__call__icon">
                    <i className={button.callIcon}></i>
                  </div>
                  <div className="about-one__button__call__content">
                    <span>{button.callText}</span>
                    <a href={`tel:${button.phoneTel || button.phone}`}>
                      {button.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Decorative Shapes */}
      <div className="about-one__element-one">
        <img src={images.shape1} alt="element" />
      </div>
      <div className="about-one__element-two">
        <img src={images.shape2} alt="element" />
      </div>
    </section>
  );
};

export default AboutOne;
