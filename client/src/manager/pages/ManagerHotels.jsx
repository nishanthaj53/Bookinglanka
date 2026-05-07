import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import apiClient, { BASE_URL } from "../../services/apiClient";
import "../../components/dashboard/dashboard-pages.css";

function resolveHotelImageUrl(url) {
  if (!url) return null;
  const t = (url + "").trim();
  if (t.startsWith("http://") || t.startsWith("https://")) return encodeURI(t);
  const path = t.startsWith("/") ? t : `/${t}`;
  const base = (BASE_URL || "").replace(/\/?$/, "");
  return base ? encodeURI(`${base}${path}`) : encodeURI(path);
}

/**
 * @param {{ statusFilter: 'ACTIVE' | 'DRAFT' }} props
 */
export default function ManagerHotels({ statusFilter }) {
  const { hotels, loading, refreshDashboard } = useOutletContext();
  const navigate = useNavigate();
  const [localLoading, setLocalLoading] = useState(false);
  const [editingHotelId, setEditingHotelId] = useState(null);
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [roles, setRoles] = useState([]);
  const [amenityImages, setAmenityImages] = useState([]);
  const [amenityPreviews, setAmenityPreviews] = useState([]);

  const ROLE_OPTIONS = ["Cover", "Lobby", "Pool", "Exterior", "Common", "Other"];

  const filtered = hotels.filter((h) => h.status === statusFilter);

  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setImages((prev) => [...prev, ...newFiles].slice(0, 10));
    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...newPreviews].slice(0, 10));
    setRoles((prev) => {
      const next = [...prev];
      const hadCover = next.includes("Cover");
      for (let i = 0; i < newFiles.length && next.length < 10; i++) {
        next.push(!hadCover && i === 0 ? "Cover" : "Other");
      }
      return next;
    });
  };

  const handleRoleChange = (index, value) => {
    setRoles((prev) => {
      const u = [...prev];
      u[index] = value;
      return u;
    });
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setRoles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAmenityImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setAmenityImages((prev) => [...prev, ...newFiles].slice(0, 10));
    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setAmenityPreviews((prev) => [...prev, ...newPreviews].slice(0, 10));
  };

  const handleRemoveAmenityImage = (index) => {
    setAmenityImages((prev) => prev.filter((_, i) => i !== index));
    setAmenityPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const resetUploadState = () => {
    setImages([]);
    setPreviews([]);
    setRoles([]);
    setAmenityImages([]);
    setAmenityPreviews([]);
    setEditingHotelId(null);
  };

  const handleUpdateImages = async (hotelId) => {
    if (images.length === 0) {
      alert("Please select new images first");
      return;
    }
    try {
      setLocalLoading(true);
      const formData = new FormData();
      images.forEach((file) => formData.append("images", file));
      formData.append("roles", JSON.stringify(roles));
      await apiClient.put(`/manager/hotels/${hotelId}/images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Hotel images updated successfully.");
      resetUploadState();
      if (refreshDashboard) await refreshDashboard();
    } catch (err) {
      console.error("Update images error:", err);
      alert(err.response?.data?.error || "Error updating hotel images");
    } finally {
      setLocalLoading(false);
    }
  };

  const handleUpdateAmenityImages = async (hotelId) => {
    if (amenityImages.length === 0) {
      alert("Please select amenity images first");
      return;
    }
    try {
      setLocalLoading(true);
      const formData = new FormData();
      amenityImages.forEach((file) => formData.append("amenityImages", file));
      await apiClient.put(`/manager/hotels/${hotelId}/amenity-images`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Amenity images updated successfully.");
      resetUploadState();
      if (refreshDashboard) await refreshDashboard();
    } catch (err) {
      console.error("Update amenity images error:", err);
      alert(err.response?.data?.error || "Error updating amenity images");
    } finally {
      setLocalLoading(false);
    }
  };

  const handleDeleteHotel = async (hotelId) => {
    if (!window.confirm("Are you sure you want to delete this hotel?")) return;
    try {
      await apiClient.delete(`/manager/hotels/${hotelId}`);
      alert("Hotel deleted successfully");
      if (refreshDashboard) await refreshDashboard();
    } catch (err) {
      console.error("Delete hotel error:", err);
      alert(err.response?.data?.error || "Error deleting hotel");
    }
  };

  const title = statusFilter === "ACTIVE" ? "Active Hotels" : "Inactive Hotels";

  if (loading) {
    return <p className="text-muted mb-0">Loading hotels…</p>;
  }

  return (
    <div style={{ maxWidth: "100%" }}>
      <h2 className="dashboard-page__title" style={{ fontSize: "1.35rem", marginBottom: "1.25rem" }}>
        {title}
      </h2>
      {filtered.length === 0 ? (
        <p className="text-muted">No hotels in this category.</p>
      ) : (
        <Row className="gutter-y-30">
          {filtered.map((h) => {
            const coverImg = h.images?.find((img) => img.isCover) || h.images?.[0];
            const src = coverImg ? resolveHotelImageUrl(coverImg.url) : null;
            const roomsPath = `/manager/dashboard/hotels/${h.id}`;
            const editHotelPath = `/manager/dashboard/hotels/${h.id}/edit`;
            return (
              <Col md={6} key={h.id}>
                <div className="blog-card wow fadeInUp" data-wow-duration="1500ms">
                  <div className="blog-card__image">
                    {src ? (
                      <img src={src} alt="" style={{ width: "100%", maxWidth: 370, height: 240, objectFit: "cover" }} />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          maxWidth: 370,
                          height: 240,
                          background: "#e9ecef",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#6c757d",
                          fontSize: "0.9rem",
                        }}
                      >
                        No image
                      </div>
                    )}
                    <Link to={roomsPath} className="blog-card-two__image__link">
                      <span className="sr-only">{h.name}</span>
                    </Link>
                  </div>
                  <div className="blog-card__content">
                    <h3 className="blog-card__title">
                      <Link to={roomsPath}>{h.name}</Link>
                    </h3>
                    <p style={{ margin: "0 0 0.75rem", fontSize: "0.9rem", color: "#6c757d" }}>{h.address}</p>
                    <span
                      style={{
                        display: "inline-block",
                        marginBottom: "0.75rem",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        color: h.status === "ACTIVE" ? "#198754" : "#fd7e14",
                      }}
                    >
                      {h.status}
                    </span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                      <button type="button" onClick={() => navigate(roomsPath)} className="gotur-btn" style={{ fontSize: "0.85rem", padding: "0.4rem 0.85rem" }}>
                        Manage Rooms
                      </button>
                      <button type="button" onClick={() => navigate(editHotelPath)} className="dashboard-btn dashboard-btn--secondary" style={{ fontSize: "0.85rem", padding: "0.4rem 0.85rem" }}>
                        Edit hotel details
                      </button>
                      <button type="button" onClick={() => setEditingHotelId(h.id)} className="gotur-btn" style={{ fontSize: "0.85rem", padding: "0.4rem 0.85rem" }}>
                        Update Photos
                      </button>
                      <button type="button" onClick={() => handleDeleteHotel(h.id)} className="dashboard-btn dashboard-btn--danger" style={{ fontSize: "0.85rem", padding: "0.4rem 0.85rem" }}>
                        Delete
                      </button>
                    </div>
                    {editingHotelId === h.id && (
                      <div className="dashboard-card" style={{ marginTop: "1rem", textAlign: "left" }}>
                        <div className="dashboard-card__body">
                          <h5 style={{ marginBottom: "0.5rem", fontSize: "1rem" }}>Update main photos</h5>
                          <p className="small text-muted mb-2" style={{ marginTop: 0 }}>
                            Set one image to <strong>Cover</strong> for the user-facing listing thumbnail. Saving replaces all current main photos for this hotel.
                          </p>
                          <input type="file" multiple accept="image/*" onChange={handleImageChange} style={{ marginBottom: "0.5rem" }} />
                          {previews.length > 0 && (
                            <div style={{ display: "flex", gap: 8, marginBottom: "0.5rem", flexWrap: "wrap" }}>
                              {previews.map((pSrc, index) => (
                                <div key={index} style={{ textAlign: "center", position: "relative" }}>
                                  <img src={pSrc} alt="" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 6, border: "1px solid #dee2e6" }} />
                                  <select value={roles[index] ?? "Other"} onChange={(e) => handleRoleChange(index, e.target.value)} style={{ marginTop: 4, fontSize: "11px", padding: "2px 4px" }}>
                                    {ROLE_OPTIONS.map((r) => (
                                      <option key={r} value={r}>
                                        {r}
                                      </option>
                                    ))}
                                  </select>
                                  <button type="button" onClick={() => handleRemoveImage(index)} className="dashboard-btn dashboard-btn--danger" style={{ position: "absolute", top: 2, right: 2, width: 20, height: 20, padding: 0, borderRadius: "50%", fontSize: "12px" }}>
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                          <button type="button" disabled={localLoading} onClick={() => handleUpdateImages(h.id)} className="dashboard-btn dashboard-btn--primary" style={{ background: "#198754", marginRight: 8 }}>
                            Save main photos
                          </button>
                          <h5 style={{ margin: "1rem 0 0.5rem", fontSize: "1rem" }}>Update amenities photos</h5>
                          <input type="file" multiple accept="image/*" onChange={handleAmenityImageChange} style={{ marginBottom: "0.5rem" }} />
                          {amenityPreviews.length > 0 && (
                            <div style={{ display: "flex", gap: 8, marginBottom: "0.5rem", flexWrap: "wrap" }}>
                              {amenityPreviews.map((pSrc, index) => (
                                <div key={`am-${index}`} style={{ textAlign: "center", position: "relative" }}>
                                  <img src={pSrc} alt="" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 6, border: "1px solid #dee2e6" }} />
                                  <button type="button" onClick={() => handleRemoveAmenityImage(index)} className="dashboard-btn dashboard-btn--danger" style={{ position: "absolute", top: 2, right: 2, width: 20, height: 20, padding: 0, borderRadius: "50%", fontSize: "12px" }}>
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                          <button type="button" disabled={localLoading} onClick={() => handleUpdateAmenityImages(h.id)} className="dashboard-btn dashboard-btn--primary" style={{ background: "#0d6efd" }}>
                            Save amenities photos
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      )}
    </div>
  );
}
