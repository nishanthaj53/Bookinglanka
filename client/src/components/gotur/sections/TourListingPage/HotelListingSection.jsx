import { useState, useCallback, useEffect, useMemo } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Link } from "react-router-dom";

import {
  PagerChevronLeft,
  PagerChevronRight,
} from "../../common/LandingPagerArrows/LandingPagerArrows";
import TextAnimation from "../../common/AnimatedText/TextAnimation";

const hotelsSectionTitle = {
  tagline: "Hotels",
  title: "Featured",
  highlight: "Hotels",
};

/**
 * Build image URL for card images.
 * - Absolute URLs (http/https) are used as-is.
 * - Relative upload paths are prefixed with apiBase.
 */
function getImageSrc(coverImage, apiBase) {
  if (!coverImage) return null;
  const trimmed = (coverImage + "").trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  if (path.startsWith("/images/")) return path;
  const base = (apiBase || "").replace(/\/$/, "");
  return base ? `${base}${path}` : path;
}

function HotelCardImage({ hotel, apiBase }) {
  const [failed, setFailed] = useState(false);
  const src = getImageSrc(hotel.coverImage, apiBase);

  const handleError = useCallback(() => {
    setFailed(true);
  }, []);

  if (failed || !src) {
    return (
      <div
        className="listing-card-two__image-placeholder"
        style={{
          width: "100%",
          height: "100%",
          minHeight: "257px",
          background: "#eee",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#999",
        }}
      >
        No Image
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={hotel.name}
      onError={handleError}
      loading="lazy"
      style={{
        width: "100%",
        height: "257px",
        objectFit: "cover",
        display: "block",
      }}
    />
  );
}

const HOTELS_PAGE_SIZE = 9;

export default function HotelListingSection({
  hotels = [],
  loading = false,
  error = "",
  filters = {},
  onFilterChange,
  onSearch,
  apiBase,
}) {
  const [hotelPage, setHotelPage] = useState(0);

  const hotelTotalPages = Math.max(1, Math.ceil(hotels.length / HOTELS_PAGE_SIZE));

  useEffect(() => {
    setHotelPage((p) => Math.min(Math.max(0, p), hotelTotalPages - 1));
  }, [hotels, hotelTotalPages]);

  const visibleHotels = useMemo(
    () =>
      hotels.slice(
        hotelPage * HOTELS_PAGE_SIZE,
        hotelPage * HOTELS_PAGE_SIZE + HOTELS_PAGE_SIZE
      ),
    [hotels, hotelPage]
  );

  return (
    <section className="tour-listing-page section-space" id="properties">
      <Container>
        <div className="sec-title text-center">
          <h6 className="sec-title__tagline bw-split-in-right">
            <TextAnimation
              text={hotelsSectionTitle.tagline}
              animationType="right"
            />
          </h6>

          <h3 className="sec-title__title bw-split-in-left d-flex gap-2 justify-content-center">
            <TextAnimation
              text={hotelsSectionTitle.title}
              animationType="left"
            />
            <span>
              <TextAnimation
                text={hotelsSectionTitle.highlight}
                animationType="left"
              />
            </span>
          </h3>
        </div>

        {/* FILTER UI – native inputs so it works without option lists */}
        <div className="listing-from">
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              onSearch?.();
            }}
          >
            <Row className="gutter-y-20 gutter-x-20">
              <Col lg={3} md={4} sm={6}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="City"
                  value={filters.city ?? ""}
                  onChange={(e) => onFilterChange?.("city", e.target.value)}
                  style={{
                    height: "56px",
                    borderRadius: "8px",
                    border: "1px solid var(--gotur-border-color, #e5e5e5)",
                  }}
                />
              </Col>
              <Col lg={3} md={4} sm={6}>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Min Price"
                  value={filters.minPrice ?? ""}
                  onChange={(e) =>
                    onFilterChange?.("minPrice", e.target.value)
                  }
                  min={0}
                  style={{
                    height: "56px",
                    borderRadius: "8px",
                    border: "1px solid var(--gotur-border-color, #e5e5e5)",
                  }}
                />
              </Col>
              <Col lg={3} md={4} sm={6}>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Max Price"
                  value={filters.maxPrice ?? ""}
                  onChange={(e) =>
                    onFilterChange?.("maxPrice", e.target.value)
                  }
                  min={0}
                  style={{
                    height: "56px",
                    borderRadius: "8px",
                    border: "1px solid var(--gotur-border-color, #e5e5e5)",
                  }}
                />
              </Col>
              <Col lg={3} md={4} sm={6}>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Guests"
                  value={filters.capacity ?? ""}
                  onChange={(e) =>
                    onFilterChange?.("capacity", e.target.value)
                  }
                  min={1}
                  style={{
                    height: "56px",
                    borderRadius: "8px",
                    border: "1px solid var(--gotur-border-color, #e5e5e5)",
                  }}
                />
              </Col>
              <Col lg={12} className="d-flex justify-content-center mt-3">
                <button type="submit" className="gotur-btn">
                  Search Now
                </button>
              </Col>
            </Row>
          </Form>
        </div>

        {/* RESULTS */}
        {loading && <p>Loading hotels…</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <Row className="gutter-y-40">
          {!loading && !error && visibleHotels.map((h) => (
            <Col lg={4} md={6} key={h.id}>
              <div className="listing-card-two">
                <div className="listing-card-two__image">
                  <HotelCardImage hotel={h} apiBase={apiBase} />
                  <Link
                    to={`/hotels/${h.id}`}
                    className="listing-card-two__overlay"
                  />
                </div>

                <div className="listing-card-two__content">
                  <h3 className="listing-card-two__title">
                    <Link to={`/hotels/${h.id}`}>{h.name}</Link>
                  </h3>

                  <ul className="listing-card-two__meta list-unstyled">
                    <li>
                      <i className="icon-pin"></i> {h.address}
                    </li>
                    <li>
                      <i className="icon-user"></i>{" "}
                      {h.minCapacity != null && h.maxCapacity != null
                        ? `${h.minCapacity}–${h.maxCapacity} Guests`
                        : "—"}
                    </li>
                  </ul>

                  <div className="listing-card-two__price">
                    <h5>
                      ${h.minPrice ?? "—"}
                      <span>/night</span>
                    </h5>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {!loading && !error && hotels.length > HOTELS_PAGE_SIZE && (
          <div className="landing-hotel-pager">
            <button
              type="button"
              className="landing-hotel-pager__arrow"
              aria-label="Previous hotels"
              disabled={hotelPage <= 0}
              onClick={() => setHotelPage((p) => Math.max(0, p - 1))}
            >
              <PagerChevronLeft />
            </button>

            <div className="landing-hotel-pager__nums" role="navigation" aria-label="Hotel pages">
              {Array.from({ length: hotelTotalPages }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`landing-hotel-pager__num${
                    i === hotelPage ? " is-active" : ""
                  }`}
                  aria-label={`Hotels page ${i + 1}`}
                  aria-current={i === hotelPage ? "page" : undefined}
                  onClick={() => setHotelPage(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="landing-hotel-pager__arrow"
              aria-label="Next hotels"
              disabled={hotelPage >= hotelTotalPages - 1}
              onClick={() =>
                setHotelPage((p) => Math.min(hotelTotalPages - 1, p + 1))
              }
            >
              <PagerChevronRight />
            </button>
          </div>
        )}
      </Container>
    </section>
  );
}
