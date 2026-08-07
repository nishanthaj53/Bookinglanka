import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import apiClient, { BASE_URL } from "../../services/apiClient";
import { setImagePlaceholderOnError } from "../../utils/imagePlaceholder";
import "../../components/dashboard/dashboard-pages.css";
import "../../styles/room-booking-details.css";
import RoomGalleryCarousel from "../../components/gotur/RoomGalleryCarousel";
import {
  apiErrorMessage,
  askConfirm,
  feedbackError,
  feedbackSuccess,
  feedbackWarning,
  useFeedback,
} from "../../context/FeedbackContext";

function imgSrc(url) {
  if (!url) return "";
  return url.startsWith("http") ? encodeURI(url) : encodeURI(`${BASE_URL}${url.startsWith("/") ? url : `/${url}`}`);
}

function emptyAmenityRow() {
  return { key: `${Date.now()}-${Math.random()}`, label: "", file: null, preview: null };
}

function revokeIfBlob(url) {
  if (url && String(url).startsWith("blob:")) URL.revokeObjectURL(url);
}

export default function ManagerRooms() {
  const { showFeedback } = useFeedback();
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editIdFromUrl = searchParams.get("edit");
  const editLoadedRef = useRef("");
  const hotelHubPath = `/manager/dashboard/hotels/${hotelId}`;

  const [rooms, setRooms] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [hotelInfo, setHotelInfo] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [name, setName] = useState("");
  const [totalUnits, setTotalUnits] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [pricePerPerson, setPricePerPerson] = useState("");
  const [viewpoint, setViewpoint] = useState("");
  const [overview, setOverview] = useState("");
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [amenityRows, setAmenityRows] = useState([emptyAmenityRow()]);
  const [clearAmenities, setClearAmenities] = useState(false);

  const fetchRooms = useCallback(async () => {
    try {
      setLoadingList(true);
      const res = await apiClient.get(`/manager/rooms/${hotelId}`);
      setRooms(res.data || []);
    } catch (err) {
      console.error(err);
      feedbackError(showFeedback, apiErrorMessage(err, "Failed to load rooms"));
    } finally {
      setLoadingList(false);
    }
  }, [hotelId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await apiClient.get(`/manager/hotels/${hotelId}`);
        if (!cancelled) setHotelInfo(res.data);
      } catch {
        if (!cancelled) setHotelInfo(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [hotelId]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setTotalUnits("");
    setShortDescription("");
    setCapacity("");
    setPricePerNight("");
    setPricePerPerson("");
    setViewpoint("");
    setOverview("");
    galleryPreviews.forEach(revokeIfBlob);
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setAmenityRows([emptyAmenityRow()]);
    setClearAmenities(false);
    editLoadedRef.current = "";
  };

  const loadRoomForEdit = (r) => {
    resetForm();
    setEditingId(r.id);
    setName(r.name || "");
    setTotalUnits(String(r.totalUnits ?? 1));
    setShortDescription(r.description || "");
    setCapacity(String(r.capacity ?? ""));
    setPricePerNight(String(r.pricePerNight ?? ""));
    setPricePerPerson(r.pricePerPerson != null ? String(r.pricePerPerson) : "");
    setViewpoint(r.viewpoint || "");
    setOverview(r.overview || "");
    if (r.amenityImages?.length) {
      setAmenityRows(
        r.amenityImages.map((a) => ({
          key: a.id,
          label: a.label || "",
          file: null,
          preview: a.url ? imgSrc(a.url) : null,
        }))
      );
    }
  };

  useEffect(() => {
    if (!editIdFromUrl || loadingList || !rooms.length) return;
    if (editLoadedRef.current === editIdFromUrl) return;
    const r = rooms.find((x) => x.id === editIdFromUrl);
    if (!r) return;
    if (r.canEdit === false) {
      editLoadedRef.current = "";
      navigate(hotelHubPath, { replace: true });
      feedbackWarning(showFeedback, "This room has an active guest booking. You can edit again after checkout.");
      return;
    }
    loadRoomForEdit(r);
    editLoadedRef.current = editIdFromUrl;
  // eslint-disable-next-line react-hooks/exhaustive-deps -- sync ?edit= from URL; loadRoomForEdit not memoized
  }, [editIdFromUrl, loadingList, rooms, navigate, hotelHubPath]);

  const cancelEdit = () => {
    resetForm();
    setShowCreateForm(false);
    navigate(hotelHubPath, { replace: true });
  };

  const startCreateRoom = () => {
    resetForm();
    setShowCreateForm(true);
    navigate(hotelHubPath, { replace: true });
  };

  const showRoomForm = !loadingList && (rooms.length === 0 || showCreateForm || editingId != null);

  const onGalleryPick = (e) => {
    const files = Array.from(e.target.files || []);
    e.target.value = "";
    if (!files.length) return;
    galleryPreviews.forEach(revokeIfBlob);
    const next = files.slice(0, 20);
    setGalleryFiles(next);
    setGalleryPreviews(next.map((f) => URL.createObjectURL(f)));
  };

  const addAmenityRow = () => setAmenityRows((prev) => [...prev, emptyAmenityRow()]);
  const removeAmenityRow = (key) => {
    setAmenityRows((prev) => {
      const row = prev.find((x) => x.key === key);
      if (row?.preview) revokeIfBlob(row.preview);
      return prev.filter((x) => x.key !== key);
    });
  };

  const onAmenityFile = (key, file) => {
    if (!file) return;
    setAmenityRows((prev) =>
      prev.map((row) => {
        if (row.key !== key) return row;
        if (row.preview) revokeIfBlob(row.preview);
        return { ...row, file, preview: URL.createObjectURL(file) };
      })
    );
  };

  const carouselSlides = useMemo(
    () => galleryPreviews.map((url, i) => ({ id: `p-${i}`, url })),
    [galleryPreviews]
  );

  const buildFormData = () => {
    const fd = new FormData();
    fd.append("name", name.trim());
    fd.append("totalUnits", String(totalUnits || 1));
    fd.append("capacity", String(capacity));
    fd.append("pricePerNight", String(pricePerNight));
    if (pricePerPerson.trim() !== "") fd.append("pricePerPerson", String(pricePerPerson.trim()));
    fd.append("overviewTitle", "Room overview");
    fd.append("overview", overview.trim());
    fd.append("viewpoint", viewpoint.trim());
    fd.append("description", shortDescription.trim());
    fd.append("highlights", "");

    const rowsWithFiles = amenityRows.filter((r) => r.file);
    const labels = rowsWithFiles.map((r) => r.label.trim() || "Amenity");
    fd.append("amenityLabels", JSON.stringify(labels));
    rowsWithFiles.forEach((r) => fd.append("amenityImages", r.file));
    galleryFiles.forEach((f) => fd.append("galleryImages", f));
    if (clearAmenities) fd.append("clearRoomAmenities", "1");
    return fd;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !totalUnits || !capacity || !pricePerNight) {
      feedbackWarning(showFeedback, "Room name, total units, capacity, and room price are required.");
      return;
    }
    if (!editingId && galleryFiles.length < 1) {
      feedbackWarning(showFeedback, "Add at least one room photo. Guests will use the arrows to browse all photos.");
      return;
    }

    const rowsWithFiles = amenityRows.filter((r) => r.file);
    if (rowsWithFiles.length > 0) {
      const missing = rowsWithFiles.some((r) => !r.label.trim());
      if (missing) {
        feedbackWarning(showFeedback, "Each amenity photo needs a label.");
        return;
      }
    }

    try {
      setSaving(true);
      if (editingId) {
        const hasNewGallery = galleryFiles.length > 0;
        const hasNewAmenityFiles = rowsWithFiles.length > 0;
        if (hasNewGallery || hasNewAmenityFiles || clearAmenities) {
          const fd = buildFormData();
          await apiClient.put(`/manager/rooms/complete/${editingId}`, fd, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          await apiClient.patch(`/manager/rooms/item/${editingId}`, {
            name: name.trim(),
            totalUnits: Number(totalUnits),
            capacity: Number(capacity),
            pricePerNight: Number(pricePerNight),
            pricePerPerson: pricePerPerson.trim() === "" ? null : Number(pricePerPerson),
            overviewTitle: "Room overview",
            overview: overview.trim() || null,
            viewpoint: viewpoint.trim() || null,
            description: shortDescription.trim() || null,
            highlights: "",
          });
        }
        feedbackSuccess(showFeedback, "Room saved.");
        navigate(`/manager/dashboard/hotels/${hotelId}/rooms/${editingId}`, { replace: true });
      } else {
        const fd = buildFormData();
        const res = await apiClient.post(`/manager/rooms/complete/${hotelId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        const newId = res.data?.room?.id;
        if (newId) {
          navigate(`/manager/dashboard/hotels/${hotelId}/rooms/${newId}`, { replace: true });
        } else {
          feedbackSuccess(showFeedback, "Room created.");
        }
      }
      resetForm();
      setShowCreateForm(false);
      await fetchRooms();
    } catch (err) {
      console.error(err);
      feedbackError(showFeedback, apiErrorMessage(err, "Save failed"));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (roomId) => {
    const ok = await askConfirm(showFeedback, {
      title: "Delete room",
      message: "Delete this room?",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
    });
    if (!ok) return;
    try {
      await apiClient.delete(`/manager/rooms/item/${roomId}`);
      if (editingId === roomId) {
        resetForm();
        setShowCreateForm(false);
        navigate(hotelHubPath, { replace: true });
      }
      await fetchRooms();
    } catch (err) {
      feedbackError(showFeedback, apiErrorMessage(err, "Delete failed"));
    }
  };

  const goViewRoom = (roomId) => {
    navigate(`/manager/dashboard/hotels/${hotelId}/rooms/${roomId}`);
  };

  const goEditRoom = (r) => {
    if (r.canEdit === false) {
      feedbackWarning(showFeedback, "This room has an active guest booking. You can edit again after checkout.");
      return;
    }
    setShowCreateForm(true);
    navigate(`${hotelHubPath}?edit=${r.id}`, { replace: true });
  };

  const roomsListSection = (
    <section className="tour-listing-page section-space manager-rooms-tour-list">
      <Container fluid className="px-2 px-md-3 px-lg-4 mb-4">
        <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
          <h2 className="mb-0" style={{ fontSize: "1.35rem", fontWeight: 700 }}>
            Rooms at this hotel
          </h2>
          {rooms.length > 0 && !showRoomForm ? (
            <button type="button" className="gotur-btn" style={{ fontSize: "0.9rem", padding: "0.45rem 1rem" }} onClick={startCreateRoom}>
              + Create new room
            </button>
          ) : null}
          {rooms.length > 0 && showRoomForm && !editingId ? (
            <button type="button" className="btn btn-outline-secondary btn-sm" onClick={cancelEdit}>
              Close form
            </button>
          ) : null}
        </div>
        {loadingList ? (
          <div className="dashboard-card mt-2">
            <div className="dashboard-card__body">Loading…</div>
          </div>
        ) : rooms.length === 0 ? (
          <div className="dashboard-card mt-2">
            <div className="dashboard-card__body text-muted">No rooms yet. Use the form below to add your first room.</div>
          </div>
        ) : (
          <Row className="gutter-y-30">
            {rooms.map((r, index) => {
              const thumb = r.images?.find((i) => i.isCover) || r.images?.[0];
              const descLine = (r.description || r.overview || "").trim();
              const descShort = descLine.length > 72 ? `${descLine.slice(0, 72)}…` : descLine || "Room on your hotel page";
              const featured = index === 0 || thumb?.isCover;
              return (
                <Col md={12} key={r.id}>
                  <div className="listing-list-card wow fadeInUp animated" data-wow-duration="1500ms" data-wow-delay={`${Math.min(index, 5) * 80}ms`}>
                    <Row className="align-items-center">
                      <Col md={4}>
                        <div className="listing-list-card__image">
                          {thumb ? (
                            <img src={imgSrc(thumb.url)} alt="" onError={setImagePlaceholderOnError} />
                          ) : (
                            <div
                              className="d-flex align-items-center justify-content-center bg-light text-muted fw-semibold"
                              style={{ minHeight: 220, borderRadius: 8 }}
                            >
                              Add photo
                            </div>
                          )}
                          <button
                            type="button"
                            className="listing-list-card__overlay-btn"
                            aria-label="View room as guest"
                            onClick={() => goViewRoom(r.id)}
                          />
                          <div className="listing-list-card__btn-group">
                            {featured ? <div className="listing-list-card__featured">Featured</div> : null}
                          </div>
                        </div>
                      </Col>
                      <Col md={8}>
                        <div className="listing-list-card__content">
                          <h3 className="listing-list-card__title">
                            {r.canEdit === false ? (
                              <span>{r.name}</span>
                            ) : (
                              <button type="button" className="manager-room-list__title-btn" onClick={() => goEditRoom(r)}>
                                {r.name}
                              </button>
                            )}
                          </h3>
                          <div className="listing-list-card__content__inner">
                            <ul className="listing-list-card__meta list-unstyled">
                              <li>
                                <span className="manager-room-list__meta-item">
                                  <span className="listing-list-card__meta__icon">
                                    <i className="icon-pin"></i>
                                  </span>
                                  Up to {r.capacity} guests
                                  {" · "}
                                  {r.totalUnits || 1} room unit{(r.totalUnits || 1) > 1 ? "s" : ""}
                                  {" · "}
                                  {(r.bookingBlocks?.length || 0)} paused window{(r.bookingBlocks?.length || 0) === 1 ? "" : "s"}
                                  {r.viewpoint ? ` · ${r.viewpoint}` : ""}
                                </span>
                              </li>
                              <li>
                                <span className="manager-room-list__meta-item">
                                  <span className="listing-list-card__meta__icon">
                                    <i className="icon-calendar"></i>
                                  </span>
                                  {descShort}
                                </span>
                              </li>
                            </ul>
                            <div className="listing-list-card__price">
                              <h5 className="listing-list-card__price__number">
                                ${r.pricePerNight}
                                <span>/Per night</span>
                              </h5>
                              <div className="listing-list-card__rating">
                                <i className="icon-star"></i>
                                <span>
                                  {r.pricePerPerson != null ? `$${r.pricePerPerson} / guest` : "—"}
                                  {r.canEdit === false ? " · Edit locked" : ""}
                                </span>
                              </div>
                            </div>
                            <div className="listing-list-card__actions">
                              <button type="button" className="gotur-btn" style={{ fontSize: "0.85rem", padding: "0.4rem 0.9rem" }} onClick={() => goViewRoom(r.id)}>
                                View as guest
                              </button>
                              {r.canEdit === false ? (
                                <span className="small align-self-center" style={{ color: "inherit" }}>
                                  Booking active — edit after checkout
                                </span>
                              ) : (
                                <button type="button" className="dashboard-btn dashboard-btn--secondary" style={{ fontSize: "0.85rem", padding: "0.4rem 0.9rem" }} onClick={() => goEditRoom(r)}>
                                  Edit room
                                </button>
                              )}
                              <button type="button" className="dashboard-btn dashboard-btn--danger" style={{ fontSize: "0.85rem", padding: "0.4rem 0.9rem" }} onClick={() => handleDelete(r.id)}>
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Col>
              );
            })}
          </Row>
        )}
      </Container>
    </section>
  );

  const roomFormSection = showRoomForm ? (
    <form onSubmit={handleSubmit}>
      <Container fluid className="px-2 px-md-3 px-lg-4">
        <h2 className="h4 mb-3">{editingId ? "Edit room" : "Create new room"}</h2>
        <div className="dashboard-form-group mb-3" style={{ maxWidth: 720 }}>
          <label>Room name</label>
          <input
            className="form-control form-control-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Shown as the main title (e.g. Deluxe Ocean Suite)"
            required
          />
        </div>
        <div className="dashboard-form-group mb-3" style={{ maxWidth: 360 }}>
          <label>Total rooms with this same room type name</label>
          <input
            className="form-control"
            type="number"
            min={1}
            value={totalUnits}
            onChange={(e) => setTotalUnits(e.target.value)}
            placeholder="e.g. 5"
            required
          />
        </div>
        <div className="dashboard-form-group mb-4" style={{ maxWidth: 720 }}>
          <label>Short line for hotel listing cards (optional)</label>
          <input
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            placeholder="One line under the room title on the hotel page"
          />
        </div>

        <div className="mb-2">
          <label className="fw-semibold d-block mb-2">Room photos (carousel — 1170×565 recommended)</label>
          <input type="file" accept="image/*" multiple className="form-control mb-2" style={{ maxWidth: 420 }} onChange={onGalleryPick} />
          <p className="small text-muted mb-2">
            {editingId
              ? "Leave files empty to keep existing photos. Choose new files only to replace the whole set."
              : "Add one or more images. Guests use arrows (and dots when there are multiple slides) to browse."}
          </p>
          {carouselSlides.length > 0 ? (
            <RoomGalleryCarousel images={carouselSlides} />
          ) : (
            <div
              className="mgr-room-carousel-wrap d-flex align-items-center justify-content-center text-muted"
              style={{ minHeight: 220, fontWeight: 600 }}
            >
              1170 × 565 — add photos above
            </div>
          )}
        </div>

        <Row className="gutter-y-30 mt-4">
          <Col lg={8}>
            <div className="destination-details__content__item mb-4">
              <h3 className="destination-details__title">Overview</h3>
              <p className="text-muted small mb-2">Explain the room, layout, and what guests can expect.</p>
              <textarea
                className="form-control"
                rows={7}
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
                placeholder="Write the room overview…"
                style={{ borderRadius: 10, border: "1px solid #e9ecef" }}
              />
            </div>

            <div className="destination-details__content__item">
              <h3 className="destination-details__title">Room amenities</h3>
              <p className="destination-details__text text-muted">
                Add photos guests will see (e.g. bathroom, balcony, coffee station). Use roughly <strong>370×243</strong> images for best
                fit.
              </p>
              <Row className="gutter-y-30 mt-2">
                {amenityRows.map((row) => (
                  <Col md={6} key={row.key}>
                    <div className="mgr-amenity-grid__tile">
                      <div className="mgr-amenity-grid__thumb-slot">
                        {row.preview ? (
                          <img src={row.preview} alt="" onError={setImagePlaceholderOnError} />
                        ) : (
                          <div className="d-flex align-items-center justify-content-center text-muted small h-100">370 × 243</div>
                        )}
                      </div>
                      <div className="mgr-amenity-grid__tile-body">
                        <label className="small fw-semibold text-muted">Amenity name</label>
                        <input
                          className="form-control form-control-sm mb-2"
                          value={row.label}
                          onChange={(e) =>
                            setAmenityRows((prev) => prev.map((r) => (r.key === row.key ? { ...r, label: e.target.value } : r)))
                          }
                          placeholder="e.g. Rain shower"
                        />
                        <input type="file" accept="image/*" className="form-control form-control-sm" onChange={(e) => onAmenityFile(row.key, e.target.files?.[0] || null)} />
                        <button type="button" className="btn btn-link text-danger btn-sm p-0 mt-1" onClick={() => removeAmenityRow(row.key)}>
                          Remove tile
                        </button>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
              <button type="button" className="gotur-btn mt-3" style={{ fontSize: "0.85rem" }} onClick={addAmenityRow}>
                + Add amenity photo
              </button>
              {editingId ? (
                <label className="d-block mt-3 small">
                  <input type="checkbox" checked={clearAmenities} onChange={(e) => setClearAmenities(e.target.checked)} /> Clear all saved
                  amenity photos when you save (use with new uploads or to reset)
                </label>
              ) : null}
            </div>
          </Col>

          <Col lg={4}>
            <div className="room-booking-details room-booking-details--editable" style={{ position: "sticky", top: "1rem" }}>
              <h3 className="room-booking-details__title">Booking details</h3>
              <ul className="room-booking-details__list">
                <li className="room-booking-details__row">
                  <span className="room-booking-details__check" aria-hidden />
                  <span className="room-booking-details__label">Room price / night</span>
                  <input
                    className="room-booking-details__value"
                    inputMode="decimal"
                    value={pricePerNight}
                    onChange={(e) => setPricePerNight(e.target.value)}
                    placeholder="0"
                  />
                </li>
                <li className="room-booking-details__row">
                  <span className="room-booking-details__check" aria-hidden />
                  <span className="room-booking-details__label">Capacity</span>
                  <input
                    className="room-booking-details__value"
                    inputMode="numeric"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    placeholder="guests"
                  />
                </li>
                <li className="room-booking-details__row">
                  <span className="room-booking-details__check" aria-hidden />
                  <span className="room-booking-details__label">Per person</span>
                  <input
                    className="room-booking-details__value"
                    inputMode="decimal"
                    value={pricePerPerson}
                    onChange={(e) => setPricePerPerson(e.target.value)}
                    placeholder="optional"
                  />
                </li>
                <li className="room-booking-details__row">
                  <span className="room-booking-details__check" aria-hidden />
                  <span className="room-booking-details__label">Viewpoint</span>
                  <input
                    className="room-booking-details__value"
                    value={viewpoint}
                    onChange={(e) => setViewpoint(e.target.value)}
                    placeholder="e.g. Ocean view"
                  />
                </li>
                {amenityRows
                  .filter((r) => r.preview && r.label.trim())
                  .map((r) => (
                    <li className="room-booking-details__row room-booking-details__row--amenity" key={`prev-${r.key}`}>
                      <span className="room-booking-details__check" aria-hidden />
                      <img className="room-booking-details__icon-thumb" src={r.preview} alt="" onError={setImagePlaceholderOnError} />
                      <span className="room-booking-details__label" style={{ flex: 1, minWidth: 0 }}>
                        {r.label.trim()}
                      </span>
                    </li>
                  ))}
              </ul>
              <button type="submit" className="gotur-btn w-100 mt-2" disabled={saving}>
                {saving ? "Saving…" : editingId ? "Save room" : "Submit room"}
              </button>
              {editingId ? (
                <button type="button" className="btn btn-outline-secondary w-100 mt-2" onClick={cancelEdit}>
                  Cancel edit
                </button>
              ) : rooms.length > 0 ? (
                <button type="button" className="btn btn-outline-secondary w-100 mt-2" onClick={cancelEdit}>
                  Cancel
                </button>
              ) : null}
            </div>
          </Col>
        </Row>
      </Container>
    </form>
  ) : null;

  return (
    <div className="dashboard-page manager-room-editor">
      <div style={{ marginBottom: "1rem" }}>
        <Link to="/manager/dashboard/hotels/active" style={{ color: "#0d6efd", textDecoration: "none", fontSize: "0.9rem" }}>
          ← Back to hotels
        </Link>
        {" · "}
        <Link to={`/manager/dashboard/hotels/${hotelId}/edit`} style={{ color: "#0d6efd", textDecoration: "none", fontSize: "0.9rem" }}>
          Edit hotel details
        </Link>
      </div>

      <div className="dashboard-card mb-4">
        <div className="dashboard-card__body py-3">
          <div className="text-muted text-uppercase small fw-semibold mb-1" style={{ letterSpacing: "0.04em" }}>
            Managing
          </div>
          <div className="fw-bold fs-4 mb-1">{hotelInfo?.name || "Loading hotel…"}</div>
          {hotelInfo?.address ? <div className="small text-muted mb-0">{hotelInfo.address}</div> : null}
          {hotelInfo?.status ? (
            <div className="mt-2 small">
              <span className={`badge ${hotelInfo.status === "ACTIVE" ? "bg-success" : "bg-warning text-dark"}`}>{hotelInfo.status}</span>
            </div>
          ) : null}
        </div>
      </div>

      {roomsListSection}
      {roomFormSection}
    </div>
  );
}
