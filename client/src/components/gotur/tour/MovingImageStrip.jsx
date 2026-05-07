import { setImagePlaceholderOnError } from "../../../utils/imagePlaceholder";
import { BASE_URL } from "../../../services/apiClient";

export function resolveImageUrl(url) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return encodeURI(url);
  const path = url.startsWith("/") ? url : `/${url}`;
  return encodeURI(`${BASE_URL}${path}`);
}

/**
 * Horizontal scrolling strip (Gotur destination-details style).
 * @param {{ images: Array<{ id?: string, url: string }>, height: number, reverse?: boolean, altPrefix?: string }} props
 */
export default function MovingImageStrip({ images, height, reverse = false, altPrefix = "image" }) {
  const list = images?.length ? images : [];
  if (!list.length) return null;
  const doubled = [...list, ...list];
  return (
    <div className={`moving-strip ${reverse ? "moving-strip--reverse" : ""}`}>
      <div className="moving-strip__track">
        {doubled.map((img, idx) => (
          <div className="moving-strip__item" key={`${img.id || idx}-${idx}`}>
            <img
              src={resolveImageUrl(img.url)}
              alt={`${altPrefix}-${idx}`}
              onError={setImagePlaceholderOnError}
              style={{ width: "100%", height: `${height}px`, objectFit: "cover", borderRadius: "10px" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export const movingStripCss = `
.moving-strip {
  overflow: hidden;
  width: 100%;
}
.moving-strip__track {
  display: flex;
  gap: 16px;
  width: max-content;
  animation: move-left 28s linear infinite;
}
.moving-strip--reverse .moving-strip__track {
  animation: move-right 28s linear infinite;
}
.moving-strip__item {
  width: 584px;
  flex: 0 0 auto;
}
@keyframes move-left {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
@keyframes move-right {
  from { transform: translateX(-50%); }
  to { transform: translateX(0); }
}
@media (max-width: 767px) {
  .moving-strip__item { width: 90vw; }
}
`;
