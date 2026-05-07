import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../../services/apiClient";
import TripRouteMap from "./TripRouteMap";

const INTERESTS = [
  "beach",
  "culture",
  "wildlife",
  "hiking",
  "food",
  "city",
  "history",
];

/**
 * @param {{ compact?: boolean; authenticatedPlanner?: boolean }} props
 * When authenticatedPlanner is true, trip-plan and availability calls use apiClient (Bearer),
 * for use inside the logged-in user dashboard.
 */
export default function TripPlannerWidget({ compact = false, authenticatedPlanner = false }) {
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const hotelDetailPath = (hotelId) =>
    authenticatedPlanner ? `/dashboard/hotels/${hotelId}` : `/hotels/${hotelId}`;
  const [days, setDays] = useState(10);
  const [locationQuery, setLocationQuery] = useState("Sri Lanka");
  const [activityType, setActivityType] = useState("Adventure");
  const [travelers, setTravelers] = useState(2);
  const [plannerStartDate, setPlannerStartDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [budget, setBudget] = useState("mid");
  const [travelStyle, setTravelStyle] = useState("couple");
  const [interests, setInterests] = useState(["culture", "beach"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [visibleCount, setVisibleCount] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);
  const [openDay, setOpenDay] = useState(null);
  const [tripStartDate, setTripStartDate] = useState("");
  const [creatingBookings, setCreatingBookings] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingInfo, setBookingInfo] = useState("");
  const [availableHotels, setAvailableHotels] = useState([]);
  const [unavailableHotels, setUnavailableHotels] = useState([]);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  const cardStyle = useMemo(
    () => ({
      border: "1px solid #e5e5e5",
      borderRadius: 12,
      padding: compact ? 14 : 18,
      background: "#fff",
    }),
    [compact]
  );

  const toggleInterest = (item) => {
    setInterests((prev) =>
      prev.includes(item) ? prev.filter((x) => x !== item) : [...prev, item]
    );
  };

  const generate = async () => {
    try {
      setLoading(true);
      setError("");
      const activityInterest = String(activityType || "")
        .toLowerCase()
        .trim();
      const body = {
        days,
        interests: activityInterest ? [activityInterest] : interests,
        budget,
        travelStyle,
        location: locationQuery,
        travelers,
        startDate: plannerStartDate,
      };
      let data;
      if (authenticatedPlanner) {
        const res = await apiClient.post("/ai/trip-plan", body);
        data = res.data;
      } else {
        const res = await fetch(`${API_BASE}/ai/trip-plan`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error("Failed to generate plan");
        data = await res.json();
      }
      setResult(data);
      setVisibleCount(0);
      setTypedText("");
      setTypingDone(false);
      setOpenDay(1);
      setBookingInfo("");
      setBookingError("");
      setAvailableHotels([]);
      setUnavailableHotels([]);
    } catch (err) {
      setError(err.response?.data?.error || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const plannerEndDate = useMemo(() => {
    const d = new Date(plannerStartDate || new Date().toISOString().slice(0, 10));
    if (Number.isNaN(d.getTime())) return "";
    d.setDate(d.getDate() + Math.max(1, Number(days || 1)));
    return d.toISOString().slice(0, 10);
  }, [plannerStartDate, days]);

  const itinerary = Array.isArray(result?.itinerary) ? result.itinerary : [];
  const hotels = Array.isArray(result?.recommendedHotels) ? result.recommendedHotels : [];
  const hotelsForBooking = availableHotels.length ? availableHotels : hotels;

  useEffect(() => {
    if (!itinerary.length) return undefined;
    let dayIdx = 0;
    let charIdx = 0;
    let current = "";
    let mounted = true;
    setVisibleCount(0);
    setTypedText("");
    setTypingDone(false);

    const timer = setInterval(() => {
      if (!mounted) return;
      const item = itinerary[dayIdx];
      if (!item) {
        setTypingDone(true);
        clearInterval(timer);
        return;
      }
      const target = `Day ${item.day}: ${item.destinationName} - ${item.plan}`;
      if (charIdx < target.length) {
        current += target[charIdx];
        charIdx += 1;
        setTypedText(current);
      } else {
        setVisibleCount(dayIdx + 1);
        dayIdx += 1;
        charIdx = 0;
        current = "";
        setTypedText("");
      }
    }, 16);

    return () => {
      mounted = false;
      clearInterval(timer);
    };
  }, [result]);

  const resolveImage = (url) => {
    if (!url) return "https://placehold.co/120x80?text=Hotel";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const base = API_BASE.replace(/\/$/, "");
    return `${base}${url.startsWith("/") ? url : `/${url}`}`;
  };

  const dayDurations = useMemo(() => {
    const map = new Map();
    itinerary.forEach((i) => {
      const key = i.destinationSlug || String(i.destinationName || "").toLowerCase();
      map.set(key, (map.get(key) || 0) + 1);
    });
    return map;
  }, [itinerary]);

  const hotelByDestination = useMemo(() => {
    const map = new Map();
    hotelsForBooking.forEach((h) => {
      const key =
        h.destinationSlug ||
        String(h.destinationName || "").toLowerCase() ||
        String(h.destination || "").toLowerCase();
      if (!map.has(key)) map.set(key, h);
    });
    return map;
  }, [hotelsForBooking]);

  const estimatedTotal = useMemo(() => {
    let total = 0;
    dayDurations.forEach((nights, key) => {
      const hotel = hotelByDestination.get(key);
      const price = Number(hotel?.minPrice || 0);
      total += price * nights;
    });
    return total;
  }, [dayDurations, hotelByDestination]);

  const buildSegments = () => {
    const seq = [];
    let current = null;
    itinerary.forEach((item) => {
      const key = item.destinationSlug || String(item.destinationName || "").toLowerCase();
      if (!current || current.key !== key) {
        current = { key, destinationName: item.destinationName, nights: 1 };
        seq.push(current);
      } else {
        current.nights += 1;
      }
    });
    return seq;
  };

  useEffect(() => {
    const run = async () => {
      if (!tripStartDate || !result?.itinerary?.length || !result?.recommendedHotels?.length) {
        setAvailableHotels([]);
        setUnavailableHotels([]);
        return;
      }
      try {
        setCheckingAvailability(true);
        const payload = {
          startDate: tripStartDate,
          itinerary: result.itinerary,
          recommendedHotels: result.recommendedHotels,
        };
        let data;
        if (authenticatedPlanner) {
          const res = await apiClient.post("/ai/trip-plan/filter-available", payload);
          data = res.data;
        } else {
          const res = await fetch(`${API_BASE}/ai/trip-plan/filter-available`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error("Availability check failed");
          data = await res.json();
        }
        setAvailableHotels(Array.isArray(data.availableHotels) ? data.availableHotels : []);
        setUnavailableHotels(Array.isArray(data.unavailableHotels) ? data.unavailableHotels : []);
      } catch {
        setAvailableHotels([]);
        setUnavailableHotels([]);
      } finally {
        setCheckingAvailability(false);
      }
    };
    run();
  }, [API_BASE, tripStartDate, result, authenticatedPlanner]);

  const addDays = (dateStr, daysToAdd) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + daysToAdd);
    return d.toISOString().slice(0, 10);
  };

  const bookAllHotels = async () => {
    try {
      setCreatingBookings(true);
      setBookingError("");
      setBookingInfo("");
      if (!tripStartDate) {
        throw new Error("Please choose trip start date.");
      }
      if (!localStorage.getItem("accessToken")) {
        throw new Error("Please login first to create bookings.");
      }
      const segments = buildSegments();
      const created = [];
      let cursorDate = tripStartDate;

      for (const seg of segments) {
        const hotel = hotelByDestination.get(seg.key);
        if (!hotel?.id || !hotel?.roomTypeId) {
          cursorDate = addDays(cursorDate, seg.nights);
          continue;
        }
        const checkIn = cursorDate;
        const checkOut = addDays(checkIn, seg.nights);
        const res = await apiClient.post("/bookings", {
          hotelId: hotel.id,
          roomTypeId: hotel.roomTypeId,
          checkIn,
          checkOut,
          currency: "USD",
          guests: 2,
          rooms: 1,
          bookingFlow: "REQUEST",
        });
        const booking = res.data?.booking;
        if (booking?.id) {
          created.push({
            id: booking.id,
            totalAmount: booking.totalAmount,
            hotelName: booking.hotel?.name || hotel.name,
            roomName: booking.roomType?.name || hotel.roomName || "Room",
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            rooms: booking.rooms || 1,
            guests: booking.guests || 2,
          });
        }
        cursorDate = checkOut;
      }

      if (!created.length) {
        throw new Error("No bookings created. Some destinations may not have available mapped rooms.");
      }
      localStorage.setItem("bookingCartItems", JSON.stringify(created));
      setBookingInfo(`${created.length} bookings added to cart. Redirecting to cart...`);
      navigate("/dashboard/bookings/cart", { state: { items: created } });
    } catch (err) {
      setBookingError(err.response?.data?.error || err.message || "Failed to create trip bookings");
    } finally {
      setCreatingBookings(false);
    }
  };

  return (
    <div style={cardStyle}>
      {!compact ? (
        <div>
          <div
            style={{
              borderRadius: 999,
              padding: "18px 20px",
              background: "#fff",
              boxShadow: "0 8px 24px rgba(0,0,0,.06)",
              display: "grid",
              gridTemplateColumns: "1.1fr 1fr 1fr .8fr auto",
              gap: 12,
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Location</div>
              <input
                className="form-control"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                style={{ border: "none", padding: "6px 0", fontSize: 22, fontWeight: 600 }}
              />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Activities Type</div>
              <select
                className="form-control"
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
                style={{ border: "none", padding: "6px 0", fontSize: 20, fontWeight: 600 }}
              >
                <option>Adventure</option>
                <option>Culture</option>
                <option>Beach</option>
                <option>Wildlife</option>
                <option>Hiking</option>
                <option>Food</option>
              </select>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Activate Day</div>
              <input
                type="date"
                className="form-control"
                value={plannerStartDate}
                onChange={(e) => setPlannerStartDate(e.target.value)}
                style={{ border: "none", padding: "6px 0", fontSize: 16, fontWeight: 600 }}
              />
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                {plannerStartDate} → {plannerEndDate}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Traveler</div>
              <input
                type="number"
                min={1}
                className="form-control"
                value={travelers}
                onChange={(e) => setTravelers(Math.max(1, Number(e.target.value) || 1))}
                style={{ border: "none", padding: "6px 0", fontSize: 22, fontWeight: 600 }}
              />
            </div>
            <button
              type="button"
              className="gotur-btn"
              onClick={generate}
              disabled={loading}
              style={{ borderRadius: 999, minWidth: 130 }}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
          <div className="row g-2" style={{ marginTop: 10 }}>
            <div className="col-sm-4">
              <input
                type="number"
                min={2}
                max={30}
                value={days}
                onChange={(e) => setDays(Number(e.target.value) || 10)}
                className="form-control"
                placeholder="Days"
              />
            </div>
            <div className="col-sm-4">
              <select
                className="form-control"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              >
                <option value="budget">Budget</option>
                <option value="mid">Mid-range</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>
            <div className="col-sm-4">
              <select
                className="form-control"
                value={travelStyle}
                onChange={(e) => setTravelStyle(e.target.value)}
              >
                <option value="solo">Solo</option>
                <option value="couple">Couple</option>
                <option value="family">Family</option>
                <option value="friends">Friends</option>
              </select>
            </div>
          </div>
        </div>
      ) : (
        <>
          <h4 style={{ marginBottom: 10 }}>Plan My Sri Lanka Trip</h4>
          <p style={{ marginBottom: 12, color: "#6b7280" }}>
            Get destination and hotel suggestions using your preferences.
          </p>
          <div className="row g-2">
            <div className="col-sm-4">
              <input
                type="number"
                min={2}
                max={30}
                value={days}
                onChange={(e) => setDays(Number(e.target.value) || 10)}
                className="form-control"
                placeholder="Days"
              />
            </div>
            <div className="col-sm-4">
              <select className="form-control" value={budget} onChange={(e) => setBudget(e.target.value)}>
                <option value="budget">Budget</option>
                <option value="mid">Mid-range</option>
                <option value="luxury">Luxury</option>
              </select>
            </div>
            <div className="col-sm-4">
              <select
                className="form-control"
                value={travelStyle}
                onChange={(e) => setTravelStyle(e.target.value)}
              >
                <option value="solo">Solo</option>
                <option value="couple">Couple</option>
                <option value="family">Family</option>
                <option value="friends">Friends</option>
              </select>
            </div>
          </div>
          <div style={{ marginTop: 10, display: "flex", flexWrap: "wrap", gap: 8 }}>
            {INTERESTS.map((item) => {
              const active = interests.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleInterest(item)}
                  style={{
                    border: "1px solid #d1d5db",
                    borderRadius: 999,
                    padding: "4px 10px",
                    fontSize: 13,
                    background: active ? "#5db83e" : "#fff",
                    color: active ? "#fff" : "#111827",
                  }}
                >
                  {item}
                </button>
              );
            })}
          </div>
          <button
            type="button"
            className="gotur-btn"
            onClick={generate}
            disabled={loading}
            style={{ marginTop: 12 }}
          >
            {loading ? "Generating..." : "Generate Trip Plan"}
          </button>
        </>
      )}

      {error && <p style={{ color: "red", marginTop: 10 }}>{error}</p>}

      {result && (
        <div style={{ marginTop: 14 }}>
          <p style={{ marginBottom: 8 }}>
            <strong>{result.summary || "Here is your suggested plan."}</strong>
          </p>
          <div className="row g-3">
            <div className={compact ? "col-12" : "col-lg-8"}>
              {itinerary.slice(0, compact ? Math.min(visibleCount, 4) : visibleCount).map((item) => {
                const isOpen = openDay === item.day;
                return (
                  <div
                    key={`${item.day}-${item.destinationSlug || item.destinationName}`}
                    style={{
                      border: "1px solid #ececec",
                      borderRadius: 10,
                      padding: 10,
                      marginBottom: 8,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenDay(isOpen ? null : item.day)}
                      style={{
                        width: "100%",
                        border: "none",
                        background: "transparent",
                        display: "flex",
                        justifyContent: "space-between",
                        fontWeight: 600,
                        textAlign: "left",
                      }}
                    >
                      <span>Day {item.day} - {item.destinationName}</span>
                      <span>{isOpen ? "▲" : "▼"}</span>
                    </button>
                    {isOpen && (
                      <p style={{ marginTop: 8, marginBottom: 0, color: "#374151" }}>
                        {item.plan}
                      </p>
                    )}
                  </div>
                );
              })}
              {!typingDone && typedText && (
                <p style={{ color: "#374151", fontStyle: "italic", marginTop: 6 }}>
                  {typedText}
                  <span style={{ marginLeft: 4 }}>|</span>
                </p>
              )}
            </div>

            {!compact && (
              <div className="col-lg-4">
                <div style={{ border: "1px solid #ececec", borderRadius: 10, padding: 10 }}>
                  <h6 style={{ marginBottom: 10 }}>Suggested Hotels</h6>
                  {(hotelsForBooking.length ? hotelsForBooking : hotels).slice(0, 6).map((hotel) => (
                    <Link
                      key={hotel.id}
                      to={hotelDetailPath(hotel.id)}
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                        textDecoration: "none",
                        border: "1px solid #f1f1f1",
                        borderRadius: 8,
                        padding: 6,
                        marginBottom: 8,
                      }}
                    >
                      <img
                        src={resolveImage(hotel.coverImage)}
                        alt={hotel.name}
                        style={{ width: 56, height: 42, objectFit: "cover", borderRadius: 6 }}
                      />
                      <div style={{ color: "#111827", fontSize: 13 }}>
                        <div style={{ fontWeight: 600 }}>{hotel.name}</div>
                        <div>${hotel.minPrice || "-"} / night</div>
                      </div>
                    </Link>
                  ))}
                  {!!unavailableHotels.length && (
                    <div style={{ marginTop: 8, fontSize: 12, color: "#b45309" }}>
                      {unavailableHotels.length} hotel(s) removed for selected dates (paused/full).
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {!compact && (
            <div style={{ marginTop: 12, border: "1px solid #ececec", borderRadius: 10, padding: 12 }}>
              <h6 style={{ marginBottom: 8 }}>Book Entire Trip (All Recommended Hotels)</h6>
              <div className="row g-2 align-items-end">
                <div className="col-sm-4">
                  <label style={{ fontSize: 12 }}>Trip start date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={tripStartDate}
                    onChange={(e) => setTripStartDate(e.target.value)}
                  />
                </div>
                <div className="col-sm-4">
                  <div style={{ fontSize: 12, color: "#6b7280" }}>Estimated ground amount</div>
                  <div style={{ fontWeight: 700 }}>${Number(estimatedTotal || 0).toFixed(2)}</div>
                </div>
                <div className="col-sm-4">
                  <button
                    type="button"
                    className="gotur-btn"
                    onClick={bookAllHotels}
                    disabled={creatingBookings || checkingAvailability}
                  >
                    {creatingBookings
                      ? "Creating..."
                      : checkingAvailability
                      ? "Checking availability..."
                      : "Book All Hotels"}
                  </button>
                </div>
              </div>
              {!!bookingInfo && (
                <p style={{ color: "#0a7a30", marginTop: 8, marginBottom: 4 }}>
                  {bookingInfo} <Link to="/dashboard/bookings/cart">Open cart</Link>
                </p>
              )}
              {!!bookingError && (
                <p style={{ color: "red", marginTop: 8, marginBottom: 4 }}>{bookingError}</p>
              )}
            </div>
          )}

          {!compact && result?.map && <TripRouteMap mapData={result.map} />}
        </div>
      )}
    </div>
  );
}
