import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Accordion, Col, Container, Row } from "react-bootstrap";

import Layout from "../../components/gotur/layout/Layout/Layout";
import TopbarOne from "../../components/gotur/common/TopbarOne/TopbarOne";
import HeaderTwo from "../../components/gotur/layout/HeaderTwo/HeaderTwo";
import HeaderTwoCloned from "../../components/gotur/layout/HeaderTwoCloned/HeaderTwoCloned";
import FooterOne from "../../components/gotur/layout/FooterOne/FooterOne";
import { getArticleBySlug, getRelatedArticles } from "../../data/articles";
import { setPageSeo } from "../../utils/setPageSeo";

export default function ArticleDetailsPage() {
  const { slug = "" } = useParams();
  const article = getArticleBySlug(slug);
  const related = getRelatedArticles(slug);

  useEffect(() => {
    if (!article) return;
    setPageSeo(article.seoTitle, article.metaDescription);
  }, [article]);

  if (!article) {
    return <Navigate to="/articles" replace />;
  }

  return (
    <Layout>
      <TopbarOne />
      <HeaderTwo />
      <HeaderTwoCloned />

      <article className="article-story">
        <header
          className="article-story__hero"
          style={{ backgroundImage: `url(${article.image})` }}
        >
          <div className="article-story__hero-shade" />
          <Container className="article-story__hero-inner">
            <p className="article-story__crumbs">
              <Link to="/">Home</Link>
              <span> / </span>
              <Link to="/articles">Guides</Link>
              <span> / </span>
              <span>{article.category}</span>
            </p>
            <span className="article-story__kicker">{article.category}</span>
            <h1 className="article-story__title">{article.title}</h1>
            <p className="article-story__excerpt">{article.excerpt}</p>
            <ul className="article-story__meta">
              <li>By {article.author}</li>
              <li>{article.dateLabel}</li>
              <li>{article.readMinutes} min read</li>
            </ul>
          </Container>
        </header>

        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              <div className="article-story__body">
                {article.intro?.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}

                {article.pullQuote ? (
                  <blockquote className="article-story__quote">{article.pullQuote}</blockquote>
                ) : null}

                {article.destinations?.length ? (
                  <div className="article-story__places">
                    <h2>Five places worth the journey</h2>
                    <ol className="article-story__place-list">
                      {article.destinations.map((place, i) => (
                        <li key={place.href}>
                          <span className="article-story__place-num">{String(i + 1).padStart(2, "0")}</span>
                          <div>
                            <h3>
                              <Link to={place.href}>{place.name}</Link>
                            </h3>
                            <p>{place.blurb}</p>
                            <Link to={place.href} className="article-story__inline-link">
                              Open destination guide
                            </Link>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </div>
                ) : null}

                {article.sections?.map((section) => (
                  <section key={section.heading} className="article-story__section">
                    <h2>{section.heading}</h2>
                    {section.paragraphs.map((p) => (
                      <p key={p.slice(0, 48)}>{p}</p>
                    ))}
                  </section>
                ))}

                {article.tips?.length ? (
                  <aside className="article-story__tips">
                    <h2>Booking Lanka tips</h2>
                    <ul>
                      {article.tips.map((tip) => (
                        <li key={tip}>{tip}</li>
                      ))}
                    </ul>
                  </aside>
                ) : null}

                {article.faqs?.length ? (
                  <div className="article-story__faqs">
                    <h2>Quick answers</h2>
                    <Accordion defaultActiveKey="0" flush>
                      {article.faqs.map((faq, i) => (
                        <Accordion.Item eventKey={String(i)} key={faq.q}>
                          <Accordion.Header>{faq.q}</Accordion.Header>
                          <Accordion.Body>{faq.a}</Accordion.Body>
                        </Accordion.Item>
                      ))}
                    </Accordion>
                  </div>
                ) : null}

                <div className="article-story__cta">
                  <h2>Ready to stay?</h2>
                  <p>
                    Browse hotels across Sri Lanka, or jump into a destination and pick a room that
                    matches this itinerary.
                  </p>
                  <div className="article-story__cta-row">
                    <Link to="/" className="gotur-btn">
                      Find hotels
                    </Link>
                    <Link to="/destinations" className="gotur-btn gotur-btn--base">
                      Explore destinations
                    </Link>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {related.length ? (
            <div className="article-story__related">
              <h2>Keep reading</h2>
              <Row className="gutter-y-30">
                {related.map((item) => (
                  <Col md={6} key={item.slug}>
                    <Link to={`/articles/${item.slug}`} className="article-story__related-card">
                      <img src={item.image} alt="" />
                      <div>
                        <span>{item.category}</span>
                        <strong>{item.title}</strong>
                      </div>
                    </Link>
                  </Col>
                ))}
              </Row>
            </div>
          ) : null}
        </Container>
      </article>

      <FooterOne />
    </Layout>
  );
}
