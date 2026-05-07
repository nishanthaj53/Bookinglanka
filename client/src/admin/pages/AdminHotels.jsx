import { useEffect, useState } from "react";
import api from "../../services/apiClient";

/**
 * @param {{ statusFilter: "ACTIVE" | "DRAFT" }} props
 */
export default function AdminHotels({ statusFilter }) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotels();
  }, [statusFilter]);

  async function fetchHotels() {
    try {
      setLoading(true);
      const res = await api.get("/admin/hotels", { params: { status: statusFilter } });
      setHotels(res.data || []);
    } catch (err) {
      console.error("Fetch hotels error:", err);
      alert("Failed to load hotels");
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(hotelId, currentStatus) {
    try {
      const newStatus = currentStatus === "ACTIVE" ? "deactivate" : "activate";
      await api.patch(`/admin/hotels/${hotelId}/${newStatus}`);
      alert(`Hotel is now ${currentStatus === "ACTIVE" ? "DRAFT (deactivated)" : "ACTIVE"}`);
      fetchHotels();
    } catch (err) {
      console.error("Error toggling hotel status:", err);
      alert("Failed to update status");
    }
  }

  const isActivePage = statusFilter === "ACTIVE";
  const listHint = isActivePage
    ? "Published listings — deactivate to move back to draft"
    : "Draft listings — activate when ready to publish";

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-card">
          <div className="dashboard-card__body" style={{ textAlign: "center", padding: "3rem" }}>
            <p style={{ color: "#6c757d", margin: 0 }}>Loading…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="product__info-top d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <p className="product__showing-text mb-0">
          {hotels.length} {isActivePage ? "active" : "draft"} hotel{hotels.length === 1 ? "" : "s"} — {listHint}
        </p>
      </div>
      <div className="dashboard-card">
        <div className="dashboard-card__body" style={{ overflowX: "auto" }}>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {hotels.map((h) => (
                <tr key={h.id}>
                  <td>{h.name}</td>
                  <td>{h.owner?.email ?? "—"}</td>
                  <td>
                    <span style={{ fontWeight: 600, color: h.status === "ACTIVE" ? "#198754" : "#6c757d" }}>
                      {h.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => toggleStatus(h.id, h.status)}
                      className="dashboard-btn dashboard-btn--primary"
                      style={{ fontSize: "0.85rem" }}
                    >
                      {h.status === "ACTIVE" ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {hotels.length === 0 && (
            <p style={{ textAlign: "center", color: "#6c757d", padding: "1.5rem", margin: 0 }}>
              No {isActivePage ? "active" : "draft"} hotels.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
