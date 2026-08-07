import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import apiClient, { BASE_URL } from "../../services/apiClient";
import { setImagePlaceholderOnError } from "../../utils/imagePlaceholder";
import {
  apiErrorMessage,
  feedbackError,
  feedbackSuccess,
  useFeedback,
} from "../../context/FeedbackContext";

export default function DashboardHotelRooms() {
  const { showFeedback } = useFeedback();
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [rooms, setRooms] = useState(1);
  const [total, setTotal] = useState(0);
  const [slideIndex, setSlideIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get(`/hotels/${id}`).then((res) => setHotel(res.data)).catch(console.error);
  }, [id]);

  useEffect(() => {
    if (!hotel || !checkIn || !checkOut) return;
    const nights = (new Date(checkOut) - new Date(checkIn)) / (1000 * 3600 * 24);
    if (nights > 0) {
      const pricePerNight = hotel.rooms?.[0]?.pricePerNight || 0;
      setTotal(nights * rooms * pricePerNight);
    }
  }, [checkIn, checkOut, rooms, hotel]);

  const handleBookNow = async (roomId) => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      localStorage.setItem("pendingHotel", id);
      navigate(`/login?redirect=/dashboard/hotels/${id}`);
      return;
    }
    try {
      await apiClient.post("/bookings", {
        hotelId: id,
        roomTypeId: roomId,
        checkIn,
        checkOut,
        currency: "USD",
        guests: 2,
        rooms,
      });
      feedbackSuccess(showFeedback, "Booking created successfully (Draft)!", {
        title: "Booking created",
        onConfirm: () => navigate("/dashboard/bookings"),
      });
    } catch (err) {
      feedbackError(showFeedback, apiErrorMessage(err, "Booking failed"));
    }
  };

  if (!hotel) {
    return (
      <div className="dashboard-page">
        <h1 className="dashboard-page__title">Hotel</h1>
        <div className="dashboard-card">
          <div className="dashboard-card__body" style={{ textAlign: "center", padding: "3rem" }}>
            Loading hotel details…
          </div>
        </div>
      </div>
    );
  }

  const cover = hotel.images?.find((i) => i.isCover) || hotel.images?.[0];
  const others = hotel.images?.filter((i) => !i.isCover) || [];

  const imgUrl = (url) =>
    url ? (url.startsWith("http") ? url : `${BASE_URL}${url}`) : null;

  return (
    <div className="dashboard-page">
      <div style={{ marginBottom: "1rem" }}>
        <Link to="/dashboard/hotels" style={{ color: "#0d6efd", textDecoration: "none", fontSize: "0.9rem" }}>
          ← Back to Hotels
        </Link>
      </div>
      <h1 className="dashboard-page__title">{hotel.name}</h1>
      <p style={{ color: "#6c757d", marginBottom: "1.25rem" }}>{hotel.address}</p>

      {cover && (
        <div className="dashboard-card" style={{ marginBottom: "1.25rem" }}>
          <div className="dashboard-card__body" style={{ padding: 0 }}>
            <img
              crossOrigin="anonymous"
              src={encodeURI(imgUrl(cover.url))}
              alt="Cover"
              onError={setImagePlaceholderOnError}
              style={{ width: "100%", maxHeight: 320, objectFit: "cover", cursor: "pointer", display: "block" }}
              onClick={() => setSlideIndex(0)}
            />
            <div style={{ display: "flex", gap: 6, padding: 8, flexWrap: "wrap" }}>
              {others.slice(0, 4).map((img, i) => (
                <img
                  key={i}
                  crossOrigin="anonymous"
                  src={encodeURI(imgUrl(img.url))}
                  alt=""
                  onError={setImagePlaceholderOnError}
                  style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 6, cursor: "pointer" }}
                  onClick={() => setSlideIndex(i + 1)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {slideIndex !== null && (
        <div
          onClick={() => setSlideIndex(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999,
          }}
        >
          <img
            crossOrigin="anonymous"
            src={encodeURI(imgUrl(hotel.images?.[slideIndex]?.url))}
            alt="Slide"
            onError={setImagePlaceholderOnError}
            style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: 8, boxShadow: "0 0 20px rgba(0,0,0,0.5)" }}
            onClick={(e) => e.stopPropagation()}
          />
          <button type="button" onClick={(e) => { e.stopPropagation(); setSlideIndex((i) => (i > 0 ? i - 1 : hotel.images.length - 1)); }} style={{ position: "absolute", left: 16, background: "none", border: "none", color: "#fff", fontSize: 28, cursor: "pointer" }}>‹</button>
          <button type="button" onClick={(e) => { e.stopPropagation(); setSlideIndex((i) => (i + 1) % hotel.images.length); }} style={{ position: "absolute", right: 16, background: "none", border: "none", color: "#fff", fontSize: 28, cursor: "pointer" }}>›</button>
        </div>
      )}

      <div className="dashboard-card" style={{ marginBottom: "1.25rem" }}>
        <div className="dashboard-card__header">Dates & rooms</div>
        <div className="dashboard-card__body">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
            <div className="dashboard-form-group" style={{ marginBottom: 0, minWidth: "140px" }}>
              <label>Check-in</label>
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
            </div>
            <div className="dashboard-form-group" style={{ marginBottom: 0, minWidth: "140px" }}>
              <label>Check-out</label>
              <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
            </div>
            <div className="dashboard-form-group" style={{ marginBottom: 0, width: "80px" }}>
              <label>Rooms</label>
              <input type="number" min={1} value={rooms} onChange={(e) => setRooms(Number(e.target.value))} />
            </div>
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>Rooms</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {hotel.rooms?.map((room) => {
          const coverImg = room.images?.find((i) => i.isCover) || room.images?.[0];
          return (
            <div key={room.id} className="dashboard-card">
              <div className="dashboard-card__body">
                <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                  {coverImg && (
                    <img
                      crossOrigin="anonymous"
                      src={encodeURI(imgUrl(coverImg.url))}
                      alt={room.name}
                      onError={setImagePlaceholderOnError}
                      style={{ width: "100%", maxWidth: 280, height: 180, objectFit: "cover", borderRadius: 8 }}
                    />
                  )}
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <h4 style={{ margin: "0 0 0.5rem" }}>{room.name}</h4>
                    <p style={{ margin: "0 0 0.5rem" }}>
                      <Link to={`/hotels/${id}/room/${room.id}`} style={{ fontSize: "0.9rem" }}>
                        View room page
                      </Link>
                    </p>
                    <p style={{ margin: 0, color: "#6c757d" }}>Capacity: {room.capacity} guests</p>
                    <p style={{ margin: "0.25rem 0" }}>Price per night: <strong>${room.pricePerNight}</strong></p>
                    <p style={{ margin: "0.5rem 0" }}>
                      Estimated total: <strong>${checkIn && checkOut ? total : "—"}</strong>
                    </p>
                    <button type="button" className="dashboard-btn dashboard-btn--primary" style={{ marginTop: "0.5rem" }} onClick={() => handleBookNow(room.id)}>
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
