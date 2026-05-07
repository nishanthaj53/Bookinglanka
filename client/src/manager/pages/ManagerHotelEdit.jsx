import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useOutletContext } from "react-router-dom";
import { Col, Row } from "react-bootstrap";
import apiClient from "../../services/apiClient";
import "../../components/dashboard/dashboard-pages.css";
import { HOTEL_TYPE_OPTIONS } from "../../enduser/constants/userDashboardHotelOptions";

const MAIN_PHOTO_ROLE_OPTIONS = ["Cover", "Lobby", "Pool", "Exterior", "Common", "Other"];

function arrToCsv(arr) {
  if (!arr?.length) return "";
  return arr.join(", ");
}

export default function ManagerHotelEdit() {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const { refreshDashboard } = useOutletContext() || {};
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [photoImages, setPhotoImages] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [photoRoles, setPhotoRoles] = useState([]);
  const [photoSaving, setPhotoSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    description: "",
    overviewTitle: "",
    overview: "",
    propertyType: "",
    checkInTime: "",
    checkOutTime: "",
    basePrice: "",
    mapEmbedUrl: "",
    highlights: "",
    facilities: "",
    amenities: "",
    roomAmenities: "",
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await apiClient.get(`/manager/hotels/${hotelId}`);
        const h = res.data;
        if (cancelled || !h) return;
        setForm({
          name: h.name || "",
          address: h.address || "",
          latitude: h.latitude != null ? String(h.latitude) : "",
          longitude: h.longitude != null ? String(h.longitude) : "",
          description: h.description || "",
          overviewTitle: h.overviewTitle || "",
          overview: h.overview || "",
          propertyType: h.propertyType || "",
          checkInTime: h.checkInTime || "",
          checkOutTime: h.checkOutTime || "",
          basePrice: h.basePrice != null ? String(h.basePrice) : "",
          mapEmbedUrl: h.mapEmbedUrl || "",
          highlights: arrToCsv(h.highlights),
          facilities: "",
          amenities: arrToCsv(h.amenities),
          roomAmenities: arrToCsv(h.roomAmenities),
        });
      } catch (e) {
        if (!cancelled) setError(e.response?.data?.error || e.message || "Failed to load hotel");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hotelId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleMainPhotoChange = (e) => {
    const newFiles = Array.from(e.target.files || []);
    setPhotoImages((prev) => [...prev, ...newFiles].slice(0, 10));
    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setPhotoPreviews((prev) => [...prev, ...newPreviews].slice(0, 10));
    setPhotoRoles((prev) => {
      const next = [...prev];
      const hadCover = next.includes("Cover");
      for (let i = 0; i < newFiles.length && next.length < 10; i++) {
        next.push(!hadCover && i === 0 ? "Cover" : "Other");
      }
      return next;
    });
  };

  const handleMainPhotoRoleChange = (index, value) => {
    setPhotoRoles((prev) => {
      const u = [...prev];
      u[index] = value;
      return u;
    });
  };

  const handleRemoveMainPhoto = (index) => {
    setPhotoImages((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
    setPhotoRoles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveMainPhotos = async () => {
    if (photoImages.length === 0) {
      alert("Select at least one image first.");
      return;
    }
    try {
      setPhotoSaving(true);
      const formData = new FormData();
      photoImages.forEach((file) => formData.append("images", file));
      formData.append("roles", JSON.stringify(photoRoles));
      await apiClient.put(`/manager/hotels/${hotelId}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPhotoImages([]);
      setPhotoPreviews([]);
      setPhotoRoles([]);
      alert("Cover and main photos saved.");
      if (refreshDashboard) await refreshDashboard();
    } catch (err) {
      alert(err.response?.data?.error || "Failed to save photos");
    } finally {
      setPhotoSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name?.trim() || !form.address?.trim()) {
      alert("Hotel name and address are required.");
      return;
    }
    try {
      setSaving(true);
      await apiClient.patch(`/manager/hotels/${hotelId}`, {
        name: form.name.trim(),
        address: form.address.trim(),
        latitude: form.latitude.trim() === "" ? null : form.latitude,
        longitude: form.longitude.trim() === "" ? null : form.longitude,
        description: form.description.trim() || null,
        overviewTitle: form.overviewTitle.trim() || null,
        overview: form.overview.trim() || null,
        propertyType: form.propertyType.trim() || null,
        checkInTime: form.checkInTime.trim() || null,
        checkOutTime: form.checkOutTime.trim() || null,
        basePrice: form.basePrice.trim() === "" ? null : form.basePrice,
        mapEmbedUrl: form.mapEmbedUrl.trim() || null,
        highlights: form.highlights,
        facilities: form.facilities,
        amenities: form.amenities,
        roomAmenities: form.roomAmenities,
      });
      alert("Hotel details saved.");
      if (refreshDashboard) await refreshDashboard();
      navigate(`/manager/dashboard/hotels/${hotelId}`);
    } catch (err) {
      alert(err.response?.data?.error || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const roomsPath = `/manager/dashboard/hotels/${hotelId}`;

  if (loading) {
    return (
      <div className="dashboard-page">
        <p className="text-muted">Loading hotel…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <p style={{ color: "#c00" }}>{error}</p>
        <Link to="/manager/dashboard/hotels/active">← Back to hotels</Link>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="mb-3">
        <Link to="/manager/dashboard/hotels/active" style={{ color: "#0d6efd", textDecoration: "none", fontSize: "0.9rem" }}>
          ← Back to hotels
        </Link>
        {" · "}
        <Link to={roomsPath} style={{ color: "#0d6efd", textDecoration: "none", fontSize: "0.9rem" }}>
          Manage rooms
        </Link>
      </div>

      <div className="dashboard-card mb-4">
        <div className="dashboard-card__body">
          <h1 className="dashboard-page__title mb-1">Edit hotel details</h1>
          <p className="text-muted small mb-0">
            <strong>Managing:</strong> {form.name || "—"}
            {form.address ? ` · ${form.address}` : ""}
          </p>
        </div>
      </div>

      <div className="dashboard-card mb-4">
        <div className="dashboard-card__body">
          <h2 className="h5 mb-2">Cover and main photos</h2>
          <p className="small text-muted mb-3">
            Upload up to 10 images. Mark one as <strong>Cover</strong> for the listing thumbnail. Saving here replaces all existing main photos for this hotel (same as Update Photos on the hotels list).
          </p>
          <input type="file" multiple accept="image/*" onChange={handleMainPhotoChange} className="mb-2" />
          {photoPreviews.length > 0 && (
            <div className="d-flex flex-wrap gap-2 mb-3">
              {photoPreviews.map((pSrc, index) => (
                <div key={index} style={{ textAlign: "center", position: "relative" }}>
                  <img src={pSrc} alt="" style={{ width: 88, height: 88, objectFit: "cover", borderRadius: 6, border: "1px solid #dee2e6" }} />
                  <select
                    value={photoRoles[index] ?? "Other"}
                    onChange={(e) => handleMainPhotoRoleChange(index, e.target.value)}
                    className="mt-1"
                    style={{ fontSize: "12px", padding: "2px 4px", maxWidth: 100 }}
                  >
                    {MAIN_PHOTO_ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => handleRemoveMainPhoto(index)}
                    className="dashboard-btn dashboard-btn--danger"
                    style={{ position: "absolute", top: 2, right: 2, width: 22, height: 22, padding: 0, borderRadius: "50%", fontSize: "12px" }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          <button type="button" className="dashboard-btn dashboard-btn--primary" disabled={photoSaving || photoImages.length === 0} onClick={handleSaveMainPhotos}>
            {photoSaving ? "Saving photos…" : "Save cover and main photos"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Row className="g-3">
          <Col md={6}>
            <div className="dashboard-form-group">
              <label>Hotel name</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
          </Col>
          <Col md={6}>
            <div className="dashboard-form-group">
              <label>Hotel type</label>
              <select name="propertyType" value={form.propertyType} onChange={handleChange}>
                {HOTEL_TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value || "__blank"} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </Col>
          <Col xs={12}>
            <div className="dashboard-form-group">
              <label>Address</label>
              <textarea name="address" value={form.address} onChange={handleChange} rows={2} required />
            </div>
          </Col>
          <Col md={6}>
            <div className="dashboard-form-group">
              <label>Latitude</label>
              <input name="latitude" value={form.latitude} onChange={handleChange} placeholder="optional" />
            </div>
          </Col>
          <Col md={6}>
            <div className="dashboard-form-group">
              <label>Longitude</label>
              <input name="longitude" value={form.longitude} onChange={handleChange} placeholder="optional" />
            </div>
          </Col>
          <Col md={6}>
            <div className="dashboard-form-group">
              <label>Check-in time</label>
              <input name="checkInTime" value={form.checkInTime} onChange={handleChange} placeholder="e.g. 2:00 PM" />
            </div>
          </Col>
          <Col md={6}>
            <div className="dashboard-form-group">
              <label>Check-out time</label>
              <input name="checkOutTime" value={form.checkOutTime} onChange={handleChange} placeholder="e.g. 11:00 AM" />
            </div>
          </Col>
          <Col md={6}>
            <div className="dashboard-form-group">
              <label>Base price (display)</label>
              <input name="basePrice" type="number" min={0} value={form.basePrice} onChange={handleChange} placeholder="optional" />
            </div>
          </Col>
          <Col md={6}>
            <div className="dashboard-form-group">
              <label>Map embed URL</label>
              <input name="mapEmbedUrl" value={form.mapEmbedUrl} onChange={handleChange} placeholder="Google Maps embed" />
            </div>
          </Col>
          <Col xs={12}>
            <div className="dashboard-form-group">
              <label>Overview title</label>
              <input name="overviewTitle" value={form.overviewTitle} onChange={handleChange} />
            </div>
          </Col>
          <Col xs={12}>
            <div className="dashboard-form-group">
              <label>Overview / description</label>
              <textarea name="overview" value={form.overview} onChange={handleChange} rows={4} />
            </div>
          </Col>
          <Col xs={12}>
            <div className="dashboard-form-group">
              <label>Short description (listing)</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
            </div>
          </Col>
          <Col md={6}>
            <div className="dashboard-form-group">
              <label>Highlights (comma-separated)</label>
              <textarea name="highlights" value={form.highlights} onChange={handleChange} rows={3} placeholder="Pool, Wi‑Fi, …" />
            </div>
          </Col>
          <Col md={6}>
            <div className="dashboard-form-group">
              <label>Extra facilities (comma, merged into highlights)</label>
              <textarea name="facilities" value={form.facilities} onChange={handleChange} rows={3} />
            </div>
          </Col>
          <Col md={6}>
            <div className="dashboard-form-group">
              <label>Amenities (comma-separated)</label>
              <textarea name="amenities" value={form.amenities} onChange={handleChange} rows={3} />
            </div>
          </Col>
          <Col md={6}>
            <div className="dashboard-form-group">
              <label>Room rules / notes (comma-separated)</label>
              <textarea name="roomAmenities" value={form.roomAmenities} onChange={handleChange} rows={3} />
            </div>
          </Col>
        </Row>
        <div className="d-flex flex-wrap gap-2 mt-4">
          <button type="submit" className="dashboard-btn dashboard-btn--primary" disabled={saving}>
            {saving ? "Saving…" : "Save hotel details"}
          </button>
          <button type="button" className="dashboard-btn dashboard-btn--secondary" onClick={() => navigate(roomsPath)} disabled={saving}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
