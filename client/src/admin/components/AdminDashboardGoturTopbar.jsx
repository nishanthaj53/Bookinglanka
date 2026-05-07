import { Container } from "react-bootstrap";

/** Matches Gotur home-rtl `TopbarOne` + `top-one--two` (dark inner bar on gray band). */
export default function AdminDashboardGoturTopbar({ pageTitle }) {
  return (
    <div className="top-one top-one--two admin-dashboard-gotur-topbar">
      <Container fluid className="px-2 px-lg-3">
        <div className="top-one__inner d-flex flex-wrap align-items-center justify-content-between gap-2 py-2">
          <ul className="list-unstyled top-one__info mb-0 d-flex flex-wrap align-items-center gap-3">
            <li className="top-one__info__item special mb-0">
              <span className="admin-gotur-topbar__pulse" aria-hidden="true" />
              <span className="text-white fw-semibold">Admin panel</span>
            </li>
            <li className="top-one__info__item mb-0 text-white-50 small">{pageTitle}</li>
          </ul>
          <div className="top-one__right d-flex align-items-center gap-3">
            <span className="text-white small opacity-75">RTL · Booking Lanka</span>
          </div>
        </div>
      </Container>
    </div>
  );
}
