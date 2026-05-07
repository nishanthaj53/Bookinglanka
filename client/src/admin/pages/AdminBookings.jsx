// client/src/admin/pages/AdminBookings.jsx
import { useEffect, useMemo, useState } from "react"
import api from "../../services/apiClient"

const STATUSES = ["DRAFT", "PENDING_PAYMENT", "PAID", "CHECKED_IN", "COMPLETED", "CANCELLED"]

export default function AdminBookings() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [bookings, setBookings] = useState([])
  const [openHotelIds, setOpenHotelIds] = useState(new Set())
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [search, setSearch] = useState("")

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        setError("")
        const res = await api.get("/admin/bookings")
        setBookings(res.data || [])
      } catch (e) {
        console.error("Admin bookings load error:", e)
        setError("Failed to load bookings")
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const filtered = useMemo(() => {
    let list = bookings
    if (statusFilter !== "ALL") list = list.filter(b => b.status === statusFilter)
    if (search.trim()) {
      const s = search.toLowerCase()
      list = list.filter(b => b.hotel?.name?.toLowerCase().includes(s))
    }
    return list
  }, [bookings, statusFilter, search])

  const grouped = useMemo(() => {
    const map = new Map()
    for (const b of filtered) {
      const hotelId = b.hotel?.id || "unknown"
      if (!map.has(hotelId)) {
        map.set(hotelId, {
          hotelId,
          hotelName: b.hotel?.name || "(Unknown Hotel)",
          totals: { ALL: 0, DRAFT: 0, PENDING_PAYMENT: 0, PAID: 0, CHECKED_IN: 0, COMPLETED: 0, CANCELLED: 0 },
          sumAmount: 0,
          currency: b.currency || "USD",
          rows: [],
        })
      }
      const bucket = map.get(hotelId)
      bucket.totals.ALL += 1
      if (bucket.totals[b.status] !== undefined) bucket.totals[b.status] += 1
      bucket.sumAmount += b.totalAmount || 0
      bucket.rows.push(b)
    }
    return Array.from(map.values()).sort((a, b) => a.hotelName.localeCompare(b.hotelName))
  }, [filtered])

  const toggleOpen = (hotelId) => {
    const next = new Set(openHotelIds)
    if (next.has(hotelId)) next.delete(hotelId)
    else next.add(hotelId)
    setOpenHotelIds(next)
  }

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-card">
          <div className="dashboard-card__body" style={{ textAlign: "center", padding: "3rem" }}>
            <p style={{ color: "#6c757d", margin: 0 }}>Loading bookings…</p>
          </div>
        </div>
      </div>
    )
  }
  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-card">
          <div className="dashboard-card__body" style={{ color: "#dc3545" }}>{error}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <div className="product__info-top d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <p className="product__showing-text mb-0">
          {filtered.length} booking{filtered.length === 1 ? "" : "s"} — filter by status or hotel name
        </p>
      </div>
      <div className="dashboard-card">
        <div className="dashboard-card__body">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center", marginBottom: "1rem" }}>
            <label style={{ fontWeight: 500 }}>Status:</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: "0.5rem 0.75rem", border: "1px solid #d1d5db", borderRadius: 6, minWidth: "140px" }}>
              <option value="ALL">ALL</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input type="text" placeholder="Search hotel…" value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: "1", minWidth: "160px", padding: "0.5rem 0.75rem", border: "1px solid #d1d5db", borderRadius: 6 }} />
            <span style={{ fontSize: "0.9rem" }}>Total: <strong>{filtered.length}</strong></span>
          </div>
          {grouped.length === 0 ? (
            <p style={{ textAlign: "center", color: "#6c757d", margin: 0 }}>No bookings found.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Hotel</th>
                    <th>Total</th>
                    {STATUSES.map(s => <th key={s}>{s}</th>)}
                    <th>Revenue (sum)</th>
                    <th>Expand</th>
                  </tr>
                </thead>
                <tbody>
                  {grouped.map(g => (
                    <FragmentRow key={g.hotelId} group={g} isOpen={openHotelIds.has(g.hotelId)} onToggle={() => toggleOpen(g.hotelId)} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FragmentRow({ group, isOpen, onToggle }) {
  return (
    <>
      <tr>
        <td>{group.hotelName}</td>
        <td align="center">{group.totals.ALL}</td>
        {["DRAFT", "PENDING_PAYMENT", "PAID", "CHECKED_IN", "COMPLETED", "CANCELLED"].map(s => (
          <td key={s} align="center">{group.totals[s]}</td>
        ))}
        <td align="right">{group.currency} {group.sumAmount.toLocaleString()}</td>
        <td style={{ textAlign: "center" }}>
          <button type="button" onClick={onToggle} className="dashboard-btn dashboard-btn--secondary" style={{ fontSize: "0.85rem" }}>{isOpen ? "Hide" : "View"}</button>
        </td>
      </tr>

      {isOpen && (
        <tr>
          <td colSpan={9} style={{ background: "#f8f9fa", padding: "1rem" }}>
            <table className="dashboard-table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>User</th>
                  <th>Room</th>
                  <th>Status</th>
                  <th>Check-in</th>
                  <th>Check-out</th>
                  <th align="right">Amount</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {group.rows.map(b => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>{b.user?.email || "-"}</td>
                    <td>{b.roomType?.name || "-"}</td>
                    <td>{b.status}</td>
                    <td>{fmtDate(b.checkIn)}</td>
                    <td>{fmtDate(b.checkOut)}</td>
                    <td align="right">{b.currency} {Number(b.totalAmount || 0).toLocaleString()}</td>
                    <td>{fmtDateTime(b.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      )}
    </>
  )
}

function fmtDate(d) { return d ? new Date(d).toISOString().slice(0, 10) : "-" }
function fmtDateTime(d) { return d ? new Date(d).toLocaleString() : "-" }
