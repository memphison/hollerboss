/**
 * lib/liveShows.ts
 *
 * The Route Sheet's actual data source, shared between app/api/shows/route.ts
 * (the client-side Route Sheet's fetch target) and any server component that
 * needs the same merged show list directly — e.g. an artist page's "Coming
 * through" card. Calling this instead of fetching /api/shows over HTTP from
 * a server component avoids guessing the deployment's own base URL and an
 * extra network hop; Next's fetch cache still dedupes the underlying
 * Ticketmaster/sheet requests either way.
 *
 *   1. Reads the artist sheet (curation — who counts as HOLLERBOSS-loved,
 *      and whether their shows come from Ticketmaster or a manually
 *      maintained sheet — see Artist.ticketSource)
 *   2. For TM artists: calls Ticketmaster's Discovery API
 *      For EB/SE artists: reads the manually maintained Shows/Venues sheets
 *   3. Flattens both into one array, deduped and sorted by date
 */

import { fetchArtists, fetchShows, fetchVenues, type Artist } from "@/lib/sheetData";
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

export type LiveShowsResult = {
  shows: LiveShow[];
  // The full tracked-artist list (calendar=YES), independent of
  // whether they currently have any booked shows — e.g. Colter Wall
  // between tours should still appear as a filter option, distinct
  // from Loretta Lynn who's excluded entirely via calendar=NO.
  artists: { slug: string; name: string }[];
};

/**
 * The manually maintained Shows sheet uses its own status vocabulary
 * (on-sale / few-left / sold-out / announced) since it's meant to be
 * legible to a human filling it in by hand. The rest of the app —
 * RouteSheet.tsx's tag logic, and Ticketmaster's own status codes —
 * expects onsale / offsale / cancelled / postponed / rescheduled.
 * This maps one to the other so a sheet-sourced show renders the
 * same tags a Ticketmaster-sourced show would.
 */
function mapSheetStatus(sheetStatus: string | undefined): string {
  switch (sheetStatus) {
    case "on-sale":
    case "few-left":
      return "onsale";
    case "announced":
      return "offsale"; // renders RouteSheet's "Not on sale yet" tag
    case "sold-out":
      return "offsale"; // no dedicated "sold out" tag yet — falls back to "Check status"
    default:
      return "onsale";
  }
}

async function fetchTicketmasterShows(artist: Artist): Promise<LiveShow[]> {
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
}

function buildSheetShows(
  artist: Artist,
  allShows: Awaited<ReturnType<typeof fetchShows>>,
  venuesBySlug: Map<string, Awaited<ReturnType<typeof fetchVenues>>[number]>
): LiveShow[] {
  return allShows
    .filter((s) => s.artistSlug === artist.slug)
    .map((s): LiveShow | null => {
      const venue = venuesBySlug.get(s.venueSlug);
      if (!venue || !venue.lat || !venue.lng) {
        // A show referencing a venue slug that doesn't exist yet in
        // the Venues sheet (typo, or venue not added yet) is skipped
        // rather than crashing the whole endpoint — logged so it's
        // visible in Vercel's function logs.
        console.warn(
          `Show for ${artist.slug} on ${s.date} references unknown or incomplete venue "${s.venueSlug}" — skipping.`
        );
        return null;
      }
      return {
        date: s.date,
        artistName: artist.name,
        artistSlug: artist.slug,
        venueName: venue.name,
        address: venue.address,
        city: venue.city,
        state: venue.state,
        postalCode: venue.zipcode,
        lat: venue.lat,
        lng: venue.lng,
        ticketUrl: s.ticketUrl,
        status: mapSheetStatus(s.status),
      };
    })
    .filter((s): s is LiveShow => s !== null);
}

export async function fetchLiveShows(): Promise<LiveShowsResult> {
  const artists = await fetchArtists();
  const trackedArtists = artists.filter((a) => a.calendar);

  // Only fetch the manual sheets if at least one tracked artist
  // actually needs them — avoids two unnecessary requests on
  // deployments where every artist is TM-sourced.
  const needsSheetShows = trackedArtists.some((a) => a.ticketSource !== "TM");
  const [allSheetShows, allVenues] = needsSheetShows
    ? await Promise.all([fetchShows(), fetchVenues()])
    : [[], []];
  const venuesBySlug = new Map(allVenues.map((v) => [v.slug, v]));

  const perArtist = await Promise.all(
    trackedArtists.map(async (artist) => {
      if (artist.ticketSource !== "TM") {
        return buildSheetShows(artist, allSheetShows, venuesBySlug);
      }
      return fetchTicketmasterShows(artist);
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

  return {
    shows: deduped,
    artists: trackedArtists.map((a) => ({ slug: a.slug, name: a.name })),
  };
}
