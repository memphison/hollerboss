import Link from "next/link";
import type { Artist } from "@/lib/sheetData";
import styles from "./ArtistHero.module.css";

function PinIcon() {
  return (
    <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true" fill="currentColor">
      <path d="M10 0C5.58 0 2 3.58 2 8c0 5.25 6.9 11.35 7.2 11.6a1.2 1.2 0 0 0 1.6 0C11.1 19.35 18 13.25 18 8c0-4.42-3.58-8-8-8Zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
    </svg>
  );
}

export default function ArtistHero({ artist }: { artist: Artist }) {
  return (
    <header className={styles.hero}>
      <div className={styles.overlay} aria-hidden="true" />
      <div className={`wrap ${styles.inner}`}>
        <Link href="/encyclopedia" className={styles.back}>
          ← Back to the encyclopedia
        </Link>

        <div className={styles.layout}>
          <div className={styles.copy}>
            {artist.tag && <p className={styles.eyebrow}>{artist.tag}</p>}
            <h1 className={styles.name}>{artist.name}</h1>
            {artist.home && (
              <p className={styles.home}>
                <PinIcon />
                {artist.home}
              </p>
            )}
            {artist.quote && <blockquote className={styles.quote}>&ldquo;{artist.quote}&rdquo;</blockquote>}
          </div>

          <div className={styles.photoWrap} aria-hidden={!artist.photoUrl}>
            {artist.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={artist.photoUrl} alt={artist.name} className={styles.photo} />
            ) : (
              <div className={styles.photoFallback}>{artist.name.charAt(0)}</div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
