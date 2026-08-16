import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";

import Layout from "../../components/gotur/layout/Layout/Layout";
import TopbarOne from "../../components/gotur/common/TopbarOne/TopbarOne";
import HeaderTwo from "../../components/gotur/layout/HeaderTwo/HeaderTwo";
import HeaderTwoCloned from "../../components/gotur/layout/HeaderTwoCloned/HeaderTwoCloned";
import FooterOne from "../../components/gotur/layout/FooterOne/FooterOne";
import PageHeader from "../../components/gotur/sections/PageHeader/PageHeader";
import { ARTICLES } from "../../data/articles";
import { setPageSeo } from "../../utils/setPageSeo";

export default function ArticlesPage() {
  useEffect(() => {
    setPageSeo(
      "Sri Lanka Travel Guides & Articles || Booking Lanka",
      "Read Booking Lanka travel guides: best places to visit in Sri Lanka, when to go, and Sri Lankan food — written to help you plan and book stays."
    );
  }, []);

  return (
    <Layout>
      <TopbarOne />
      <HeaderTwo />
      <HeaderTwoCloned />
      <PageHeader
        title="Travel guides"
        subTitle="Articles"
        extraClass="page-header--property"
        backgroundImage={ARTICLES[0]?.image}
      />
      <section className="blog-two section-space article-index">
        <Container>
          <div className="sec-title text-center" style={{ marginBottom: 36 }}>
            <h6 className="sec-title__tagline">Travel Tips & Guides</h6>
            <h3 className="sec-title__title">Stories that help you travel Sri Lanka well</h3>
            <p className="article-index__lead">
              These are Booking Lanka editorial guides — not hotel ads. Open one, read at your pace,
              then book a stay from the destination links inside.
            </p>
          </div>
          <Row className="gutter-y-30">
            {ARTICLES.map((article, index) => (
              <Col lg={4} md={6} key={article.slug}>
                <article
                  className="blog-card-two blog-card-two--one wow fadeInUp article-card"
                  data-wow-delay={`${100 * (index + 1)}ms`}
                >
                  <div className="blog-card-two__image">
                    <img src={article.image} alt={article.title} className="img-fluid" />
                    <div className="blog-card-two__date">
                      <span className="blog-card-two__date__day">{article.day}</span>
                      <span className="blog-card-two__date__month">{article.month}</span>
                    </div>
                    <Link to={`/articles/${article.slug}`} className="blog-card-two__image__link">
                      <span className="sr-only">{article.title}</span>
                    </Link>
                  </div>
                  <div className="blog-card-two__content">
                    <ul className="list-unstyled blog-card-two__meta">
                      <li>
                        <span className="blog-card-two__meta__icon">
                          <i className="icon-price-tag"></i>
                        </span>{" "}
                        {article.category}
                      </li>
                      <li>{article.readMinutes} min read</li>
                    </ul>
                    <h3 className="blog-card-two__title">
                      <Link to={`/articles/${article.slug}`}>{article.title}</Link>
                    </h3>
                    <p className="article-card__excerpt">{article.excerpt}</p>
                    <Link to={`/articles/${article.slug}`} className="blog-card-two__content__btn">
                      Read article <i className="icon-arrow-right"></i>
                    </Link>
                  </div>
                </article>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
      <FooterOne />
    </Layout>
  );
}
