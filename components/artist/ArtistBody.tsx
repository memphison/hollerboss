import Link from "next/link";
import type { Artist } from "@/lib/sheetData";
import type { LiveShow } from "@/lib/liveShows";
import ArtistThumbCard, { type ThumbArtist } from "@/components/encyclopedia/ArtistThumbCard";
import styles from "./ArtistBody.module.css";

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function formatShowDate(iso: string): { month: string; day: number } {
  const dt = new Date(iso + "T12:00:00");
  return { month: MONTHS[dt.getMonth()], day: dt.getDate() };
}

export default function ArtistBody({
  artist,
  upcomingShows,
  relatedArtists,
}: {
  artist: Artist;
  upcomingShows: LiveShow[];
  relatedArtists: ThumbArtist[];
}) {
  const hasVoice = Boolean(artist.blurb);
  const hasWhy = artist.whyItPasses.length > 0;
  const hasSongs = artist.essentialSongs.length > 0;
  const showTopRow = hasVoice || hasWhy || hasSongs;

  return (
    <div className={styles.body}>
      <div className="wrap">
        {showTopRow && (
          <div className={styles.cardRow}>
            {hasVoice && (
              <article className={styles.card}>
                <p className={styles.cardEyebrow}>HOLLERBOSS Voice</p>
                <h3 className={styles.cardHeading}>The Voice of the People</h3>
                <p className={styles.cardText}>{artist.blurb}</p>
                {/* approval stamp — liked it, but it doesn't fit here. Keeping for reuse elsewhere.
                <div className={styles.stamp} aria-hidden="true">
                  <span>Appalachian</span>
                  <strong>HB</strong>
                  <span>Approved</span>
                </div>
                */}
              </article>
            )}

            {hasWhy && (
              <article className={styles.card}>
                <p className={styles.cardEyebrow}>Why {artist.name} passes the test</p>
                <h3 className={styles.cardHeading}>Rooted, Real, and True</h3>
                <p className={styles.cardText}>
                  Every artist in this encyclopedia clears the same bar — real roots,
                  honest songs, and respect for where this music comes from.
                </p>
                <ul className={styles.checklist}>
                  {artist.whyItPasses.map((item) => (
                    <li key={item}>
                      <span className={styles.check} aria-hidden="true">
                        ✓
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            )}

            {hasSongs && (
              <article className={styles.card}>
                <p className={styles.cardEyebrow}>Start here</p>
                <h3 className={styles.cardHeading}>Essential Songs</h3>
                <ol className={styles.songList}>
                  {artist.essentialSongs.map((song, i) => (
                    <li key={song}>
                      <span className={styles.songNum}>{String(i + 1).padStart(2, "0")}</span>
                      <span className={styles.songTitle}>{song}</span>
                    </li>
                  ))}
                </ol>
                {artist.spotifyUrl && (
                  <a
                    href={artist.spotifyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`btn btn-primary ${styles.spotifyBtn}`}
                  >
                    Play on Spotify
                  </a>
                )}
              </article>
            )}
          </div>
        )}

        {/*
          calendar=NO means this artist isn't being tracked for shows at
          all (see lib/liveShows.ts) — most of the time because they're no
          longer touring, sometimes because they're no longer living. Either
          way, "doesn't have any shows booked right now, check back soon"
          reads badly, so the whole card is suppressed rather than shown
          with an empty state.
        */}
        {artist.calendar && (
          <div className={styles.cardRow}>
            <article className={`${styles.card} ${styles.cardWide}`}>
              <p className={styles.cardEyebrow}>Coming through</p>
              <h3 className={styles.cardHeading}>Next shows on the Route Sheet</h3>
              {upcomingShows.length === 0 ? (
                <p className={styles.cardText}>
                  {artist.name} doesn&apos;t have any shows booked right now. Check back soon.
                </p>
              ) : (
                <ul className={styles.showList}>
                  {upcomingShows.map((show) => {
                    const { month, day } = formatShowDate(show.date);
                    return (
                      <li key={show.date + show.venueName}>
                        <span className={styles.showDate}>
                          {month} {day}
                        </span>
                        <span>
                          <span className={styles.showVenue}>{show.venueName}</span>
                          <span className={styles.showCity}>
                            {show.city}, {show.state}
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
              <Link
                href={`/route-sheet?artist=${artist.slug}`}
                className={`btn ${styles.ghostBtn} ${styles.routeBtn}`}
              >
                View full Route Sheet
              </Link>
            </article>

            {/*
              TODO: "Key Records" / discography card — not backed by real data
              yet. Would need a Discography sheet/tab (artist slug, album
              title, year, type, cover image URL) joined in here the same
              way essentialSongs/whyItPasses are parsed today.

            <article className={`${styles.card} ${styles.cardWide}`}>
              <p className={styles.cardEyebrow}>Key records</p>
              <h3 className={styles.cardHeading}>Discography</h3>
              <ul className={styles.discography}>
                {artist.discography.map((record) => (
                  <li key={record.title}>
                    <img src={record.coverUrl} alt="" />
                    <div>
                      <strong>{record.title}</strong>
                      <span>{record.year} · {record.type}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <a href={`/encyclopedia/${artist.slug}/discography`} className="btn btn-ghost-dark">
                View full discography
              </a>
            </article>
            */}

            {/*
              TODO: "Appalachian Coordinates" map card — lat/lng columns now
              exist on the artist sheet, but there's no map rendering set up
              yet (no state-outline SVGs, no mapping library wired in). Once
              that's in place, this can plot artist.lat/artist.lng on a
              state-outline SVG keyed off artist.home's state.

            <article className={styles.card}>
              <p className={styles.cardEyebrow}>Appalachian coordinates</p>
              <h3 className={styles.cardHeading}>{artist.home}</h3>
              <StateMap lat={artist.lat} lng={artist.lng} />
              <p className={styles.cardText}>
                {artist.lat}° N, {artist.lng}° W
              </p>
            </article>
            */}
          </div>
        )}

        {relatedArtists.length > 0 && (
          <div className={styles.related}>
            <p className={styles.sectionEyebrow}>Related in the holler</p>
            <div className={styles.relatedGrid}>
              {relatedArtists.map((related) => (
                <ArtistThumbCard key={related.slug} artist={related} />
              ))}
            </div>
          </div>
        )}

        {artist.bio.length > 0 && (
          <div className={styles.bio}>
            <p className={styles.sectionEyebrow}>The story so far</p>
            <h2 className={styles.bioHeading}>From the Holler to the World</h2>
            {artist.bio.map((paragraph, i) => (
              <p key={i} className={styles.bioParagraph}>
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {/*
          TODO: "Objects & Moments" timeline — not backed by real data yet.
          Would need a dedicated sheet/tab (artist slug, year, label) to
          drive a chronological list like the milestones shown in the
          ArtistPage mockup (award nods, breakthrough releases, etc.).

        <div className={styles.moments}>
          <p className={styles.sectionEyebrow}>Objects & moments</p>
          <ul className={styles.momentsList}>
            {artist.moments.map((moment) => (
              <li key={moment.year}>
                <span>{moment.year}</span>
                <span>{moment.label}</span>
              </li>
            ))}
          </ul>
        </div>
        */}
      </div>
    </div>
  );
}
