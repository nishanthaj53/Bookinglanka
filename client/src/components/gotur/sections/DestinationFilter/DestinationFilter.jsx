import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

import { destinationFilterData } from "../../../../data/destinationFilterData";
import TextAnimation from "../../common/AnimatedText/TextAnimation";

const DestinationFilter = () => {
  const tabKeys = Object.keys(destinationFilterData.items);
  const [activeTab, setActiveTab] = useState(tabKeys[0] || "Beach Destinations");

  return (
    <section className="destination-filter section-space" id="destination">
      <Container>
        {/* TOP */}
        <div className="destination-filter__top">
          <div className="sec-title text-center">
            <h6 className="sec-title__tagline bw-split-in-right">
              <TextAnimation
                text={destinationFilterData.subtitle}
                animationType="right"
              />
            </h6>

            <h3 className="sec-title__title bw-split-in-left d-flex justify-content-center gap-2">
              <TextAnimation
                text={destinationFilterData.title}
                animationType="left"
              />
              <span>
                <TextAnimation
                  text={destinationFilterData.titleSpan}
                  animationType="left"
                />
              </span>
            </h3>
          </div>

          <p className="destination-filter__top__text">
            {destinationFilterData.description}
          </p>
        </div>

        {/* TABS */}
        <div className="tabs-box">
          <div className="destination-filter__btn tab-buttons">
            {Object.keys(destinationFilterData.items).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`tab-btn gotur-btn ${
                  activeTab === key ? "active-btn" : ""
                }`}
              >
                {key.replace(/([A-Z])/g, " $1").trim()}
              </button>
            ))}
          </div>

          {/* CONTENT */}
          <div className="tabs-content">
            <Row className="gutter-y-20 gutter-x-20">
              {destinationFilterData.items[activeTab].map((item) => (
                <Col xl={3} lg={4} md={4} sm={6} key={item.id}>
                  <div
                    className="destination-card-one wow fadeInUp"
                    data-wow-duration="1500ms"
                    data-wow-delay="100ms"
                  >
                    <div className="destination-card-one__thumb">
                      <img src={item.image} alt={item.title} />
                      <Link
                        to={item.link}
                        className="destination-card-one__overly"
                      />
                    </div>

                    <div className="destination-card-one__content">
                      <h3 className="destination-card-one__title">
                        <Link to={item.link}>{item.title}</Link>
                      </h3>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </Container>

      {/* SHAPES */}
      <div className="destination-filter__element">
        <img
          src={destinationFilterData.plan}
          alt="Shape Plan"
        />
      </div>

      <div className="destination-filter__element-two">
        <img
          src={destinationFilterData.monjil}
          alt="Shape Monjil"
        />
      </div>
    </section>
  );
};

export default DestinationFilter;
