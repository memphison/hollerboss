/**
 * lib/ticketmaster.ts
 *
 * Client for Ticketmaster's Discovery API (genuinely self-serve — free
 * signup, instant key, no artist affiliation required).
 * Docs: https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/
 *
 * Server-side only — do not import from a "use client" component.
 * Requires TICKETMASTER_API_KEY in .env.local.
 *
 * Coverage note: only includes events Ticketmaster actually sells
 * tickets for. Smaller club shows or other ticketing vendors may not
 * appear — this is broad coverage for bigger venues, not exhaustive.
 */

export type TicketmasterEvent = {
  name: string;
  date: string; // YYYY-MM-DD
  ticketUrl: string;
  status: string; // "onsale" | "offsale" | "cancelled" | "postponed" | "rescheduled"
  venue: {
    name: string;
    address?: string;
    city: string;
    state: string;
    postalCode?: string;
    lat: number;
    lng: number;
  };
};

/** Shape of the slice of Ticketmaster's response we actually consume. */
type TmApiVenue = {
  name: string;
  address?: { line1?: string };
  city?: { name?: string };
  state?: { stateCode?: string; name?: string };
  postalCode?: string;
  location?: { latitude?: string; longitude?: string };
};

type TmApiEvent = {
  name: string;
  url: string;
  dates?: { start?: { localDate?: string }; status?: { code?: string } };
  _embedded?: { venues?: TmApiVenue[] };
};

type TmApiResponse = { _embedded?: { events?: TmApiEvent[] } };



const BLOCKLIST_TERMS = ["tribute", "experience", "salute", "cover band", "as performed by"];

/** Catches tribute/cover acts that put the real artist's name in their own show title. */
function isLikelyTributeAct(eventName: string): boolean {
  const lower = eventName.toLowerCase();
  return BLOCKLIST_TERMS.some((term) => lower.includes(term));
}

export async function fetchArtistEvents(artistName: string): Promise<TicketmasterEvent[]> {
  const apiKey = process.env.TICKETMASTER_API_KEY;
  if (!apiKey) {
    throw new Error("TICKETMASTER_API_KEY is not set in .env.local");
  }

  const url =
    `https://app.ticketmaster.com/discovery/v2/events.json` +
    `?apikey=${apiKey}` +
    `&keyword=${encodeURIComponent(artistName)}` +
    `&classificationName=music` +
    `&sort=date,asc` +
    `&size=50`;

  const res = await fetch(url, { next: { revalidate: 3600 } }); // cache 1 hour

  if (!res.ok) {
    throw new Error(`Ticketmaster request failed (${res.status}) for "${artistName}"`);
  }

  const data = (await res.json()) as TmApiResponse;
  const events = data._embedded?.events ?? [];

  return events
    .map((e): TicketmasterEvent | null => {
      const venue = e._embedded?.venues?.[0];
      const localDate = e.dates?.start?.localDate;
      if (!venue || !localDate || !venue.location) return null;

      const lat = Number(venue.location.latitude);
      const lng = Number(venue.location.longitude);
      // (0,0) means Ticketmaster failed to geocode this venue — treating
      // it as valid would compute mileage from off the coast of Africa.
      if (!lat || !lng) return null;

      // Tribute/cover acts often put the real artist's name in their own
      // show title ("Tennessee Whiskey - A Tribute to Chris Stapleton").
      if (isLikelyTributeAct(e.name)) return null;

      return {
        name: e.name,
        date: localDate,
        ticketUrl: e.url,
        status: e.dates?.status?.code ?? "onsale",
        venue: {
          name: venue.name,
          address: venue.address?.line1,
          city: venue.city?.name ?? "",
          state: venue.state?.stateCode ?? venue.state?.name ?? "",
          postalCode: venue.postalCode,
          lat,
          lng,
        },
      };
    })
    .filter((e): e is TicketmasterEvent => e !== null);
}
