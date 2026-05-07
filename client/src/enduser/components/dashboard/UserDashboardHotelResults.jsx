import { Link } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import { setImagePlaceholderOnError } from "../../../utils/imagePlaceholder";
import { BASE_URL } from "../../../services/apiClient";
import { PAGE_SIZE, stableRatingDecimal, stableReviewCount } from "../../utils/userDashboardHotelUtils";

const API_BASE = import.meta.env.VITE_API_BASE_URL || BASE_URL;

function HotelCardImage({ hotel, variant = "grid" }) {
  const src = hotel.coverImage
    ? encodeURI(hotel.coverImage.startsWith("http") ? hotel.coverImage : `${API_BASE}${hotel.coverImage}`)
    : null;

  const listStyle = { width: "100%", minHeight: 238, objectFit: "cover", display: "block" };
  const gridStyle = { width: "100%", height: "257px", objectFit: "cover", display: "block" };

  if (!src) {
    return (
      <div
        style={{
          width: "100%",
          minHeight: variant === "list" ? 238 : 257,
          height: variant === "list" ? undefined : 257,
          background: "#eee",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#999",
        }}
      >
        No image
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={hotel.name}
      onError={setImagePlaceholderOnError}
      loading="lazy"
      style={variant === "list" ? listStyle : gridStyle}
    />
  );
}

export default function UserDashboardHotelResults({
  loading,
  error,
  slice,
  filteredLength,
  safePage,
  setPage,
  totalPages,
  pageNumbers,
  emptyMessage = "No hotels match your search. Try widening price or district.",
}) {
  if (loading) {
    return (
      <div className="dashboard-card">
        <div className="dashboard-card__body" style={{ textAlign: "center", padding: "3rem" }}>
          <p className="text-muted mb-0">Loading hotels…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-card">
        <div className="dashboard-card__body" style={{ color: "#dc3545" }}>{error}</div>
      </div>
    );
  }

  if (filteredLength === 0) {
    return (
      <div className="dashboard-card">
        <div className="dashboard-card__body" style={{ textAlign: "center", padding: "2rem", color: "#6c757d" }}>
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <>
      <Row className="gutter-y-30 user-dash-hotel-list">
        {slice.map((h, index) => {
          const rating = stableRatingDecimal(h.id);
          const reviews = stableReviewCount(h.id);
          const cap =
            h.minCapacity != null && h.maxCapacity != null
              ? `${h.minCapacity}–${h.maxCapacity} guests`
              : "Flexible capacity";
          const metaLine2 = h.propertyType ? `${cap} · ${h.propertyType}` : cap;
          const globalIndex = (safePage - 1) * PAGE_SIZE + index;
          const detail = `/dashboard/hotels/${h.id}`;
          return (
            <Col md={12} key={h.id}>
              <div
                className="listing-list-card wow fadeInUp animated"
                data-wow-duration="1500ms"
                data-wow-delay={`${Math.min(index, 6) * 90}ms`}
              >
                <Row className="align-items-center">
                  <Col md={4}>
                    <div className="listing-list-card__image">
                      <HotelCardImage hotel={h} variant="list" />
                      <Link to={detail} className="listing-list-card__overlay" />
                      <div className="listing-list-card__btn-group">
                        {globalIndex === 0 ? <div className="listing-list-card__featured">Featured</div> : null}
                      </div>
                    </div>
                  </Col>
                  <Col md={8}>
                    <div className="listing-list-card__content">
                      <h3 className="listing-list-card__title">
                        <Link to={detail}>{h.name}</Link>
                      </h3>
                      <div className="listing-list-card__content__inner">
                        <ul className="listing-list-card__meta list-unstyled">
                          <li>
                            <Link to={detail}>
                              <span className="listing-list-card__meta__icon">
                                <i className="icon-pin" />
                              </span>
                              {h.address || "Sri Lanka"}
                            </Link>
                          </li>
                          <li>
                            <Link to={detail}>
                              <span className="listing-list-card__meta__icon">
                                <i className="icon-calendar" />
                              </span>
                              {metaLine2}
                            </Link>
                          </li>
                        </ul>
                        <div className="listing-list-card__price">
                          <h5 className="listing-list-card__price__number">
                            ${h.minPrice ?? "—"}
                            <span>/Per night</span>
                          </h5>
                          <div className="listing-list-card__rating">
                            <i className="icon-star" />
                            <span>
                              {rating.toFixed(1)} ({reviews} Reviews)
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          );
        })}
      </Row>

      <nav className="user-dash-pagination" aria-label="Pagination">
        <button
          type="button"
          className="user-dash-pagination__prev"
          disabled={safePage <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          Previous
        </button>
        {pageNumbers.map((n, i) =>
          n === "ellipsis" ? (
            <span key={`e-${i}`} className="text-muted">
              …
            </span>
          ) : (
            <button
              key={n}
              type="button"
              className={`user-dash-pagination__num${n === safePage ? " is-current" : ""}`}
              onClick={() => setPage(n)}
            >
              {n}
            </button>
          )
        )}
        <button
          type="button"
          className="user-dash-pagination__next"
          disabled={safePage >= totalPages}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        >
          Next
        </button>
      </nav>
    </>
  );
}
