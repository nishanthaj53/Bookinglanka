import { useMemo } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import TextAnimation from "../../common/AnimatedText/TextAnimation";
import {
  PROPERTY_TYPES,
  formatPropertyPrice,
} from "../../../../data/propertyListings";

const inputStyle = {
  height: "56px",
  borderRadius: "8px",
  border: "1px solid var(--gotur-border-color, #e5e5e5)",
};

export default function PropertyListingSection({
  listings = [],
  filters = {},
  cities = [],
  onFilterChange,
  onSearch,
}) {
  const typeLabel = useMemo(() => {
    const match = PROPERTY_TYPES.find((t) => t.value === filters.type);
    return match ? match.label : "Properties";
  }, [filters.type]);

  return (
    <section className="tour-listing-page section-space" id="property-sale">
      <Container>
        <div className="sec-title text-center">
          <h6 className="sec-title__tagline bw-split-in-right">
            <TextAnimation text="Property" animationType="right" />
          </h6>
          <h3 className="sec-title__title bw-split-in-left d-flex gap-2 justify-content-center flex-wrap">
            <TextAnimation text="For" animationType="left" />
            <span>
              <TextAnimation text="Sale" animationType="left" />
            </span>
          </h3>
          <p className="destination-details__text" style={{ marginTop: 12 }}>
            Land, houses, and apartments listed for sale in Sri Lanka. Search or pick a type.
          </p>
        </div>

        <div className="listing-from">
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              onSearch?.();
            }}
          >
            <Row className="gutter-y-20 gutter-x-20">
              <Col lg={3} md={6}>
                <select
                  className="form-control"
                  value={filters.type || ""}
                  onChange={(e) => onFilterChange?.("type", e.target.value)}
                  style={inputStyle}
                  aria-label="Property type"
                >
                  <option value="">All types</option>
                  {PROPERTY_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </Col>
              <Col lg={3} md={6}>
                <select
                  className="form-control"
                  value={filters.city || ""}
                  onChange={(e) => onFilterChange?.("city", e.target.value)}
                  style={inputStyle}
                  aria-label="City"
                >
                  <option value="">All cities</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </Col>
              <Col lg={2} md={6}>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Min price (LKR)"
                  value={filters.minPrice ?? ""}
                  onChange={(e) => onFilterChange?.("minPrice", e.target.value)}
                  min={0}
                  style={inputStyle}
                />
              </Col>
              <Col lg={2} md={6}>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Max price (LKR)"
                  value={filters.maxPrice ?? ""}
                  onChange={(e) => onFilterChange?.("maxPrice", e.target.value)}
                  min={0}
                  style={inputStyle}
                />
              </Col>
              <Col lg={2} md={12}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search"
                  value={filters.q ?? ""}
                  onChange={(e) => onFilterChange?.("q", e.target.value)}
                  style={inputStyle}
                />
              </Col>
              <Col lg={12} className="d-flex justify-content-center mt-3 gap-2 flex-wrap">
                <button type="submit" className="gotur-btn">
                  Search Now
                </button>
              </Col>
            </Row>
          </Form>
        </div>

        <div className="d-flex justify-content-center flex-wrap gap-2 mb-4 property-type-chips">
          <button
            type="button"
            className={`property-type-chip${!filters.type ? " is-active" : ""}`}
            onClick={() => onFilterChange?.("type", "")}
          >
            All
          </button>
          {PROPERTY_TYPES.map((t) => (
            <button
              type="button"
              key={t.value}
              className={`property-type-chip${filters.type === t.value ? " is-active" : ""}`}
              onClick={() => onFilterChange?.("type", t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <p className="text-center mb-4">
          Showing {listings.length} {typeLabel.toLowerCase()}
        </p>

        <Row className="gutter-y-40">
          {listings.map((item) => (
            <Col lg={4} md={6} key={item.id}>
              <div className="listing-card-two">
                <div className="listing-card-two__image">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    style={{
                      width: "100%",
                      height: "257px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <Link
                    to={`/property/${item.id}`}
                    className="listing-card-two__overlay"
                  />
                </div>
                <div className="listing-card-two__content">
                  <h3 className="listing-card-two__title">
                    <Link to={`/property/${item.id}`}>{item.name}</Link>
                  </h3>
                  <ul className="listing-card-two__meta list-unstyled">
                    <li>
                      <i className="icon-pin"></i> {item.address}
                    </li>
                    <li>
                      <i className="icon-check-star"></i>{" "}
                      {PROPERTY_TYPES.find((t) => t.value === item.type)?.label} · {item.size}
                    </li>
                  </ul>
                  <div className="listing-card-two__price">
                    <h5>
                      {formatPropertyPrice(item.price)}
                      <span> asking</span>
                    </h5>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>

        {!listings.length && (
          <p className="text-center mt-4">No properties match this search. Try another type or city.</p>
        )}
      </Container>
    </section>
  );
}
