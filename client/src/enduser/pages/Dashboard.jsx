import { useEffect, useState } from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import UserDashboardGoturLayout from "../../components/dashboard/UserDashboardGoturLayout";
import apiClient from "../../services/apiClient";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    if (location.pathname === "/dashboard" || location.pathname === "/dashboard/") {
      navigate("/dashboard/hotels", { replace: true });
    }
  }, [location.pathname, navigate]);

  useEffect(() => {
    apiClient
      .get("/bookings/reminders")
      .then((res) => setReminders(res.data || []))
      .catch(() => setReminders([]));
  }, [location.pathname]);

  const dismissReminder = async (bookingId) => {
    try {
      await apiClient.patch(`/bookings/${bookingId}/reminder-seen`);
      setReminders((prev) => prev.filter((r) => r.id !== bookingId));
    } catch {
      // ignore
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <UserDashboardGoturLayout onLogout={handleLogout}>
      {reminders.length > 0 && (
        <div
          style={{
            maxWidth: 1200,
            margin: "120px auto 16px",
            padding: "0 12px",
            position: "relative",
            zIndex: 5,
          }}
        >
          {reminders.map((r) => (
            <div
              key={r.id}
              className="alert alert-warning d-flex justify-content-between align-items-center"
              style={{ marginBottom: 10, gap: 12, flexWrap: "wrap", padding: "12px 14px" }}
            >
              <div>
                <strong>Payment reminder:</strong>{" "}
                {r.reminderMessage || "Please complete your booking payment."}{" "}
                <span style={{ color: "#6c757d" }}>
                  ({r.hotel?.name} · {new Date(r.checkIn).toLocaleDateString()} →{" "}
                  {new Date(r.checkOut).toLocaleDateString()})
                </span>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => dismissReminder(r.id)}
              >
                Mark as seen
              </button>
            </div>
          ))}
        </div>
      )}
      <Outlet />
    </UserDashboardGoturLayout>
  );
}
