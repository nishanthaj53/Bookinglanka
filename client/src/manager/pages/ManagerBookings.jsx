import { useEffect, useMemo, useState } from "react";
import apiClient from "../../services/apiClient";
import {
  apiErrorMessage,
  askConfirm,
  feedbackError,
  feedbackSuccess,
  feedbackWarning,
  useFeedback,
} from "../../context/FeedbackContext";

function formatYyyyMm(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function formatYyyyMmDd(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDate(input) {
  if (!input) return "—";
  return new Date(input).toLocaleDateString();
}

const STATUS_COLOR = {
  DRAFT: "#fd7e14",
  PENDING_PAYMENT: "#0d6efd",
  PAID: "#198754",
  CHECKED_IN: "#20c997",
  COMPLETED: "#198754",
  CANCELLED: "#dc3545",
};

const STATUS_LABEL = {
  DRAFT: "Booking Request",
  PENDING_PAYMENT: "Accepted - pending payment",
  PAID: "Booking Confirmed",
  CHECKED_IN: "Checked in",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export default function ManagerBookings() {
  const { showFeedback } = useFeedback();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyById, setBusyById] = useState({});

  const [selectedMonth, setSelectedMonth] = useState(() => formatYyyyMm(new Date()));
  const [calendarLoading, setCalendarLoading] = useState(false);
  const [calendarDays, setCalendarDays] = useState([]);
  const [calendarError, setCalendarError] = useState("");
  const [pauseModalOpen, setPauseModalOpen] = useState(false);
  const [pauseRoomId, setPauseRoomId] = useState("");
  const [pauseStartDate, setPauseStartDate] = useState("");
  const [pauseEndDate, setPauseEndDate] = useState("");
  const [pauseReason, setPauseReason] = useState("");
  const [pauseBlocks, setPauseBlocks] = useState([]);
  const [pauseLoading, setPauseLoading] = useState(false);
  const [pauseBusy, setPauseBusy] = useState(false);
  const [roomCatalog, setRoomCatalog] = useState([]);

  const fetchBookings = async () => {
    try {
      setError("");
      setLoading(true);
      const res = await apiClient.get("/manager/bookings");
      setBookings(res.data || []);
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.error || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const fetchCalendar = async (month) => {
    try {
      setCalendarError("");
      setCalendarLoading(true);
      const res = await apiClient.get("/manager/bookings/calendar/summary", {
        params: { month },
      });
      setCalendarDays(res.data?.days || []);
    } catch (e) {
      console.error(e);
      setCalendarError(e.response?.data?.error || "Failed to load calendar data");
      setCalendarDays([]);
    } finally {
      setCalendarLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    fetchCalendar(selectedMonth);
  }, [selectedMonth]);

  useEffect(() => {
    const loadRoomCatalog = async () => {
      try {
        const hotelsRes = await apiClient.get("/manager/hotels");
        const hotels = hotelsRes.data || [];
        const roomsPerHotel = await Promise.all(
          hotels.map(async (h) => {
            try {
              const roomsRes = await apiClient.get(`/manager/rooms/${h.id}`);
              const rooms = roomsRes.data || [];
              return rooms.map((r) => ({
                roomTypeId: r.id,
                roomName: r.name || "Room",
                hotelId: h.id,
                hotelName: h.name || "Hotel",
              }));
            } catch {
              return [];
            }
          })
        );
        setRoomCatalog(roomsPerHotel.flat());
      } catch (e) {
        console.error(e);
        setRoomCatalog([]);
      }
    };
    loadRoomCatalog();
  }, []);

  const decideBooking = async (bookingId, decision) => {
    try {
      setBusyById((prev) => ({ ...prev, [bookingId]: true }));
      await apiClient.patch(`/manager/bookings/${bookingId}/decision`, { decision });
      await Promise.all([fetchBookings(), fetchCalendar(selectedMonth)]);
    } catch (e) {
      console.error(e);
      feedbackError(showFeedback, apiErrorMessage(e, "Failed to update booking decision"));
    } finally {
      setBusyById((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  const remindPayment = async (bookingId) => {
    try {
      setBusyById((prev) => ({ ...prev, [bookingId]: true }));
      const res = await apiClient.post(`/manager/bookings/${bookingId}/remind-payment`);
      feedbackSuccess(showFeedback, res.data?.message || "Reminder sent to user.");
    } catch (e) {
      console.error(e);
      feedbackError(showFeedback, apiErrorMessage(e, "Failed to send reminder"));
    } finally {
      setBusyById((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  const updatable = useMemo(
    () => new Set(["PENDING_PAYMENT", "PAID", "CHECKED_IN"]),
    []
  );

  const updateStatus = async (bookingId, status) => {
    try {
      setBusyById((prev) => ({ ...prev, [bookingId]: true }));
      await apiClient.patch(`/manager/bookings/${bookingId}/status`, { status });
      await Promise.all([fetchBookings(), fetchCalendar(selectedMonth)]);
    } catch (e) {
      console.error(e);
      feedbackError(showFeedback, apiErrorMessage(e, "Failed to update booking status"));
    } finally {
      setBusyById((prev) => ({ ...prev, [bookingId]: false }));
    }
  };

  const roomOptions = useMemo(() => {
    if (roomCatalog.length) return roomCatalog;
    const map = new Map();
    for (const b of bookings) {
      const rid = b.roomType?.id;
      if (!rid || map.has(rid)) continue;
      map.set(rid, {
        roomTypeId: rid,
        roomName: b.roomType?.name || "Room",
        hotelName: b.hotel?.name || "Hotel",
      });
    }
    return Array.from(map.values());
  }, [bookings, roomCatalog]);

  const loadPauseBlocks = async (roomId) => {
    if (!roomId) {
      setPauseBlocks([]);
      return;
    }
    try {
      setPauseLoading(true);
      const res = await apiClient.get(`/manager/rooms/item/${roomId}/blocks`);
      setPauseBlocks(res.data || []);
    } catch (e) {
      console.error(e);
      setPauseBlocks([]);
    } finally {
      setPauseLoading(false);
    }
  };

  const openPauseModal = async (roomId) => {
    setPauseRoomId(roomId || "");
    setPauseStartDate("");
    setPauseEndDate("");
    setPauseReason("");
    setPauseModalOpen(true);
    await loadPauseBlocks(roomId || "");
  };

  const createPauseWindow = async (e) => {
    e.preventDefault();
    if (!pauseRoomId || !pauseStartDate || !pauseEndDate) {
      feedbackWarning(showFeedback, "Select room, start date and end date.");
      return;
    }
    try {
      setPauseBusy(true);
      const res = await apiClient.post(`/manager/rooms/item/${pauseRoomId}/blocks`, {
        startDate: pauseStartDate,
        endDate: pauseEndDate,
        reason: pauseReason.trim() || null,
      });
      const cancelledCount = Number(res.data?.cancelledCount || 0);
      if (cancelledCount > 0) {
        feedbackSuccess(
          showFeedback,
          `Pause created. ${cancelledCount} booking request(s) were cancelled due to no space.`
        );
      }
      setPauseStartDate("");
      setPauseEndDate("");
      setPauseReason("");
      await Promise.all([loadPauseBlocks(pauseRoomId), fetchCalendar(selectedMonth), fetchBookings()]);
    } catch (e2) {
      console.error(e2);
      const conflict = e2.response?.data?.conflict;
      const conflictDetail = conflict
        ? `Booked period: ${formatDate(conflict.checkIn)} -> ${formatDate(conflict.checkOut)}`
        : undefined;
      feedbackError(
        showFeedback,
        e2.response?.data?.error || "Failed to create pause window",
        conflictDetail ? { detail: conflictDetail } : undefined
      );
    } finally {
      setPauseBusy(false);
    }
  };

  const removePauseWindow = async (blockId) => {
    if (!pauseRoomId || !blockId) return;
    const ok = await askConfirm(showFeedback, {
      title: "Remove pause window",
      message: "Remove this pause window?",
      confirmLabel: "Remove",
      cancelLabel: "Cancel",
    });
    if (!ok) return;
    try {
      setPauseBusy(true);
      await apiClient.delete(`/manager/rooms/item/${pauseRoomId}/blocks/${blockId}`);
      await Promise.all([loadPauseBlocks(pauseRoomId), fetchCalendar(selectedMonth)]);
    } catch (e) {
      console.error(e);
      feedbackError(showFeedback, apiErrorMessage(e, "Failed to remove pause window"));
    } finally {
      setPauseBusy(false);
    }
  };

  const monthDate = useMemo(() => {
    const [y, m] = selectedMonth.split("-").map(Number);
    return new Date(y, (m || 1) - 1, 1);
  }, [selectedMonth]);

  const calendarGrid = useMemo(() => {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDow = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const countMap = new Map((calendarDays || []).map((d) => [d.date, d.count]));
    const cells = [];
    for (let i = 0; i < firstDow; i++) cells.push({ empty: true, id: `e-${i}` });
    for (let d = 1; d <= daysInMonth; d++) {
      const key = formatYyyyMmDd(new Date(year, month, d));
      cells.push({ empty: false, day: d, key, count: countMap.get(key) || 0 });
    }
    return cells;
  }, [monthDate, calendarDays]);

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-page__title">Hotel Bookings</h1>

      <div className="dashboard-card" style={{ marginBottom: "1rem" }}>
        <div className="dashboard-card__body">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
            <h4 style={{ margin: 0 }}>Accepted bookings calendar</h4>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{ minWidth: 180 }}
              />
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => openPauseModal(roomOptions[0]?.roomTypeId || "")}>
                Manage paused date ranges
              </button>
            </div>
          </div>

          {calendarLoading ? (
            <p style={{ margin: "1rem 0 0", color: "#6c757d" }}>Loading calendar…</p>
          ) : calendarError ? (
            <p style={{ margin: "1rem 0 0", color: "#dc3545" }}>{calendarError}</p>
          ) : (
            <div style={{ marginTop: "1rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 8, marginBottom: 8 }}>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((w) => (
                  <div key={w} style={{ fontWeight: 600, color: "#6c757d", fontSize: "0.9rem" }}>
                    {w}
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: 8 }}>
                {calendarGrid.map((cell) =>
                  cell.empty ? (
                    <div key={cell.id} style={{ minHeight: 68 }} />
                  ) : (
                    <div
                      key={cell.key}
                      style={{
                        border: "1px solid #e9ecef",
                        borderRadius: 8,
                        minHeight: 68,
                        padding: "8px 10px",
                        background: cell.count > 0 ? "#f0f7ff" : "#fff",
                      }}
                    >
                      <div style={{ fontWeight: 700 }}>{cell.day}</div>
                      <div style={{ fontSize: "0.82rem", color: cell.count > 0 ? "#0d6efd" : "#6c757d" }}>
                        {cell.count} booking{cell.count === 1 ? "" : "s"}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="dashboard-card">
          <div className="dashboard-card__body" style={{ textAlign: "center", padding: "3rem" }}>
            <p style={{ color: "#6c757d", margin: 0 }}>Loading…</p>
          </div>
        </div>
      ) : error ? (
        <div className="dashboard-card">
          <div className="dashboard-card__body" style={{ textAlign: "center", padding: "2rem", color: "#dc3545" }}>
            {error}
          </div>
        </div>
      ) : !bookings.length ? (
        <div className="dashboard-card">
          <div className="dashboard-card__body" style={{ textAlign: "center", padding: "2rem", color: "#6c757d" }}>
            No current bookings.
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {bookings.map((b) => {
            const isBusy = !!busyById[b.id];
            const isDraft = b.status === "DRAFT";
            return (
              <div key={b.id} className="dashboard-card">
                <div className="dashboard-card__body">
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "1rem" }}>
                    <div>
                      <h4 style={{ margin: "0 0 0.35rem" }}>{b.hotel?.name || "Hotel"}</h4>
                      <p style={{ margin: 0, fontSize: "0.9rem", color: "#6c757d" }}>
                        {b.user?.displayName || b.user?.email || "Guest"}
                      </p>
                      <p style={{ margin: "0.25rem 0 0", fontSize: "0.9rem" }}>
                        Room: {b.roomType?.name || "—"} | Guests: {b.guests} | Rooms: {b.rooms}
                      </p>
                      <p style={{ margin: "0.2rem 0 0", fontSize: "0.9rem" }}>
                        Check-in: {formatDate(b.checkIn)} → Check-out: {formatDate(b.checkOut)}
                      </p>
                    </div>

                    <span
                      style={{
                        padding: "0.35rem 0.65rem",
                        borderRadius: 6,
                        background: STATUS_COLOR[b.status] || "#0d6efd",
                        color: "#fff",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        alignSelf: "flex-start",
                      }}
                    >
                      {STATUS_LABEL[b.status] || b.status}
                    </span>
                  </div>
                  {b.requestExpiresAt && b.status === "DRAFT" ? (
                    <p style={{ marginTop: 8, marginBottom: 0, fontSize: "0.82rem", color: "#6c757d" }}>
                      Request expires: {new Date(b.requestExpiresAt).toLocaleString()}
                    </p>
                  ) : null}
                  {b.status === "CANCELLED" && b.cancelReason ? (
                    <p style={{ marginTop: 8, marginBottom: 0, fontSize: "0.82rem", color: "#6c757d" }}>
                      {b.cancelReason}
                    </p>
                  ) : null}

                  <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                    {isDraft && (
                      <>
                        <button
                          type="button"
                          className="btn btn-sm btn-success"
                          disabled={isBusy}
                          onClick={() => decideBooking(b.id, "ACCEPT")}
                        >
                          Accept
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          disabled={isBusy}
                          onClick={() => decideBooking(b.id, "DECLINE")}
                        >
                          Decline
                        </button>
                        {b.roomType?.id ? (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => openPauseModal(b.roomType.id)}
                          >
                            Pause dates for this room
                          </button>
                        ) : null}
                      </>
                    )}

                    {b.status === "PENDING_PAYMENT" && (
                      <>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-warning"
                          disabled={isBusy}
                          onClick={() => remindPayment(b.id)}
                        >
                          Send payment reminder
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          disabled={isBusy}
                          onClick={() => decideBooking(b.id, "DECLINE")}
                        >
                          Cancel request
                        </button>
                        {b.roomType?.id ? (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => openPauseModal(b.roomType.id)}
                          >
                            Pause dates for this room
                          </button>
                        ) : null}
                      </>
                    )}

                    {updatable.has(b.status) && (
                      <>
                        {b.status !== "CHECKED_IN" && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            disabled={isBusy}
                            onClick={() => updateStatus(b.id, "CHECKED_IN")}
                          >
                            Mark CHECKED_IN
                          </button>
                        )}
                        {b.status !== "COMPLETED" && (
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-dark"
                            disabled={isBusy}
                            onClick={() => updateStatus(b.id, "COMPLETED")}
                          >
                            Mark COMPLETED
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {pauseModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            zIndex: 1200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setPauseModalOpen(false)}
        >
          <div
            className="dashboard-card"
            style={{ width: "100%", maxWidth: 760, maxHeight: "85vh", overflow: "auto" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dashboard-card__body">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <h4 style={{ margin: 0 }}>Pause Room Booking Dates</h4>
                <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setPauseModalOpen(false)}>
                  Close
                </button>
              </div>

              <form onSubmit={createPauseWindow}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 10 }}>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label className="form-label">Room</label>
                    <select
                      className="form-control"
                      value={pauseRoomId}
                      onChange={(e) => {
                        setPauseRoomId(e.target.value);
                        loadPauseBlocks(e.target.value);
                      }}
                      required
                    >
                      <option value="">Select room</option>
                      {roomOptions.map((opt) => (
                        <option key={opt.roomTypeId} value={opt.roomTypeId}>
                          {opt.hotelName} — {opt.roomName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Start date</label>
                    <input className="form-control" type="date" value={pauseStartDate} onChange={(e) => setPauseStartDate(e.target.value)} required />
                  </div>
                  <div>
                    <label className="form-label">End date (checkout style)</label>
                    <input className="form-control" type="date" value={pauseEndDate} onChange={(e) => setPauseEndDate(e.target.value)} required />
                  </div>
                  <div style={{ gridColumn: "1 / -1" }}>
                    <label className="form-label">Reason (optional)</label>
                    <input className="form-control" value={pauseReason} onChange={(e) => setPauseReason(e.target.value)} placeholder="Manual/offline booking, maintenance, etc." />
                  </div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <button type="submit" className="btn btn-primary" disabled={pauseBusy}>
                    {pauseBusy ? "Saving..." : "Add pause range"}
                  </button>
                </div>
              </form>

              <hr />
              <h5 style={{ marginBottom: 10 }}>Existing pause windows</h5>
              {!pauseRoomId ? (
                <p style={{ color: "#6c757d", margin: 0 }}>Select a room to view pause windows.</p>
              ) : pauseLoading ? (
                <p style={{ color: "#6c757d", margin: 0 }}>Loading pause windows...</p>
              ) : !pauseBlocks.length ? (
                <p style={{ color: "#6c757d", margin: 0 }}>No pause windows set for this room.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {pauseBlocks.map((blk) => (
                    <div key={blk.id} style={{ border: "1px solid #e9ecef", borderRadius: 8, padding: 10, display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>
                          {formatDate(blk.startDate)} → {formatDate(blk.endDate)}
                        </div>
                        <div style={{ fontSize: "0.85rem", color: "#6c757d" }}>
                          {blk.reason || "No reason provided"}
                        </div>
                      </div>
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => removePauseWindow(blk.id)} disabled={pauseBusy}>
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
