import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Col, Container } from "react-bootstrap";
import apiClient from "../../services/apiClient";
import { setImagePlaceholderOnError } from "../../utils/imagePlaceholder";
import Layout from "../../components/gotur/layout/Layout/Layout";
import TopbarOne from "../../components/gotur/common/TopbarOne/TopbarOne";
import HeaderTwo from "../../components/gotur/layout/HeaderTwo/HeaderTwo";
import HeaderTwoCloned from "../../components/gotur/layout/HeaderTwoCloned/HeaderTwoCloned";
import FooterOne from "../../components/gotur/layout/FooterOne/FooterOne";
import MovingImageStrip, { resolveImageUrl, movingStripCss } from "../../components/gotur/tour/MovingImageStrip";
import "../../styles/room-booking-details.css";

const STATIC_REVIEWS = [
  {
    name: "Nimal Perera",
    date: "03 Jan 2026",
    text: "Great location and friendly staff. Clean rooms and smooth check-in.",
  },
  {
    name: "Ayesha Fernando",
    date: "18 Dec 2025",
    text: "Loved the amenities and breakfast. The room felt very comfortable.",
  },
];
const REVIEW_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='70' height='70' viewBox='0 0 70 70'%3E%3Ccircle cx='35' cy='35' r='35' fill='%23e8f0e8'/%3E%3Ccircle cx='35' cy='28' r='12' fill='%2363AB45'/%3E%3Cellipse cx='35' cy='56' rx='18' ry='11' fill='%2363AB45'/%3E%3C/svg%3E";

function getCoverImage(images = []) {
  return images.find((img) => img.isCover) || images[0] || null;
}

function formatPrice(value) {
  if (value == null || Number.isNaN(Number(value))) return "0";
  return Number(value).toLocaleString();
}

