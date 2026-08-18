import Link from "next/link";
import { artists } from "@/data/artists";
import ArtistCard from "./ArtistCard";
import styles from "./Encyclopedia.module.css";

export default function Encyclopedia() {
  return (
    <section id="encyclopedia" className="section">
      <div className="wrap">
        <div className="sectionHead">
          <div>
            <p className="eyebrow">est. one holler at a time</p>
            <h2>The Encyclopedia</h2>
          </div>
          <p className="sectionNote">
            Who they are, what to listen to first, where to find them. No filler, just
            what&apos;s worth knowing.
          </p>
        </div>
        <hr className="rule" />
        <div className={styles.grid}>
          {artists.map((artist) => (
            <ArtistCard key={artist.slug} artist={artist} />
          ))}
        </div>
        <div className={styles.more}>
          <Link href="/encyclopedia">Browse the full encyclopedia →</Link>
        </div>
      </div>
    </section>
  );
}
