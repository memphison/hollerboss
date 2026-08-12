/**
 * components/RouteSheet.tsx
 *
 * Same visual design as before. Data now comes from /api/shows, which
 * merges the artist sheet (curation) with live Ticketmaster Discovery
 * API data (dates, venues, addresses, coordinates) — see
 * app/api/shows/route.ts.
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { coordsForZip } from "@/lib/distance";
import styles from "./RouteSheet.module.css";

const RADII = [25, 50, 100, 250, 9999];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_FULL = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DOW = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type LiveShow = {
  date: string;
  artistName: string;
  artistSlug: string;
  venueName: string;
  address?: string;
  city: string;
  state: string;
  postalCode?: string;
  lat: number;
  lng: number;
  ticketUrl?: string;
  status: string;
};

function haversineMiles(a: [number, number], b: [number, number]): number {
  const toRad = (d: number) => (d * Math.PI) / 180;
  const R = 3958.8;
  const dLat = toRad(b[0] - a[0]);
  const dLng = toRad(b[1] - a[1]);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a[0])) * Math.cos(toRad(b[0])) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function appleMapsLink(venue: { name: string; lat: number; lng: number }) {
  return `https://maps.apple.com/?q=${encodeURIComponent(venue.name)}&ll=${venue.lat},${venue.lng}`;
}

function googleMapsLink(venue: { name: string; address?: string }) {
  const query = venue.address || venue.name;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export default function RouteSheet() {
  const [shows, setShows] = useState<LiveShow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/shows")
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return res.json();
      })
      .then((data: LiveShow[]) => {
        if (cancelled) return;
        setShows(data);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        setLoadError("Couldn't load the show schedule right now. Try again in a bit.");
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const [zip, setZip] = useState("10001");
  const [radius, setRadius] = useState(250);
  const [artistSlug, setArtistSlug] = useState("");
  const [origin, setOrigin] = useState<[number, number] | null>(null);
  const [zipError, setZipError] = useState<string | null>(null);

  // Resolve the typed zip using the bundled Census lookup (lib/distance.ts) —
  // same one confirmed working earlier, no external call needed.
  function runSearch() {
    const clean = zip.trim();
    const coords = coordsForZip(clean);
    if (!coords) {
      setOrigin(null);
      setZipError(`"${clean}" isn't a zip code we recognize.`);
      return;
    }
    setZipError(null);
    setOrigin(coords);
  }

  // run once on mount with the default zip
  useEffect(() => {
    runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scheduledArtists = useMemo(() => {
    const seen = new Map<string, string>();
    shows.forEach((s) => seen.set(s.artistSlug, s.artistName));
    return [...seen.entries()]
      .map(([slug, name]) => ({ slug, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [shows]);

  const results = useMemo(() => {
    if (!origin) return [];
    return shows
      .filter((s) => !artistSlug || s.artistSlug === artistSlug)
      .map((s) => ({ ...s, miles: Math.round(haversineMiles(origin, [s.lat, s.lng])) }))
      .filter((s) => s.miles <= radius)
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [shows, origin, radius, artistSlug]);

  const grouped: { key: string; rows: typeof results }[] = [];
  for (const row of results) {
    const dt = new Date(row.date + "T12:00:00");
    const key = `${MONTHS_FULL[dt.getMonth()]} ${dt.getFullYear()}`;
    const bucket = grouped.find((g) => g.key === key);
    if (bucket) bucket.rows.push(row);
    else grouped.push({ key, rows: [row] });
  }

  return (
    <section className={styles.section} id="route-sheet">
      <div className="wrap">
        <p className={styles.eyebrow}>The Route Sheet</p>
        <h2 className={styles.heading}>Who&apos;s coming through</h2>
        <p className={styles.lede}>
          Nothing stings like hearing they played twenty minutes down the road last
          Thursday. Drop your zip in and we&apos;ll tell you who&apos;s headed your way —
          pulled live from tour listings for the artists we track.
        </p>

        <div className={styles.console}>
          <div className={styles.field}>
            <label htmlFor="rs-zip">Your zip code</label>
            <input
              id="rs-zip"
              className={styles.zipInput}
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && runSearch()}
              inputMode="numeric"
              maxLength={5}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="rs-radius">How far you&apos;ll drive</label>
            <select id="rs-radius" value={radius} onChange={(e) => setRadius(Number(e.target.value))}>
              {RADII.map((r) => (
                <option key={r} value={r}>
                  {r === 9999 ? "However far it takes" : `${r} miles`}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label htmlFor="rs-artist">Artist</label>
            <select id="rs-artist" value={artistSlug} onChange={(e) => setArtistSlug(e.target.value)}>
              <option value="">Everybody</option>
              {scheduledArtists.map((a) => (
                <option key={a.slug} value={a.slug}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <button className={styles.go} onClick={runSearch}>
            Find shows
          </button>
          <p className={styles.consoleNote}>
            Tour dates update automatically. The artist list is ours — we only track
            HOLLERBOSS-loved acts, not every tour in the country.
          </p>
        </div>

        {loading ? (
          <p className={styles.lede}>Loading the schedule…</p>
        ) : loadError ? (
          <div className={styles.empty}>
            <h3>Couldn&apos;t load the schedule</h3>
            <p>{loadError}</p>
          </div>
        ) : (
          <>
            <div className={styles.tally}>
              <div>
                {zipError ? (
                  zipError
                ) : (
                  <>
                    <strong>{results.length}</strong> show{results.length === 1 ? "" : "s"} within{" "}
                    {radius === 9999 ? "range" : `${radius} miles`}
                  </>
                )}
              </div>
            </div>

            {results.length === 0 ? (
              <div className={styles.empty}>
                <h3>Quiet out there</h3>
                <p>
                  {zipError ??
                    `Nobody on the list is booked within ${radius === 9999 ? "range" : `${radius} miles`} of ${zip} yet. Widen the radius, or check back later.`}
                </p>
              </div>
            ) : (
              grouped.map((g) => (
                <div key={g.key}>
                  <div className={styles.month}>
                    <span>{g.key}</span>
                  </div>
                  {g.rows.map((row) => {
                    const dt = new Date(row.date + "T12:00:00");
                    return (
                      <article className={styles.show} key={row.date + row.venueName}>
                        <div className={styles.stub}>
                          <span className="dow">{DOW[dt.getDay()]}</span>
                          <span className="day">{dt.getDate()}</span>
                          <span className="mo">{MONTHS[dt.getMonth()]}</span>
                        </div>
                        <div className={styles.meat}>
                          <div className={styles.artistName}>{row.artistName}</div>
                          <div className={styles.venueLine}>
                            {row.venueName} <em>· {row.city}, {row.state}</em>
                          </div>
                          <div className={styles.mapLinks}>
                            <a
                              href={googleMapsLink(row)}
                              target="_blank"
                              rel="noreferrer"
                              className={styles.mapLink}
                            >
                              Google Maps
                            </a>
                            <span className={styles.mapLinkDivider}>·</span>
                            <a
                              href={appleMapsLink(row)}
                              target="_blank"
                              rel="noreferrer"
                              className={styles.mapLink}
                            >
                              Apple Maps
                            </a>
                          </div>
                          <div className={styles.tags}>
                            {row.status === "cancelled" && (
                              <span className={`${styles.tag} ${styles.tagOut}`}>Cancelled</span>
                            )}
                            {row.status === "postponed" && (
                              <span className={`${styles.tag} ${styles.tagSoon}`}>Postponed</span>
                            )}
                            {row.status === "offsale" && (
                              <span className={`${styles.tag} ${styles.tagSoon}`}>Not on sale yet</span>
                            )}
                          </div>
                        </div>
                        <div className={styles.right}>
                          <div className={styles.miles}>
                            <b>{row.miles}</b>
                            <i>MILES</i>
                          </div>
                          {row.ticketUrl && row.status === "onsale" ? (
                            <a className={styles.tix} href={row.ticketUrl} target="_blank" rel="noreferrer">
                              Tickets
                            </a>
                          ) : (
                            <span className={`${styles.tix} ${styles.tixDead}`}>
                              {row.status === "cancelled" ? "Cancelled" : "Check status"}
                            </span>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              ))
            )}
          </>
        )}

        <p className={styles.fine}>
          Tour dates sourced from Ticketmaster. HOLLERBOSS is an independent fan project.
          Not affiliated with or endorsed by any artist or venue listed.
        </p>
      </div>
    </section>
  );
}
