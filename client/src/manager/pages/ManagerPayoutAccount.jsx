import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";
import "../../components/dashboard/dashboard-pages.css";

export default function ManagerPayoutAccount() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      alert(err.response?.data?.error || "Failed to load payout account settings");
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

  const onSave = async (e) => {
    e.preventDefault();
    if (!form.accountId || String(form.accountId).trim().length < 6) {
      alert("Please enter a valid account number (minimum 6 characters).");
      return;
    }
    try {
      setSaving(true);
      await apiClient.put("/manager/payout-account", form);
      alert("Payout account updated successfully.");
      await loadAccount();
    } catch (err) {
      console.error("Save payout account error:", err);
      alert(err.response?.data?.error || "Failed to save payout account");
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
          <p style={{ marginTop: 0, color: "#374151" }}>
            Set your payout account details. Confirmed booking payments are routed to this account.
          </p>
          <p style={{ fontSize: "0.9rem", color: "#6c757d", marginBottom: "1rem" }}>
            Current status: <strong>{account?.status || "PENDING"}</strong>
            {account?.maskedAccountId ? ` · Account: ${account.maskedAccountId}` : " · No account added yet"}
          </p>

          <form onSubmit={onSave}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
              <div className="dashboard-form-group">
                <label>Provider</label>
                <select name="provider" value={form.provider} onChange={onChange}>
                  <option value="bank">Bank Transfer</option>
                  <option value="stripe">Stripe</option>
                </select>
              </div>
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
                <label>Bank Name</label>
                <input
                  name="bankName"
                  value={form.bankName}
                  onChange={onChange}
                  placeholder="e.g. Commercial Bank"
                />
              </div>
              <div className="dashboard-form-group">
                <label>Account Holder Name</label>
                <input
                  name="accountHolder"
                  value={form.accountHolder}
                  onChange={onChange}
                  placeholder="Account holder name"
                />
              </div>
            </div>
            <button type="submit" className="dashboard-btn dashboard-btn--primary" disabled={saving}>
              {saving ? "Saving…" : "Save Payout Account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
