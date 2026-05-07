import { useState } from "react";
import { Accordion } from "react-bootstrap";
import TinySlider from "tiny-slider-react";
import "tiny-slider/dist/tiny-slider.css";

import { getDestinationData } from "../../../../data/destinationDetailsBySlug";

export default function DestinationDetails() {
  const data = getDestinationData("kandy");
  const { destinationInfo, mapEmbedUrl } = data;
  const [activeKey, setActiveKey] = useState("0");

  return (
    <section className="destination-details section-space">
      <div className="container">

        {/* ================= CAROUSEL ================= */}
        <div className="destination-carousel">
          <div className="destination-carousel__inner gotur-owl__carousel gotur-owl__carousel--basic-nav">
            
            <TinySlider
              settings={{
                items: 1,
                gutter: 30,
                loop: false,
                nav: false,
                autoplay: false,
                controls: true,
                mouseDrag: true,
              }}
            >
              {data?.sliderImages?.map((img, idx) => (
                <div key={idx}>
                  <div className="destination-carousel__item">
                    <img src={img} alt="destination" />
                  </div>
                </div>
              ))}
            </TinySlider>

          </div>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="row gutter-y-30">
          <div className="col-lg-8">
            <div className="destination-details__content">

              {/* Section 1 */}
              <div className="destination-details__content__item">
                <h3 className="destination-details__title">
                  {data.title}
                </h3>
                <p className="destination-details__text">
                  {data.overview}
                </p>
              </div>

              {/* Section 2 */}
              <div className="destination-details__content__item">
                <h3 className="destination-details__title">
                  {data.titleTwo}
                </h3>
                <p className="destination-details__text">
                  {data.topDestinations}
                </p>
              </div>

              {/* Images */}
              <div className="destination-details__content__thumb">
                <div className="row gutter-y-30">
                  {data.images?.map((img, idx) => (
                    <div className="col-md-6" key={idx}>
                      <div className="destination-details__content__thumb__item">
                        <img src={img} alt="destination" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ */}
              <div className="destination-details__content__faq">
                <h3 className="destination-details__title">
                  Free Ask Question?
                </h3>

                <div className="faq-page__accordion faq-accordion gotur-accordion">
                  <Accordion defaultActiveKey="0">
                    {data.faqs?.map((faq, idx) => (
                      <Accordion.Item eventKey={idx.toString()} key={idx}>
                        <Accordion.Header>
                          <div className="accordion-title">
                            <h4 className="accordion-title__text">
                              {faq.question}
                            </h4>
                          </div>
                        </Accordion.Header>

                        <Accordion.Body>
                          <div className="accordion-content">
                            <p className="inner__text">{faq.answer}</p>
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </div>
              </div>

            </div>
          </div>

          {/* ================= SIDEBAR ================= */}
          <div className="col-lg-4">
            <aside className="destination-details__sidebar">

              {/* Info */}
              <div className="destination-details__sidebar__item destination-details__sidebar__item-list">
                <h4 className="destination-details__sidebar__title">
                  Some Information
                </h4>

                <ul className="destination-details__sidebar__list">
                  {destinationInfo?.map((item, index) => (
                    <li key={index}>
                      <p className="destination-details__sidebar__text">
                        <i className="icon-check-star"></i> {item.label}:
                      </p>
                      <span>{item.value}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Map */}
              <div className="destination-details__sidebar__item destination-details__sidebar__item-map">
                <iframe
                  title="Google Map"
                  src={mapEmbedUrl}
                  allowFullScreen
                  className="w-100"
                  height="300"
                ></iframe>
              </div>

            </aside>
          </div>

        </div>
      </div>
    </section>
  );
}