export default function HotelDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [roomsCount, setRoomsCount] = useState(1);
  const [guests, setGuests] = useState(2);
  const [bookingFlow, setBookingFlow] = useState("REQUEST");
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [availabilityMonth, setAvailabilityMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  const [availability, setAvailability] = useState(null);
  const [customReviews, setCustomReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ name: "", email: "", message: "" });
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/hotels/${id}`);
        setHotel(res.data);
        setSelectedRoomId(res.data.rooms?.[0]?.id || "");
      } catch (e) {
        setError(e.response?.data?.error || e.message || "Failed to load hotel");
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  useEffect(() => {
    if (!hotel?.id || !availabilityMonth) return;
    apiClient
      .get(`/hotels/${hotel.id}/availability`, { params: { month: availabilityMonth } })
      .then((res) => setAvailability(res.data))
      .catch(() => setAvailability(null));
  }, [hotel?.id, availabilityMonth]);

  const hotelImages = hotel?.images || [];
  const dedicatedAmenityImages = hotel?.amenityImages || [];
  const hotelCover = getCoverImage(hotelImages);
  const galleryImages = hotelImages.filter((img) => img.id !== hotelCover?.id);
  const amenityImages = (
    dedicatedAmenityImages.length
      ? dedicatedAmenityImages
      : (galleryImages.length ? galleryImages : hotelImages)
  ).slice(0, 8);
  const rooms = hotel?.rooms || [];
  const selectedRoom = rooms.find((r) => r.id === selectedRoomId) || rooms[0] || null;
  const selectedRoomAvailability = useMemo(() => {
    if (!availability?.roomTypes?.length || !selectedRoom?.id) return null;
    return availability.roomTypes.find((r) => r.roomTypeId === selectedRoom.id) || null;
  }, [availability, selectedRoom?.id]);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, [checkIn, checkOut]);

  const totalPrice = useMemo(() => {
    if (!selectedRoom) return 0;
    return selectedRoom.pricePerNight * Math.max(roomsCount, 1) * Math.max(nights, 1);
  }, [selectedRoom, roomsCount, nights]);

  const allReviews = [...STATIC_REVIEWS, ...customReviews];
  const mapSrc = useMemo(() => {
    if (hotel?.mapEmbedUrl) return hotel.mapEmbedUrl;
    if (hotel?.latitude != null && hotel?.longitude != null) {
      return `https://maps.google.com/maps?q=${hotel.latitude},${hotel.longitude}&z=15&output=embed`;
    }
    return `https://maps.google.com/maps?q=${encodeURIComponent(hotel?.address || "Sri Lanka")}&z=14&output=embed`;
  }, [hotel]);

  const handleBookNow = async (e) => {
    e.preventDefault();

    if (!selectedRoom?.id) {
      alert("Please select a room type first.");
      return;
    }
    if (!checkIn || !checkOut) {
      alert("Please select check-in and check-out dates.");
      return;
    }
    if (!token) {
      navigate(`/login?redirect=/hotels/${id}`);
      return;
    }

    try {
      await apiClient.post("/bookings", {
        hotelId: id,
        roomTypeId: selectedRoom.id,
        checkIn,
        checkOut,
        currency: "USD",
        guests,
        rooms: roomsCount,
        bookingFlow,
      });
      alert(bookingFlow === "INSTANT" ? "Booking confirmed." : "Booking request created.");
      navigate("/dashboard/bookings");
    } catch (err) {
      alert("Booking failed: " + (err.response?.data?.error || err.message));
    }
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.message) {
      alert("Please enter name and review message.");
      return;
    }
    setCustomReviews((prev) => [
      ...prev,
      {
        name: reviewForm.name,
        date: new Date().toLocaleDateString(),
        text: reviewForm.message,
      },
    ]);
    setReviewForm({ name: "", email: "", message: "" });
  };

  if (loading) return <p style={{ padding: 24 }}>Loading hotel details...</p>;
  if (error) return <p style={{ padding: 24, color: "red" }}>{error}</p>;
  if (!hotel) return <p style={{ padding: 24 }}>Hotel not found.</p>;

  return (
    <Layout>
      <TopbarOne />
      <HeaderTwo />
      <HeaderTwoCloned />

      <section className="tour-listing-details section-space">
        <div className="tour-listing-details__destination wow fadeInUp" data-wow-duration="1500ms">
          <Container>
            <div className="tour-listing-details__destination__inner">
              <div className="tour-listing-details__destination__left">
                <h4 className="tour-listing-details__destination__title">{hotel.name}</h4>
                <div className="tour-listing-details__destination__revue">
                  <div className="tour-listing-details__destination__ratings-box">
                    <span>({allReviews.length} Review)</span>
                    {[...Array(5)].map((_, idx) => (
                      <i key={idx} className="icon-star"></i>
                    ))}
                  </div>
                  <div className="tour-listing-details__destination__posted">
                    <i className="icon-pin1"></i>
                    <p className="tour-listing-details__destination__posted-text">{hotel.address || "Sri Lanka"}</p>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>

        <div className="tour-listing-details__carousel wow fadeInUp" data-wow-duration="1500ms">
          <Container>
            <div className="destination-carousel__item">
              <img
                src={resolveImageUrl(hotelCover?.url)}
                alt={hotel.name}
                onError={setImagePlaceholderOnError}
                style={{ width: "100%", height: "460px", objectFit: "cover", borderRadius: "10px" }}
              />
            </div>
          </Container>
        </div>

        <div className="tour-listing-details__content__item tour-listing-details__thumb wow fadeInUp">
          <div className="container-fluid">
            <h4 className="tour-listing-details__title">Relevant Hotel Photos</h4>
            <MovingImageStrip
              images={galleryImages.length ? galleryImages : hotelImages}
              height={395}
              altPrefix="relevant"
            />
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
                  <p className="tour-listing-details__info-area__text">{hotel.address || "Sri Lanka"}</p>
                </div>
              </li>
              <li>
                <div className="tour-listing-details__info-area__icon">
                  <i className="icon-travel-and-tourism"></i>
                </div>
                <div className="tour-listing-details__info-area__content">
                  <h5 className="tour-listing-details__info-area__title">Property Type</h5>
                  <p className="tour-listing-details__info-area__text">{hotel.propertyType || "Hotel"}</p>
                </div>
              </li>
              <li>
                <div className="tour-listing-details__info-area__icon">
                  <i className="icon-clock"></i>
                </div>
                <div className="tour-listing-details__info-area__content">
                  <h5 className="tour-listing-details__info-area__title">Check-in</h5>
                  <p className="tour-listing-details__info-area__text">{hotel.checkInTime || "2:00 PM"}</p>
                </div>
              </li>
              <li>
                <div className="tour-listing-details__info-area__icon">
                  <i className="icon-clock"></i>
                </div>
                <div className="tour-listing-details__info-area__content">
                  <h5 className="tour-listing-details__info-area__title">Check-out</h5>
                  <p className="tour-listing-details__info-area__text">{hotel.checkOutTime || "11:00 AM"}</p>
                </div>
              </li>
              <li>
                <span className="gotur-btn">
                  ${formatPrice(selectedRoom?.pricePerNight || hotel.basePrice || 0)} / per night
                </span>
              </li>
            </ul>
          </Container>
        </div>

        <Container>
          <div className="row gutter-y-30">
            <div className="col-lg-8">
              <div className="tour-listing-details__content">
                <div className="tour-listing-details__content__item tour-listing-details__content__text wow fadeInUp">
                  <h4 className="tour-listing-details__title">{hotel.overviewTitle || "Overview of the hotel"}</h4>
                  <p className="tour-listing-details__text">
                    {hotel.overview || hotel.description || "Hotel overview details will be updated soon."}
                  </p>
                </div>

                <div className="tour-listing-details__content__item tour-listing-details__list wow fadeInUp">
                  <h4 className="tour-listing-details__title">Facilities</h4>
                  <ul className="tour-listing-details__content__list">
                    {(hotel.highlights?.length ? hotel.highlights : ["24/7 Front Desk", "Secure Parking", "Free Wi-Fi"]).map((item, idx) => (
                      <li key={`${item}-${idx}`}>
                        <i className="icon-check-star"></i> {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="tour-listing-details__content__item tour-listing-details__amenities wow fadeInUp">
                  <h4 className="tour-listing-details__title">Amenities</h4>
                  <div className="tour-listing-details__amenities__inner">
                    <ul className="tour-listing-details__amenities__list">
                      {(hotel.amenities?.length ? hotel.amenities : ["Air Conditioning", "Breakfast Included", "Swimming Pool"]).map((amenity, idx) => (
                        <li key={`${amenity}-${idx}`}>
                          <i className="icon-check-star"></i> {amenity}
                        </li>
                      ))}
                    </ul>
                    <ul className="tour-listing-details__amenities__list tour-listing-details__amenities__list--two">
                      {(hotel.roomAmenities?.length ? hotel.roomAmenities : ["No smoking in rooms", "No outside pets"]).map((amenity, idx) => (
                        <li key={`${amenity}-${idx}`}>
                          <i className="icon-check-star"></i> {amenity}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="tour-listing-details__content__item tour-listing-details__ture-list wow fadeInUp">
                  <h4 className="tour-listing-details__title">Room Type</h4>
                  <div className="row">
                    {rooms.map((room) => {
                      const roomCover = getCoverImage(room.images || []);
                      return (
                        <Col lg={6} md={6} key={room.id}>
                          <div className="listing-card-four">
                            <div className="listing-card-four__image">
                              <img
                                src={resolveImageUrl(roomCover?.url)}
                                alt={room.name}
                                onError={setImagePlaceholderOnError}
                                style={{ width: "100%", height: "243px", objectFit: "cover" }}
                              />
                              <ul className="listing-card-four__meta list-unstyled">
                                <li>
                                  <span className="listing-card-four__meta__icon">
                                    <i className="icon-group"></i>
                                  </span>
                                  Capacity: {room.capacity}
                                </li>
                                <li>
                                  <span className="listing-card-four__meta__icon">
                                    <i className="icon-price-tag"></i>
                                  </span>
                                  ${formatPrice(room.pricePerNight)} / night
                                </li>
                              </ul>
                            </div>
                            <div className="listing-card-four__content">
                              <h3 className="listing-card-four__title">{room.name}</h3>
                              <p>{room.overview || room.description || "Comfortable room with modern facilities."}</p>
                              <div className="listing-card-four__content__btn" style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                                <Link to={`/hotels/${id}/room/${room.id}`} className="listing-card-four__btn gotur-btn">
                                  View room <i className="icon-right"></i>
                                </Link>
                                <button
                                  type="button"
                                  className="listing-card-four__btn gotur-btn"
                                  onClick={() => {
                                    setSelectedRoomId(room.id);
                                    const bookingEl = document.getElementById("room-booking-form");
                                    if (bookingEl) bookingEl.scrollIntoView({ behavior: "smooth", block: "start" });
                                  }}
                                >
                                  Select on this page <i className="icon-right"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </Col>
                      );
                    })}
                  </div>
                </div>

                <div className="tour-listing-details__content__item tour-listing-details__thumb wow fadeInUp">
                  <h4 className="tour-listing-details__title">Amenities Images</h4>
                  <MovingImageStrip images={amenityImages} height={243} reverse altPrefix="amenity" />
                </div>

              </div>
            </div>

            <div className="col-lg-4">
              <div className="tour-listing-details__sidebar">
                <form
                  id="room-booking-form"
                  className="room-booking-details room-booking-details--book-form room-booking-details--hotel-book mb-3 wow fadeInUp"
                  onSubmit={handleBookNow}
                >
                  <h3 className="room-booking-details__title">Book this room</h3>
                  <ul className="room-booking-details__list">
                    <li className="room-booking-details__row">
                      <span className="room-booking-details__check" aria-hidden />
                      <label className="room-booking-details__label" htmlFor="hotel-room-select">
                        Room type
                      </label>
                      <select
                        id="hotel-room-select"
                        className="room-booking-details__control room-booking-details__control--select"
                        value={selectedRoomId}
                        onChange={(e) => setSelectedRoomId(e.target.value)}
                      >
                        {rooms.map((room) => (
                          <option key={room.id} value={room.id}>
                            {room.name} — ${formatPrice(room.pricePerNight)}/night
                          </option>
                        ))}
                      </select>
                    </li>
                    <li className="room-booking-details__row">
                      <span className="room-booking-details__check" aria-hidden />
                      <label className="room-booking-details__label" htmlFor="hotel-book-flow">
                        Booking option
                      </label>
                      <select
                        id="hotel-book-flow"
                        className="room-booking-details__control room-booking-details__control--select"
                        value={bookingFlow}
                        onChange={(e) => setBookingFlow(e.target.value)}
                      >
                        <option value="REQUEST">Request & pay later</option>
                        <option value="INSTANT">Instant booking (pay now)</option>
                      </select>
                    </li>
                    <li className="room-booking-details__row">
                      <span className="room-booking-details__check" aria-hidden />
                      <label className="room-booking-details__label" htmlFor="hotel-book-checkin">
                        Check-in
                      </label>
                      <input
                        id="hotel-book-checkin"
                        className="room-booking-details__control"
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                      />
                    </li>
                    <li className="room-booking-details__row">
                      <span className="room-booking-details__check" aria-hidden />
                      <label className="room-booking-details__label" htmlFor="hotel-book-checkout">
                        Check-out
                      </label>
                      <input
                        id="hotel-book-checkout"
                        className="room-booking-details__control"
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                      />
                    </li>
                    <li className="room-booking-details__row">
                      <span className="room-booking-details__check" aria-hidden />
                      <label className="room-booking-details__label" htmlFor="hotel-book-guests">
                        Guests
                      </label>
                      <input
                        id="hotel-book-guests"
                        className="room-booking-details__control"
                        type="number"
                        min={1}
                        max={selectedRoom?.capacity || 99}
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                      />
                    </li>
                    <li className="room-booking-details__row">
                      <span className="room-booking-details__check" aria-hidden />
                      <label className="room-booking-details__label" htmlFor="hotel-book-roomcount">
                        Rooms
                      </label>
                      <input
                        id="hotel-book-roomcount"
                        className="room-booking-details__control"
                        type="number"
                        min={1}
                        value={roomsCount}
                        onChange={(e) => setRoomsCount(Number(e.target.value))}
                      />
                    </li>
                    <li className="room-booking-details__row">
                      <span className="room-booking-details__check" aria-hidden />
                      <span className="room-booking-details__label">Nights</span>
                      <span className="room-booking-details__value room-booking-details__value--readonly">{nights || 0}</span>
                    </li>
                    <li className="room-booking-details__row">
                      <span className="room-booking-details__check" aria-hidden />
                      <span className="room-booking-details__label">Total</span>
                      <span className="room-booking-details__value room-booking-details__value--readonly">${formatPrice(totalPrice)}</span>
                    </li>
                  </ul>
                  <div className="small text-muted mb-2">
                    {bookingFlow === "REQUEST"
                      ? "Booking request will wait for manager acceptance and has an expiry time."
                      : "Instant booking confirms immediately when room units are available."}
                  </div>
                  <div className="small text-muted mb-2">
                    <label htmlFor="availability-month" className="me-2">Availability month:</label>
                    <input
                      id="availability-month"
                      type="month"
                      value={availabilityMonth}
                      onChange={(e) => setAvailabilityMonth(e.target.value)}
                    />
                  </div>
                  {selectedRoomAvailability ? (
                    <div className="small mb-2">
                      <strong>{selectedRoomAvailability.roomName}:</strong>{" "}
                      {Math.min(...selectedRoomAvailability.days.map((d) => d.free))} min free /
                      {" "}{selectedRoomAvailability.totalUnits} total units in this month
                    </div>
                  ) : null}
                  <button type="submit" className="gotur-btn gotur-btn--base w-100 mt-2">
                    Book this room <i className="icon-right"></i>
                  </button>
                </form>

                <div className="tour-listing-details__sidebar__item tour-listing-details__sidebar__item-location wow fadeInUp">
                  <div className="tour-listing-details__sidebar__item-box">
                    <iframe title="Google Map" src={mapSrc} className="w-100" height="300" allowFullScreen />
                  </div>
                </div>

                <div className="tour-listing-details__sidebar__item wow fadeInUp">
                  <h4 className="tour-listing-details__sidebar__title">Related Room List</h4>
                  <ul className="list-unstyled">
                    {rooms.map((room) => (
                      <li key={`related-${room.id}`} style={{ marginBottom: 10 }}>
                        <Link
                          to="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setSelectedRoomId(room.id);
                            const bookingEl = document.getElementById("room-booking-form");
                            if (bookingEl) bookingEl.scrollIntoView({ behavior: "smooth", block: "start" });
                          }}
                        >
                          {room.name} - ${formatPrice(room.pricePerNight)} / night
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Container>

        <Container>
          <div className="tour-listing-details__content">
            <div className="tour-listing-details__content__item tour-listing-details__reviews wow fadeInUp">
              <h3 className="tour-listing-details__title">{allReviews.length} Reviews</h3>
              <ul className="list-unstyled product-details__comment__list">
                {allReviews.map((review, idx) => (
                  <li key={`${review.name}-${idx}`} className="product-details__comment__card">
                    <div className="product-details__comment__card__image">
                      <img src={REVIEW_AVATAR} alt={review.name} />
                    </div>
                    <div className="product-details__comment__card__content">
                      <div className="product-details__comment__card__top">
                        <div className="product-details__comment__card__info">
                          <h3 className="product-details__comment__card__title">{review.name}</h3>
                          <p className="product-details__comment__card__date">{review.date}</p>
                        </div>
                        <div className="product-details__comment__card__star">
                          {[...Array(5)].map((_, s) => <span key={s} className="fa fa-star"></span>)}
                        </div>
                      </div>
                      <p className="product-details__comment__card__text">{review.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="tour-listing-details__content__item tour-listing-details__add-reviews wow fadeInUp">
              <div className="contact-page__contact">
                <h2 className="tour-listing-details__title">Add Review</h2>
                <form
                  className="comments-form__form contact-form-validated product-details__form__form form-one"
                  onSubmit={handleReviewSubmit}
                >
                  <div className="form-one__group">
                    <div className="form-one__control">
                      <label htmlFor="review-name">Name</label>
                      <input
                        id="review-name"
                        value={reviewForm.name}
                        onChange={(e) => setReviewForm((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Your name"
                      />
                    </div>
                    <div className="form-one__control">
                      <label htmlFor="review-email">Email</label>
                      <input
                        id="review-email"
                        type="email"
                        value={reviewForm.email}
                        onChange={(e) => setReviewForm((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="Your email"
                      />
                    </div>
                    <div className="form-one__control form-one__control--full">
                      <label htmlFor="review-message">Message</label>
                      <textarea
                        id="review-message"
                        value={reviewForm.message}
                        onChange={(e) => setReviewForm((prev) => ({ ...prev, message: e.target.value }))}
                        placeholder="Write your review"
                      />
                    </div>
                    <div className="form-one__control form-one__control--full">
                      <button type="submit" className="gotur-btn gotur-btn--base">
                        Send Message <i className="icon-arrow-right"></i>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Container>

      </section>

      <FooterOne />
      <style>{movingStripCss}</style>
    </Layout>
  );
}
