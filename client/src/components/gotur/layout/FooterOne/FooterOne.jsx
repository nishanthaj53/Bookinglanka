import React from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";

import { footerOneData } from "../../../../data/footerOneData";
import ContactInfoIcon from "../../../common/ContactInfoIcon";

export default function FooterOne() {
  const data = footerOneData;

  return (
    <footer className="main-footer">
      <div className="main-footer__top">
        <Container>
          <div
            className="main-footer__top__inner wow fadeInUp"
            data-wow-duration="1500ms"
            data-wow-delay="200ms"
          >
            <div className="footer-widget__logo logo-retina">
              <Link to="/">
                <img src={data.logo} alt="Booking Lanka" width="158" height="45" />
              </Link>
            </div>

            <ul className="list-unstyled footer-widget__list">
              <li>
                <div className="footer-widget__list__icon">
                  <ContactInfoIcon type="email" />
                </div>
                <div className="footer-widget__list__content">
                  <span className="footer-widget__list__subtitle">send email</span>
                  <a href={`mailto:${data.contact.email}`}>{data.contact.email}</a>
                </div>
              </li>

              <li>
                <div className="footer-widget__list__icon">
                  <ContactInfoIcon type="phone" />
                </div>
                <div className="footer-widget__list__content">
                  <span className="footer-widget__list__subtitle">call agent</span>
                  <a
                    href={data.contact.whatsappUrl || `tel:${data.contact.phoneTel || ""}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {data.contact.phone}
                  </a>
                </div>
              </li>

              <li>
                <div className="footer-widget__list__icon">
                  <ContactInfoIcon type="location" />
                </div>
                <div className="footer-widget__list__content">
                  <span className="footer-widget__list__subtitle">visit us</span>
                  <a
                    href={data.contact.mapsSearchUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {data.contact.addressLine}
                  </a>
                </div>
              </li>

              <li>
                <div className="footer-widget__list__icon">
                  <ContactInfoIcon type="time" />
                </div>
                <div className="footer-widget__list__content">
                  <span className="footer-widget__list__subtitle">opening time</span>
                  <p>{data.contact.hours}</p>
                </div>
              </li>
            </ul>
          </div>
        </Container>
      </div>

      <div className="main-footer__bottom main-footer__bottom--highlight">
        <Container>
          <div className="main-footer__bottom__inner center">
            <p className="main-footer__copyright">
              © {new Date().getFullYear()} Booking Lanka. All rights reserved.
              <br />
              Powered by {data.contact.companyName}
            </p>
          </div>
        </Container>
      </div>
    </footer>
  );
}
