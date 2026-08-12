/**
 * lib/sheetData.ts
 *
 * Fetches the three published Google Sheets and parses them into the
 * same shapes the old data/artists.ts, data/venues.ts, and data/shows.ts
 * files used to export — so the rest of the app barely notices the switch.
 */

import { parseCSV } from "@/lib/csv";
import { SHEET_URLS } from "@/lib/sheetsConfig";

export type TicketSource = "TM" | "EB" | "SE";

export type Artist = {
  slug: string;
  name: string;
  tag: string;
  home: string;
  blurb: string;
  startHere: string;
  calendar: boolean;
  ticketSource: TicketSource;
};

export type Venue = {
  slug: string;
  name: string;
  address?: string;
  city: string;
  state: string;
  zipcode?: string;
  lat: number;
  lng: number;
};

export type ShowStatus = "on-sale" | "few-left" | "sold-out" | "announced" | "";

export type Show = {
  date: string;
  artistSlug: string;
  venueSlug: string;
  status?: ShowStatus;
  ticketUrl?: string;
};

async function fetchCSV(url: string): Promise<Record<string, string>[]> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch sheet (${res.status}): ${url}`);
  }
  const text = await res.text();
  return parseCSV(text);
}

export async function fetchArtists(): Promise<Artist[]> {
  const rows = await fetchCSV(SHEET_URLS.artists);
  return rows.map((r) => ({
    slug: r.slug,
    name: r.name,
    tag: r.tag,
    home: r.home,
    blurb: r.blurb,
    startHere: r.startHere,
    calendar: (r.calendar || "").trim().toUpperCase() === "YES",
    // Defaults to TM (Ticketmaster) for any blank/unrecognized value,
    // so a typo or empty cell fails safe into the self-serve API
    // rather than silently routing an artist into the manual-sheet
    // path where they'd show nothing without anyone noticing. Known
    // manual-source codes (EB, SE) are recognized explicitly; add new
    // ones here as new providers come up — route.ts itself doesn't
    // need to change, since it treats anything non-"TM" as manual.
    ticketSource: (() => {
      const raw = (r.ticketSource || "").trim().toUpperCase();
      return raw === "EB" || raw === "SE" ? raw : "TM";
    })(),
  }));
}

export async function fetchVenues(): Promise<Venue[]> {
  const rows = await fetchCSV(SHEET_URLS.venues);
  return rows.map((r) => ({
    slug: r.slug,
    name: r.name,
    address: r.address || undefined,
    city: r.city,
    state: r.state,
    zipcode: r.zipcode || undefined,
    lat: Number(r.lat),
    lng: Number(r.lng),
  }));
}

export async function fetchShows(): Promise<Show[]> {
  const rows = await fetchCSV(SHEET_URLS.shows);
  return rows
    .filter((r) => r.date && r.artistSlug && r.venueSlug) // skip blank rows
    .map((r) => ({
      date: r.date,
      artistSlug: r.artistSlug,
      venueSlug: r.venueSlug,
      status: (r.status || "") as ShowStatus,
      ticketUrl: r.ticketUrl || undefined,
    }));
}
