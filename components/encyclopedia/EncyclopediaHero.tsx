import styles from "./EncyclopediaHero.module.css";

/** Mountain-photo banner atop /encyclopedia — same visual recipe as the homepage Hero. */
export default function EncyclopediaHero() {
  return (
    <header className={styles.hero}>
      <div className={styles.overlay} aria-hidden="true" />
      <div className={`wrap ${styles.inner}`}>
        <p className={styles.eyebrow}>— est. one holler at a time —</p>
        <h1 className={styles.heading}>The Encyclopedia</h1>
        <p className={styles.lede}>
          The artists, their stories, and the songs that built this sound. No filler,
          no hype cycle — just who&apos;s carrying this music forward and where to start.
        </p>
        <a href="#browse" className="btn btn-ghost">
          Browse all artists
        </a>
      </div>
    </header>
  );
}
