import { useCallback, useMemo } from "react";

/**
 * Dual-handle range for min/max price on one track (orange fill + tooltips).
 */
export default function DualRangePriceSlider({
  min,
  max,
  onChange,
  maxLimit = 800,
  minGap = 8,
  ariaLabel = "Price range",
}) {
  const lo = Math.min(min, max);
  const hi = Math.max(min, max);

  const pct = useCallback(
    (v) => Math.round((Math.min(maxLimit, Math.max(0, v)) / maxLimit) * 1000) / 10,
    [maxLimit]
  );

  const pLo = pct(lo);
  const pHi = pct(hi);

  const setMin = useCallback(
    (raw) => {
      const v = Math.min(Number(raw), hi - minGap);
      onChange?.({ min: Math.max(0, v), max: hi });
    },
    [hi, minGap, onChange]
  );

  const setMax = useCallback(
    (raw) => {
      const v = Math.max(Number(raw), lo + minGap);
      onChange?.({ min: lo, max: Math.min(maxLimit, v) });
    },
    [lo, minGap, maxLimit, onChange]
  );

  const zMin = useMemo(() => (lo > hi - minGap * 3 ? 5 : 3), [lo, hi, minGap]);
  const zMax = useMemo(() => (lo > hi - minGap * 3 ? 3 : 5), [lo, hi, minGap]);

  return (
    <div className="udh-dual-slider" role="group" aria-label={ariaLabel}>
      <div className="udh-dual-slider__bubbles" aria-hidden="true">
        <span className="udh-dual-slider__bubble" style={{ left: `${pLo}%` }}>
          ${lo}
        </span>
        <span className="udh-dual-slider__bubble" style={{ left: `${pHi}%` }}>
          ${hi}
        </span>
      </div>

      <div className="udh-dual-slider__track-wrap">
        <div className="udh-dual-slider__track-bg" />
        <div
          className="udh-dual-slider__track-fill"
          style={{
            left: `${pLo}%`,
            width: `${Math.max(0, pHi - pLo)}%`,
          }}
        />
      </div>

      <div className="udh-dual-slider__inputs">
        <input
          type="range"
          min={0}
          max={maxLimit}
          step={1}
          value={lo}
          onChange={(e) => setMin(e.target.value)}
          aria-label="Minimum price"
          style={{ zIndex: zMin }}
        />
        <input
          type="range"
          min={0}
          max={maxLimit}
          step={1}
          value={hi}
          onChange={(e) => setMax(e.target.value)}
          aria-label="Maximum price"
          style={{ zIndex: zMax }}
        />
      </div>
    </div>
  );
}
