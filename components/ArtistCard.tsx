import Link from "next/link";
import type { Artist } from "@/data/artists";
import styles from "./Encyclopedia.module.css";

export default function ArtistCard({ artist }: { artist: Artist }) {
  return (
    <Link href={`/encyclopedia/${artist.slug}`} className={styles.card}>
      <span className={styles.tag}>{artist.tag}</span>
      <h3>{artist.name}</h3>
      <div className={styles.home}>{artist.home}</div>
      <p className={styles.blurb}>{artist.blurb}</p>
      <div className={styles.startHere}>
        <span>Start here</span>
        <b>{artist.startHere}</b>
      </div>
    </Link>
  );
}
