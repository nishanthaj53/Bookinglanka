import { useEffect, useMemo, useState } from "react";
import api from "../../services/apiClient";
import {
  apiErrorMessage,
  askConfirm,
  feedbackError,
  feedbackSuccess,
  useFeedback,
} from "../../context/FeedbackContext";

const INITIAL_FORM = {
  name: "",
  slug: "",
  district: "",
  town: "",
  region: "",
  bestFor: "",
  overview: "",
  whyVisit: "",
  mapEmbedUrl: "",
  coverImageUrl: "",
  cardImageUrl: "",
  galleryImagesText: "",
  faqsText: "",
  isActive: true,
  sortOrder: 0,
};

function normalizeList(text) {
  return String(text || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function buildMapEmbedFromParts({ name, town, district, region }) {
  const query = [town, district, region, name, "Sri Lanka"].filter(Boolean).join(", ");
  if (!query.trim()) return "";
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=12&output=embed`;
}

export default function AdminDestinations() {
  const { showFeedback } = useFeedback();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [cardFile, setCardFile] = useState(null);
  const [form, setForm] = useState(INITIAL_FORM);

  const isEdit = Boolean(editingId);

  const sortedDestinations = useMemo(
    () =>
      [...destinations].sort(
        (a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0)
      ),
    [destinations]
  );

  const fetchDestinations = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/destinations");
      setDestinations(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch destinations failed:", err);
      feedbackError(showFeedback, "Failed to load destinations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, []);

  useEffect(() => {
    if (form.mapEmbedUrl?.trim()) return;
    const auto = buildMapEmbedFromParts(form);
    if (!auto) return;
    setForm((prev) => ({ ...prev, mapEmbedUrl: auto }));
  }, [form.name, form.town, form.district, form.region]); // eslint-disable-line react-hooks/exhaustive-deps

  const resetForm = () => {
    setEditingId("");
    setCoverFile(null);
    setCardFile(null);
    setForm(INITIAL_FORM);
  };

  const onEdit = (destination) => {
    setEditingId(destination.id);
    setCoverFile(null);
    setCardFile(null);
    setForm({
      name: destination.name || "",
      slug: destination.slug || "",
      district: destination.district || "",
      town: destination.town || "",
      region: destination.region || "",
      bestFor: destination.bestFor || "",
      overview: destination.overview || "",
      whyVisit: destination.whyVisit || "",
      mapEmbedUrl: destination.mapEmbedUrl || "",
      coverImageUrl: destination.coverImageUrl || "",
      cardImageUrl: destination.cardImageUrl || "",
      galleryImagesText: (destination.galleryImages || []).join(", "),
      faqsText: JSON.stringify(destination.faqs || [], null, 2),
      isActive: Boolean(destination.isActive),
      sortOrder: Number(destination.sortOrder || 0),
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id) => {
    const ok = await askConfirm(showFeedback, {
      title: "Delete destination",
      message: "Delete this destination?",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    });
    if (!ok) return;
    try {
      await api.delete(`/admin/destinations/${id}`);
      await fetchDestinations();
      if (editingId === id) resetForm();
    } catch (err) {
      console.error("Delete destination failed:", err);
      feedbackError(showFeedback, apiErrorMessage(err, "Failed to delete destination"));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const body = new FormData();
      body.append("name", form.name);
      body.append("slug", form.slug);
      body.append("district", form.district);
      body.append("town", form.town);
      body.append("region", form.region);
      body.append("bestFor", form.bestFor);
      body.append("overview", form.overview);
      body.append("whyVisit", form.whyVisit);
      body.append("mapEmbedUrl", form.mapEmbedUrl);
      body.append("coverImageUrl", form.coverImageUrl);
      body.append("cardImageUrl", form.cardImageUrl);
      body.append("sortOrder", String(form.sortOrder || 0));
      body.append("isActive", String(form.isActive));
      body.append("galleryImages", JSON.stringify(normalizeList(form.galleryImagesText)));
      body.append("faqs", form.faqsText || "[]");
      if (coverFile) body.append("coverImage", coverFile);
      if (cardFile) body.append("cardImage", cardFile);

      if (isEdit) {
        await api.put(`/admin/destinations/${editingId}`, body, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        feedbackSuccess(showFeedback, "Destination updated");
      } else {
        await api.post("/admin/destinations", body, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        feedbackSuccess(showFeedback, "Destination created");
      }

      await fetchDestinations();
      resetForm();
    } catch (err) {
      console.error("Save destination failed:", err);
      feedbackError(showFeedback, apiErrorMessage(err, "Failed to save destination"));
    } finally {
      setSaving(false);
    }
  };

  const previewCover = coverFile
    ? URL.createObjectURL(coverFile)
    : form.coverImageUrl ||
      "https://placehold.co/1170x565?text=Destination+Cover";

  const previewCard = cardFile
    ? URL.createObjectURL(cardFile)
    : form.cardImageUrl ||
      "https://placehold.co/900x1242?text=Card+%281%3A1.38%29";

  return (
    <div className="dashboard-page">
      <h2 style={{ marginBottom: 12 }}>
        {isEdit ? "Edit Destination" : "Create Destination"}
      </h2>
      <div className="dashboard-card" style={{ marginBottom: 16 }}>
        <div className="dashboard-card__body">
          <div style={{ marginBottom: 16 }}>
            <img
              src={previewCover}
              alt="Destination cover preview"
              style={{
                width: "100%",
                maxHeight: 565,
                minHeight: 320,
                objectFit: "cover",
                borderRadius: 10,
              }}
            />
          </div>
          <form onSubmit={onSubmit}>
            <div className="row g-2">
              <div className="col-md-6">
                <label>Name</label>
                <input
                  className="form-control"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  required
                />
              </div>
              <div className="col-md-6">
                <label>Slug</label>
                <input
                  className="form-control"
                  value={form.slug}
                  onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                  placeholder="ex: arugam-bay"
                />
              </div>
              <div className="col-md-4">
                <label>District</label>
                <input
                  className="form-control"
                  value={form.district}
                  onChange={(e) => setForm((p) => ({ ...p, district: e.target.value }))}
                />
              </div>
              <div className="col-md-4">
                <label>Town</label>
                <input
                  className="form-control"
                  value={form.town}
                  onChange={(e) => setForm((p) => ({ ...p, town: e.target.value }))}
                />
              </div>
              <div className="col-md-4">
                <label>Region</label>
                <input
                  className="form-control"
                  value={form.region}
                  onChange={(e) => setForm((p) => ({ ...p, region: e.target.value }))}
                />
              </div>
              <div className="col-md-6">
                <label>Best For</label>
                <input
                  className="form-control"
                  value={form.bestFor}
                  onChange={(e) => setForm((p) => ({ ...p, bestFor: e.target.value }))}
                />
              </div>
              <div className="col-md-3">
                <label>Sort Order</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.sortOrder}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, sortOrder: Number(e.target.value) || 0 }))
                  }
                />
              </div>
              <div className="col-md-3 d-flex align-items-end">
                <label className="d-flex align-items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) => setForm((p) => ({ ...p, isActive: e.target.checked }))}
                  />
                  Active
                </label>
              </div>
              <div className="col-12">
                <label>Overview</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={form.overview}
                  onChange={(e) => setForm((p) => ({ ...p, overview: e.target.value }))}
                />
              </div>
              <div className="col-12">
                <label>Why Visit</label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={form.whyVisit}
                  onChange={(e) => setForm((p) => ({ ...p, whyVisit: e.target.value }))}
                />
              </div>
              <div className="col-md-8">
                <label>Map Embed URL (auto-generated from destination fields)</label>
                <input
                  className="form-control"
                  value={form.mapEmbedUrl}
                  onChange={(e) => setForm((p) => ({ ...p, mapEmbedUrl: e.target.value }))}
                />
              </div>
              <div className="col-md-4 d-flex align-items-end">
                <button
                  type="button"
                  className="dashboard-btn dashboard-btn--primary"
                  onClick={() =>
                    setForm((p) => ({
                      ...p,
                      mapEmbedUrl: buildMapEmbedFromParts(p),
                    }))
                  }
                >
                  Auto Capture Map
                </button>
              </div>
              <div className="col-md-6">
                <label>Cover Image URL (optional)</label>
                <input
                  className="form-control"
                  value={form.coverImageUrl}
                  onChange={(e) => setForm((p) => ({ ...p, coverImageUrl: e.target.value }))}
                />
              </div>
              <div className="col-md-6">
                <label>Upload Cover Image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                />
              </div>
              <div className="col-12">
                <p className="text-muted small mb-2">
                  <strong>Hero / gallery (cover):</strong> wide photos work best (e.g.{" "}
                  <strong>1920 × 1080</strong> or <strong>2400 × 1600</strong>). Shown on the
                  destination page carousel — use arrows to browse cover + gallery.
                </p>
              </div>
              <div className="col-md-4">
                <label>List / card image URL (optional)</label>
                <input
                  className="form-control"
                  value={form.cardImageUrl}
                  onChange={(e) => setForm((p) => ({ ...p, cardImageUrl: e.target.value }))}
                  placeholder="/uploads/… or https://…"
                />
              </div>
              <div className="col-md-4">
                <label>Upload list / card image</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={(e) => setCardFile(e.target.files?.[0] || null)}
                />
              </div>
              <div className="col-md-4">
                <label>Card preview (landing + AI planner)</label>
                <div
                  style={{
                    borderRadius: 12,
                    overflow: "hidden",
                    border: "1px solid #e5e7eb",
                    aspectRatio: "1 / 1.38",
                    maxWidth: 220,
                  }}
                >
                  <img
                    src={previewCard}
                    alt="Card preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  />
                </div>
              </div>
              <div className="col-12">
                <p className="text-muted small mb-0">
                  <strong>List / card image:</strong> one consistent crop for the{" "}
                  <strong>landing</strong> “Popular destinations” tiles and the{" "}
                  <strong>AI planner</strong> explorer. Aim for aspect{" "}
                  <strong>1 : 1.38</strong> (e.g. <strong>1200 × 1656 px</strong>); keep the subject{" "}
                  <strong>centred</strong>. If you skip this, the cover image is used instead and may
                  be cropped unevenly.
                </p>
              </div>
              {form.mapEmbedUrl?.trim() && (
                <div className="col-12">
                  <iframe
                    title="Destination map preview"
                    src={form.mapEmbedUrl}
                    style={{ width: "100%", height: 280, border: "1px solid #e5e7eb", borderRadius: 8 }}
                    allowFullScreen
                  />
                </div>
              )}
              <div className="col-12">
                <label>Gallery Image URLs (comma separated)</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={form.galleryImagesText}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, galleryImagesText: e.target.value }))
                  }
                />
              </div>
              <div className="col-12">
                <label>FAQs JSON</label>
                <textarea
                  className="form-control"
                  rows={4}
                  value={form.faqsText}
                  onChange={(e) => setForm((p) => ({ ...p, faqsText: e.target.value }))}
                  placeholder='[{"question":"...","answer":"..."}]'
                />
              </div>
            </div>
            <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
              <button className="dashboard-btn dashboard-btn--primary" type="submit" disabled={saving}>
                {saving ? "Saving..." : isEdit ? "Update Destination" : "Create Destination"}
              </button>
              {isEdit && (
                <button
                  type="button"
                  className="dashboard-btn"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="dashboard-card">
        <div className="dashboard-card__body" style={{ overflowX: "auto" }}>
          <h3 style={{ marginBottom: 12 }}>All Destinations</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>District</th>
                  <th>Status</th>
                  <th>Order</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedDestinations.map((d) => (
                  <tr key={d.id}>
                    <td>{d.name}</td>
                    <td>{d.slug}</td>
                    <td>{d.district || "-"}</td>
                    <td>{d.isActive ? "Active" : "Inactive"}</td>
                    <td>{d.sortOrder ?? 0}</td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <a
                          href={`/destinations/${d.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="dashboard-btn"
                        >
                          View
                        </a>
                        <button
                          type="button"
                          className="dashboard-btn dashboard-btn--primary"
                          onClick={() => onEdit(d)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="dashboard-btn"
                          onClick={() => onDelete(d.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
