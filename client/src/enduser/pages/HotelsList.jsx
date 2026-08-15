import { useEffect, useState } from "react";

/* ===== GOTUR BASE LAYOUT (HOME-2) ===== */
import Layout from "../../components/gotur/layout/Layout/Layout";
import TopbarOne from "../../components/gotur/common/TopbarOne/TopbarOne";
import HeaderTwo from "../../components/gotur/layout/HeaderTwo/HeaderTwo";
import HeaderTwoCloned from "../../components/gotur/layout/HeaderTwoCloned/HeaderTwoCloned";
import FooterOne from "../../components/gotur/layout/FooterOne/FooterOne";
import MainSliderThree from "../../components/gotur/sections/MainSliderThree/MainSliderThree";
import HotelListingSection from "../../components/gotur/sections/TourListingPage/HotelListingSection";
import PopularDestinations from "../../components/gotur/sections/PopularDestination/PopularDestination";
import BlogTwoTwo from "../../components/gotur/sections/BlogTwoTwo/BlogTwoTwo"; 
import AboutOne from "../../components/gotur/sections/AboutOne/AboutOne";



export default function HotelsList() {
  const [hotels, setHotels] = useState([]);
  const [filters, setFilters] = useState({
    city: "",
    minPrice: "",
    maxPrice: "",
    capacity: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (filters.city) query.append("city", filters.city);
      if (filters.minPrice) query.append("minPrice", filters.minPrice);
      if (filters.maxPrice) query.append("maxPrice", filters.maxPrice);
      if (filters.capacity) query.append("capacity", filters.capacity);

      const res = await fetch(`${API_BASE}/hotels?${query.toString()}`);
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const data = await res.json();
      setHotels(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Booking Lanka";
    fetchHotels();
  }, []);

  useEffect(() => {
    if (window.location.hash !== "#properties") return;
    const timer = setTimeout(() => {
      document.getElementById("properties")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 200);
    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <Layout>
      {/* ===== HOME-2 HEADER STACK ===== */}
      <TopbarOne />
      <HeaderTwo />
      <HeaderTwoCloned />
      {<MainSliderThree /> }
      <PopularDestinations />

      <HotelListingSection
        hotels={hotels}
        loading={loading}
        error={error}
        filters={filters}
        onFilterChange={(key, value) =>
          setFilters((prev) => ({ ...prev, [key]: value }))
        }
        onSearch={fetchHotels}
        apiBase={API_BASE}
      />

      <AboutOne />
      <BlogTwoTwo />

      {/* ===== FOOTER ===== */}
      <FooterOne /> 
    </Layout>
  );
}
