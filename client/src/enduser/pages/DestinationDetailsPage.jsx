import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Accordion } from "react-bootstrap";
import TinySlider from "tiny-slider-react";
import "tiny-slider/dist/tiny-slider.css";

import TopbarOne from "../../components/gotur/common/TopbarOne/TopbarOne";
import HeaderTwo from "../../components/gotur/layout/HeaderTwo/HeaderTwo";
import HeaderTwoCloned from "../../components/gotur/layout/HeaderTwoCloned/HeaderTwoCloned";
import FooterOne from "../../components/gotur/layout/FooterOne/FooterOne";
import Layout from "../../components/gotur/layout/Layout/Layout";
import DestinationNearbyHotelCard from "../components/DestinationNearbyHotelCard";

function splitParagraphs(text) {
  return String(text || "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function splitLines(text) {
  return String(text || "")
    .split(/\n/)
    .map((line) => line.replace(/^[-•]\s*/, "").trim())
    .filter(Boolean);
}

function toImageSrc(path, apiBase) {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/images/")) return path;
  return `${apiBase.replace(/\/$/, "")}${path.startsWith("/") ? path : `/${path}`}`;
}

export default function DestinationDetailsPage() {
  const { slug = "" } = useParams();
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const [destination, setDestination] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadDetails() {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(`${API_BASE}/destinations/${slug}`);
        if (!res.ok) {
          throw new Error("Destination not found");
        }
        const data = await res.json();
        if (mounted) setDestination(data);
      } catch (err) {
        if (mounted) {
          setDestination(null);
          setError(err.message || "Failed to load destination");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (slug) {
      loadDetails();
    } else {
      setLoading(false);
      setError("Invalid destination");
    }

    return () => {
      mounted = false;
    };
  }, [API_BASE, slug]);

  const sliderImages = useMemo(() => {
    const gallery = Array.isArray(destination?.galleryImages) ? destination.galleryImages : [];
    const all = [destination?.coverImageUrl, ...gallery].filter(Boolean);
    return all.length ? all : ["https://placehold.co/1200x700?text=Destination"];
  }, [destination]);

  const mapSrc = useMemo(() => {
    if (destination?.mapEmbedUrl) return destination.mapEmbedUrl;
    const query = [destination?.town, destination?.district, "Sri Lanka"]
      .filter(Boolean)
      .join(", ");
    if (!query) return null;
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=11&output=embed`;
  }, [destination]);

  return (
    <Layout>
      <TopbarOne />
      <HeaderTwo />
      <HeaderTwoCloned />

      <section className={`destination-details section-space destination-theme destination-theme--${slug}`}>
        <div className="container">
          {loading && <p>Loading destination...</p>}
          {!loading && error && <p style={{ color: "red" }}>{error}</p>}

          {!loading && !error && destination && (
            <>
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
                    {sliderImages.map((img, idx) => (
                      <div key={idx}>
                        <div className="destination-carousel__item">
                          <img
                            src={toImageSrc(img, API_BASE)}
                            alt={destination.name}
                          />
                        </div>
                      </div>
                    ))}
                  </TinySlider>
                </div>
              </div>

              <div className="row gutter-y-30">
                <div className="col-lg-8">
                  <div className="destination-details__content">
                    <div className="destination-details__content__item destination-details__about">
                      <h3 className="destination-details__title">
                        About {destination.name}
                      </h3>
                      {splitParagraphs(destination.overview).map((para, idx) => (
                        <p className="destination-details__text" key={idx}>
                          {para}
                        </p>
                      ))}
                      {!destination.overview && (
                        <p className="destination-details__text">
                          Details will be updated by admin soon.
                        </p>
                      )}
                    </div>

                    <div className="destination-details__content__item destination-details__why">
                      <h3 className="destination-details__title">
                        Why Visit {destination.name}
                      </h3>
                      {splitLines(destination.whyVisit).length > 1 ? (
                        <ul className="destination-details__why-list">
                          {splitLines(destination.whyVisit).map((line, idx) => (
                            <li key={idx}>{line}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="destination-details__text">
                          {destination.whyVisit ||
                            "This destination is worth exploring with nearby stays."}
                        </p>
                      )}
                    </div>

                    <div className="destination-details__content__item destination-details__nearby">
                      <h3 className="destination-details__title">
                        Nearby Hotels in {destination.name}
                      </h3>
                      <p className="destination-details__nearby-lead">
                        Active stays in {destination.town || destination.name}
                        {destination.district ? `, ${destination.district}` : ""}.
                      </p>
                      <div className="row gutter-y-30">
                        {(destination.nearbyHotels || []).map((hotel) => (
                          <div className="col-md-6" key={hotel.id}>
                            <DestinationNearbyHotelCard hotel={hotel} apiBase={API_BASE} />
                          </div>
                        ))}
                        {!destination.nearbyHotels?.length && (
                          <p className="destination-details__text">
                            No active hotels found yet for this district/town.
                          </p>
                        )}
                      </div>
                    </div>

                    {!!destination.faqs?.length && (
                      <div className="destination-details__content__faq">
                        <h3 className="destination-details__title">
                          Frequently asked questions
                        </h3>
                        <div className="faq-page__accordion faq-accordion gotur-accordion">
                          <Accordion defaultActiveKey="0">
                            {destination.faqs.map((faq, idx) => (
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
                    )}
                  </div>
                </div>

                <div className="col-lg-4">
                  <aside className="destination-details__sidebar">
                    <div className="destination-details__sidebar__item destination-details__sidebar__item-list">
                      <h4 className="destination-details__sidebar__title">Some Information</h4>
                      <ul className="destination-details__sidebar__list">
                        <li>
                          <p className="destination-details__sidebar__text">
                            <i className="icon-check-star"></i> District:
                          </p>
                          <span>{destination.district || "-"}</span>
                        </li>
                        <li>
                          <p className="destination-details__sidebar__text">
                            <i className="icon-check-star"></i> Town:
                          </p>
                          <span>{destination.town || "-"}</span>
                        </li>
                        <li>
                          <p className="destination-details__sidebar__text">
                            <i className="icon-check-star"></i> Region:
                          </p>
                          <span>{destination.region || "-"}</span>
                        </li>
                        <li>
                          <p className="destination-details__sidebar__text">
                            <i className="icon-check-star"></i> Best for:
                          </p>
                          <span>{destination.bestFor || "-"}</span>
                        </li>
                      </ul>
                    </div>

                    {!!mapSrc && (
                      <div className="destination-details__sidebar__item destination-details__sidebar__item-map">
                        <iframe
                          title={`${destination.name} map`}
                          src={mapSrc}
                          allowFullScreen
                          className="w-100"
                          height="300"
                        ></iframe>
                      </div>
                    )}
                  </aside>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      <FooterOne />
    </Layout>
  );
}
