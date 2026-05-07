import React from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

import { demoData } from "../../data/DemoData";

const MegaMenu = ({ setIsMegaMenu, isMegamenu }) => {
  return (
    <ul className={`${isMegamenu ? "megamenu-clickable--active" : ""}`}>
      <li>
        <div className="megamenu-popup">
          <a
            href="#"
            className="megamenu-clickable--close"
            onClick={(e) => {
              e.preventDefault();
              setIsMegaMenu(false);
            }}
          >
            <span className="icon-close"></span>
          </a>

          <div className="megamenu-popup__content">
            <div className="demo-one">
              <Container>
                <Row>
                  {demoData.map((page, index) => (
                    <Col md={6} lg={4} key={index}>
                      <div className="demo-one__card">
                        <div className="demo-one__image">
                          <img
                            src={page.image}
                            alt={page.alt || page.title}
                            style={{ height: "auto" }}
                          />

                          <div className="demo-one__btns">
                            {page.buttons &&
                              page.buttons.map((item, idx) => (
                                <Link
                                  to={item.href}
                                  key={idx}
                                  className="gotur-btn demo-one__btn"
                                >
                                  {item.label}
                                </Link>
                              ))}
                          </div>
                        </div>

                        <div className="demo-one__content">
                          <h3 className="demo-one__title">
                            <Link to={page.href}>{page.title}</Link>
                          </h3>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Container>
            </div>
          </div>
        </div>
      </li>
    </ul>
  );
};

export default MegaMenu;
