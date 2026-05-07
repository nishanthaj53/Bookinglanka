import { MapContainer, Marker, Polyline, Popup, TileLayer, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function iconForStop(stop, index) {
  const isAirport = stop.type === "airport";
  const label = isAirport ? "✈" : String(index);
  const bg = isAirport ? "#0ea5e9" : "#16a34a";
  return L.divIcon({
    className: "trip-route-marker",
    html: `<div style="
      width:30px;height:30px;border-radius:999px;background:${bg};color:#fff;
      border:2px solid #fff;display:flex;align-items:center;justify-content:center;
      font-size:13px;font-weight:700;box-shadow:0 1px 6px rgba(0,0,0,.25);
    ">${label}</div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

export default function TripRouteMap({ mapData }) {
  const stops = Array.isArray(mapData?.stops)
    ? mapData.stops.filter((s) => Number.isFinite(s.lat) && Number.isFinite(s.lon))
    : [];
  if (stops.length < 2) return null;

  const center = [stops[0].lat, stops[0].lon];
  const route = stops.map((s) => [s.lat, s.lon]);

  return (
    <div style={{ border: "1px solid #ececec", borderRadius: 10, overflow: "hidden", marginTop: 12 }}>
      <div style={{ padding: "10px 12px", borderBottom: "1px solid #ececec", fontWeight: 700 }}>
        Trip Route Map (Airport to Day Plan to Airport)
      </div>
      <MapContainer
        center={center}
        zoom={7}
        style={{ width: "100%", height: 340 }}
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={route} pathOptions={{ color: "#2563eb", weight: 4, opacity: 0.8 }} />
        {stops.map((stop, idx) => (
          <Marker
            key={`${stop.label}-${idx}`}
            position={[stop.lat, stop.lon]}
            icon={iconForStop(stop, idx)}
          >
            <Popup>{stop.label}</Popup>
            <Tooltip direction="top" offset={[0, -12]} opacity={0.95}>
              {stop.label}
            </Tooltip>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
