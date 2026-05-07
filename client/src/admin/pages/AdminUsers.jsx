import { useEffect, useState } from "react";
import apiClient from "../../services/apiClient";

/**
 * @param {{ accountKind: "guest" | "manager" }} props
 */
export default function AdminUsers({ accountKind }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const isManagers = accountKind === "manager";
  const apiKind = isManagers ? "manager" : "guest";

  useEffect(() => {
    setLoading(true);
    apiClient
      .get("/admin/users", { params: { kind: apiKind } })
      .then((res) => setUsers(res.data || []))
      .catch((err) => console.error("Error fetching users:", err))
      .finally(() => setLoading(false));
  }, [apiKind]);

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

  const blurb = isManagers
    ? "Branch managers — bank / payout details for settlements"
    : "End-user accounts (guests) — sign-up and booking customers";

  return (
    <div className="dashboard-page">
      <div className="product__info-top d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <p className="product__showing-text mb-0">
          {users.length} {isManagers ? "manager" : "user"}
          {users.length === 1 ? "" : "s"} — {blurb}
        </p>
      </div>
      <div className="dashboard-card" style={{ marginBottom: 0 }}>
        <div className="dashboard-card__body" style={{ overflowX: "auto" }}>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Role(s)</th>
                <th>Joined</th>
                {isManagers && (
                  <>
                    <th>Bank / provider</th>
                    <th>Account holder</th>
                    <th>Masked account</th>
                    <th>Payout status</th>
                    <th>Payout updated</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.email}</td>
                  <td>{u.displayName ?? "—"}</td>
                  <td>{u.phone ?? "—"}</td>
                  <td>{(u.roles || []).join(", ") || "—"}</td>
                  <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}</td>
                  {isManagers && (
                    <>
                      <td>{u.payout ? u.payout.bankName || u.payout.provider || "—" : "—"}</td>
                      <td>{u.payout?.accountHolder || "—"}</td>
                      <td>{u.payout?.maskedAccountId || "—"}</td>
                      <td>{u.payout?.status ?? "—"}</td>
                      <td>{u.payout?.updatedAt ? new Date(u.payout.updatedAt).toLocaleString() : "—"}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && (
            <p style={{ textAlign: "center", color: "#6c757d", padding: "1.5rem", margin: 0 }}>
              No {isManagers ? "managers" : "users"}.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
