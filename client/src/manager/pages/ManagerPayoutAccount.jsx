import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [account, setAccount] = useState(null);
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
      setAccount(data);
      setForm({
        provider: data.provider || "bank",
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

  useEffect(() => {
    const stripeFlag = searchParams.get("stripe");
    if (!stripeFlag) return;

    (async () => {
      try {
        await apiClient.post("/manager/payout-account/stripe/refresh");
        await loadAccount();
        if (stripeFlag === "return") {
          feedbackSuccess(showFeedback, "Stripe onboarding returned. Status refreshed.");
        }
      } catch (err) {
        console.error(err);
      } finally {
        searchParams.delete("stripe");
        setSearchParams(searchParams, { replace: true });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const startStripeOnboard = async () => {
    try {
      setConnecting(true);
      const { data } = await apiClient.post("/manager/payout-account/stripe/onboard");
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      feedbackWarning(showFeedback, "No onboarding URL returned");
    } catch (err) {
      feedbackError(showFeedback, apiErrorMessage(err, "Failed to start Stripe Connect"));
    } finally {
      setConnecting(false);
    }
  };

  const refreshStripe = async () => {
    try {
      setConnecting(true);
      const { data } = await apiClient.post("/manager/payout-account/stripe/refresh");
      setAccount(data.account);
      feedbackSuccess(showFeedback, data.message || "Stripe status updated");
    } catch (err) {
      feedbackError(showFeedback, apiErrorMessage(err, "Failed to refresh Stripe status"));
    } finally {
      setConnecting(false);
    }
  };

  if (loading) return <p className="text-muted mb-0">Loading…</p>;

  return (
    <div className="dashboard-page" style={{ maxWidth: "100%" }}>
      <h2 className="dashboard-page__title" style={{ fontSize: "1.35rem" }}>
        Payout Account
      </h2>

      <div className="dashboard-card" style={{ marginBottom: "1.25rem" }}>
        <div className="dashboard-card__body">
          <h3 style={{ marginTop: 0, fontSize: "1.05rem" }}>Stripe Connect (required for card payments)</h3>
          <p style={{ color: "#374151" }}>
            Guests pay by card on Booking Lanka. Your hotel receives the booking amount minus the
            admin commission (default 15%, or the rate set for your hotel).
          </p>
          <p style={{ fontSize: "0.9rem", color: "#6c757d" }}>
            Status:{" "}
            <strong>
              {account?.provider === "stripe" ? account?.status : "Not linked"}
            </strong>
            {account?.stripeReady ? " · Ready to receive payouts" : " · Complete onboarding to receive card payments"}
            {account?.maskedAccountId && account?.provider === "stripe"
              ? ` · ${account.maskedAccountId}`
              : ""}
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button
              type="button"
              className="gotur-btn gotur-btn--base"
              onClick={startStripeOnboard}
              disabled={connecting}
            >
              {connecting ? "Opening Stripe…" : account?.stripeReady ? "Update Stripe account" : "Connect with Stripe"}
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={refreshStripe}
              disabled={connecting}
            >
              Refresh status
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card__body">
          <h3 style={{ marginTop: 0, fontSize: "1.05rem" }}>Bank details (optional backup)</h3>
          <p style={{ fontSize: "0.9rem", color: "#6c757d", marginBottom: "1rem" }}>
            Optional record for admin. Card splitting uses Stripe Connect above.
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
