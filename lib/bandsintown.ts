/**
 * lib/bandsintown.ts
 *
 * Thin client for Bandsintown's public read-only API. No auth beyond a
 * self-assigned app_id (no approval process for read-only artist/event
 * lookups at this volume). Docs: https://app.swaggerhub.com/apis/Bandsintown/PublicAPI/3.0.0
 *
 * Server-side only — do not import this from a "use client" component.
 * Bandsintown's CORS policy isn't guaranteed for browser fetches, and
 * routing through our own API route lets us cache responses.
 */

const APP_ID = "hollerboss"; // self-assigned; fine for read-only lookups at this scale

export type BandsintownEvent = {
  id: string;
  datetime: string; // ISO
  url: string;
  venue: {
    name: string;
    city: string;
    region: string;
    country: string;
    latitude: string;
    longitude: string;
  };
  offers?: { type: string; url: string; status: string }[];
};

/** Upcoming events for one artist, by exact Bandsintown artist name. */
export async function fetchArtistEvents(artistName: string): Promise<BandsintownEvent[]> {
  const url = `https://rest.bandsintown.com/artists/${encodeURIComponent(
    artistName
  )}/events/?app_id=${APP_ID}&date=upcoming`;

  const res = await fetch(url, { next: { revalidate: 3600 } }); // cache 1 hour

  if (res.status === 404) {
    // Bandsintown returns 404 for artists it doesn't recognize at all —
    // treat as "no shows" rather than an error, so one typo/unknown name
    // doesn't take down the whole Route Sheet.
    return [];
  }
  if (!res.ok) {
    throw new Error(`Bandsintown request failed (${res.status}) for "${artistName}"`);
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}
