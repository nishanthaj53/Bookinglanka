import { useMemo, useRef, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useNavigate, useOutletContext } from "react-router-dom";
import apiClient from "../../services/apiClient";
import { MANAGER_ROUTES } from "../../components/manager/managerNav";
import { HOTEL_TYPE_OPTIONS } from "../../enduser/constants/userDashboardHotelOptions";

function addTileStyle(height) {
  return {
    flex: "0 0 auto",
    width: "min(46vw, 280px)",
    height,
    border: "2px dashed #ced4da",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    background: "#fafafa",
    color: "#6c757d",
    fontSize: "0.9rem",
    gap: "0.25rem",
  };
}

export default function ManagerHotelCreate() {
  const navigate = useNavigate();
  const { refreshDashboard } = useOutletContext();
  const coverInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const amenityInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    description: "",
    facilities: "",
    overviewTitle: "",
    overview: "",
    propertyType: "",
    checkInTime: "",
    checkOutTime: "",
    basePrice: "",
    highlights: "",
    amenities: "",
    roomAmenities: "",
    mapEmbedUrl: "",
  });

  const [cover, setCover] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [amenityItems, setAmenityItems] = useState([]);
  const [draftRooms, setDraftRooms] = useState([]);
  const [loading, setLoading] = useState(false);

  const buildMapEmbedFromAddress = (address) => {
    const trimmed = (address || "").trim();
    if (!trimmed) return "";
    return `https://maps.google.com/maps?q=${encodeURIComponent(trimmed)}&z=14&output=embed`;
  };

  const buildMapEmbedFromLatLng = (lat, lng, zoom = 16) => {
    const la = parseFloat(lat);
    const lo = parseFloat(lng);
    if (Number.isNaN(la) || Number.isNaN(lo)) return "";
    return `https://maps.google.com/maps?q=${la},${lo}&z=${zoom}&output=embed`;
  };

  const [locationSearch, setLocationSearch] = useState("");
  const [geocodeResults, setGeocodeResults] = useState([]);
  const [geocodeLoading, setGeocodeLoading] = useState(false);
  const [geocodeError, setGeocodeError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const runGeocode = async () => {
    const q = locationSearch.trim();
    if (q.length < 2) {
      setGeocodeError("Type at least 2 characters (city, street, or place).");
      setGeocodeResults([]);
      return;
    }
    setGeocodeError("");
    setGeocodeLoading(true);
    setGeocodeResults([]);
    try {
      const res = await apiClient.get("/manager/geocode", { params: { q } });
      const list = res.data?.results || [];
      setGeocodeResults(list);
      if (!list.length) setGeocodeError("No matches found. Try a different spelling.");
    } catch (err) {
      setGeocodeError(err.response?.data?.error || "Search failed.");
      setGeocodeResults([]);
    } finally {
      setGeocodeLoading(false);
    }
  };

  const pickGeocodeResult = (p) => {
    if (!p?.lat || !p?.lon) return;
    const latStr = String(p.lat);
    const lonStr = String(p.lon);
    const embed = buildMapEmbedFromLatLng(latStr, lonStr);
    setForm((prev) => ({
      ...prev,
      address: p.display_name || prev.address,
      latitude: latStr,
      longitude: lonStr,
      mapEmbedUrl: embed,
    }));
    setGeocodeResults([]);
    setLocationSearch("");
    setGeocodeError("");
  };

  const onCoverChange = (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    setCover((prev) => {
      if (prev?.url) URL.revokeObjectURL(prev.url);
      return { file: f, url: URL.createObjectURL(f) };
    });
  };

  const onGalleryChange = (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;
    setGallery((prev) => {
      const next = [...prev];
      for (const file of files) {
        if (next.length >= 9) break;
        next.push({ file, url: URL.createObjectURL(file) });
      }
      return next;
    });
  };

  const removeGallery = (index) => {
    setGallery((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(index, 1);
      if (removed?.url) URL.revokeObjectURL(removed.url);
      return copy;
    });
  };

  const onAmenityChange = (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;
    setAmenityItems((prev) => {
      const next = [...prev];
      for (const file of files) {
        if (next.length >= 10) break;
        next.push({ file, url: URL.createObjectURL(file) });
      }
      return next;
    });
  };

  const removeAmenity = (index) => {
    setAmenityItems((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(index, 1);
      if (removed?.url) URL.revokeObjectURL(removed.url);
      return copy;
    });
  };

  const addDraftRoom = () => {
    setDraftRooms((prev) => [
      ...prev,
      { key: `${Date.now()}-${prev.length}`, name: "", capacity: "", pricePerNight: "" },
    ]);
  };

  const updateDraftRoom = (key, field, value) => {
    setDraftRooms((prev) => prev.map((r) => (r.key === key ? { ...r, [field]: value } : r)));
  };

  const removeDraftRoom = (key) => {
    setDraftRooms((prev) => prev.filter((r) => r.key !== key));
  };

  const handleAddHotel = async (e) => {
    e.preventDefault();
    if (!form.name?.trim()) {
      alert("Hotel name is required.");
      return;
    }
    if (!form.address?.trim()) {
      alert("Address is required.");
      return;
    }
    if (!cover?.file) {
      alert("Please add a cover image for the hotel.");
      return;
    }
    if (gallery.length < 1) {
      alert("Please add at least one relevant hotel photo (in addition to the cover).");
      return;
    }

    const activeRooms = draftRooms.filter((r) => (r.name || "").trim() || r.capacity || r.pricePerNight);
    for (const r of activeRooms) {
      const nameOk = (r.name || "").trim();
      const cap = Number(r.capacity);
      const price = Number(r.pricePerNight);
      if (!nameOk || !r.capacity || Number.isNaN(cap) || cap < 1) {
        alert('Each room you add needs a name and a valid capacity (guest count).');
        return;
      }
      if (!r.pricePerNight || Number.isNaN(price) || price <= 0) {
        alert('Each room you add needs a price per night greater than 0.');
        return;
      }
    }

    const roles = ["Cover", ...gallery.map(() => "Other")];

    try {
      setLoading(true);
      const formData = new FormData();
      let merged = { ...form, description: form.description || form.overview || "" };
      const la = parseFloat(merged.latitude);
      const lo = parseFloat(merged.longitude);
      if (!Number.isNaN(la) && !Number.isNaN(lo)) {
        merged = { ...merged, mapEmbedUrl: buildMapEmbedFromLatLng(merged.latitude, merged.longitude) };
      } else if (!merged.mapEmbedUrl?.trim() && merged.address?.trim()) {
        merged = { ...merged, mapEmbedUrl: buildMapEmbedFromAddress(merged.address) };
      }
      Object.entries(merged).forEach(([k, v]) => formData.append(k, v ?? ""));
      formData.append("images", cover.file);
      gallery.forEach((g) => formData.append("images", g.file));
      amenityItems.forEach((a) => formData.append("amenityImages", a.file));
      formData.append("roles", JSON.stringify(roles));

      const { data } = await apiClient.post("/manager/hotels", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const hotelId = data.hotel?.id;
      if (hotelId && activeRooms.length) {
        for (const r of activeRooms) {
          await apiClient.post("/manager/rooms", {
            hotelId,
            name: r.name.trim(),
            capacity: Number(r.capacity),
            pricePerNight: Number(r.pricePerNight),
          });
        }
      }

      alert("Hotel created successfully.");
      if (refreshDashboard) await refreshDashboard();
      navigate(hotelId ? `/manager/dashboard/hotels/${hotelId}` : MANAGER_ROUTES.hotelsActive);
    } catch (err) {
      console.error("Add hotel error:", err);
      const msg = err.response?.data?.error || "Error creating hotel";
      const details = err.response?.data?.details;
      alert(details ? `${msg}\n\n${details}` : msg);
    } finally {
      setLoading(false);
    }
  };

  const mapSrc = useMemo(() => {
    const la = parseFloat(form.latitude);
    const lo = parseFloat(form.longitude);
    if (!Number.isNaN(la) && !Number.isNaN(lo)) {
      return buildMapEmbedFromLatLng(form.latitude, form.longitude);
    }
    const custom = form.mapEmbedUrl?.trim();
    if (custom) return custom;
    return buildMapEmbedFromAddress(form.address);
  }, [form.latitude, form.longitude, form.mapEmbedUrl, form.address]);

  const highlightsPreview = form.highlights
    ? form.highlights.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const amenitiesPreview = form.amenities
    ? form.amenities.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const roomAmenitiesPreview = form.roomAmenities
    ? form.roomAmenities.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <form onSubmit={handleAddHotel} style={{ maxWidth: "100%" }}>
      <p className="text-muted small mb-3" style={{ marginTop: "-0.5rem" }}>
        Build your hotel the same way guests will see it. Recommended sizes — cover <strong>1920×460</strong>, relevant photos{" "}
        <strong>584×395</strong>, amenities strip <strong>370×243</strong>, room cards <strong>370×243</strong> (room photos after save).
      </p>

      <section className="tour-listing-details section-space" style={{ paddingTop: 0 }}>
        <div className="tour-listing-details__destination wow fadeInUp" data-wow-duration="1500ms">
          <Container>
            <div className="tour-listing-details__destination__inner">
              <div className="tour-listing-details__destination__left" style={{ width: "100%" }}>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="tour-listing-details__destination__title"
                  placeholder="Hotel name (required)"
                  required
                  style={{
                    border: "none",
                    background: "transparent",
                    width: "100%",
                    outline: "none",
                    marginBottom: "0.35rem",
                  }}
                />
                <div className="tour-listing-details__destination__revue">
                  <div className="tour-listing-details__destination__ratings-box">
                    <span>(Preview)</span>
                    {[...Array(5)].map((_, idx) => (
                      <i key={idx} className="icon-star"></i>
                    ))}
                  </div>
                  <div className="tour-listing-details__destination__posted">
                    <i className="icon-pin1"></i>
                    <input
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      className="tour-listing-details__destination__posted-text"
                      placeholder="Address (required)"
                      required
                      style={{
                        border: "none",
                        background: "transparent",
                        flex: 1,
                        outline: "none",
                        minWidth: 0,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>

        <div className="tour-listing-details__carousel wow fadeInUp" data-wow-duration="1500ms">
          <Container>
            <div className="destination-carousel__item" style={{ position: "relative" }}>
              {cover?.url ? (
                <>
                  <img
                    src={cover.url}
                    alt="Cover preview"
                    style={{ width: "100%", height: "460px", objectFit: "cover", borderRadius: "10px" }}
                  />
                  <button
                    type="button"
                    className="gotur-btn"
                    style={{ position: "absolute", bottom: "16px", right: "16px" }}
                    onClick={() => coverInputRef.current?.click()}
                  >
                    Change cover
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="destination-carousel__item"
                  onClick={() => coverInputRef.current?.click()}
                  style={{
                    width: "100%",
                    height: "460px",
                    borderRadius: "10px",
                    border: "2px dashed #ced4da",
                    background: "#f8f9fa",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#6c757d",
                    gap: "0.5rem",
                  }}
                >
                  <span style={{ fontSize: "2.5rem", lineHeight: 1 }}>+</span>
                  <span style={{ fontSize: "1rem", fontWeight: 600 }}>Add cover image</span>
                  <span className="small">1920 × 460 recommended</span>
                </button>
              )}
              <input ref={coverInputRef} type="file" accept="image/*" hidden onChange={onCoverChange} />
            </div>
          </Container>
        </div>

        <div className="tour-listing-details__content__item tour-listing-details__thumb wow fadeInUp">
          <div className="container-fluid">
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
              <h4 className="tour-listing-details__title mb-0">Relevant Hotel Photos</h4>
              <span className="small text-muted">At least one required · 584×395 recommended</span>
            </div>
            <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
              {gallery.map((item, index) => (
                <div key={`g-${index}`} style={{ position: "relative", flex: "0 0 auto" }}>
                  <img
                    src={item.url}
                    alt=""
                    style={{ width: "min(46vw, 280px)", height: "395px", objectFit: "cover", borderRadius: "10px", display: "block" }}
                  />
                  <button
                    type="button"
                    className="dashboard-btn dashboard-btn--danger"
                    onClick={() => removeGallery(index)}
                    style={{ position: "absolute", top: 8, right: 8, width: 28, height: 28, padding: 0, borderRadius: "50%", fontSize: "16px", lineHeight: 1 }}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button type="button" onClick={() => galleryInputRef.current?.click()} style={addTileStyle(395)}>
                <span style={{ fontSize: "2rem", lineHeight: 1 }}>+</span>
                <span>Add photos</span>
              </button>
            </div>
            <input ref={galleryInputRef} type="file" accept="image/*" multiple hidden onChange={onGalleryChange} />
          </div>
        </div>

        <div className="tour-listing-details__info-area wow fadeInUp" data-wow-duration="1500ms">
          <Container>
            <ul className="tour-listing-details__info-area__info list-unstyled">
              <li>
                <div className="tour-listing-details__info-area__icon">
                  <i className="icon-location"></i>
                </div>
                <div className="tour-listing-details__info-area__content">
                  <h5 className="tour-listing-details__info-area__title">Situated Place</h5>
                  <p className="tour-listing-details__info-area__text" style={{ marginBottom: 0 }}>
                    {form.address?.trim() || "Enter address above"}
                  </p>
                </div>
              </li>
              <li>
                <div className="tour-listing-details__info-area__icon">
                  <i className="icon-travel-and-tourism"></i>
                </div>
                <div className="tour-listing-details__info-area__content">
                  <h5 className="tour-listing-details__info-area__title">Hotel type</h5>
                  <select
                    name="propertyType"
                    value={form.propertyType}
                    onChange={handleChange}
                    className="tour-listing-details__info-area__text"
                    style={{ border: "none", width: "100%", background: "transparent", outline: "none", padding: 0 }}
                  >
                    {HOTEL_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value || "__blank"} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </li>
              <li>
                <div className="tour-listing-details__info-area__icon">
                  <i className="icon-clock"></i>
                </div>
                <div className="tour-listing-details__info-area__content">
                  <h5 className="tour-listing-details__info-area__title">Check-in</h5>
                  <input
                    name="checkInTime"
                    value={form.checkInTime}
                    onChange={handleChange}
                    className="tour-listing-details__info-area__text"
                    placeholder="2:00 PM"
                    style={{ border: "none", width: "100%", background: "transparent", outline: "none", padding: 0 }}
                  />
                </div>
              </li>
              <li>
                <div className="tour-listing-details__info-area__icon">
                  <i className="icon-clock"></i>
                </div>
                <div className="tour-listing-details__info-area__content">
                  <h5 className="tour-listing-details__info-area__title">Check-out</h5>
                  <input
                    name="checkOutTime"
                    value={form.checkOutTime}
                    onChange={handleChange}
                    className="tour-listing-details__info-area__text"
                    placeholder="11:00 AM"
                    style={{ border: "none", width: "100%", background: "transparent", outline: "none", padding: 0 }}
                  />
                </div>
              </li>
              <li>
                <span className="gotur-btn">
                  From{" "}
                  <input
                    name="basePrice"
                    type="number"
                    min={0}
                    value={form.basePrice}
                    onChange={handleChange}
                    style={{ width: 90, border: "none", background: "rgba(255,255,255,0.25)", color: "#fff", borderRadius: 4 }}
                    placeholder="0"
                  />{" "}
                  / night (optional)
                </span>
              </li>
            </ul>
          </Container>
        </div>

        <Container>
          <Row className="gutter-y-30">
            <Col lg={8}>
              <div className="tour-listing-details__content">
                <div className="tour-listing-details__content__item tour-listing-details__content__text wow fadeInUp">
                  <input
                    name="overviewTitle"
                    value={form.overviewTitle}
                    onChange={handleChange}
                    className="tour-listing-details__title"
                    placeholder="Overview heading"
                    style={{ border: "none", width: "100%", background: "transparent", outline: "none", marginBottom: "0.75rem" }}
                  />
                  <textarea
                    name="overview"
                    value={form.overview}
                    onChange={handleChange}
                    className="tour-listing-details__text"
                    placeholder="Overview — describe your hotel for guests."
                    rows={5}
                    style={{ width: "100%", border: "1px solid #e9ecef", borderRadius: "8px", padding: "0.75rem", resize: "vertical" }}
                  />
                </div>

                <div className="tour-listing-details__content__item tour-listing-details__list wow fadeInUp">
                  <h4 className="tour-listing-details__title">Facilities / Highlights</h4>
                  <textarea
                    name="highlights"
                    value={form.highlights}
                    onChange={handleChange}
                    placeholder="Comma separated, e.g. Pool, Spa, Airport shuttle"
                    rows={2}
                    style={{ width: "100%", border: "1px solid #e9ecef", borderRadius: "8px", padding: "0.75rem" }}
                  />
                  {!!highlightsPreview.length && (
                    <ul className="tour-listing-details__content__list mt-3">
                      {highlightsPreview.map((item, idx) => (
                        <li key={`${item}-${idx}`}>
                          <i className="icon-check-star"></i> {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="tour-listing-details__content__item tour-listing-details__amenities wow fadeInUp">
                  <h4 className="tour-listing-details__title">Amenities</h4>
                  <textarea
                    name="amenities"
                    value={form.amenities}
                    onChange={handleChange}
                    placeholder="Hotel amenities, comma separated"
                    rows={2}
                    style={{ width: "100%", border: "1px solid #e9ecef", borderRadius: "8px", padding: "0.75rem", marginBottom: "0.75rem" }}
                  />
                  <textarea
                    name="roomAmenities"
                    value={form.roomAmenities}
                    onChange={handleChange}
                    placeholder="Typical in-room amenities, comma separated"
                    rows={2}
                    style={{ width: "100%", border: "1px solid #e9ecef", borderRadius: "8px", padding: "0.75rem" }}
                  />
                  <div className="tour-listing-details__amenities__inner mt-3">
                    <ul className="tour-listing-details__amenities__list">
                      {(amenitiesPreview.length ? amenitiesPreview : ["—"]).map((amenity, idx) => (
                        <li key={`a-${idx}`}>
                          <i className="icon-check-star"></i> {amenity}
                        </li>
                      ))}
                    </ul>
                    <ul className="tour-listing-details__amenities__list tour-listing-details__amenities__list--two">
                      {(roomAmenitiesPreview.length ? roomAmenitiesPreview : ["—"]).map((amenity, idx) => (
                        <li key={`ra-${idx}`}>
                          <i className="icon-check-star"></i> {amenity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="tour-listing-details__content__item tour-listing-details__ture-list wow fadeInUp">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                    <h4 className="tour-listing-details__title mb-0">Room Types (optional)</h4>
                    <button type="button" className="gotur-btn" style={{ fontSize: "0.85rem" }} onClick={addDraftRoom}>
                      + Add room
                    </button>
                  </div>
                  <p className="small text-muted mb-3">
                    If you add a room here, <strong>name</strong>, <strong>capacity</strong>, and <strong>price per night</strong> are required. Upload room photos after submit.
                  </p>
                  <div className="row">
                    {draftRooms.map((r) => (
                      <Col lg={6} md={6} key={r.key}>
                        <div className="listing-card-four">
                          <div
                            className="listing-card-four__image"
                            style={{
                              background: "#e9ecef",
                              minHeight: "243px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "#6c757d",
                              fontSize: "0.9rem",
                              padding: "1rem",
                              textAlign: "center",
                            }}
                          >
                            Room photo · add after save (370×243)
                          </div>
                          <div className="listing-card-four__content">
                            <input
                              value={r.name}
                              onChange={(e) => updateDraftRoom(r.key, "name", e.target.value)}
                              className="listing-card-four__title"
                              placeholder="Room name"
                              style={{ border: "1px solid #e9ecef", borderRadius: 6, padding: "0.35rem 0.5rem", width: "100%", marginBottom: 8 }}
                            />
                            <div className="row g-2 mb-2">
                              <div className="col-6">
                                <input
                                  type="number"
                                  min={1}
                                  value={r.capacity}
                                  onChange={(e) => updateDraftRoom(r.key, "capacity", e.target.value)}
                                  placeholder="Capacity"
                                  style={{ width: "100%", border: "1px solid #e9ecef", borderRadius: 6, padding: "0.35rem 0.5rem" }}
                                />
                              </div>
                              <div className="col-6">
                                <input
                                  type="number"
                                  min={1}
                                  value={r.pricePerNight}
                                  onChange={(e) => updateDraftRoom(r.key, "pricePerNight", e.target.value)}
                                  placeholder="Price / night"
                                  style={{ width: "100%", border: "1px solid #e9ecef", borderRadius: 6, padding: "0.35rem 0.5rem" }}
                                />
                              </div>
                            </div>
                            <button type="button" className="dashboard-btn dashboard-btn--danger" style={{ fontSize: "0.8rem" }} onClick={() => removeDraftRoom(r.key)}>
                              Remove room
                            </button>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </div>
                </div>

                <div className="tour-listing-details__content__item tour-listing-details__thumb wow fadeInUp">
                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
                    <h4 className="tour-listing-details__title mb-0">Amenities Images</h4>
                    <span className="small text-muted">Optional · 370×243 recommended</span>
                  </div>
                  <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
                    {amenityItems.map((item, index) => (
                      <div key={`aimg-${index}`} style={{ position: "relative", flex: "0 0 auto" }}>
                        <img
                          src={item.url}
                          alt=""
                          style={{ width: "min(40vw, 240px)", height: "243px", objectFit: "cover", borderRadius: "10px", display: "block" }}
                        />
                        <button
                          type="button"
                          className="dashboard-btn dashboard-btn--danger"
                          onClick={() => removeAmenity(index)}
                          style={{ position: "absolute", top: 8, right: 8, width: 28, height: 28, padding: 0, borderRadius: "50%", fontSize: "16px", lineHeight: 1 }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={() => amenityInputRef.current?.click()} style={addTileStyle(243)}>
                      <span style={{ fontSize: "2rem", lineHeight: 1 }}>+</span>
                      <span>Add</span>
                    </button>
                  </div>
                  <input ref={amenityInputRef} type="file" accept="image/*" multiple hidden onChange={onAmenityChange} />
                </div>

                <div className="tour-listing-details__content__item wow fadeInUp">
                  <h4 className="tour-listing-details__title">Location preview</h4>
                  <p className="small text-muted mb-2">
                    Search for a city or street below the map, pick the correct result, and we fill <strong>address</strong>, <strong>latitude</strong>, <strong>longitude</strong>, and the <strong>embed URL</strong>. You can still edit coordinates manually.
                  </p>
                  <div className="row g-2 mb-2">
                    <div className="col-md-6">
                      <input
                        type="number"
                        step="any"
                        name="latitude"
                        value={form.latitude}
                        onChange={handleChange}
                        placeholder="Latitude (optional)"
                        style={{ width: "100%", border: "1px solid #e9ecef", borderRadius: "8px", padding: "0.5rem 0.75rem" }}
                      />
                    </div>
                    <div className="col-md-6">
                      <input
                        type="number"
                        step="any"
                        name="longitude"
                        value={form.longitude}
                        onChange={handleChange}
                        placeholder="Longitude (optional)"
                        style={{ width: "100%", border: "1px solid #e9ecef", borderRadius: "8px", padding: "0.5rem 0.75rem" }}
                      />
                    </div>
                  </div>
                  <textarea
                    name="mapEmbedUrl"
                    value={form.mapEmbedUrl}
                    onChange={handleChange}
                    placeholder="Map embed URL (filled when you pick a search result, or paste your own)"
                    rows={2}
                    style={{ width: "100%", border: "1px solid #e9ecef", borderRadius: "8px", padding: "0.75rem", marginBottom: "0.75rem" }}
                  />
                  {mapSrc ? (
                    <div style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid #e9ecef", marginBottom: "1rem" }}>
                      <iframe title="map-preview" src={mapSrc} style={{ width: "100%", height: "280px", border: "none" }} loading="lazy" />
                    </div>
                  ) : (
                    <p className="text-muted small mb-3">Add coordinates, an embed URL, or search below.</p>
                  )}
                  <label className="small fw-semibold d-block mb-1">Find on map</label>
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    <input
                      type="text"
                      value={locationSearch}
                      onChange={(e) => setLocationSearch(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          runGeocode();
                        }
                      }}
                      placeholder="e.g. Colombo Fort, Galle Face, Ella Sri Lanka"
                      style={{ flex: "1 1 200px", border: "1px solid #e9ecef", borderRadius: "8px", padding: "0.5rem 0.75rem" }}
                    />
                    <button type="button" className="gotur-btn" style={{ whiteSpace: "nowrap" }} onClick={runGeocode} disabled={geocodeLoading}>
                      {geocodeLoading ? "Searching…" : "Search"}
                    </button>
                  </div>
                  {geocodeError ? <p className="text-danger small mb-2">{geocodeError}</p> : null}
                  {geocodeResults.length > 0 && (
                    <ul className="list-unstyled mb-0" style={{ maxHeight: "220px", overflowY: "auto", border: "1px solid #e9ecef", borderRadius: "8px" }}>
                      {geocodeResults.map((p, idx) => (
                        <li key={`${p.lat}-${p.lon}-${idx}`} style={{ borderBottom: idx < geocodeResults.length - 1 ? "1px solid #eee" : "none" }}>
                          <button
                            type="button"
                            onClick={() => pickGeocodeResult(p)}
                            style={{
                              width: "100%",
                              textAlign: "left",
                              padding: "0.6rem 0.75rem",
                              border: "none",
                              background: "transparent",
                              cursor: "pointer",
                              fontSize: "0.9rem",
                            }}
                          >
                            {p.display_name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="tour-listing-details__content__item wow fadeInUp d-lg-none">
                  <button type="submit" className="gotur-btn w-100" disabled={loading}>
                    {loading ? "Saving…" : "Submit hotel"}
                  </button>
                </div>
              </div>
            </Col>

            <Col lg={4}>
              <div className="tour-listing-details__sidebar">
                <div className="tour-listing-details__sidebar__item tour-listing-details__sidebar__item-form wow fadeInUp">
                  <h4 className="tour-listing-details__sidebar__title">Save hotel</h4>
                  <p className="small text-muted mb-3">Required before submit:</p>
                  <ul className="small mb-3 ps-3">
                    <li>Hotel name</li>
                    <li>Address</li>
                    <li>Cover image</li>
                    <li>At least one relevant photo</li>
                    <li>If you add rooms: each needs price (and name &amp; capacity)</li>
                  </ul>
                  <button type="submit" className="gotur-btn w-100 d-none d-lg-block" disabled={loading}>
                    {loading ? "Saving…" : "Submit hotel"}
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </form>
  );
}
