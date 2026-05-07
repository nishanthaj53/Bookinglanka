import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";

function readCartFromLocation(location) {
  if (Array.isArray(location.state?.items) && location.state.items.length) {
    return location.state.items;
  }
  try {
    const raw = localStorage.getItem("bookingCartItems");
    const arr = JSON.parse(raw || "[]");
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export default function DashboardBookingsCart() {
  const location = useLocation();
  const navigate = useNavigate();
  const [items, setItems] = useState(() => readCartFromLocation(location));
  const [busy, setBusy] = useState(false);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + Number(i.totalAmount || 0), 0),
    [items]
  );

  const removeOne = (id) => {
    setItems((prev) => {
      const next = prev.filter((x) => x.id !== id);
      localStorage.setItem("bookingCartItems", JSON.stringify(next));
      return next;
    });
  };

  const payNow = async () => {
    if (!items.length) return;
    try {
      setBusy(true);
      for (const item of items) {
        await apiClient.post(`/bookings/${item.id}/pay-success`);
      }
      localStorage.removeItem("bookingCartItems");
      alert("Payment completed for selected bookings.");
      navigate("/dashboard/bookings");
    } catch (e) {
      alert(e.response?.data?.error || "Payment failed for one or more bookings");
      await apiClient
        .get("/bookings")
        .then((res) => {
          const latest = res.data || [];
          const latestMap = new Map(latest.map((b) => [b.id, b]));
          const next = items.filter((x) => {
            const b = latestMap.get(x.id);
            return b && ["DRAFT", "PENDING_PAYMENT"].includes(b.status);
          });
          setItems(next);
          localStorage.setItem("bookingCartItems", JSON.stringify(next));
        })
        .catch(() => {});
    } finally {
      setBusy(false);
    }
  };

  if (!items.length) {
    return (
      <div className="dashboard-page">
        <h1 className="dashboard-page__title">Booking Payment Cart</h1>
        <div className="dashboard-card">
          <div className="dashboard-card__body" style={{ padding: "2rem", color: "#6c757d" }}>
            No booking items selected for payment.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-page__title">Booking Payment Cart</h1>
      <section className="cart-page">
        <div className="table-responsive">
          <table className="table cart-page__table">
            <thead>
              <tr>
                <th>Booking</th>
                <th>Package</th>
                <th>Dates</th>
                <th>Sub total</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div>
                      <strong>{item.hotelName}</strong>
                      <div style={{ color: "#6c757d", fontSize: "0.85rem" }}>
                        Booking #{item.id.slice(0, 8)}
                      </div>
                    </div>
                  </td>
                  <td>
                    {item.roomName}
                    <div style={{ color: "#6c757d", fontSize: "0.85rem" }}>
                      Rooms: {item.rooms} · Guests: {item.guests}
                    </div>
                  </td>
                  <td>
                    {new Date(item.checkIn).toLocaleDateString()} →{" "}
                    {new Date(item.checkOut).toLocaleDateString()}
                  </td>
                  <td>${Number(item.totalAmount || 0).toFixed(2)}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeOne(item.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="cart-page__coupone__list mt-3">
          <h3 className="cart-page__cart-total__title">Subtotal</h3>
          <ul className="cart-page__cart-total list-unstyled">
            <li className="cart-page__cart-total__item">
              <span>Subtotal</span>
              <span className="cart-page__cart-total-amount">${subtotal.toFixed(2)}</span>
            </li>
            <li className="cart-page__cart-total__item">
              <span>Total</span>
              <span className="cart-page__cart-total-amount">${subtotal.toFixed(2)}</span>
            </li>
          </ul>
        </div>

        <div className="cart-page__buttons">
          <button type="button" className="gotur-btn gotur-btn--base" onClick={payNow} disabled={busy}>
            {busy ? "Processing..." : "Checkout & Pay"}
          </button>
        </div>
      </section>
    </div>
  );
}
