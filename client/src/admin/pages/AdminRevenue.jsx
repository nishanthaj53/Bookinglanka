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
import apiClient from "../../services/apiClient";
import "../../components/dashboard/dashboard-pages.css";
import "../admin-revenue.css";

const STATUS_LABELS = {
  DRAFT: "Draft",
  PENDING_PAYMENT: "Pending payment",
  PAID: "Paid",
  CHECKED_IN: "Checked in",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const PIE_COLORS = ["#63ab45", "#f7921e", "#2d6a4f", "#40916c", "#95d5b2", "#dc3545", "#6c757d"];

function fmtMoney(n) {
  return `$${Number(n || 0).toLocaleString()}`;
}

function monthLabel(ym) {
  const d = dayjs(`${ym}-01`);
  return d.isValid() ? d.format("MMM YYYY") : ym;
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

export default function AdminRevenue() {
  const [stats, setStats] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [hotelId, setHotelId] = useState("");
  const [loading, setLoading] = useState(true);
  const [hotelsLoading, setHotelsLoading] = useState(true);
  const [error, setError] = useState(null);
  const latestHotelIdRef = useRef(hotelId);
  latestHotelIdRef.current = hotelId;

  useEffect(() => {
    let cancelled = false;
    setHotelsLoading(true);
    apiClient
      .get("/admin/hotels")
      .then((res) => {
        if (!cancelled) setHotels(res.data || []);
      })
      .catch((err) => {
        console.error("Admin hotels list:", err);
        if (!cancelled) setHotels([]);
      })
      .finally(() => {
        if (!cancelled) setHotelsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const requestedHotelId = hotelId;
    setLoading(true);
    setError(null);
    const params = requestedHotelId ? { hotelId: requestedHotelId } : {};
    apiClient
      .get("/admin/stats", { params })
      .then((res) => {
        if (cancelled) return;
        if (requestedHotelId !== latestHotelIdRef.current) return;
        setStats(res.data);
      })
      .catch((err) => {
        console.error("Error fetching stats:", err);
        if (cancelled) return;
        if (requestedHotelId !== latestHotelIdRef.current) return;
        setStats(null);
        setError("Failed to load statistics.");
      })
      .finally(() => {
        if (cancelled) return;
        if (requestedHotelId !== latestHotelIdRef.current) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [hotelId]);

  const hotelOptions = useMemo(() => {
    return [...hotels].sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }, [hotels]);

  const chartRows = useMemo(() => {
    const series = stats?.monthlySeries || [];
    return series.map((row) => ({
      ...row,
      label: monthLabel(row.month),
    }));
  }, [stats]);

  const pieData = useMemo(() => buildPieData(stats?.statusCounts), [stats]);

  const sc = stats?.statusCounts || {};

  if (loading && !stats) {
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

  if (error && !stats) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-card">
          <div className="dashboard-card__body" style={{ color: "#dc3545" }}>
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-card">
          <div className="dashboard-card__body" style={{ color: "#dc3545" }}>
            Failed to load stats.
          </div>
        </div>
      </div>
    );
  }

  const isHotel = stats.scope === "hotel";
  const selectedHotel = isHotel ? stats.hotel : null;

  const kpiCards = isHotel
    ? [
        { label: "Recorded income", value: fmtMoney(stats.totalRevenue), accent: true },
        { label: "Total bookings", value: stats.totalBookings ?? 0 },
        { label: "Cancelled", value: sc.CANCELLED ?? 0 },
        { label: "Pending payment", value: sc.PENDING_PAYMENT ?? 0 },
        { label: "Draft", value: sc.DRAFT ?? 0 },
        { label: "Paid / in stay / done", value: (sc.PAID || 0) + (sc.CHECKED_IN || 0) + (sc.COMPLETED || 0) },
      ]
    : [
        { label: "Total revenue", value: fmtMoney(stats.totalRevenue), accent: true },
        { label: "Total bookings", value: stats.totalBookings ?? 0 },
        { label: "Total hotels", value: stats.totalHotels ?? 0 },
        { label: "Active hotels", value: stats.activeHotels ?? 0 },
        { label: "Total users", value: stats.totalUsers ?? 0 },
        { label: "Managers", value: stats.totalManagers ?? 0 },
        { label: "Cancelled (all)", value: sc.CANCELLED ?? 0 },
        { label: "Pending payment (all)", value: sc.PENDING_PAYMENT ?? 0 },
      ];

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
            {p.name}: {p.dataKey === "revenue" || p.dataKey === "cumulativeRevenue" ? fmtMoney(p.value) : p.value}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="dashboard-page admin-revenue">
      <div className="admin-revenue__toolbar">
        <div className="admin-revenue__toolbar-meta">
          <h1>Revenue & analytics</h1>
          <p>
            {isHotel
              ? `Figures for ${selectedHotel?.name || "this hotel"} — bookings, cancellations, pending payments, and income.`
              : "Platform-wide revenue, booking mix, and monthly trends."}
          </p>
          {isHotel && selectedHotel?.status && (
            <span className={`admin-revenue__badge${selectedHotel.status === "DRAFT" ? " admin-revenue__badge--draft" : ""}`}>
              {selectedHotel.status === "ACTIVE" ? "Active listing" : "Draft listing"}
            </span>
          )}
        </div>
        <div className="admin-revenue__hotel-field">
          <Form.Group className="mb-0">
            <Form.Label>Hotel</Form.Label>
            <Form.Select
              value={hotelId}
              disabled={hotelsLoading}
              onChange={(e) => setHotelId(e.target.value)}
              aria-label="Filter statistics by hotel"
            >
              <option value="">All platform</option>
              {hotelOptions.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                  {h.status === "DRAFT" ? " (draft)" : ""}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </div>
      </div>

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
              <div className="admin-revenue__empty-hint">No monthly data yet for this view.</div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <ComposedChart data={chartRows} margin={{ top: 8, right: 12, left: 0, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis dataKey="label" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} tickFormatter={(v) => `$${Number(v).toLocaleString()}`} />
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
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `$${Number(v).toLocaleString()}`} />
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
        <div className="dashboard-card">
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
                    <td style={{ textAlign: "right" }}>{fmtMoney(m.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
