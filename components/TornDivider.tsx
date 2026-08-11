import styles from "./TornDivider.module.css";

const FILLS = {
  kraft: "#E4D5B7",
  ink: "#241D14",
  paper: "#F1E7CC",
} as const;

/** Ragged torn-paper edge between sections. `fill` is the color of the section below. */
export default function TornDivider({
  fill = "kraft",
  flipped = false,
}: {
  fill?: keyof typeof FILLS;
  flipped?: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      className={`${styles.torn} ${flipped ? styles.flipped : ""}`}
      viewBox="0 0 1200 34"
      preserveAspectRatio="none"
    >
      <polygon
        points="0,10 40,4 78,14 120,2 165,12 210,3 255,15 300,5 345,11 390,2 435,13 480,4 525,10 570,2 615,14 660,5 705,12 750,3 795,11 840,2 885,13 930,4 975,10 1020,2 1065,13 1110,5 1155,11 1200,3 1200,34 0,34"
        fill={FILLS[fill]}
      />
    </svg>
  );
}
