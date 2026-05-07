import { useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import { Form } from "react-bootstrap";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useOutletContext } from "react-router-dom";
import apiClient from "../../services/apiClient";
import "../../components/dashboard/dashboard-pages.css";
import "../../admin/admin-revenue.css";

const PAID_LIKE = new Set(["PAID", "CHECKED_IN", "COMPLETED"]);
const CANCELLED = "CANCELLED";

const STATUS_LABELS = {
  DRAFT: "Draft",
  PENDING_PAYMENT: "Pending payment",
  PAID: "Paid",
  CHECKED_IN: "Checked in",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const PIE_COLORS = ["#63ab45", "#f7921e", "#2d6a4f", "#40916c", "#95d5b2", "#dc3545", "#6c757d"];

function toDateInputValue(date) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function inRange(dateValue, fromDate, toDate) {
  const d = new Date(dateValue);
  if (Number.isNaN(d.getTime())) return false;
  const compare = toDateInputValue(d);
  if (fromDate && compare < fromDate) return false;
  if (toDate && compare > toDate) return false;
  return true;
}

function monthLabel(ym) {
  const d = dayjs(`${ym}-01`);
  return d.isValid() ? d.format("MMM YYYY") : ym;
}

function fmtMoney(n, currency = "USD") {
  const sym = currency === "LKR" ? "LKR " : "$";
  return `${sym}${Number(n || 0).toLocaleString()}`;
}

function buildPieData(statusCounts) {
  if (!statusCounts) return [];
  return Object.entries(statusCounts)
    .map(([status, value]) => ({
      name: STATUS_LABELS[status] || status,
      value: Number(value) || 0,
      status,
    }))
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);
}

