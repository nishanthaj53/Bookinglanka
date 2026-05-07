import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

import { blogTwoInfo } from "../../../../data/blogTwoTwoData";

import TextAnimation from "../../common/AnimatedText/TextAnimation";

const BlogTwoTwo = () => {
  const { tagline, title, link, linkLabel, shape, blogData } = blogTwoInfo;

  return (
    <section className="blog-two section-space-bottom" id="blog">
      <Container>
        <div className="blog-two__top">
          <Row className="align-items-end gutter-y-20">
            <Col lg={8}>
              <div className="sec-title">
                <h6 className="sec-title__tagline bw-split-in-right">
                  <TextAnimation text={tagline} animationType="right" />
                </h6>
                <h3 className="sec-title__title bw-split-in-left">
                  <TextAnimation text={title} animationType="left" />
                </h3>
              </div>
            </Col>

            <Col lg={4}>
              <div className="blog-two__top__btn">
                <Link to={link} className="gotur-btn gotur-btn--base">
                  {linkLabel}
                  <span className="icon">
                    <i className="icon-right"></i>
                  </span>
                </Link>
              </div>
            </Col>
          </Row>
        </div>

        <Row className="gutter-y-30">
          {blogData.map((post, index) => (
            <Col lg={4} md={6} key={index}>
              <div
                className="blog-card-two blog-card-two--one wow fadeInUp"
                data-wow-duration="1500ms"
                data-wow-delay={`${100 * (index + 1)}ms`}
              >
                <div className="blog-card-two__image">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="img-fluid"
                  />

                  <div className="blog-card-two__date">
                    <span className="blog-card-two__date__day">
                      {post.day}
                    </span>
                    <span className="blog-card-two__date__month">
                      {post.month}
                    </span>
                  </div>

                  <Link
                    to={post.link}
                    className="blog-card-two__image__link"
                  >
                    <span className="sr-only">{post.title}</span>
                  </Link>
                </div>

                <div className="blog-card-two__content">
                  <ul className="list-unstyled blog-card-two__meta">
                    <li>
                      <Link to={post.link}>
                        <span className="blog-card-two__meta__icon">
                          <i className="icon-user"></i>
                        </span>{" "}
                        By {post.author}
                      </Link>
                    </li>
                    <li>
                      <Link to={post.link}>
                        <span className="blog-card-two__meta__icon">
                          <i className="icon-price-tag"></i>
                        </span>{" "}
                        {post.category}
                      </Link>
                    </li>
                  </ul>

                  <h3 className="blog-card-two__title">
                    <Link to={post.link}>{post.title}</Link>
                  </h3>

                  <Link
                    to={post.link}
                    className="blog-card-two__content__btn"
                  >
                    Read More <i className="icon-arrow-right"></i>
                  </Link>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>

      <div className="blog-two__element">
        <img src={shape} alt="" />
      </div>
    </section>
  );
};

export default BlogTwoTwo;
