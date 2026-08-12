/**
 * app/api/shows/route.ts
 *
 * The Route Sheet's actual data source.
 *
 *   1. Reads the artist sheet (curation — who counts as HOLLERBOSS-loved)
 *   2. Calls Ticketmaster's Discovery API for each artist's upcoming shows
 *   3. Flattens it all into one array the Route Sheet can filter by distance
 *
 * No venues.csv or shows.csv needed — Ticketmaster supplies dates,
 * venues, addresses, and coordinates directly.
 */

import { NextResponse } from "next/server";
import { fetchArtists } from "@/lib/sheetData";
import { fetchArtistEvents } from "@/lib/ticketmaster";
import { haversineMiles } from "@/lib/distance";

export type LiveShow = {
  date: string; // YYYY-MM-DD
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

export async function GET() {
  try {
    const artists = await fetchArtists();
    const trackedArtists = artists.filter((a) => a.calendar);

    const perArtist = await Promise.all(
      artists.map(async (artist) => {
        const events = await fetchArtistEvents(artist.name);
        return events.map(
          (e): LiveShow => ({
            date: e.date,
            artistName: artist.name,
            artistSlug: artist.slug,
            venueName: e.venue.name,
            address: e.venue.address,
            city: e.venue.city,
            state: e.venue.state,
            postalCode: e.venue.postalCode,
            lat: e.venue.lat,
            lng: e.venue.lng,
            ticketUrl: e.ticketUrl,
            status: e.status,
          })
        );
      })
    );

    const shows = perArtist.flat().sort((a, b) => a.date.localeCompare(b.date));

    // Ticketmaster can list the same show more than once: separate ticket
    // tiers (VIP/GA) at identical coordinates, or the same venue geocoded
    // slightly differently under two name variants (e.g. "111 East 6th
    // Street" vs "111 E Sixth Street" came back ~1.5 miles apart in
    // Ticketmaster's own data). Dedup by proximity: same artist, same
    // date, venues within 2 miles of each other. It's rare for one artist
    // to play two genuinely different venues in the same city on the same
    // night, so this favors collapsing likely-duplicates over leaving
    // them — a real edge case (say, a day festival + a separate late-night
    // set nearby) could incorrectly merge, but that's uncommon enough to
    // accept for now.
    const DEDUP_RADIUS_MILES = 3;
    const deduped: typeof shows = [];
    for (const show of shows) {
      const isDuplicate = deduped.some(
        (kept) =>
          kept.artistSlug === show.artistSlug &&
          kept.date === show.date &&
          haversineMiles([kept.lat, kept.lng], [show.lat, show.lng]) <= DEDUP_RADIUS_MILES
      );
      if (!isDuplicate) deduped.push(show);
    }

    return NextResponse.json(deduped);
  } catch (err) {
    console.error("Failed to build show list:", err);
    return NextResponse.json(
      { error: "Failed to load shows. Check TICKETMASTER_API_KEY and the artist sheet URL." },
      { status: 500 }
    );
  }
}
