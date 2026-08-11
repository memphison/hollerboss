/**
 * Fixed paper-grain overlay. Sits above everything, catches no clicks.
 * The filter definition and the painted rect are separate <svg> elements so the
 * zero-size defs node never takes up layout space.
 */
export default function GrainOverlay() {
  return (
    <>
      <svg
        aria-hidden="true"
        width="0"
        height="0"
        style={{ position: "absolute" }}
      >
        <filter id="hb-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves={2}
            stitchTiles="stitch"
            result="noise"
          />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.04 0"
          />
        </filter>
      </svg>
      <svg
        aria-hidden="true"
        width="100%"
        height="100%"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 999,
          pointerEvents: "none",
          opacity: 0.5,
          mixBlendMode: "multiply",
        }}
      >
        <rect width="100%" height="100%" filter="url(#hb-grain)" />
      </svg>
    </>
  );
}
