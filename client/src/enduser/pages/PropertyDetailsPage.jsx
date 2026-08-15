import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";

import Layout from "../../components/gotur/layout/Layout/Layout";
import TopbarOne from "../../components/gotur/common/TopbarOne/TopbarOne";
import HeaderTwo from "../../components/gotur/layout/HeaderTwo/HeaderTwo";
import HeaderTwoCloned from "../../components/gotur/layout/HeaderTwoCloned/HeaderTwoCloned";
import FooterOne from "../../components/gotur/layout/FooterOne/FooterOne";
import PageHeader from "../../components/gotur/sections/PageHeader/PageHeader";
import { SITE_CONTACT } from "../../data/siteContact";
import {
  PROPERTY_TYPES,
  formatPropertyPrice,
  getPropertyById,
} from "../../data/propertyListings";

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const item = useMemo(() => getPropertyById(id), [id]);
  const typeLabel = PROPERTY_TYPES.find((t) => t.value === item?.type)?.label || "Property";

  useEffect(() => {
    document.title = item ? `${item.name} || Booking Lanka` : "Property || Booking Lanka";
  }, [item]);

  const waHref = item
    ? `${SITE_CONTACT.whatsappUrl}?text=${encodeURIComponent(
        `Hello, I am interested in ${item.name} (${typeLabel}) listed on Booking Lanka.`
      )}`
    : SITE_CONTACT.whatsappUrl;

  return (
    <Layout>
      <TopbarOne />
      <HeaderTwo />
      <HeaderTwoCloned />
      <PageHeader title={item?.name || "Property"} subTitle="Property" />
      <section className="destination-details section-space">
        <Container>
          {!item && (
            <p>
              This listing was not found. <Link to="/property">Back to property for sale</Link>
            </p>
          )}
          {item && (
            <Row className="gutter-y-30">
              <Col lg={8}>
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "100%",
                    maxHeight: 420,
                    objectFit: "cover",
                    borderRadius: 12,
                  }}
                />
                <h3 className="destination-details__title" style={{ marginTop: 28 }}>
                  About this {typeLabel.toLowerCase()}
                </h3>
                <p className="destination-details__text">{item.description}</p>
              </Col>
              <Col lg={4}>
                <aside className="destination-details__sidebar">
                  <div className="destination-details__sidebar__item destination-details__sidebar__item-list">
                    <h4 className="destination-details__sidebar__title">Sale details</h4>
                    <ul className="destination-details__sidebar__list">
                      <li>
                        <p className="destination-details__sidebar__text">Type</p>
                        <span>{typeLabel}</span>
                      </li>
                      <li>
                        <p className="destination-details__sidebar__text">City</p>
                        <span>{item.city}</span>
                      </li>
                      <li>
                        <p className="destination-details__sidebar__text">Size</p>
                        <span>{item.size}</span>
                      </li>
                      <li>
                        <p className="destination-details__sidebar__text">Asking</p>
                        <span>{formatPropertyPrice(item.price)}</span>
                      </li>
                    </ul>
                    <p className="destination-details__text" style={{ marginTop: 16 }}>
                      {item.address}
                    </p>
                    <a
                      className="gotur-btn"
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginTop: 16, display: "inline-flex" }}
                    >
                      Enquire on WhatsApp
                    </a>
                    <div style={{ marginTop: 12 }}>
                      <Link to={`/property?type=${item.type}`}>More {typeLabel.toLowerCase()}</Link>
                    </div>
                  </div>
                </aside>
              </Col>
            </Row>
          )}
        </Container>
      </section>
      <FooterOne />
    </Layout>
  );
}
