// client/src/components/GoturHotelCard.jsx
import { Link } from "react-router-dom";
import { setImagePlaceholderOnError } from "../../utils/imagePlaceholder";

export default function GoturHotelCard({ hotel, apiBase }) {
  if (!hotel) return null;

  const {
    id,
    name,
    address,
    minCapacity,
    maxCapacity,
    minPrice,
    maxPrice,
    coverImage,
  } = hotel;

  const priceText = minPrice
    ? `$${minPrice} – $${maxPrice ?? minPrice} / night`
    : "No pricing info";

  const capacityText =
    minCapacity && maxCapacity
      ? `Capacity: ${minCapacity} – ${maxCapacity}`
      : "";

  const imageSrc = coverImage ? encodeURI(coverImage) : null;

  return (
    <div className="destination-card-one">
      {/* 🖼 Image section */}
      <div className="destination-card-one__thumb">
        {imageSrc ? (
          <img
            crossOrigin="anonymous"
            src={imageSrc}
            alt={name}
            onError={setImagePlaceholderOnError}
            style={{ width: "100%", height: "180px", objectFit: "cover" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "180px",
              background: "#eee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#777",
              fontSize: 14,
            }}
          >
            No Image
          </div>
        )}

        {/* Gotur overlay click area */}
        <Link
          to={`/hotels/${id}`}
          className="destination-card-one__overly"
        />
      </div>

      {/* 📄 Content section */}
      <div className="destination-card-one__content">
        <h3 className="destination-card-one__title">
          <Link to={`/hotels/${id}`}>{name}</Link>
        </h3>

        {address && (
          <p className="destination-card-one__meta" style={{ marginBottom: 4 }}>
            {address}
          </p>
        )}

        {capacityText && (
          <p className="destination-card-one__meta" style={{ marginBottom: 4 }}>
            {capacityText}
          </p>
        )}

        <p className="destination-card-one__meta">{priceText}</p>
      </div>
    </div>
  );
}
