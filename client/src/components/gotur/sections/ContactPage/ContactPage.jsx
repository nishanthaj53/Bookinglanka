import React from "react";
import { contactFormFields, googleMapUrl } from "../../../../data/contactData";

const ContactPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const data = {};

    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    console.log("Form Submitted:", data);
  };

  return (
    <section className="contact-page section-space-bottom">
      <div className="container">
        <div className="row gutter-y-30">

          {/* Google Map */}
          <div
            className="col-lg-6 wow fadeInLeft"
            data-wow-duration="1500ms"
            data-wow-delay="300ms"
          >
            <div className="contact-page__map">
              <div className="google-map">
                <iframe
                  title="google map"
                  src={googleMapUrl}
                  className="map"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div
            className="col-lg-6 wow fadeInRight"
            data-wow-duration="1500ms"
            data-wow-delay="300ms"
          >
            <div className="contact-page__contact">
              <h2 className="contact-page__title">Ready to Get Started?</h2>
              <p className="contact-page__text">
                Reach us by phone, email, or the form below. We respond to booking
                and travel questions as soon as we can during business hours.
              </p>

              <form
                className="comments-form__form contact-form-validated form-one"
                onSubmit={handleSubmit}
              >
                <div className="form-one__group">
                  {contactFormFields.map((field, index) => (
                    <div
                      key={index}
                      className={`form-one__control ${
                        field.type === "textarea"
                          ? "form-one__control--full"
                          : ""
                      }`}
                    >
                      <label htmlFor={field.name}>{field.label}</label>

                      {field.type === "textarea" ? (
                        <textarea
                          name={field.name}
                          id={field.name}
                          placeholder={field.placeholder}
                        ></textarea>
                      ) : (
                        <input
                          type={field.type}
                          name={field.name}
                          id={field.name}
                          placeholder={field.placeholder}
                        />
                      )}
                    </div>
                  ))}

                  <div className="form-one__control form-one__control--full">
                    <button
                      type="submit"
                      className="gotur-btn gotur-btn--base"
                    >
                      Send Message <i className="icon-arrow-right"></i>
                    </button>
                  </div>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
