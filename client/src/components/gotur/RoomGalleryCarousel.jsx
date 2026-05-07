import { useEffect, useMemo, useState } from "react";
import { setImagePlaceholderOnError } from "../../utils/imagePlaceholder";

/**
 * Simple horizontal room gallery (one slide + bottom prev/next) — reliable in dashboard and public pages.
 * @param {{ images: Array<{ id?: string, url: string }>, className?: string }} props
 */
export default function RoomGalleryCarousel({ images, className = "" }) {
  const list = useMemo(() => images?.filter((i) => i?.url) || [], [images]);
  const [idx, setIdx] = useState(0);
  const urlsKey = useMemo(() => list.map((i) => i.url).join("|"), [list]);

  useEffect(() => {
    setIdx(0);
  }, [urlsKey]);

  if (!list.length) return null;

  const multi = list.length > 1;
  const current = list[Math.min(idx, list.length - 1)];

  return (
    <div className={`mgr-room-carousel-wrap room-photo-carousel ${className}`.trim()}>
      <div className="room-photo-carousel__viewport">
        <img key={current.id || current.url} src={current.url} alt="" onError={setImagePlaceholderOnError} />
      </div>
      {multi ? (
        <div className="room-photo-carousel__nav" role="group" aria-label="Room photos">
          <button
            type="button"
            className="room-photo-carousel__btn"
            aria-label="Previous photo"
            onClick={() => setIdx((i) => (i - 1 + list.length) % list.length)}
          >
            ←
          </button>
          <button
            type="button"
            className="room-photo-carousel__btn"
            aria-label="Next photo"
            onClick={() => setIdx((i) => (i + 1) % list.length)}
          >
            →
          </button>
        </div>
      ) : null}
    </div>
  );
}
