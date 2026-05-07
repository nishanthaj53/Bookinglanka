import { useMemo, useRef } from "react";

import { Link } from "react-router-dom";

import { Col, Container, Row } from "react-bootstrap";

import { resolveImageUrl } from "../gotur/tour/MovingImageStrip";

import RoomGalleryCarousel from "../gotur/RoomGalleryCarousel";

import "../../styles/room-booking-details.css";

import { setImagePlaceholderOnError } from "../../utils/imagePlaceholder";



export function formatRoomPrice(value) {

  if (value == null || Number.isNaN(Number(value))) return "0";

  return Number(value).toLocaleString();

}



function roomCardThumb(room) {

  const img = room?.images?.find((i) => i.isCover) || room?.images?.[0];

  return img?.url ? resolveImageUrl(img.url) : null;

}



/**

 * Shared guest-style room detail body (carousel, overview, amenities, booking details, optional book form).

 * @param {{ otherRooms?: Array<object> }} [props] — sibling room types at the same hotel (excludes current); links for discovery.

 */

export default function RoomDetailViewCore({

  hotel,

  room,

  hotelId,

  showBookForm = true,

  otherRooms = [],

  checkIn,

  setCheckIn,

  checkOut,

  setCheckOut,

  guests,

  setGuests,

  roomsCount,

  setRoomsCount,

  nights,

  totalPrice,

  onBookSubmit,

  managerPreview = false,

}) {

  const gallery = room?.images?.length ? room.images : [];

  const amenityTiles = room?.amenityImages || [];

  const highlights = room?.highlights?.length ? room.highlights : [];

  const carouselImages = useMemo(

    () => gallery.map((img, i) => ({ id: img.id || `g-${i}`, url: resolveImageUrl(img.url) })),

    [gallery]

  );



  const siblings = useMemo(() => otherRooms.filter((r) => r?.id && r.id !== room?.id), [otherRooms, room?.id]);

  const manySiblings = siblings.length > 3;

  const otherRoomsTrackRef = useRef(null);



  const scrollSiblings = (dir) => {

    const el = otherRoomsTrackRef.current;

    if (!el) return;

    const step = Math.min(el.clientWidth * 0.75, 300);

    el.scrollBy({ left: dir * step, behavior: "smooth" });

  };



  return (

    <section className="tour-listing-details section-space">

      <div className="tour-listing-details__destination wow fadeInUp" data-wow-duration="1500ms">

        <Container>

          <div className="tour-listing-details__destination__inner">

            <div className="tour-listing-details__destination__left">

              <h4 className="tour-listing-details__destination__title">{room.name}</h4>

              <div className="tour-listing-details__destination__revue">

                <div className="tour-listing-details__destination__posted">

                  <i className="icon-pin1"></i>

                  <p className="tour-listing-details__destination__posted-text">

                    {managerPreview ? (

                      <>

                        <span className="fw-semibold text-body">{hotel.name}</span>

                        {hotel.address ? ` · ${hotel.address}` : ""}

                      </>

                    ) : (

                      <>

                        <Link to={`/hotels/${hotelId}`}>{hotel.name}</Link>

                        {hotel.address ? ` · ${hotel.address}` : ""}

                      </>

                    )}

                  </p>

                </div>

              </div>

            </div>

          </div>

        </Container>

      </div>



      <div className="container-fluid px-3 px-lg-4 mb-4">

        {carouselImages.length > 0 ? (

          <RoomGalleryCarousel images={carouselImages} />

        ) : (

          <p className="text-muted px-2">No room photos yet.</p>

        )}

      </div>



      <Container>

        <Row className="gutter-y-30">

          <Col lg={8}>

            <div className="destination-details__content__item mb-4">

              <h3 className="destination-details__title">Overview</h3>

              <p className="destination-details__text">

                {room.overview || room.description || "Details for this room will appear here."}

              </p>

            </div>



            {highlights.length > 0 && (

              <div className="tour-listing-details__content__item tour-listing-details__list mb-4">

                <h4 className="tour-listing-details__title">Facilities</h4>

                <ul className="tour-listing-details__content__list">

                  {highlights.map((item, idx) => (

                    <li key={`${item}-${idx}`}>

                      <i className="icon-check-star"></i> {item}

                    </li>

                  ))}

                </ul>

              </div>

            )}



            {amenityTiles.length > 0 && (

              <div className="destination-details__content__item room-amenities-section">

                <h3 className="destination-details__title room-amenities-section__title">Room amenities</h3>

                <p className="destination-details__text text-muted room-amenities-section__subtitle">

                  Photos supplied for this room type.

                </p>

                <Row className="gutter-y-30 mt-2 justify-content-center">

                  {amenityTiles.map((a) => (

                    <Col md={6} lg={5} key={a.id}>

                      <div className="room-amenity-tile">

                        <div className="room-amenity-tile__media">

                          <img src={resolveImageUrl(a.url)} alt={a.label} onError={setImagePlaceholderOnError} />

                        </div>

                        <p className="small fw-semibold mt-2 mb-0">{a.label}</p>

                      </div>

                    </Col>

                  ))}

                </Row>

              </div>

            )}

          </Col>



          <Col lg={4}>

            <div className={`room-booking-details mb-3${managerPreview ? " room-booking-details--manager-preview" : ""}`}>

              <h3 className="room-booking-details__title">Booking details</h3>

              <ul className="room-booking-details__list">

                <li className="room-booking-details__row">

                  <span className="room-booking-details__check" aria-hidden />

                  <span className="room-booking-details__label">Room price / night</span>

                  <span className="room-booking-details__value room-booking-details__value--readonly">${formatRoomPrice(room.pricePerNight)}</span>

                </li>

                <li className="room-booking-details__row">

                  <span className="room-booking-details__check" aria-hidden />

                  <span className="room-booking-details__label">Capacity</span>

                  <span className="room-booking-details__value room-booking-details__value--readonly">{room.capacity} guests</span>

                </li>

                <li className="room-booking-details__row">

                  <span className="room-booking-details__check" aria-hidden />

                  <span className="room-booking-details__label">Per person</span>

                  <span className="room-booking-details__value room-booking-details__value--readonly">

                    {room.pricePerPerson != null ? `$${formatRoomPrice(room.pricePerPerson)}` : "—"}

                  </span>

                </li>

                <li className="room-booking-details__row">

                  <span className="room-booking-details__check" aria-hidden />

                  <span className="room-booking-details__label">Viewpoint</span>

                  <span className="room-booking-details__value room-booking-details__value--readonly">{room.viewpoint || "—"}</span>

                </li>

              </ul>

            </div>



            {showBookForm ? (

              <form id="room-booking-form" className="room-booking-details room-booking-details--book-form mb-3" onSubmit={onBookSubmit}>

                <h3 className="room-booking-details__title">Book this room</h3>

                <ul className="room-booking-details__list">

                  <li className="room-booking-details__row">

                    <span className="room-booking-details__check" aria-hidden />

                    <span className="room-booking-details__label">Room</span>

                    <span className="room-booking-details__value room-booking-details__value--readonly">{room.name}</span>

                  </li>

                  <li className="room-booking-details__row">

                    <span className="room-booking-details__check" aria-hidden />

                    <label className="room-booking-details__label" htmlFor="room-book-checkin">

                      Check-in

                    </label>

                    <input

                      id="room-book-checkin"

                      className="room-booking-details__control"

                      type="date"

                      value={checkIn}

                      onChange={(e) => setCheckIn(e.target.value)}

                    />

                  </li>

                  <li className="room-booking-details__row">

                    <span className="room-booking-details__check" aria-hidden />

                    <label className="room-booking-details__label" htmlFor="room-book-checkout">

                      Check-out

                    </label>

                    <input

                      id="room-book-checkout"

                      className="room-booking-details__control"

                      type="date"

                      value={checkOut}

                      onChange={(e) => setCheckOut(e.target.value)}

                    />

                  </li>

                  <li className="room-booking-details__row">

                    <span className="room-booking-details__check" aria-hidden />

                    <label className="room-booking-details__label" htmlFor="room-book-guests">

                      Guests

                    </label>

                    <input

                      id="room-book-guests"

                      className="room-booking-details__control"

                      type="number"

                      min={1}

                      max={room.capacity}

                      value={guests}

                      onChange={(e) => setGuests(Number(e.target.value))}

                    />

                  </li>

                  <li className="room-booking-details__row">

                    <span className="room-booking-details__check" aria-hidden />

                    <label className="room-booking-details__label" htmlFor="room-book-roomcount">

                      Rooms

                    </label>

                    <input

                      id="room-book-roomcount"

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

                    <span className="room-booking-details__value room-booking-details__value--readonly">${formatRoomPrice(totalPrice)}</span>

                  </li>

                </ul>

                <button type="submit" className="gotur-btn gotur-btn--base w-100 mt-2">

                  Book this room <i className="icon-right"></i>

                </button>

              </form>

            ) : null}

          </Col>

        </Row>

      </Container>



      {siblings.length > 0 ? (

        <div className="room-other-rooms">

          <Container>

            <h3 className="room-other-rooms__heading">More rooms at this hotel</h3>

            <p className="room-other-rooms__lede text-muted">Browse other room types at {hotel.name}.</p>

            {manySiblings ? (

              <div className="room-other-rooms__toolbar">

                <button type="button" className="room-other-rooms__arrow" aria-label="Show previous rooms" onClick={() => scrollSiblings(-1)}>

                  ←

                </button>

                <button type="button" className="room-other-rooms__arrow" aria-label="Show more rooms" onClick={() => scrollSiblings(1)}>

                  →

                </button>

              </div>

            ) : null}

            <div

              ref={otherRoomsTrackRef}

              className={manySiblings ? "room-other-rooms__track room-other-rooms__track--scroll" : "room-other-rooms__track room-other-rooms__track--few"}

            >

              {siblings.map((r) => {

                const thumb = roomCardThumb(r);

                return (

                  <Link key={r.id} to={`/hotels/${hotelId}/room/${r.id}`} className="room-other-rooms__card text-decoration-none">

                    <div className="room-other-rooms__card-media">

                      {thumb ? (

                        <img src={thumb} alt="" onError={setImagePlaceholderOnError} />

                      ) : (

                        <div className="room-other-rooms__card-placeholder" aria-hidden />

                      )}

                    </div>

                    <div className="room-other-rooms__card-body">

                      <div className="room-other-rooms__card-name">{r.name}</div>

                      <div className="room-other-rooms__card-meta">

                        ${formatRoomPrice(r.pricePerNight)}/night · {r.capacity} guests

                      </div>

                    </div>

                  </Link>

                );

              })}

            </div>

          </Container>

        </div>

      ) : null}

    </section>

  );

}

