import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Layout from "../../components/gotur/layout/Layout/Layout";
import TopbarOne from "../../components/gotur/common/TopbarOne/TopbarOne";
import HeaderTwo from "../../components/gotur/layout/HeaderTwo/HeaderTwo";
import HeaderTwoCloned from "../../components/gotur/layout/HeaderTwoCloned/HeaderTwoCloned";
import FooterOne from "../../components/gotur/layout/FooterOne/FooterOne";
import PageHeader from "../../components/gotur/sections/PageHeader/PageHeader";
import PropertyListingSection from "../../components/gotur/sections/TourListingPage/PropertyListingSection";
import {
  PROPERTY_LISTINGS,
  PROPERTY_TYPE_BANNERS,
  filterProperties,
} from "../../data/propertyListings";

export default function PropertyPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    type: searchParams.get("type") || "",
    city: searchParams.get("city") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    q: searchParams.get("q") || "",
  });
  const [applied, setApplied] = useState(filters);

  useEffect(() => {
    document.title = "Property for sale || Booking Lanka";
  }, []);

  useEffect(() => {
    const next = {
      type: searchParams.get("type") || "",
      city: searchParams.get("city") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      q: searchParams.get("q") || "",
    };
    setFilters(next);
    setApplied(next);
  }, [searchParams]);

  const cities = useMemo(
    () => [...new Set(PROPERTY_LISTINGS.map((p) => p.city))].sort(),
    []
  );

  const listings = useMemo(() => filterProperties(applied), [applied]);
  const bannerImage =
    PROPERTY_TYPE_BANNERS[applied.type] || PROPERTY_TYPE_BANNERS[""];

  const syncUrl = (next) => {
    const params = new URLSearchParams();
    Object.entries(next).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params, { replace: true });
  };

  const onFilterChange = (key, value) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    if (key === "type" || key === "city") {
      setApplied(next);
      syncUrl(next);
    }
  };

  const onSearch = () => {
    setApplied(filters);
    syncUrl(filters);
  };

  return (
    <Layout>
      <TopbarOne />
      <HeaderTwo />
      <HeaderTwoCloned />
      <PageHeader
        title="Property for sale"
        subTitle="Property"
        backgroundImage={bannerImage}
        extraClass="page-header--property"
      />
      <PropertyListingSection
        listings={listings}
        filters={filters}
        cities={cities}
        onFilterChange={onFilterChange}
        onSearch={onSearch}
      />
      <FooterOne />
    </Layout>
  );
}
