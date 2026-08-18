import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import "../../components/dashboard/dashboard-pages.css";
import {
  apiErrorMessage,
  feedbackError,
  feedbackSuccess,
  feedbackWarning,
  useFeedback,
} from "../../context/FeedbackContext";

export default function ManagerPayoutAccount() {
  const { showFeedback } = useFeedback();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    provider: "bank",
    accountId: "",
    bankName: "",
    accountHolder: "",
  });

  const loadAccount = async () => {
    setLoading(true);
    try {
      const { data } = await apiClient.get("/manager/payout-account");
      setForm({
        provider: "bank",
        accountId: data.accountId || "",
        bankName: data.bankName || "",
        accountHolder: data.accountHolder || "",
      });
    } catch (err) {
      console.error("Load payout account error:", err);
      feedbackError(showFeedback, apiErrorMessage(err, "Failed to load payout account settings"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccount();
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSaveBank = async (e) => {
    e.preventDefault();
    if (!form.accountId || String(form.accountId).trim().length < 6) {
      feedbackWarning(showFeedback, "Please enter a valid account number (minimum 6 characters).");
      return;
    }
    try {
      setSaving(true);
      await apiClient.put("/manager/payout-account", {
        ...form,
        provider: "bank",
      });
      feedbackSuccess(showFeedback, "Bank payout details saved.");
      await loadAccount();
    } catch (err) {
      feedbackError(showFeedback, apiErrorMessage(err, "Failed to save payout account"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="text-muted mb-0">Loading…</p>;

  return (
    <div className="dashboard-page" style={{ maxWidth: "100%" }}>
      <h2 className="dashboard-page__title" style={{ fontSize: "1.35rem" }}>
        Payout Account
      </h2>

      <div className="dashboard-card">
        <div className="dashboard-card__body">
          <h3 style={{ marginTop: 0, fontSize: "1.05rem" }}>Bank details</h3>
          <p style={{ fontSize: "0.9rem", color: "#6c757d", marginBottom: "1rem" }}>
            Save the bank account where Booking Lanka should send your hotel payouts.
          </p>

          <form onSubmit={onSaveBank}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1rem",
              }}
            >
              <div className="dashboard-form-group">
                <label>Account Number *</label>
                <input
                  name="accountId"
                  value={form.accountId}
                  onChange={onChange}
                  placeholder="Enter account number"
                  required
                />
              </div>
              <div className="dashboard-form-group">
                <label>Bank name</label>
                <input name="bankName" value={form.bankName} onChange={onChange} />
              </div>
              <div className="dashboard-form-group">
                <label>Account holder</label>
                <input name="accountHolder" value={form.accountHolder} onChange={onChange} />
              </div>
            </div>
            <button type="submit" className="gotur-btn gotur-btn--base" disabled={saving}>
              {saving ? "Saving…" : "Save bank details"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
