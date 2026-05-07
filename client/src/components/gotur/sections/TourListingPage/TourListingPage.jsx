import React, { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { Gallery as PhotoSwipeGallery, Item } from "react-photoswipe-gallery";


import { tourListingPageData } from "../../../../data/tourListingPageData";
import CustomReactSelect from "../../common/CustomReactSelect/CustomReactSelect";
import TextAnimation from "../../common/AnimatedText/TextAnimation";
import VideoModal from "../../common/VideoModal/VideoModal";

const TourListingPage = () => {
  const {
    sectionTitle,
    sectionTagline,
    filterOptions,
    tours,
    images,
  } = tourListingPageData;

  const [isOpen, setOpen] = useState(false);
  const [videoId, setVideoId] = useState("");
  const [filterValues, setFilterValues] = useState({});

  const onFilterChange = (key, value) => {
    setFilterValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <>
      <section className="tour-listing-page section-space" id="popular">
        <PhotoSwipeGallery>
          <Container>
            {/* Section Title */}
            <div className="sec-title text-center">
              <h6 className="sec-title__tagline d">
                <TextAnimation text={sectionTagline} animationType="right" />
              </h6>
              <h3 className="sec-title__title d-md-flex justify-content-center">
                <TextAnimation text={sectionTitle} animationType="left" />
              </h3>
            </div>

            {/* Filter Form */}
            <div
              className="listing-from wow fadeInUp"
              data-wow-duration="1500ms"
              data-wow-delay="400ms"
            >
              <Form>
                <Row className="gutter-y-20 gutter-x-20">
                  {Object.keys(filterOptions).map((key, index) => {
                    const values = filterOptions[key];
                    const placeholder = values[0];

                    const options = values.slice(1).map((option) => ({
                      value: option.toLowerCase(),
                      label: option,
                    }));

                    return (
                      <Col lg={3} md={4} sm={6} key={index}>
                        <CustomReactSelect
                          options={options}
                          value={filterValues[key] || ""}
                          onChange={(val) => onFilterChange(key, val)}
                          placeholder={placeholder}
                        />
                      </Col>
                    );
                  })}

                  <Col lg={3} md={4} sm={6}>
                    <div className="listing-from__control">
                      <button className="gotur-btn" type="button">
                        Search Now
                      </button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </div>

            {/* Tour Cards */}
            <Row className="gutter-y-40">
              {tours.map((tour, index) => (
                <Col lg={4} md={6} key={index}>
                  <div
                    className="listing-card-two wow fadeInUp"
                    data-wow-duration="1500ms"
                    data-wow-delay={`${100 * (index + 1)}ms`}
                  >
                    <div className="listing-card-two__image">
                      <img src={tour.image} alt={tour.title} />

                      <Link
                        to="/tour-listing-details-2"
                        className="listing-card-two__overlay"
                      />

                      {tour.discount && (
                        <div className="listing-card-two__btn-group">
                          <div className="listing-card-two__discount">
                            {tour.discount}
                          </div>
                        </div>
                      )}

                      <div className="listing-card-two__btns">
                        <div className="listing-card-two__btns__hover">
                          <Item
                            original={tour.image}
                            thumbnail={tour.image}
                            width="370"
                            height="220"
                          >
                            {({ ref, open }) => (
                              <a
                                href="#"
                                ref={ref}
                                className="listing-card-two__popup card__popup"
                                onClick={(e) => {
                                  e.preventDefault();
                                  open(e);
                                }}
                              >
                                <span className="icon-image"></span>
                              </a>
                            )}
                          </Item>

                          <a
                            href="#"
                            className="video-popup"
                            onClick={(e) => {
                              e.preventDefault();
                              setOpen(true);
                              setVideoId(tour.videoId);
                            }}
                          >
                            <span className="icon-video"></span>
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="listing-card-two__content">
                      <div className="listing-card-two__rating">
                        <span>(10 Review)</span>
                        <i className="icon-star"></i>
                        <i className="icon-star"></i>
                        <i className="icon-star"></i>
                        <i className="icon-star"></i>
                        <i className="icon-star"></i>
                      </div>

                      <h3 className="listing-card-two__title">
                        <Link to="/tour-listing-details-2">
                          {tour.title}
                        </Link>
                      </h3>

                      <div className="listing-card-two__content__inner">
                        <ul className="listing-card-two__meta list-unstyled">
                          <li>
                            <Link to="/tour-listing-details-2">
                              <span className="listing-card-two__meta__icon">
                                <i className="icon-pin"></i>
                              </span>
                              {tour.location}
                            </Link>
                          </li>
                          <li>
                            <Link to="/tour-listing-details-2">
                              <span className="listing-card-two__meta__icon">
                                <i className="icon-calendar"></i>
                              </span>
                              {tour.duration}
                            </Link>
                          </li>
                        </ul>

                        <div className="listing-card-two__price">
                          <h5 className="listing-card-two__price__number">
                            {tour.price}
                            <span>/Per day</span>
                          </h5>
                          <i className="far fa-heart"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </PhotoSwipeGallery>

        {/* Decorative Images */}
        <div className="tour-listing-page__element">
          <img src={images.corkiImage} alt="corki" />
        </div>
        <div className="tour-listing-page__element-two">
          <img src={images.listImage} alt="list" />
        </div>
      </section>

      <VideoModal id={videoId} isOpen={isOpen} setOpen={setOpen} />
    </>
  );
};

export default TourListingPage;
