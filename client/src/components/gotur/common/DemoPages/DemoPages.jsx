import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

// ✅ relative import (no @ alias)
import { demoPages } from "../../../../data/demoPages";

const DemoPages = () => {
  return (
    <ul>
      <li>
        <section className="home-showcase">
          <Container>
            <div className="home-showcase__inner">
              <Row>
                {demoPages.map((page, index) => (
                  <Col lg={3} md={6} key={index}>
                    <div className="demo-one__card">
                      <div className="demo-one__image">
                        {/* ✅ Normal img (NO next/image) */}
                        <img
                          src={page.image}
                          alt={`gotur image ${page.title}`}
                          style={{ width: "100%", height: "auto" }}
                        />

                        <div className="demo-one__btns">
                          {page.multiPageLink && (
                            <Link
                              to={page.multiPageLink}
                              className="gotur-btn demo-one__btn"
                            >
                              Multi Page
                            </Link>
                          )}

                          {page.onePageLink && (
                            <Link
                              to={page.onePageLink}
                              className="gotur-btn demo-one__btn"
                            >
                              One Page
                            </Link>
                          )}
                        </div>
                      </div>

                      <div className="demo-one__content">
                        <h3 className="demo-one__title">
                          {page.title}
                        </h3>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          </Container>
        </section>
      </li>
    </ul>
  );
};

export default DemoPages;
