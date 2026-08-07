import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState(() => readCartFromLocation(location));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

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

  const syncCartWithServer = async () => {
    const res = await apiClient.get("/bookings");
    const latest = res.data || [];
    const latestMap = new Map(latest.map((b) => [b.id, b]));
    const next = items.filter((x) => {
      const b = latestMap.get(x.id);
      return b && ["DRAFT", "PENDING_PAYMENT"].includes(b.status);
    });
    setItems(next);
    localStorage.setItem("bookingCartItems", JSON.stringify(next));
    return next;
  };

  // After Stripe redirect: confirm session, then continue next unpaid booking
  useEffect(() => {
    const checkout = searchParams.get("checkout");
    const sessionId = searchParams.get("session_id");
    if (checkout !== "success" || !sessionId) return;

    (async () => {
      try {
        setBusy(true);
        await apiClient.get(`/payments/session/${sessionId}`);
        const remaining = await syncCartWithServer();
        searchParams.delete("checkout");
        searchParams.delete("session_id");
        setSearchParams(searchParams, { replace: true });

        if (remaining.length) {
          setMessage("Payment received. Starting next booking checkout…");
          await startCheckout(remaining.map((x) => x.id));
        } else {
          setMessage("All selected bookings are paid.");
          localStorage.removeItem("bookingCartItems");
          setTimeout(() => navigate("/dashboard/bookings"), 800);
        }
      } catch (e) {
        setMessage(e.response?.data?.error || "Could not confirm payment session");
      } finally {
        setBusy(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (searchParams.get("checkout") === "cancel") {
      setMessage("Checkout cancelled. You can try again when ready.");
      searchParams.delete("checkout");
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCheckout = async (bookingIds) => {
    const { data } = await apiClient.post("/payments/checkout", { bookingIds });
    if (data.url) {
      window.location.href = data.url;
      return;
    }
    throw new Error("No Stripe checkout URL returned");
  };

  const payNow = async () => {
    if (!items.length) return;
    try {
      setBusy(true);
      setMessage("");
      await startCheckout(items.map((i) => i.id));
    } catch (e) {
      alert(e.response?.data?.error || e.message || "Payment failed");
      try {
        await syncCartWithServer();
      } catch {
        /* ignore */
      }
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
            {message || "No booking items selected for payment."}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-page__title">Booking Payment Cart</h1>
      {message && (
        <p style={{ color: "#0f5132", background: "#d1e7dd", padding: "0.75rem 1rem", borderRadius: 8 }}>
          {message}
        </p>
      )}
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
          <p style={{ fontSize: "0.85rem", color: "#6c757d", marginTop: "0.75rem" }}>
            You will pay securely with Stripe. Admin commission is taken automatically; the hotel
            manager receives the rest via Stripe Connect.
          </p>
        </div>

        <div className="cart-page__buttons">
          <button type="button" className="gotur-btn gotur-btn--base" onClick={payNow} disabled={busy}>
            {busy ? "Redirecting to Stripe…" : "Checkout & Pay with Stripe"}
          </button>
        </div>
      </section>
    </div>
  );
}
