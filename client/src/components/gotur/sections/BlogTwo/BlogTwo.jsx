import React from "react";
import { Link } from "react-router-dom";
import blogTwoData from "../../../../data/blogTwoData";

const BlogTwo = () => {
  const {
    sectionTagline,
    sectionTitle,
    buttonText,
    buttonLink,
    mainBlog,
    blogs,
  } = blogTwoData;

  return (
    <section className="blog-two section-space" id="blog">
      <div className="container">
        <div className="blog-two__top">
          <div className="row align-items-end">
            <div className="col-lg-8">
              <div className="sec-title">
                <h6 className="sec-title__tagline bw-split-in-right">
                  {sectionTagline}
                </h6>
                <h3
                  className="sec-title__title bw-split-in-left"
                  dangerouslySetInnerHTML={{ __html: sectionTitle }}
                />
              </div>
            </div>

            <div className="col-lg-4">
              <div className="blog-two__top__btn text-lg-end">
                <Link to={buttonLink} className="gotur-btn gotur-btn--base">
                  {buttonText}
                  <span className="icon">
                    <i className="icon-right"></i>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="row gutter-y-30">
          {/* Main Left Blog */}
          <div className="col-lg-6">
            <div
              className="blog-two__left wow fadeInLeft"
              data-wow-duration="1500ms"
              data-wow-delay="300ms"
            >
              <div className="blog-two-card">
                <div className="blog-two-card__image position-relative">
                  <img
                    src={mainBlog.image}
                    alt={mainBlog.title}
                    className="img-fluid"
                  />

                  <Link
                    to={mainBlog.link}
                    className="blog-two-card__image__link"
                  />

                  <div className="blog-two-card__date">
                    <span>{mainBlog.date.day}</span> {mainBlog.date.month}
                  </div>
                </div>

                <div className="blog-two-card__content">
                  <ul className="list-unstyled blog-two-card__meta">
                    <li>
                      <Link to="/blog-list">
                        <i className="icon-user"></i> By {mainBlog.author}
                      </Link>
                    </li>
                    <li>
                      <Link to={mainBlog.link}>
                        <i className="icon-price-tag"></i>{" "}
                        {mainBlog.category}
                      </Link>
                    </li>
                  </ul>

                  <h3 className="blog-two-card__title">
                    <Link to={mainBlog.link}>{mainBlog.title}</Link>
                  </h3>

                  <div className="blog-two-card__link">
                    <Link
                      to={mainBlog.link}
                      className="blog-two-card__btn"
                    >
                      Read More <i className="icon-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Blog List */}
          <div className="col-lg-6">
            <div className="blog-two-card__list">
              {blogs.map((post, idx) => (
                <div
                  key={idx}
                  className="blog-two-card wow fadeInUp"
                  data-wow-duration="1500ms"
                  data-wow-delay="300ms"
                >
                  <div className="blog-two-card__image position-relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="img-fluid"
                    />

                    <Link
                      to={post.link}
                      className="blog-two-card__image__link"
                    />

                    <div className="blog-two-card__date">
                      <span>{post.date.day}</span> {post.date.month}
                    </div>
                  </div>

                  <div className="blog-two-card__content">
                    <ul className="list-unstyled blog-two-card__meta">
                      <li>
                        <Link to="/blog-list">
                          <i className="icon-user"></i> By {post.author}
                        </Link>
                      </li>
                      <li>
                        <Link to={post.link}>
                          <i className="icon-price-tag"></i>{" "}
                          {post.category}
                        </Link>
                      </li>
                    </ul>

                    <h3 className="blog-two-card__title">
                      <Link to={post.link}>{post.title}</Link>
                    </h3>

                    <div className="blog-two-card__link">
                      <Link
                        to={post.link}
                        className="blog-two-card__btn"
                      >
                        Read More <i className="icon-arrow-right"></i>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogTwo;
