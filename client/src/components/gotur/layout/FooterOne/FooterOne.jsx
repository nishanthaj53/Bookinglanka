import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import MailchimpSubscribe from "react-mailchimp-subscribe";

import { footerOneData } from "../../../../data/footerOneData";

const url = "//xxxx.us13.list-manage.com/subscribe/post?u=zefzefzef&id=fnfgn";

function FooterInfoIcon({ type }) {
  const t = String(type || "").toLowerCase();

  if (t === "email") {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2Zm0 4.2-8 5-8-5V6l8 5 8-5v2.2Z"
        />
      </svg>
    );
  }

  if (t === "phone") {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.2 1 .3 2.2.5 3.4.5.7 0 1.3.6 1.3 1.3V20c0 .7-.6 1.3-1.3 1.3C11.6 21.3 2.7 12.4 2.7 1.3 2.7.6 3.3 0 4 0h3.1c.7 0 1.3.6 1.3 1.3 0 1.2.2 2.4.5 3.4.1.4 0 .9-.3 1.2l-2 2Z"
        />
      </svg>
    );
  }

  if (t === "location") {
    return (
      <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
        <path
          fill="currentColor"
          d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 7a2.5 2.5 0 0 1 0 4.5Z"
        />
      </svg>
    );
  }

  // time / clock
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
      <path
        fill="currentColor"
        d="M12 2a10 10 0 1 0 10 10A10.01 10.01 0 0 0 12 2Zm.8 5.2c0-.44-.36-.8-.8-.8s-.8.36-.8.8v5.1c0 .22.09.42.24.57l3.3 3.3c.31.31.82.31 1.13 0s.31-.82 0-1.13l-3.07-3.07V7.2Z"
      />
    </svg>
  );
}

export default function FooterOne() {
  const data = footerOneData;

  return (
    <footer className="main-footer">

      {/* ================= TOP ================= */}
      <div className="main-footer__top">
        <Container>
          <div
            className="main-footer__top__inner wow fadeInUp"
            data-wow-duration="1500ms"
            data-wow-delay="200ms"
          >
            <div className="footer-widget__logo logo-retina">
              <Link to="/">
                <img
                  src={data.logo}
                  alt="gotur logo"
                  width="158"
                  height="45"
                />
              </Link>
            </div>

            <ul className="list-unstyled footer-widget__list">
              <li>
                <div className="footer-widget__list__icon">
                  <FooterInfoIcon type="email" />
                </div>
                <div className="footer-widget__list__content">
                  <span className="footer-widget__list__subtitle">
                    send email
                  </span>
                  <a href={`mailto:${data.contact.email}`}>
                    {data.contact.email}
                  </a>
                </div>
              </li>

              <li>
                <div className="footer-widget__list__icon">
                  <FooterInfoIcon type="phone" />
                </div>
                <div className="footer-widget__list__content">
                  <span className="footer-widget__list__subtitle">
                    call agent
                  </span>
                  <a
                    href={`tel:${data.contact.phoneTel || data.contact.phone?.replace(/\s/g, "") || ""}`}
                  >
                    {data.contact.phone}
                  </a>
                </div>
              </li>

              <li>
                <div className="footer-widget__list__icon">
                  <FooterInfoIcon type="location" />
                </div>
                <div className="footer-widget__list__content">
                  <span className="footer-widget__list__subtitle">
                    visit us
                  </span>
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
                  <FooterInfoIcon type="time" />
                </div>
                <div className="footer-widget__list__content">
                  <span className="footer-widget__list__subtitle">
                    opening time
                  </span>
                  <p>{data.contact.hours}</p>
                </div>
              </li>
            </ul>
          </div>
        </Container>
      </div>

      {/* ================= MIDDLE ================= */}
      <div className="main-footer__middle">
        <Container>
          <Row className="gutter-y-40">

            <Col md={6} lg={4} xl={3}>
              <div
                className="footer-widget footer-widget--about wow fadeInUp"
                data-wow-duration="1500ms"
                data-wow-delay="0ms"
              >
                <h2 className="footer-widget__title">about Gotur</h2>
                <p className="footer-widget__about-text">
                  {data.about.text}
                </p>

                <div className="footer-widget__social">
                  {data.about.socials.map((social, idx) => (
                    <a
                      key={idx}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className={social.icon}></i>
                      <span className="sr-only">{social.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </Col>

            <Col md={6} lg={4} xl={3}>
              <div
                className="footer-widget footer-widget--links wow fadeInUp"
                data-wow-duration="1500ms"
                data-wow-delay="200ms"
              >
                <h2 className="footer-widget__title">Destinations</h2>
                <ul className="list-unstyled footer-widget__links">
                  {data.destinations.map((item, idx) => (
                    <li key={idx}>
                      <Link to={item.href}>{item.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>

            <Col md={6} lg={4} xl={3}>
              <div
                className="footer-widget footer-widget--post wow fadeInUp"
                data-wow-duration="1500ms"
                data-wow-delay="400ms"
              >
                <h2 className="footer-widget__title">useful links</h2>
                <ul className="list-unstyled footer-widget__links">
                  {data.usefulLinks.map((item, idx) => (
                    <li key={idx}>
                      <Link to={item.href}>{item.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>

            <Col md={6} lg={5} xl={3}>
              <div
                className="footer-widget footer-widget--contact wow fadeInUp"
                data-wow-duration="1500ms"
                data-wow-delay="600ms"
              >
                <h2 className="footer-widget__title">Newsletter</h2>
                <p className="footer-widget__contact-text">
                  {data.newsletter.text}
                </p>

                <MailchimpSubscribe
                  url={url}
                  render={({ subscribe, status, message }) => (
                    <div className="mc-form">
                      <form
                        className="footer-widget__newsletter mc-form"
                        onSubmit={(e) => {
                          e.preventDefault();
                          const email =
                            e.currentTarget.EMAIL.value;
                          if (email) subscribe({ EMAIL: email });
                        }}
                      >
                        <div className="form-group__form">
                          <input
                            type="email"
                            name="EMAIL"
                            placeholder="Your email address"
                          />
                          <button type="submit" className="gotur-btn">
                            <span className="icon-right-arrow"></span>
                          </button>
                        </div>

                        <div className="form-group__check">
                          <input type="checkbox" id="check" />
                          <label htmlFor="check">
                            I agree to the{" "}
                            <Link to={data.newsletter.privacyLink}>
                              Privacy Policy.
                            </Link>
                          </label>
                        </div>
                      </form>

                      <div className="mc-form__response">
                        {status === "sending" && <div>sending...</div>}
                        {status === "error" && (
                          <div dangerouslySetInnerHTML={{ __html: message }} />
                        )}
                        {status === "success" && <div>Subscribed!</div>}
                      </div>
                    </div>
                  )}
                />
              </div>
            </Col>

          </Row>
        </Container>

        <div className="main-footer__element-one">
          <img src={data.shape1} alt="footer shape" />
        </div>
        <div className="main-footer__element-two">
          <img src={data.shape2} alt="footer shape" />
        </div>
      </div>

      {/* ================= BOTTOM (FIXED) ================= */}
      {/* ================= BOTTOM ================= */}
      <div className="main-footer__bottom main-footer__bottom--highlight">
        <Container>
          <div className="main-footer__bottom__inner center">
            <p className="main-footer__copyright">
              © {new Date().getFullYear()} Booking Lanka. All rights reserved.
            </p>
          </div>
        </Container>
      </div>


    </footer>
  );
}
