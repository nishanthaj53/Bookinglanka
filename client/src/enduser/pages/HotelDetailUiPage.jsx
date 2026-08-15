import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import Slider from "react-slick";
import { Accordion, Col, Container } from "react-bootstrap";

import "react-datepicker/dist/react-datepicker.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import TopbarOne from "../../components/gotur/common/TopbarOne/TopbarOne";
import HeaderTwo from "../../components/gotur/layout/HeaderTwo/HeaderTwo";
import HeaderTwoCloned from "../../components/gotur/layout/HeaderTwoCloned/HeaderTwoCloned";
import FooterOne from "../../components/gotur/layout/FooterOne/FooterOne";
import Layout from "../../components/gotur/layout/Layout/Layout";
import PageHeader from "../../components/gotur/sections/PageHeader/PageHeader";
import { feedbackWarning, useFeedback } from "../../context/FeedbackContext";
import { SITE_CONTACT } from "../../data/siteContact";

// Optional imports if you already have these components
// import VideoModal from "../../components/common/VideoModal/VideoModal";
// import FullWidthCalendar from "../../components/gotur/common/Calendar/Calendar";

export default function HoteldetailUiPage() {
  const { showFeedback } = useFeedback();
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
  const [isOpen, setOpen] = useState(false);
  const [videoId, setVideoId] = useState("");

  const {
    hotelName,
    title,
    overview,
    overviewTitle,
    reviews,
    location,
    propertyType,
    checkInTime,
    checkOutTime,
    price,
    sliderImages,
    highlights,
    amenities,
    roomAmenities,
    galleryImages,
    faqs,
    roomTypes,
    comments,
  } = hotelDetailsData;

  useEffect(() => {
    document.title = hotelName || "Hotel Details | Booking Lanka";

    const metaDesc = document.querySelector("meta[name='description']");
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        overview ||
          "Discover hotel details, room types, prices, amenities, location, and gallery on Booking Lanka."
      );
    }
  }, [hotelName, overview]);

  const sliderSettings = {
    className: "center",
    centerMode: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    infinite: false,
    arrows: false,
    dots: false,
    autoplay: false,
    centerPadding: "230px",
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerPadding: "180px",
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          centerPadding: "80px",
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: "40px",
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerPadding: "20px",
        },
      },
    ],
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();

    if (!checkInDate || !checkOutDate) {
      feedbackWarning(showFeedback, "Please select both check-in and check-out dates.");
      return;
    }

    const bookingData = {
      checkInDate,
      checkOutDate,
      guestCount,
      roomCount,
    };

    console.log("Booking Submitted:", bookingData);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const reviewData = {};

    formData.forEach((value, key) => {
      reviewData[key] = value.toString();
    });

    console.log("Review Submitted:", reviewData);
  };

  return (
    <Layout>
      <TopbarOne />
      <HeaderTwo />
      <HeaderTwoCloned />
      <PageHeader title={hotelName || "Hotel Details"} />

      <>
        {/* Hotel Image Carousel */}
        <div
          className="tour-one section-space-top wow fadeInUp animated"
          data-wow-duration="1500ms"
          data-wow-delay="500ms"
        >
          <div className="tour-one__carousel tour-two__carousel gotur-owl__carousel owl-carousel owl-theme owl-loaded owl-drag">
            <Slider {...sliderSettings}>
              {sliderImages?.map((img, idx) => (
                <div key={idx}>
                  <div className="item">
                    <div className="tour-one__item">
                      <img
                        src={img}
                        alt={`Hotel Slide ${idx + 1}`}
                        style={{ width: "100%", borderRadius: "10px" }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>

        <section className="tour-listing-details section-space-bottom">
          {/* Hotel Header Section */}
          <div
            className="tour-listing-details__destination wow fadeInUp animated"
            data-wow-duration="1500ms"
            data-wow-delay="500ms"
          >
            <Container>
              <div className="tour-listing-details__destination__inner">
                <div className="tour-listing-details__destination__left">
                  <h4 className="tour-listing-details__destination__title">
                    {hotelName || title}
                  </h4>
                  <div className="tour-listing-details__destination__revue">
                    <div className="tour-listing-details__destination__ratings-box">
                      <span>({reviews} Reviews)</span>
                      {[...Array(5)].map((_, index) => (
                        <i key={index} className="icon-star"></i>
                      ))}
                    </div>
                    <div className="tour-listing-details__destination__posted">
                      <i className="icon-pin1"></i>
                      <p className="tour-listing-details__destination__posted-text">
                        {location}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="tour-listing-details__destination__right">
                  <button
                    type="button"
                    className="tour-listing-details__destination__btn gotur-btn"
                  >
                    Share <i className="icon-share"></i>
                  </button>

                  <div className="tour-listing-details__destination__social__list">
                    <a href="https://twitter.com" target="_blank" rel="noreferrer">
                      <i className="fab fa-twitter" aria-hidden="true"></i>
                    </a>
                    <a href={SITE_CONTACT.facebookUrl} target="_blank" rel="noreferrer">
                      <i className="fab fa-facebook" aria-hidden="true"></i>
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noreferrer">
                      <i className="fab fa-instagram" aria-hidden="true"></i>
                    </a>
                  </div>
                </div>
              </div>
            </Container>
          </div>

          {/* Quick Info */}
          <div
            className="tour-listing-details__info-area wow fadeInUp"
            data-wow-duration="1500ms"
            data-wow-delay="500ms"
          >
            <Container>
              <ul className="tour-listing-details__info-area__info list-unstyled">
                <li>
                  <div className="tour-listing-details__info-area__icon">
                    <i className="icon-location"></i>
                  </div>
                  <div className="tour-listing-details__info-area__content">
                    <h5 className="tour-listing-details__info-area__title">
                      Location
                    </h5>
                    <p className="tour-listing-details__info-area__text">{location}</p>
                  </div>
                </li>

                <li>
                  <div className="tour-listing-details__info-area__icon">
                    <i className="icon-travel-and-tourism"></i>
                  </div>
                  <div className="tour-listing-details__info-area__content">
                    <h5 className="tour-listing-details__info-area__title">
                      Property Type
                    </h5>
                    <p className="tour-listing-details__info-area__text">
                      {propertyType}
                    </p>
                  </div>
                </li>

                <li>
                  <div className="tour-listing-details__info-area__icon">
                    <i className="icon-clock"></i>
                  </div>
                  <div className="tour-listing-details__info-area__content">
                    <h5 className="tour-listing-details__info-area__title">
                      Check-In
                    </h5>
                    <p className="tour-listing-details__info-area__text">
                      {checkInTime}
                    </p>
                  </div>
                </li>

                <li>
                  <div className="tour-listing-details__info-area__icon">
                    <i className="icon-clock"></i>
                  </div>
                  <div className="tour-listing-details__info-area__content">
                    <h5 className="tour-listing-details__info-area__title">
                      Check-Out
                    </h5>
                    <p className="tour-listing-details__info-area__text">
                      {checkOutTime}
                    </p>
                  </div>
                </li>

                <li>
                  <span className="gotur-btn">
                    LKR {price} / night
                  </span>
                </li>
              </ul>
            </Container>
          </div>

          <Container>
            <div className="row gutter-y-30">
              {/* Left Content */}
              <div className="col-lg-8">
                <div className="tour-listing-details__content">
                  {/* Overview */}
                  <div
                    className="tour-listing-details__content__item tour-listing-details__content__text wow fadeInUp animated"
                    data-wow-duration="1500ms"
                    data-wow-delay="500ms"
                  >
                    <h4 className="tour-listing-details__title">
                      {overviewTitle || "Hotel Overview"}
                    </h4>
                    <p className="tour-listing-details__text">{overview}</p>
                  </div>

                  {/* Highlights */}
                  <div
                    className="tour-listing-details__content__item tour-listing-details__list wow fadeInUp"
                    data-wow-duration="1500ms"
                    data-wow-delay="500ms"
                  >
                    <h4 className="tour-listing-details__title">Highlights</h4>
                    <ul className="tour-listing-details__content__list">
                      {highlights?.map((item, index) => (
                        <li key={index}>
                          <i className="icon-check-star"></i> {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Amenities */}
                  <div
                    className="tour-listing-details__content__item tour-listing-details__amenities wow fadeInUp"
                    data-wow-duration="1500ms"
                    data-wow-delay="500ms"
                  >
                    <h4 className="tour-listing-details__title">Hotel Amenities</h4>
                    <div className="tour-listing-details__amenities__inner">
                      <ul className="tour-listing-details__amenities__list">
                        {amenities?.map((amenity, index) => (
                          <li key={index}>
                            <i className="fas fa-check"></i> {amenity}
                          </li>
                        ))}
                      </ul>

                      <ul className="tour-listing-details__amenities__list tour-listing-details__amenities__list--two">
                        {roomAmenities?.map((amenity, index) => (
                          <li key={index}>
                            <i className="fas fa-check"></i> {amenity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Gallery */}
                  <div
                    className="tour-listing-details__content__item tour-listing-details__thumb wow fadeInUp animated"
                    data-wow-duration="1500ms"
                    data-wow-delay="500ms"
                  >
                    <h4 className="tour-listing-details__title">Gallery</h4>
                    <div className="row gutter-y-30">
                      {galleryImages?.map((img, idx) => (
                        <div className="col-md-6" key={idx}>
                          <div className="destination-details__content__thumb__item">
                            <img
                              src={img}
                              alt={`Gallery ${idx + 1}`}
                              style={{ width: "100%", borderRadius: "10px" }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Room Types */}
                  <div className="tour-listing-details__content__item tour-listing-details__ture-list">
                    <h4 className="tour-listing-details__title">Room Types</h4>
                    <div className="row">
                      {roomTypes?.map((room, index) => (
                        <Col lg={6} md={6} key={index}>
                          <div
                            className="listing-card-four wow fadeInUp"
                            data-wow-duration="1500ms"
                          >
                            <div className="listing-card-four__image">
                              <img
                                src={room.image}
                                alt={room.title}
                                style={{ width: "100%" }}
                              />
                            </div>

                            <div className="listing-card-four__content">
                              <div className="listing-card-four__rating">
                                <span>({room.reviews} Reviews)</span>
                                {[...Array(room.rating)].map((_, i) => (
                                  <i key={i} className="icon-star"></i>
                                ))}
                              </div>

                              <h3 className="listing-card-four__title">
                                {room.title}
                              </h3>

                              <p>{room.description}</p>

                              <ul className="listing-card-four__meta list-unstyled">
                                {room.meta?.map((meta) => (
                                  <li key={meta.id}>
                                    <span className="listing-card-four__meta__icon">
                                      <i className={meta.icon}></i>
                                    </span>
                                    {meta.title}
                                  </li>
                                ))}
                              </ul>

                              <div className="listing-card-four__content__btn">
                                <div className="listing-card-four__price">
                                  <span className="listing-card-four__price__sub">
                                    Per Night
                                  </span>
                                  <span className="listing-card-four__price__number">
                                    {room.price}
                                  </span>
                                </div>

                                <a href="#booking-form" className="listing-card-four__btn gotur-btn">
                                  Book Now
                                  <span className="icon">
                                    <i className="icon-right"></i>
                                  </span>
                                </a>
                              </div>
                            </div>
                          </div>
                        </Col>
                      ))}
                    </div>
                  </div>

                  {/* FAQ */}
                  <div className="tour-listing-details__content__item tour-listing-details__ture-plan">
                    <h4 className="tour-listing-details__title">
                      Frequently Asked Questions
                    </h4>
                    <div className="faq-page__accordion faq-accordion gotur-accordion">
                      <Accordion defaultActiveKey="0">
                        {faqs?.map((faq, idx) => (
                          <Accordion.Item eventKey={idx.toString()} key={idx}>
                            <Accordion.Header>
                              <div className="accordion-title">
                                <h4 className="accordion-title__text">
                                  {faq.question}
                                  <span className="accordion-title__icon"></span>
                                </h4>
                              </div>
                            </Accordion.Header>
                            <Accordion.Body>
                              <div className="accordion-content">
                                <div className="inner">
                                  <p className="inner__text">{faq.answer}</p>
                                </div>
                              </div>
                            </Accordion.Body>
                          </Accordion.Item>
                        ))}
                      </Accordion>
                    </div>
                  </div>

                  {/* Reviews */}
                  <div className="tour-listing-details__content__item tour-listing-details__reviews">
                    <h3 className="tour-listing-details__title wow fadeInUp animated">
                      {comments?.length || 0} Reviews
                    </h3>
                    <ul className="list-unstyled product-details__comment__list">
                      {comments?.map((comment, index) => (
                        <li
                          key={index}
                          className="product-details__comment__card wow fadeInUp animated"
                          data-wow-delay="100ms"
                          data-wow-duration="1500ms"
                        >
                          <div className="product-details__comment__card__image">
                            <img
                              src={comment.avatar}
                              alt={comment.name}
                              style={{ width: "70px", borderRadius: "50%" }}
                            />
                          </div>
                          <div className="product-details__comment__card__content">
                            <div className="product-details__comment__card__top">
                              <div className="product-details__comment__card__info">
                                <h3 className="product-details__comment__card__title">
                                  {comment.name}
                                </h3>
                                <p className="product-details__comment__card__date">
                                  {comment.date}
                                </p>
                              </div>
                              <div className="product-details__comment__card__star">
                                <span className="fa fa-star"></span>
                                <span className="fa fa-star"></span>
                                <span className="fa fa-star"></span>
                                <span className="fa fa-star"></span>
                                <span className="fa fa-star"></span>
                              </div>
                            </div>
                            <p className="product-details__comment__card__text">
                              {comment.text}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Add Review */}
                  <div className="tour-listing-details__content__item tour-listing-details__add-reviews">
                    <div className="contact-page__contact">
                      <h2 className="tour-listing-details__title wow fadeInUp animated">
                        Add a Review
                      </h2>

                      <form
                        className="comments-form__form contact-form-validated product-details__form__form form-one wow fadeInUp animated"
                        onSubmit={handleReviewSubmit}
                      >
                        <div className="form-one__group">
                          <div className="form-one__control">
                            <label htmlFor="name">Name</label>
                            <input
                              type="text"
                              name="name"
                              id="name"
                              placeholder="Your Name"
                            />
                          </div>

                          <div className="form-one__control">
                            <label htmlFor="email">Email</label>
                            <input
                              type="email"
                              name="email"
                              id="email"
                              placeholder="Your Email"
                            />
                          </div>

                          <div className="form-one__control form-one__control--full">
                            <label htmlFor="message">Review</label>
                            <textarea
                              name="message"
                              id="message"
                              placeholder="Write your review"
                            ></textarea>
                          </div>

                          <div className="form-one__control form-one__control--full">
                            <button
                              type="submit"
                              className="gotur-btn gotur-btn--base"
                            >
                              Submit Review <i className="icon-arrow-right"></i>
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar */}
              <div className="col-lg-4">
                <div className="tour-listing-details__sidebar">
                  {/* Booking Form */}
                  <div
                    id="booking-form"
                    className="tour-listing-details__sidebar__item tour-listing-details__sidebar__item-form wow fadeInUp animated"
                    data-wow-delay="0.4s"
                    data-wow-duration="1500ms"
                  >
                    <h4 className="tour-listing-details__sidebar__title">
                      Book This Hotel
                    </h4>

                    <div className="sidebar-two__form">
                      <form
                        className="sidebar-two__form__inner contact-form-validated"
                        onSubmit={handleBookingSubmit}
                      >
                        <div className="sidebar-two__form__control">
                          <label>Check-In:</label>
                          <DatePicker
                            selected={checkInDate}
                            onChange={(date) => setCheckInDate(date)}
                            placeholderText="Select check-in date"
                            className="form-control"
                          />
                          <i className="icon-calendar"></i>
                        </div>

                        <div className="sidebar-two__form__control">
                          <label>Check-Out:</label>
                          <DatePicker
                            selected={checkOutDate}
                            onChange={(date) => setCheckOutDate(date)}
                            placeholderText="Select check-out date"
                            className="form-control"
                          />
                          <i className="icon-calendar"></i>
                        </div>

                        <div className="sidebar-two__form__control">
                          <label>Guests:</label>
                          <input
                            type="number"
                            min="1"
                            value={guestCount}
                            onChange={(e) => setGuestCount(Number(e.target.value))}
                          />
                        </div>

                        <div className="sidebar-two__form__control">
                          <label>Rooms:</label>
                          <input
                            type="number"
                            min="1"
                            value={roomCount}
                            onChange={(e) => setRoomCount(Number(e.target.value))}
                          />
                        </div>

                        <div className="sidebar-two__form__total">
                          Starting From: <span>LKR {price}</span>
                        </div>

                        <button
                          type="submit"
                          className="gotur-btn gotur-btn--base"
                        >
                          Book Now <i className="icon-right"></i>
                        </button>
                      </form>
                    </div>
                  </div>

                  {/* Google Map */}
                  <div
                    className="tour-listing-details__sidebar__item tour-listing-details__sidebar__item-location wow fadeInUp animated"
                    data-wow-delay="0.4s"
                    data-wow-duration="1500ms"
                  >
                    <div className="tour-listing-details__sidebar__item-box">
                      <iframe
                        title="Google Map"
                        src={mapEmbedUrl}
                        allowFullScreen
                        className="w-100"
                        height="300"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Optional VideoModal if you already use it */}
        {/* <VideoModal isOpen={isOpen} setOpen={setOpen} id={videoId} /> */}
      </>

      <FooterOne />
    </Layout>
  );
}