export default function ManagerIncome() {
  const { bookings, loading: outletLoading, hotels } = useOutletContext();
  const [month, setMonth] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [hotelId, setHotelId] = useState("");

  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  const latestQueryRef = useRef("");

  const hotelOptions = useMemo(() => [...(hotels || [])].sort((a, b) => (a.name || "").localeCompare(b.name || "")), [hotels]);

  const showHotelFilter = hotelOptions.length > 1;

  const statsQueryParams = useMemo(() => {
    const p = {};
    if (hotelId) p.hotelId = hotelId;
    if (month) {
      const [y, m] = month.split("-").map(Number);
      if (y && m) {
        const start = new Date(y, m - 1, 1);
        const end = new Date(y, m, 0, 23, 59, 59, 999);
        p.from = toDateInputValue(start);
        p.to = toDateInputValue(end);
      }
    } else {
      if (fromDate) p.from = fromDate;
      if (toDate) p.to = toDate;
    }
    return p;
  }, [hotelId, month, fromDate, toDate]);

  useEffect(() => {
    const key = JSON.stringify(statsQueryParams);
    latestQueryRef.current = key;
    let cancelled = false;
    setStatsLoading(true);
    setStatsError(null);
    apiClient
      .get("/manager/stats", { params: statsQueryParams })
      .then((res) => {
        if (cancelled || latestQueryRef.current !== key) return;
        setStats(res.data);
      })
      .catch((err) => {
        console.error(err);
        if (cancelled || latestQueryRef.current !== key) return;
        setStats(null);
        setStatsError(err.response?.data?.error || "Failed to load analytics.");
      })
      .finally(() => {
        if (cancelled || latestQueryRef.current !== key) return;
        setStatsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [statsQueryParams]);

  const filteredBookings = useMemo(() => {
    const list = bookings || [];
    if (!list.length) return [];
    return list.filter((b) => {
      if (hotelId && b.hotelId !== hotelId && b.hotel?.id !== hotelId) return false;
      const created = b.createdAt || b.checkIn;
      if (!created) return false;
      const d = new Date(created);
      if (Number.isNaN(d.getTime())) return false;
      if (month) {
        const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (ym !== month) return false;
      }
      return inRange(created, fromDate, toDate);
    });
  }, [bookings, hotelId, month, fromDate, toDate]);

  const csvCurrency = useMemo(() => {
    const b = filteredBookings.find((x) => PAID_LIKE.has(x.status) && x.currency);
    return b?.currency || "USD";
  }, [filteredBookings]);

  const analytics = useMemo(() => {
    if (!filteredBookings?.length) {
      return {
        gross: 0,
        paidCount: 0,
        currency: csvCurrency,
        upcomingCount: 0,
        completedCount: 0,
        cancelledCount: 0,
        totalBookings: 0,
      };
    }

    const today = new Date();
    const todayKey = toDateInputValue(today);
    let sum = 0;
    let paidCount = 0;
    let cur = csvCurrency;
    let upcomingCount = 0;
    let completedCount = 0;
    let cancelledCount = 0;

    for (const b of filteredBookings) {
      const checkInKey = b.checkIn ? toDateInputValue(b.checkIn) : "";
      if (b.status === CANCELLED) cancelledCount += 1;
      if (b.status === "COMPLETED") completedCount += 1;
      if (checkInKey && checkInKey >= todayKey && b.status !== CANCELLED && b.status !== "COMPLETED") {
        upcomingCount += 1;
      }
      if (PAID_LIKE.has(b.status)) {
        sum += Number(b.totalAmount) || 0;
        paidCount += 1;
        if (b.currency) cur = b.currency;
      }
    }

    return {
      gross: sum,
      paidCount,
      currency: cur,
      upcomingCount,
      completedCount,
      cancelledCount,
      totalBookings: filteredBookings.length,
    };
  }, [filteredBookings, csvCurrency]);

  const chartRows = useMemo(() => {
    const series = stats?.monthlySeries || [];
    return series.map((row) => ({
      ...row,
      label: monthLabel(row.month),
    }));
  }, [stats]);

  const pieData = useMemo(() => buildPieData(stats?.statusCounts), [stats]);

  const sc = stats?.statusCounts || {};

  const kpiCards = useMemo(() => {
    const cur = csvCurrency;
    return [
      { label: "Recorded income (filtered)", value: fmtMoney(stats?.totalRevenue ?? 0, cur), accent: true },
      { label: "Total bookings", value: stats?.totalBookings ?? 0 },
      { label: "Cancelled", value: sc.CANCELLED ?? 0 },
      { label: "Pending payment", value: sc.PENDING_PAYMENT ?? 0 },
      { label: "Paid / in stay / done", value: (sc.PAID || 0) + (sc.CHECKED_IN || 0) + (sc.COMPLETED || 0) },
      { label: "Draft", value: sc.DRAFT ?? 0 },
    ];
  }, [stats, sc, csvCurrency]);

  const chartTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div
        className="admin-revenue__chart-ltr"
        style={{
          background: "#fff",
          border: "1px solid #e5e5e5",
          borderRadius: 8,
          padding: "0.5rem 0.75rem",
          fontSize: 12,
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
        {payload.map((p) => (
          <div key={p.dataKey} style={{ color: p.color }}>
            {p.name}: {p.dataKey === "revenue" || p.dataKey === "cumulativeRevenue" ? fmtMoney(p.value, csvCurrency) : p.value}
          </div>
        ))}
      </div>
    );
  };

  const downloadCsv = () => {
    const lines = [];
    lines.push("Booking Lanka Manager Income Report");
    lines.push(`Generated At,${new Date().toISOString()}`);
    lines.push(`Hotel filter,${hotelId ? hotelOptions.find((h) => h.id === hotelId)?.name || hotelId : "All my hotels"}`);
    lines.push(`Filter Month,${month || "All"}`);
    lines.push(`Filter From,${fromDate || "N/A"}`);
    lines.push(`Filter To,${toDate || "N/A"}`);
    lines.push("");
    lines.push("Summary (bookings table filters)");
    lines.push(`Total Bookings,${analytics.totalBookings}`);
    lines.push(`Upcoming Bookings,${analytics.upcomingCount}`);
    lines.push(`Completed Bookings,${analytics.completedCount}`);
    lines.push(`Cancelled Bookings,${analytics.cancelledCount}`);
    lines.push(`Paid Bookings,${analytics.paidCount}`);
    lines.push(`Income (${analytics.currency}),${analytics.gross}`);
    lines.push("");
    lines.push("Booking ID,Hotel,Room,Status,CheckIn,CheckOut,Amount,Currency,CreatedAt");
    filteredBookings.forEach((b) => {
      const row = [
        b.id || "",
        (b.hotel?.name || "").replaceAll(",", " "),
        (b.roomType?.name || "").replaceAll(",", " "),
        b.status || "",
        b.checkIn ? toDateInputValue(b.checkIn) : "",
        b.checkOut ? toDateInputValue(b.checkOut) : "",
        Number(b.totalAmount) || 0,
        b.currency || analytics.currency,
        b.createdAt ? toDateInputValue(b.createdAt) : "",
      ];
      lines.push(row.join(","));
    });

    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `income-report-${month || "all"}-${fromDate || "start"}-to-${toDate || "end"}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isHotelScope = stats?.scope === "manager_hotel";
  const selectedHotel = stats?.hotel;

  if (outletLoading) {
    return <p className="text-muted mb-0">Loading…</p>;
  }

  return (
    <div className="dashboard-page admin-revenue" style={{ maxWidth: "100%" }}>
      <div className="admin-revenue__toolbar">
        <div className="admin-revenue__toolbar-meta">
          <h1>Income & analytics</h1>
          <p>
            Bookings, cancellations, revenue trends, and status mix for your properties. Use filters to narrow charts and the CSV export.
          </p>
          {isHotelScope && selectedHotel?.status && (
            <span className={`admin-revenue__badge${selectedHotel.status === "DRAFT" ? " admin-revenue__badge--draft" : ""}`}>
              {selectedHotel.status === "ACTIVE" ? "Active listing" : "Draft listing"}
            </span>
          )}
        </div>
        {showHotelFilter ? (
          <div className="admin-revenue__hotel-field">
            <Form.Group className="mb-0">
              <Form.Label>Hotel</Form.Label>
              <Form.Select value={hotelId} onChange={(e) => setHotelId(e.target.value)} aria-label="Filter by hotel">
                <option value="">All my hotels</option>
                {hotelOptions.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                    {h.status === "DRAFT" ? " (draft)" : ""}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>
        ) : null}
      </div>

      <div className="dashboard-card" style={{ marginBottom: "1.25rem" }}>
        <div className="dashboard-card__body">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "0.75rem", marginBottom: "1rem" }}>
            <div className="dashboard-form-group" style={{ marginBottom: 0 }}>
              <label>Month (charts & CSV)</label>
              <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
            </div>
            <div className="dashboard-form-group" style={{ marginBottom: 0 }}>
              <label>From date</label>
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} disabled={!!month} />
            </div>
            <div className="dashboard-form-group" style={{ marginBottom: 0 }}>
              <label>To date</label>
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} disabled={!!month} />
            </div>
          </div>
          <p className="small text-muted mb-2">
            Pick a <strong>month</strong> for a quick range, or choose <strong>from / to</strong> when month is cleared. Charts use the same range.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <button
              type="button"
              className="dashboard-btn dashboard-btn--secondary"
              onClick={() => {
                setMonth("");
                setFromDate("");
                setToDate("");
              }}
            >
              Clear date filters
            </button>
            <button type="button" className="dashboard-btn dashboard-btn--primary" onClick={downloadCsv}>
              Download report (CSV)
            </button>
          </div>
        </div>
      </div>

      {statsLoading && !stats ? (
        <div className="dashboard-card">
          <div className="dashboard-card__body" style={{ textAlign: "center", padding: "2rem" }}>
            <p className="text-muted mb-0">Loading analytics…</p>
          </div>
        </div>
      ) : statsError && !stats ? (
        <div className="dashboard-card">
          <div className="dashboard-card__body" style={{ color: "#dc3545" }}>
            {statsError}
          </div>
        </div>
      ) : stats ? (
        <>
          <div className="admin-revenue__kpi-grid">
            {kpiCards.map((c) => (
              <div
                key={c.label}
                className={`dashboard-card admin-revenue__kpi-card${c.accent ? " admin-revenue__kpi-card--accent" : ""}`}
              >
                <div className="dashboard-card__body">
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#6c757d", fontWeight: 600 }}>{c.label}</p>
                  <p
                    style={{
                      margin: "0.35rem 0 0",
                      fontSize: "1.2rem",
                      fontWeight: 800,
                      color: c.accent ? "#63ab45" : "#1a1a1a",
                    }}
                  >
                    {c.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="admin-revenue__charts-grid">
            <div className="dashboard-card admin-revenue__chart-panel admin-revenue__chart-panel--wide" style={{ marginBottom: 0 }}>
              <div className="dashboard-card__header">Monthly volume — revenue & bookings</div>
              <div className="dashboard-card__body admin-revenue__chart-body admin-revenue__chart-ltr">
                {chartRows.length === 0 ? (
                  <div className="admin-revenue__empty-hint">No monthly data for this filter.</div>
                ) : (
                  <ResponsiveContainer width="100%" height={320}>
                    <ComposedChart data={chartRows} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                      <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickFormatter={(v) => fmtMoney(v, csvCurrency).replace(/[^\d.,-]/g, "")} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} allowDecimals={false} />
                      <Tooltip content={chartTooltip} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Bar yAxisId="left" dataKey="revenue" name="Revenue" fill="#63ab45" radius={[4, 4, 0, 0]} maxBarSize={48} />
                      <Line yAxisId="right" type="monotone" dataKey="bookings" name="Bookings" stroke="#f7921e" strokeWidth={2.5} dot={{ r: 3 }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="dashboard-card admin-revenue__chart-panel admin-revenue__chart-panel--side" style={{ marginBottom: 0 }}>
              <div className="dashboard-card__header">Booking status mix</div>
              <div className="dashboard-card__body admin-revenue__chart-body admin-revenue__chart-ltr">
                {pieData.length === 0 ? (
                  <div className="admin-revenue__empty-hint">No bookings in this view.</div>
                ) : (
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={52} outerRadius={88} paddingAngle={2}>
                        {pieData.map((_, i) => (
                          <Cell key={pieData[i].status} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [value, "Bookings"]}
                        contentStyle={{ borderRadius: 8, border: "1px solid #e5e5e5", fontSize: 12 }}
                      />
                      <Legend layout="horizontal" verticalAlign="bottom" wrapperStyle={{ fontSize: 11 }} />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            <div className="dashboard-card admin-revenue__chart-panel" style={{ marginBottom: 0 }}>
              <div className="dashboard-card__header">Cumulative revenue (paid & completed stays)</div>
              <div className="dashboard-card__body admin-revenue__chart-body admin-revenue__chart-body--tall admin-revenue__chart-ltr">
                {chartRows.length === 0 ? (
                  <div className="admin-revenue__empty-hint">No revenue curve yet.</div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartRows} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                      <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => fmtMoney(v, csvCurrency)} />
                      <Tooltip content={chartTooltip} />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Line type="monotone" dataKey="cumulativeRevenue" name="Cumulative revenue" stroke="#2d6a4f" strokeWidth={2.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>

          {(stats.monthlyRevenue || []).length > 0 && (
            <div className="dashboard-card" style={{ marginTop: "1rem" }}>
              <div className="dashboard-card__header">Monthly revenue (table)</div>
              <div className="dashboard-card__body" style={{ overflowX: "auto" }}>
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th style={{ textAlign: "right" }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(stats.monthlyRevenue || []).map((m) => (
                      <tr key={m.month}>
                        <td>{monthLabel(m.month)}</td>
                        <td style={{ textAlign: "right" }}>{fmtMoney(m.amount, csvCurrency)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : null}

      <div className="dashboard-card" style={{ marginTop: "1.25rem" }}>
        <div className="dashboard-card__header">CSV export preview (same filters + hotel)</div>
        <div className="dashboard-card__body">
          <p style={{ margin: "0 0 0.75rem", fontSize: "0.9rem", color: "#374151" }}>
            Confirmed booking revenue in table (paid / checked-in / completed) from filtered rows:
          </p>
          <p style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>
            {analytics.gross.toLocaleString()}{" "}
            <span style={{ fontSize: "1rem", fontWeight: 500, color: "#6c757d" }}>{analytics.currency}</span>
          </p>
          <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem", color: "#6c757d" }}>
            {analytics.paidCount} paid booking{analytics.paidCount === 1 ? "" : "s"} · {analytics.totalBookings} total rows · Upcoming{" "}
            {analytics.upcomingCount} · Completed {analytics.completedCount} · Cancelled {analytics.cancelledCount}
          </p>
        </div>
      </div>
    </div>
  );
}
