import { useEffect, useMemo, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import CustomReactSelect from "../../components/gotur/common/CustomReactSelect/CustomReactSelect";
import DualRangePriceSlider from "../components/dashboard/DualRangePriceSlider";
import UserDashboardHotelResults from "../components/dashboard/UserDashboardHotelResults";
import {
  DISTRICT_OPTIONS,
  FAVOURITE_OPTIONS,
  HOTEL_TYPE_OPTIONS,
} from "../constants/userDashboardHotelOptions";
import { useDebouncedHotelFetch } from "../hooks/useDebouncedHotelFetch";
import { PAGE_SIZE, PRICE_MAX, stableStarRating } from "../utils/userDashboardHotelUtils";
import "../../styles/user-dashboard-hotels.css";

const DEFAULT_GUESTS = 2;

export default function DashboardHotels() {
  const [page, setPage] = useState(1);

  const [district, setDistrict] = useState("");
  const [hotelType, setHotelType] = useState("");
  const [destination, setDestination] = useState("");

  const [sidebarMin, setSidebarMin] = useState(0);
  const [sidebarMax, setSidebarMax] = useState(PRICE_MAX);
  const [minStar, setMinStar] = useState(0);

  const lo = Math.min(sidebarMin, sidebarMax);
  const hi = Math.max(sidebarMin, sidebarMax);

  const fetchInputs = useMemo(
    () => ({
      city: district,
      keyword: destination,
      propertyType: hotelType,
      guests: DEFAULT_GUESTS,
      priceMin: lo,
      priceMax: hi,
      priceMaxCap: PRICE_MAX,
    }),
    [district, destination, hotelType, lo, hi]
  );

  const { allHotels, loading, error } = useDebouncedHotelFetch(fetchInputs, 280);

  const filtered = useMemo(() => {
    if (!minStar) return allHotels;
    return allHotels.filter((h) => stableStarRating(h.id) >= minStar);
  }, [allHotels, minStar]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const slice = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, safePage]);

  const pageNumbers = useMemo(() => {
    const total = totalPages;
    const cur = safePage;
    const nums = [];
    for (let n = 1; n <= total; n += 1) {
      if (n === 1 || n === total || Math.abs(n - cur) <= 1) {
        if (nums.length && n - nums[nums.length - 1] > 1) nums.push("ellipsis");
        nums.push(n);
      }
    }
    return nums;
  }, [totalPages, safePage]);

  useEffect(() => {
    setPage(1);
  }, [district, hotelType, destination, lo, hi, minStar]);

  const setStarFromCheckbox = (n) => {
    setMinStar((prev) => (prev === n ? 0 : n));
  };

  return (
    <div className="dashboard-page user-dash-hotels user-dash-hotels-page">
      <h1 className="dashboard-page__title" style={{ marginBottom: "1.25rem" }}>
        Find your stay
      </h1>

      <section className="tour-listing-page section-space" style={{ paddingTop: 0 }}>
        <Container>
          <Row className="gutter-y-24 align-items-start user-dash-hotels-layout">
            <Col lg={4} xl={3} className="order-2 order-lg-1">
              <aside
                className="user-dash-sidebar user-dash-hotels-sidebar-left"
                aria-label="Price, reviews, and AI booking help"
              >
                <h3 className="user-dash-sidebar__section-title" style={{ paddingTop: "1rem" }}>
                  Filter by price
                </h3>
                <DualRangePriceSlider
                  min={sidebarMin}
                  max={sidebarMax}
                  maxLimit={PRICE_MAX}
                  minGap={8}
                  onChange={({ min: a, max: b }) => {
                    setSidebarMin(a);
                    setSidebarMax(b);
                  }}
                />
                <h3 className="user-dash-sidebar__section-title">Reviews star</h3>
                <div className="user-dash-reviews">
                  {[5, 4, 3, 2, 1].map((n) => (
                    <label key={n} className="user-dash-reviews__item">
                      <input type="checkbox" checked={minStar === n} onChange={() => setStarFromCheckbox(n)} />
                      <span className="user-dash-reviews__stars">{"★".repeat(n) + "☆".repeat(5 - n)}</span>
                      <span>{n === 5 ? "5 only" : `${n} & up`}</span>
                    </label>
                  ))}
                </div>

                <div className="user-dash-hotels-agent-below-reviews">
                  <div
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 12,
                      padding: 12,
                      background: "#fff",
                    }}
                  >
                    <div style={{ fontSize: 28, marginBottom: 6 }}>🤖</div>
                    <h4 className="user-dash-agent__title" style={{ marginBottom: 6 }}>
                      AI Trip Planner
                    </h4>
                    <p className="user-dash-agent__text" style={{ marginBottom: 10 }}>
                      Need route and destination advice? Open planner and start.
                    </p>
                    <Link to="/dashboard/favourite-destination" className="gotur-btn">
                      Open Planner
                    </Link>
                  </div>
                </div>
              </aside>
            </Col>

            <Col lg={8} xl={9} className="order-1 order-lg-2">
              <div className="user-dash-hotels-main">
                <div className="listing-from user-dash-hotels-main-filters wow fadeInUp" data-wow-duration="1500ms">
                  <Row className="gutter-y-16 gutter-x-12 user-dash-hotels-filters-row">
                    <Col xs={12} md={4}>
                      <CustomReactSelect
                        options={[
                          { value: "", label: "All districts" },
                          ...DISTRICT_OPTIONS.filter((o) => o.value !== "").map((o) => ({ value: o.value, label: o.label })),
                        ]}
                        placeholder="District"
                        value={district}
                        onChange={(v) => setDistrict(v || "")}
                      />
                    </Col>
                    <Col xs={12} md={4}>
                      <CustomReactSelect
                        options={[
                          { value: "", label: "Hotel type" },
                          ...HOTEL_TYPE_OPTIONS.filter((o) => o.value !== "").map((o) => ({ value: o.value, label: o.label })),
                        ]}
                        placeholder="Hotel type"
                        value={hotelType}
                        onChange={(v) => setHotelType(v || "")}
                      />
                    </Col>
                    <Col xs={12} md={4}>
                      <CustomReactSelect
                        options={[
                          { value: "", label: "Favourite destination" },
                          ...FAVOURITE_OPTIONS.filter((o) => o.value !== "").map((o) => ({ value: o.value, label: o.label })),
                        ]}
                        placeholder="Favourite destination"
                        value={destination}
                        onChange={(v) => setDestination(v || "")}
                      />
                    </Col>
                  </Row>
                </div>

                <UserDashboardHotelResults
                  loading={loading}
                  error={error}
                  slice={slice}
                  filteredLength={filtered.length}
                  safePage={safePage}
                  setPage={setPage}
                  totalPages={totalPages}
                  pageNumbers={pageNumbers}
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}
