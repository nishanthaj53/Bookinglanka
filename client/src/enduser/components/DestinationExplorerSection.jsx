import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

function resolveImage(url, apiBase) {
  if (!url) return "https://placehold.co/600x380?text=Destination";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  if (url.startsWith("/images/")) return url;
  const base = (apiBase || "").replace(/\/$/, "");
  return `${base}${url.startsWith("/") ? url : `/${url}`}`;
}

function destinationCardSrc(item, apiBase) {
  return resolveImage(item.cardImageUrl || item.coverImageUrl, apiBase);
}

export default function DestinationExplorerSection() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const [destinations, setDestinations] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/destinations`);
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) setDestinations(Array.isArray(data) ? data : []);
      } catch {
        if (mounted) setDestinations([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, [API_BASE]);

  const active = destinations[activeIdx] || null;
  const infoRows = useMemo(
    () => [
      { label: "Country", value: "Sri Lanka" },
      { label: "Region", value: active?.region || "-" },
      { label: "District", value: active?.district || "-" },
      { label: "Town", value: active?.town || "-" },
      { label: "Best for", value: active?.bestFor || "-" },
    ],
    [active]
  );

  return (
    <section className="destination-one section-space">
      <div className="container">
        <div className="row gutter-y-20 gutter-x-20">
          <div className="col-lg-4">
            <aside className="destination-details__sidebar">
              <div className="destination-details__sidebar__item destination-details__sidebar__item-list wow fadeInUp">
                <h4 className="destination-details__sidebar__title">Some Information</h4>
                <ul className="destination-details__sidebar__list">
                  {infoRows.map((item) => (
                    <li key={item.label}>
                      <p className="destination-details__sidebar__text">
                        <i className="icon-check-star"></i> {item.label}:
                      </p>
                      <span>{item.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {!!active?.mapEmbedUrl && (
                <div className="destination-details__sidebar__item destination-details__sidebar__item-map wow fadeInUp">
                  <iframe
                    title="Destination Map"
                    src={active.mapEmbedUrl}
                    allowFullScreen
                    className="w-100"
                    height="300"
                  />
                </div>
              )}
            </aside>
          </div>

          <div className="col-lg-8">
            {loading ? (
              <p>Loading destinations...</p>
            ) : (
              <div className="row gutter-y-20 gutter-x-20">
                {destinations.map((item, index) => (
                  <div className="col-md-6 col-sm-6" key={item.id}>
                    <div
                      className="destination-card-one wow fadeInUp"
                      onMouseEnter={() => setActiveIdx(index)}
                      onFocus={() => setActiveIdx(index)}
                    >
                      <div className="destination-card-one__thumb">
                        <img
                          src={destinationCardSrc(item, API_BASE)}
                          alt={item.name}
                          style={{
                            width: "100%",
                            aspectRatio: "1 / 1.38",
                            objectFit: "cover",
                            objectPosition: "center",
                            display: "block",
                          }}
                        />
                        <Link
                          to={`/destinations/${item.slug}`}
                          className="destination-card-one__overly"
                        ></Link>
                      </div>
                      <div className="destination-card-one__content">
                        <h3 className="destination-card-one__title">
                          <Link to={`/destinations/${item.slug}`}>{item.name}</Link>
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
