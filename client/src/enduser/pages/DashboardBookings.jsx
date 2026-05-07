import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient, { BASE_URL } from "../../services/apiClient";
import { setImagePlaceholderOnError } from "../../utils/imagePlaceholder";

const STATUS_COLORS = {
  DRAFT: "#6c757d",
  PENDING_PAYMENT: "#fd7e14",
  PAID: "#198754",
  CHECKED_IN: "#0d6efd",
  COMPLETED: "#20c997",
  CANCELLED: "#dc3545",
};

const STATUS_LABELS = {
  DRAFT: "Booking Request",
  PENDING_PAYMENT: "Accepted - pending payment",
  PAID: "Booking Confirmed",
  CHECKED_IN: "Checked in",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

export default function DashboardBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("LATEST");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ checkIn: "", checkOut: "", rooms: 1, guests: 1 });
  const [editBusy, setEditBusy] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    apiClient
      .get("/bookings")
      .then((res) => setBookings(res.data || []))
      .catch((err) => setError(err.response?.data?.error || "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const sortedBookings = useMemo(() => {
    const rows = [...bookings];
    rows.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === "OLDEST") {
      rows.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "CHECKIN_ASC") {
      rows.sort((a, b) => new Date(a.checkIn) - new Date(b.checkIn));
    } else if (sortBy === "TOTAL_DESC") {
      rows.sort((a, b) => (b.totalAmount || 0) - (a.totalAmount || 0));
    }
    return rows;
  }, [bookings, sortBy]);

  const visibleBookings = useMemo(() => {
    if (statusFilter === "ALL") return sortedBookings;
    return sortedBookings.filter((b) => b.status === statusFilter);
  }, [sortedBookings, statusFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(visibleBookings.length / pageSize));
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return visibleBookings.slice(start, start + pageSize);
  }, [visibleBookings, currentPage]);

  const payableVisible = useMemo(
    () => visibleBookings.filter((b) => ["DRAFT", "PENDING_PAYMENT"].includes(b.status)),
    [visibleBookings]
  );

  const selectedPayable = useMemo(
    () => visibleBookings.filter((b) => selectedIds.has(b.id) && ["DRAFT", "PENDING_PAYMENT"].includes(b.status)),
    [visibleBookings, selectedIds]
  );

  const refreshBookings = async () => {
    try {
      const res = await apiClient.get("/bookings");
      setBookings(res.data || []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to load");
    }
  };

  const startEdit = (b) => {
    setEditingId(b.id);
    setEditForm({
      checkIn: new Date(b.checkIn).toISOString().slice(0, 10),
      checkOut: new Date(b.checkOut).toISOString().slice(0, 10),
      rooms: b.rooms || 1,
      guests: b.guests || 1,
    });
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      setEditBusy(true);
      await apiClient.patch(`/bookings/${editingId}`, editForm);
      setEditingId(null);
      await refreshBookings();
    } catch (e) {
      alert(e.response?.data?.error || "Failed to update booking");
    } finally {
      setEditBusy(false);
    }
  };

  const toggleSelected = (id, checked) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const toggleSelectAllVisible = (checked) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const b of payableVisible) {
        if (checked) next.add(b.id);
        else next.delete(b.id);
      }
      return next;
    });
  };

  const goToPaymentCart = (rows) => {
    if (!rows.length) return;
    const payload = rows.map((b) => ({
      id: b.id,
      hotelName: b.hotel?.name || "",
      roomName: b.roomType?.name || "",
      checkIn: b.checkIn,
      checkOut: b.checkOut,
      totalAmount: b.totalAmount || 0,
      currency: b.currency || "USD",
      rooms: b.rooms || 1,
      guests: b.guests || 1,
      status: b.status,
    }));
    localStorage.setItem("bookingCartItems", JSON.stringify(payload));
    navigate("/dashboard/bookings/cart", { state: { items: payload } });
  };

  if (loading) {
    return (
      <div className="dashboard-page">
        <h1 className="dashboard-page__title">My Bookings</h1>
        <div className="dashboard-card">
          <div className="dashboard-card__body" style={{ textAlign: "center", padding: "3rem" }}>
            <p style={{ color: "#6c757d", margin: 0 }}>Loading bookings…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <h1 className="dashboard-page__title">My Bookings</h1>
        <div className="dashboard-card">
          <div className="dashboard-card__body" style={{ color: "#dc3545" }}>{error}</div>
        </div>
      </div>
    );
  }

  if (!bookings.length) {
    return (
      <div className="dashboard-page">
        <h1 className="dashboard-page__title">My Bookings</h1>
        <div className="dashboard-card">
          <div className="dashboard-card__body" style={{ textAlign: "center", padding: "2rem", color: "#6c757d" }}>
            No bookings yet.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-page__title">My Bookings</h1>
      <section className="product-page">
        <div className="row g-4">
          <div className="col-lg-3">
            <div className="product__categories product__sidebar__item">
              <h3 className="product__sidebar__title product__categories__title">Categories</h3>
              <ul className="list-unstyled">
                {[
                  ["ALL", "All bookings"],
                  ["DRAFT", "Booking request"],
                  ["PENDING_PAYMENT", "Accepted - pending payment"],
                  ["PAID", "Confirmed"],
                  ["CHECKED_IN", "Checked in"],
                  ["COMPLETED", "Checked out / completed"],
                  ["CANCELLED", "Cancelled"],
                ].map(([key, label]) => (
                  <li key={key} style={{ marginBottom: 10 }}>
                    <button
                      type="button"
                      onClick={() => setStatusFilter(key)}
                      style={{
                        border: 0,
                        background: statusFilter === key ? "#e8f5e9" : "transparent",
                        padding: "8px 10px",
                        width: "100%",
                        textAlign: "left",
                        borderRadius: 8,
                        color: statusFilter === key ? "#2f7d32" : "inherit",
                        fontWeight: statusFilter === key ? 700 : 400,
                        cursor: "pointer",
                        transition: "all .2s ease",
                        transform: statusFilter === key ? "translateX(3px)" : "translateX(0)",
                      }}
                      onMouseEnter={(e) => {
                        if (statusFilter !== key) {
                          e.currentTarget.style.transform = "translateX(3px)";
                          e.currentTarget.style.background = "#e8f5e9";
                          e.currentTarget.style.color = "#2f7d32";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (statusFilter !== key) {
                          e.currentTarget.style.transform = "translateX(0)";
                          e.currentTarget.style.background = "transparent";
                          e.currentTarget.style.color = "inherit";
                        }
                      }}
                    >
                      <span className="product-categories__icon">
                        <i className="icon-arrow-point-to-right"></i>
                      </span>
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="product-sidebar__single mt-3">
              <h4 className="product-sidebar__title">Bulk payment</h4>
              <div className="small text-muted mb-2">
                Select pending-payment bookings and checkout once.
              </div>
              <button
                type="button"
                className="gotur-btn gotur-btn--base"
                disabled={!selectedPayable.length}
                onClick={() => goToPaymentCart(selectedPayable)}
              >
                Pay selected ({selectedPayable.length})
              </button>
            </div>
          </div>

          <div className="col-lg-9">
            <div className="product__info-top d-flex justify-content-between align-items-center mb-4">
              <div className="product__showing-text-box">
                <p className="product__showing-text">
                  Showing {(currentPage - 1) * pageSize + (paginatedBookings.length ? 1 : 0)}–
                  {(currentPage - 1) * pageSize + paginatedBookings.length} of {visibleBookings.length} Results
                </p>
              </div>
              <div className="product__showing-sort">
                <select
                  className="form-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={{ minWidth: 220 }}
                >
                  <option value="LATEST">Default Sorting (Latest first)</option>
                  <option value="OLDEST">Oldest first</option>
                  <option value="CHECKIN_ASC">Check-in date</option>
                  <option value="TOTAL_DESC">Total amount (high to low)</option>
                </select>
              </div>
            </div>

            {!!payableVisible.length && (
              <div className="mb-3 d-flex align-items-center gap-2">
                <input
                  id="select-all-payable"
                  type="checkbox"
                  checked={payableVisible.every((b) => selectedIds.has(b.id))}
                  onChange={(e) => toggleSelectAllVisible(e.target.checked)}
                />
                <label htmlFor="select-all-payable" className="small mb-0">
                  Tick all pending-payment bookings in current view
                </label>
              </div>
            )}

            <div className="row gutter-y-30">
              {paginatedBookings.map((b) => {
          const coverUrl =
            b.hotel?.images?.find((i) => i.isCover)?.url || b.hotel?.images?.[0]?.url || null;
          const roomImage =
            b.roomType?.images?.find((i) => i.isCover)?.url || b.roomType?.images?.[0]?.url || null;
          const safeCover = coverUrl
            ? encodeURI(coverUrl.startsWith("http") ? coverUrl : `${BASE_URL}${coverUrl}`)
            : null;
          const safeRoom = roomImage
            ? encodeURI(roomImage.startsWith("http") ? roomImage : `${BASE_URL}${roomImage}`)
            : null;
          const checkIn = new Date(b.checkIn).toLocaleDateString();
          const checkOut = new Date(b.checkOut).toLocaleDateString();
          const statusColor = STATUS_COLORS[b.status] || "#6c757d";
          const statusLabel = STATUS_LABELS[b.status] || b.status;
          const canPay = ["PENDING_PAYMENT", "DRAFT"].includes(b.status);
          const canEdit = b.status === "DRAFT";
          const isEditing = editingId === b.id;

          return (
            <div key={b.id} className="col-12">
              <div
                className="product-list__item"
                style={{ transition: "transform .2s ease, box-shadow .2s ease" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 10px 24px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div className="row align-items-center gutter-y-20">
                  <div className="col-md-4">
                    <div className="product-list__item__image">
                {safeCover ? (
                  <img
                    crossOrigin="anonymous"
                    src={safeCover}
                    alt={b.hotel?.name}
                    onError={setImagePlaceholderOnError}
                    style={{ width: "100%", minHeight: "220px", objectFit: "cover" }}
                  />
                ) : (
                  <div style={{ width: "100%", minHeight: "220px", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", fontSize: "0.85rem" }}>
                    No Image
                  </div>
                )}
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="product-list__item__content">
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
                    <div>
                  <p style={{ margin: "0 0 0.2rem", color: "#6c757d", fontSize: "0.82rem" }}>
                    Date: {new Date(b.createdAt).toLocaleString()}
                  </p>
                  <h4 className="product-list__item__title" style={{ margin: "0 0 0.25rem", fontSize: "1.35rem", lineHeight: 1.25 }}>{b.hotel?.name}</h4>
                  <p style={{ margin: 0, color: "#6c757d", fontSize: "1rem" }}>Room: {b.roomType?.name}</p>
                  <p style={{ margin: 0, color: "#6c757d", fontSize: "1rem" }}>Package: {b.roomType?.name || "Standard package"}</p>
                  {isEditing ? (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 6 }}>
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        value={editForm.checkIn}
                        onChange={(e) => setEditForm((p) => ({ ...p, checkIn: e.target.value }))}
                      />
                      <input
                        type="date"
                        className="form-control form-control-sm"
                        value={editForm.checkOut}
                        onChange={(e) => setEditForm((p) => ({ ...p, checkOut: e.target.value }))}
                      />
                      <input
                        type="number"
                        min={1}
                        className="form-control form-control-sm"
                        value={editForm.rooms}
                        onChange={(e) => setEditForm((p) => ({ ...p, rooms: Number(e.target.value) }))}
                        placeholder="Rooms"
                      />
                      <input
                        type="number"
                        min={1}
                        className="form-control form-control-sm"
                        value={editForm.guests}
                        onChange={(e) => setEditForm((p) => ({ ...p, guests: Number(e.target.value) }))}
                        placeholder="Guests"
                      />
                    </div>
                  ) : (
                    <p style={{ margin: 0, color: "#495057", fontSize: "1rem" }}>{checkIn} → {checkOut}</p>
                  )}
                  {b.status === "CANCELLED" && b.cancelReason ? (
                    <p style={{ margin: "0.25rem 0 0", color: "#6c757d", fontSize: "0.82rem" }}>
                      {b.cancelReason}
                    </p>
                  ) : null}
                  {b.requestExpiresAt && b.status === "DRAFT" ? (
                    <p style={{ margin: "0.25rem 0 0", color: "#6c757d", fontSize: "0.82rem" }}>
                      Expires: {new Date(b.requestExpiresAt).toLocaleString()}
                    </p>
                  ) : null}
                  <p style={{ margin: "0.5rem 0 0", fontSize: "0.95rem" }}>
                    Total: <strong>${b.totalAmount?.toFixed(2) ?? "—"}</strong>
                  </p>
                    </div>
                    {canPay && (
                      <input
                        type="checkbox"
                        checked={selectedIds.has(b.id)}
                        onChange={(e) => toggleSelected(b.id, e.target.checked)}
                        title="Tick for bulk payment"
                        style={{ width: 18, height: 18, marginTop: 6 }}
                      />
                    )}
                  </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: 10, flexWrap: "wrap" }}>
                  {safeRoom && (
                    <img
                      crossOrigin="anonymous"
                      src={safeRoom}
                      alt="Room"
                      onError={setImagePlaceholderOnError}
                      style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 6, border: "1px solid #e9ecef" }}
                    />
                  )}
                  <span
                    style={{
                      padding: "0.35rem 0.65rem",
                      borderRadius: 6,
                      background: statusColor,
                      color: "#fff",
                      fontSize: "0.92rem",
                      fontWeight: 600,
                    }}
                  >
                    {statusLabel}
                  </span>
                  {canPay && (
                    <button
                      type="button"
                      className="gotur-btn gotur-btn--base"
                      onClick={() => goToPaymentCart([b])}
                    >
                      Payment
                    </button>
                  )}
                  {canEdit && !isEditing && (
                    <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => startEdit(b)}>
                      Edit stay
                    </button>
                  )}
                  {isEditing && (
                    <>
                      <button type="button" className="btn btn-sm btn-success" onClick={saveEdit} disabled={editBusy}>
                        {editBusy ? "Saving..." : "Save"}
                      </button>
                      <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setEditingId(null)} disabled={editBusy}>
                        Cancel
                      </button>
                    </>
                  )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
              })}
            </div>
            <div className="d-flex justify-content-center mt-4 gap-2 flex-wrap">
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                Prev
              </button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    type="button"
                    className={`btn btn-sm ${page === currentPage ? "btn-primary" : "btn-outline-secondary"}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                );
              })}
              <button
                type="button"
                className="btn btn-outline-secondary btn-sm"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
