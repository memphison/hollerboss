import Link from "next/link";
import type { Artist } from "@/lib/sheetData";
import styles from "./EncyclopediaBrowser.module.css";

export type ThumbArtist = Pick<Artist, "slug" | "name" | "home" | "tag" | "photoUrl">;

/** Photo + name + View Artist card, used in the encyclopedia grid and in "Related" rails. */
export default function ArtistThumbCard({ artist }: { artist: ThumbArtist }) {
  return (
    <Link href={`/encyclopedia/${artist.slug}`} className={styles.card}>
      <div className={styles.photoWrap} aria-hidden="true">
        {artist.photoUrl ? (
          // Sheet-sourced URLs are arbitrary/unknown at build time, so this
          // intentionally uses <img> rather than next/image (which requires
          // allow-listing remote hosts ahead of time).
          // eslint-disable-next-line @next/next/no-img-element
          <img src={artist.photoUrl} alt="" className={styles.photo} loading="lazy" />
        ) : (
          <div className={styles.photoFallback}>{artist.name.charAt(0)}</div>
        )}
      </div>
      <div className={styles.cardBody}>
        {artist.tag && <span className={styles.tag}>{artist.tag}</span>}
        <h3>{artist.name}</h3>
        {artist.home && <div className={styles.home}>{artist.home}</div>}
        <span className={styles.viewLink} aria-hidden="true">
          View artist →
        </span>
      </div>
    </Link>
  );
}
