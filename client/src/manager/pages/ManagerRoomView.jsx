import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import apiClient from "../../services/apiClient";
import RoomDetailViewCore from "../../components/room/RoomDetailViewCore";

export default function ManagerRoomView() {
  const { hotelId, roomId } = useParams();
  const [payload, setPayload] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await apiClient.get(`/manager/rooms/item/${roomId}`);
        if (!cancelled) setPayload(res.data);
      } catch (e) {
        if (!cancelled) setError(e.response?.data?.error || e.message || "Failed to load room");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [roomId]);

  if (loading) {
    return (
      <div className="dashboard-page" style={{ padding: "2rem" }}>
        Loading room…
      </div>
    );
  }

  if (error || !payload?.room || !payload?.hotel) {
    return (
      <div className="dashboard-page" style={{ padding: "2rem" }}>
        <p style={{ color: "#c00" }}>{error || "Room not found."}</p>
        <Link to={`/manager/dashboard/hotels/${hotelId}`}>← Back to hotel</Link>
      </div>
    );
  }

  const { room, hotel, canEdit, activeBooking } = payload;
  const checkoutLabel = activeBooking?.checkOut
    ? new Date(activeBooking.checkOut).toLocaleDateString(undefined, { dateStyle: "medium" })
    : null;

  return (
    <div className="manager-room-guest-preview" dir="ltr">
      <div className="manager-room-guest-preview__context border-bottom bg-light px-3 py-2">
        <div className="text-muted text-uppercase small fw-semibold mb-0" style={{ letterSpacing: "0.04em" }}>
          Managing
        </div>
        <div className="fw-bold">{hotel.name}</div>
        {hotel.address ? <div className="small text-muted mb-0">{hotel.address}</div> : null}
      </div>
      <div className="manager-room-guest-preview__toolbar">
        <Container className="py-2 py-md-3">
          <div className="d-flex flex-wrap align-items-center gap-2 gap-md-3">
            <Link to={`/manager/dashboard/hotels/${hotelId}`} className="text-decoration-none fw-semibold">
              ← Back to hotel
            </Link>
            {canEdit ? (
              <Link className="gotur-btn" style={{ fontSize: "0.9rem", padding: "8px 18px" }} to={`/manager/dashboard/hotels/${hotelId}/rooms?edit=${roomId}`}>
                Edit room
              </Link>
            ) : (
              <span className="text-muted small" style={{ maxWidth: 520 }}>
                Editing is disabled while a guest booking is active. It unlocks after checkout
                {checkoutLabel ? ` (${checkoutLabel})` : ""}.
              </span>
            )}
          </div>
        </Container>
      </div>

      <RoomDetailViewCore hotel={hotel} room={room} hotelId={hotelId} showBookForm={false} managerPreview />
    </div>
  );
}
