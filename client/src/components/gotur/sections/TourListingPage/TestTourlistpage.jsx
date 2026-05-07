import { useEffect, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import CustomReactSelect from "../../common/CustomReactSelect/CustomReactSelect";
import { setImagePlaceholderOnError } from "../../../../../utils/imagePlaceholder";

export default function HotelSearchWithFilters() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const [hotels, setHotels] = useState([]);
  const [filters, setFilters] = useState({
    city: "",
    minPrice: "",
    maxPrice: "",
    capacity: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value) query.append(key, value);
      });

      const res = await fetch(`${API_BASE}/hotels?${query.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch hotels");

      const data = await res.json();
      setHotels(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels(); // load all hotels initially
  }, []);

  const onFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <section className="tour-listing-page section-space">
      <Container>

        {/* FILTER UI */}
        <div className="listing-from">
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              fetchHotels();
            }}
          >
            <Row className="gutter-y-20 gutter-x-20">
              <Col lg={3} md={4} sm={6}>
                <CustomReactSelect
                  value={filters.city}
                  onChange={(val) => onFilterChange("city", val)}
                  placeholder="City"
                />
              </Col>

              <Col lg={3} md={4} sm={6}>
                <CustomReactSelect
                  value={filters.minPrice}
                  onChange={(val) => onFilterChange("minPrice", val)}
                  placeholder="Min Price"
                />
              </Col>

              <Col lg={3} md={4} sm={6}>
                <CustomReactSelect
                  value={filters.maxPrice}
                  onChange={(val) => onFilterChange("maxPrice", val)}
                  placeholder="Max Price"
                />
              </Col>

              <Col lg={3} md={4} sm={6}>
                <CustomReactSelect
                  value={filters.capacity}
                  onChange={(val) => onFilterChange("capacity", val)}
                  placeholder="Guests"
                />
              </Col>

              <Col lg={3}>
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
          {hotels.map((h) => (
            <Col lg={4} md={6} key={h.id}>
              <div className="listing-card-two">
                <div className="listing-card-two__image">
                  <img
                    src={encodeURI(h.coverImage)}
                    alt={h.name}
                    onError={setImagePlaceholderOnError}
                  />
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
                      {h.minCapacity}–{h.maxCapacity} Guests
                    </li>
                  </ul>

                  <div className="listing-card-two__price">
                    <h5>
                      ${h.minPrice}
                      <span>/night</span>
                    </h5>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
}
