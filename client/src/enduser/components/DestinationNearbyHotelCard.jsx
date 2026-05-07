import { Link } from "react-router-dom";

function getImageSrc(coverImage, apiBase) {
  if (!coverImage) return null;
  const trimmed = String(coverImage).trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  const base = (apiBase || "").replace(/\/$/, "");
  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return base ? `${base}${path}` : path;
}

export default function DestinationNearbyHotelCard({ hotel, apiBase }) {
  if (!hotel) return null;
  const imageSrc = getImageSrc(hotel.coverImage, apiBase);

  return (
    <div className="listing-card-two">
      <div className="listing-card-two__image">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={hotel.name}
            style={{ width: "100%", height: 220, objectFit: "cover", display: "block" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: 220,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#ececec",
              color: "#666",
            }}
          >
            No image
          </div>
        )}
        <Link to={`/hotels/${hotel.id}`} className="listing-card-two__overlay" />
      </div>

      <div className="listing-card-two__content">
        <h3 className="listing-card-two__title">
          <Link to={`/hotels/${hotel.id}`}>{hotel.name}</Link>
        </h3>
        <ul className="listing-card-two__meta list-unstyled">
          <li>
            <i className="icon-pin"></i> {hotel.address || "Sri Lanka"}
          </li>
          <li>
            <i className="icon-user"></i>{" "}
            {hotel.minCapacity != null && hotel.maxCapacity != null
              ? `${hotel.minCapacity}-${hotel.maxCapacity} Guests`
              : "Capacity info pending"}
          </li>
        </ul>
        <div
          style={{
            marginTop: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div className="listing-card-two__price">
            <h5>
              ${hotel.minPrice ?? "-"}
              <span>/night</span>
            </h5>
          </div>
          <Link to={`/hotels/${hotel.id}`} className="gotur-btn gotur-btn--base" style={{ padding: "8px 14px" }}>
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
