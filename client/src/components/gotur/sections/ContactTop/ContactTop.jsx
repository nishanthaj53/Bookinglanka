import React from "react";
import { Link } from "react-router-dom";
import { contactItems } from "../../../../data/contactTopData";

function ContactTitleLink({ item }) {
  if (!item.link) return item.title;
  if (/^(https?:|mailto:|tel:)/i.test(item.link)) {
    return (
      <a href={item.link} target={item.link.startsWith("http") ? "_blank" : undefined} rel={item.link.startsWith("http") ? "noopener noreferrer" : undefined}>
        {item.title}
      </a>
    );
  }
  return <Link to={item.link}>{item.title}</Link>;
}

const ContactTop = () => {
  return (
    <section className="contact-top section-space">
      <div className="container">
        <div className="row gutter-y-30">
          {contactItems.map((item, index) => (
            <div
              key={index}
              className="col-lg-4 col-md-6 wow fadeInUp"
              data-wow-duration="1500ms"
              data-wow-delay={`${300 + 200 * index}ms`}
            >
              <div className="contact-top__item">
                <div className="contact-top__item__icon">
                  <i className={item.icon}></i>
                </div>

                <h4 className="contact-top__item__title">
                  <ContactTitleLink item={item} />
                </h4>

                <p className="contact-top__item__text">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContactTop;
