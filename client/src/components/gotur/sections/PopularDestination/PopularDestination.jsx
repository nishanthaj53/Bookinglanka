import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { sectionTitle } from "../../../../data/destinationData";

import TextAnimation from "../../common/AnimatedText/TextAnimation";
import {
  PagerChevronLeft,
  PagerChevronRight,
} from "../../common/LandingPagerArrows/LandingPagerArrows";

const DESTINATIONS_PAGE_SIZE = 4;

const PopularDestinations = () => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const [destinations, setDestinations] = useState([]);
  const [destPage, setDestPage] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function loadDestinations() {
      try {
        const res = await fetch(`${API_BASE}/destinations`);
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) setDestinations(Array.isArray(data) ? data : []);
      } catch {
        if (mounted) setDestinations([]);
      }
    }

    loadDestinations();
    return () => {
      mounted = false;
    };
  }, [API_BASE]);

  const destTotalPages = Math.max(1, Math.ceil(destinations.length / DESTINATIONS_PAGE_SIZE));

  useEffect(() => {
    setDestPage((p) => Math.min(Math.max(0, p), destTotalPages - 1));
  }, [destinations, destTotalPages]);

  const visibleDestinations = useMemo(
    () =>
      destinations.slice(
        destPage * DESTINATIONS_PAGE_SIZE,
        destPage * DESTINATIONS_PAGE_SIZE + DESTINATIONS_PAGE_SIZE
      ),
    [destinations, destPage]
  );

  const resolveImage = (path) => {
    if (!path) return null;
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const base = API_BASE?.replace(/\/$/, "") || "";
    return `${base}${path.startsWith("/") ? path : `/${path}`}`;
  };

  const cardSrc = (dest) =>
    resolveImage(dest.cardImageUrl || dest.coverImageUrl) ||
    "https://placehold.co/600x400?text=Destination";

  return (
    <section className="popular-destination section-space" id="destination">
      <div className="container">
        <div className="sec-title text-center">
          <h6 className="sec-title__tagline bw-split-in-right">
            <TextAnimation
              text={sectionTitle.tagline}
              animationType="right"
            />
          </h6>

          <h3 className="sec-title__title bw-split-in-left d-flex gap-2 justify-content-center">
            <TextAnimation
              text={sectionTitle.title}
              animationType="left"
            />
            <span>
              <TextAnimation
                text={sectionTitle.highlight}
                animationType="left"
              />
            </span>
          </h3>
        </div>

        <div className="row gx-3 gy-3">
          {visibleDestinations.map((dest, idx) => (
            <div
              key={dest.id}
              className="col-xl-3 col-lg-4 col-md-4 col-sm-6"
            >
              <div
                className="destinations-card wow fadeInUp"
                data-wow-duration="1500ms"
                data-wow-delay={`${100 + idx * 100}ms`}
              >
                <div className="destinations-card__thumb">
                  <img
                    src={cardSrc(dest)}
                    alt={`${dest.name} image`}
                    className="img-fluid"
                  />

                  <div className="destinations-card__group-card">
                    <p className="destinations-card__group-card__text">
                      {dest.town || "Sri Lanka"}
                    </p>
                    <p className="destinations-card__group-card__text">
                      {dest.hotelsCount} Hotels
                    </p>
                  </div>
                </div>

                <h4 className="destinations-card__title">
                  <Link to={`/destinations/${dest.slug}`}>
                    {dest.name}
                  </Link>
                </h4>
              </div>
            </div>
          ))}
        </div>

        {destinations.length > DESTINATIONS_PAGE_SIZE && (
          <div
            className="destinations-two__bottom__nav justify-content-center mt-4"
            style={{ justifyContent: "center" }}
          >
            <button
              type="button"
              className="destinations-two__carousel__nav--left"
              aria-label="Previous destinations"
              disabled={destPage <= 0}
              onClick={() => setDestPage((p) => Math.max(0, p - 1))}
            >
              <PagerChevronLeft />
            </button>
            <button
              type="button"
              className="destinations-two__carousel__nav--right"
              aria-label="Next destinations"
              disabled={destPage >= destTotalPages - 1}
              onClick={() =>
                setDestPage((p) => Math.min(destTotalPages - 1, p + 1))
              }
            >
              <PagerChevronRight />
            </button>
          </div>
        )}
      </div>

      <div className="popular-destination__element">
        <img
          src={sectionTitle.shape}
          alt="decoration shape"
        />
      </div>
    </section>
  );
};

export default PopularDestinations;
