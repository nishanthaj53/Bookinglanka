import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import "../../components/dashboard/dashboard-pages.css";
import {
  apiErrorMessage,
  feedbackError,
  feedbackSuccess,
  useFeedback,
} from "../../context/FeedbackContext";

export default function AdminCommission() {
  const { showFeedback } = useFeedback();
  const [loading, setLoading] = useState(true);
  const [savingGlobal, setSavingGlobal] = useState(false);
  const [globalPercent, setGlobalPercent] = useState(15);
  const [hotels, setHotels] = useState([]);
  const [drafts, setDrafts] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/admin/commission");
      setGlobalPercent(data.global?.ratePercent ?? 15);
      setHotels(data.hotels || []);
      const next = {};
      for (const h of data.hotels || []) {
        next[h.hotelId] = String(h.ratePercent);
      }
      setDrafts(next);
    } catch (err) {
      feedbackError(showFeedback, apiErrorMessage(err, "Failed to load commission settings"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const saveGlobal = async (e) => {
    e.preventDefault();
    try {
      setSavingGlobal(true);
      await apiClient.put("/admin/commission/global", {
        ratePercent: Number(globalPercent),
      });
      feedbackSuccess(showFeedback, "Global commission saved (default for hotels without override).");
      await load();
    } catch (err) {
      feedbackError(showFeedback, apiErrorMessage(err, "Failed to save global commission"));
    } finally {
      setSavingGlobal(false);
    }
  };

  const saveHotel = async (hotelId) => {
    try {
      await apiClient.put(`/admin/commission/hotels/${hotelId}`, {
        ratePercent: Number(drafts[hotelId]),
      });
      await load();
    } catch (err) {
      feedbackError(showFeedback, apiErrorMessage(err, "Failed to save hotel commission"));
    }
  };

  const clearHotel = async (hotelId) => {
    try {
      await apiClient.delete(`/admin/commission/hotels/${hotelId}`);
      await load();
    } catch (err) {
      feedbackError(showFeedback, apiErrorMessage(err, "Failed to clear override"));
    }
  };

  if (loading) return <p className="text-muted mb-0">Loading…</p>;

  return (
    <div className="dashboard-page" style={{ maxWidth: "100%" }}>
      <h2 className="dashboard-page__title" style={{ fontSize: "1.35rem" }}>
        Commission (Admin share)
      </h2>

      <div className="dashboard-card" style={{ marginBottom: "1.25rem" }}>
        <div className="dashboard-card__body">
          <p style={{ marginTop: 0 }}>
            When a guest pays by card, Stripe sends the <strong>admin commission %</strong> to the
            platform account and the remainder to the hotel manager’s Stripe Connect account.
          </p>
          <p style={{ color: "#6c757d", fontSize: "0.9rem" }}>
            Default is <strong>15%</strong>. Set a global rate below, or override per hotel.
          </p>

          <form
            onSubmit={saveGlobal}
            style={{ display: "flex", gap: "0.75rem", alignItems: "end", flexWrap: "wrap" }}
          >
            <div className="dashboard-form-group" style={{ marginBottom: 0 }}>
              <label>Global commission %</label>
              <input
                type="number"
                min={0}
                max={100}
                step={0.1}
                value={globalPercent}
                onChange={(e) => setGlobalPercent(e.target.value)}
                style={{ width: 120 }}
              />
            </div>
            <button type="submit" className="gotur-btn gotur-btn--base" disabled={savingGlobal}>
              {savingGlobal ? "Saving…" : "Save global"}
            </button>
          </form>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card__body">
          <h3 style={{ marginTop: 0, fontSize: "1.05rem" }}>Per-hotel rates</h3>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Hotel</th>
                  <th>Owner</th>
                  <th>Source</th>
                  <th>Admin %</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {hotels.map((h) => (
                  <tr key={h.hotelId}>
                    <td>
                      <strong>{h.name}</strong>
                      <div style={{ fontSize: "0.8rem", color: "#6c757d" }}>
                        {h.city} · {h.status}
                      </div>
                    </td>
                    <td>{h.ownerEmail || "—"}</td>
                    <td>{h.source}</td>
                    <td>
                      <input
                        type="number"
                        min={0}
                        max={100}
                        step={0.1}
                        value={drafts[h.hotelId] ?? ""}
                        onChange={(e) =>
                          setDrafts((prev) => ({ ...prev, [h.hotelId]: e.target.value }))
                        }
                        style={{ width: 90 }}
                      />
                    </td>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <button
                        type="button"
                        className="btn btn-sm btn-primary"
                        onClick={() => saveHotel(h.hotelId)}
                      >
                        Save
                      </button>{" "}
                      {h.hasOverride && (
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => clearHotel(h.hotelId)}
                        >
                          Use global
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {!hotels.length && (
                  <tr>
                    <td colSpan={5} style={{ color: "#6c757d" }}>
                      No hotels yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
