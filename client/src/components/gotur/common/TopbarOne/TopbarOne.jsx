
import React from "react";
import { Container } from "react-bootstrap";
import { topbarOne } from "../../../../data/topbarOne";
import { SITE_CONTACT } from "../../../../data/siteContact";
import ContactInfoIcon from "../../../common/ContactInfoIcon";

function SocialIcon({ platform }) {
  const p = String(platform || "").toLowerCase();
  if (p === "facebook") {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
        <path
          fill="currentColor"
          d="M13.5 8.5V6.8c0-.8.5-.9.8-.9h2V3h-2.7C10.8 3 10 5 10 6.3v2.2H8v3h2V21h3.5v-9.5h2.4l.3-3z"
        />
      </svg>
    );
  }
  if (p === "x" || p === "twitter" || p === "x-twitter") {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
        <path
          fill="currentColor"
          d="M18.9 3H21l-4.6 5.3L22 21h-4.8l-3.8-4.9L9.1 21H7l5-5.8L2.5 3h4.9l3.4 4.5zm-.8 16.6h1.3L6.7 4.3H5.3z"
        />
      </svg>
    );
  }
  if (p === "linkedin") {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
        <path
          fill="currentColor"
          d="M6.5 8.8H3.6V21h2.9zM5 3C4 3 3.2 3.8 3.2 4.8S4 6.6 5 6.6s1.8-.8 1.8-1.8S6 3 5 3m16 9.2c0-2.9-1.5-4.2-3.6-4.2-1.7 0-2.4.9-2.8 1.5v-1.3h-2.9V21h2.9v-6.3c0-.3 0-.7.1-1 .2-.7.8-1.5 1.9-1.5 1.3 0 1.9 1 1.9 2.5V21H21z"
        />
      </svg>
    );
  }
  if (p === "youtube") {
    return (
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
        <path
          fill="currentColor"
          d="M21.6 7.2a2.7 2.7 0 0 0-1.9-1.9C18 5 12 5 12 5s-6 0-7.7.3A2.7 2.7 0 0 0 2.4 7.2C2 9 2 12 2 12s0 3 .4 4.8a2.7 2.7 0 0 0 1.9 1.9C6 19 12 19 12 19s6 0 7.7-.3a2.7 2.7 0 0 0 1.9-1.9C22 15 22 12 22 12s0-3-.4-4.8M10 15.5v-7l6 3.5z"
        />
      </svg>
    );
  }
  return <i className="icon-share" aria-hidden="true"></i>;
}

const TopbarOne = ({ extraClass }) => {
  const { contactInfo, address, socialLinks } = topbarOne;
  const leftItems = contactInfo;

  return (
    <div className={`top-one ${extraClass || ""}`}>
      <div className="top-one__powered">
        <Container fluid>
          <p className="top-one__powered__text">
            <span className="top-one__powered__label">Powered by</span>{" "}
            <strong>{SITE_CONTACT.companyName}</strong>
            <span className="top-one__powered__sep" aria-hidden="true">
              ·
            </span>
            <a href={SITE_CONTACT.mapsSearchUrl} target="_blank" rel="noopener noreferrer">
              {SITE_CONTACT.addressLines.join(", ")}
            </a>
          </p>
        </Container>
      </div>
      <Container fluid>
        <div className="top-one__inner">
          {/* Contact Info */}
          <ul className="list-unstyled top-one__info">
            {leftItems.map((item, index) => (
              <li className={`top-one__info__item ${extraClass === "top-one--two" ? "special" : ""}`} key={index}>
                <span className="top-one__info__icon" aria-hidden="true">
                  <ContactInfoIcon type={item.iconType} size={14} />
                </span>
                <a
                  href={item.href}
                  {...(item.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="top-one__right">
            <div className="top-one__info__item">
              <span className="top-one__info__icon" aria-hidden="true">
                <ContactInfoIcon type={address.iconType} size={14} />
              </span>
              <a href={address.href} target="_blank" rel="noopener noreferrer">
                {address.label}
              </a>
            </div>

            {/* Social Links */}
            <div className="top-one__social">
              {socialLinks.map((social, index) => (
                <a
                  href={social.href}
                  key={index}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.platform}
                >
                  <SocialIcon platform={social.platform} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TopbarOne;
