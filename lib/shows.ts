/**
 * lib/shows.ts
 *
 * Joins data/shows.ts + data/venues.ts + data/artists.ts into the
 * flat, display-ready shape the Route Sheet renders, and filters
 * that list by distance from a fan's zip code.
 */

import { shows, type Show } from "@/data/shows";
import { venues } from "@/data/venues";
import { artists } from "@/data/artists";
import { milesFromZip } from "@/lib/distance";

export type RouteSheetEntry = {
  date: string;
  artistName: string;
  artistSlug: string;
  venueName: string;
  city: string;
  state: string;
  miles: number;
  status?: Show["status"];
  ticketUrl?: string;
};

/**
 * All shows within `radiusMiles` of `zip`, nearest-date first.
 * Shows at venues or artists missing from the data files are skipped
 * rather than crashing — better an incomplete list than a broken page.
 */
export function showsWithinRadius(zip: string, radiusMiles: number): RouteSheetEntry[] {
  const entries: RouteSheetEntry[] = [];

  for (const show of shows) {
    const venue = venues.find((v) => v.slug === show.venueSlug);
    const artist = artists.find((a) => a.slug === show.artistSlug);
    if (!venue || !artist) continue;

    const miles = milesFromZip(zip, [venue.lat, venue.lng]);
    if (miles === null || miles > radiusMiles) continue;

    entries.push({
      date: show.date,
      artistName: artist.name,
      artistSlug: artist.slug,
      venueName: venue.name,
      city: venue.city,
      state: venue.state,
      miles,
      status: show.status,
      ticketUrl: show.ticketUrl,
    });
  }

  return entries.sort((a, b) => a.date.localeCompare(b.date));
}
export function scheduledArtists(): { slug: string; name: string }[] {
  const slugs = new Set(shows.map((s) => s.artistSlug));
  return artists
    .filter((a) => slugs.has(a.slug))
    .map((a) => ({ slug: a.slug, name: a.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}