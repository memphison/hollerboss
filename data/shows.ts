/**
 * data/shows.ts
 *
 * The manually-entered show list the Route Sheet reads from.
 * Each show references an artist slug (from data/artists.ts) and a
 * venue slug (from data/venues.ts) rather than repeating their details.
 *
 * To add a show: one object, four required fields. `status` and
 * `onsale` are optional flags the Route Sheet uses for badges.
 *
 * Source: publicly announced tour dates as of Aug 11, 2026. Tour
 * schedules change — recheck before this ships anywhere real.
 */

export type ShowStatus = "on-sale" | "few-left" | "sold-out" | "announced";

export type Show = {
  date: string; // YYYY-MM-DD
  artistSlug: string;
  venueSlug: string;
  status?: ShowStatus;
  ticketUrl?: string;
};

export const shows: Show[] = [
  { date: "2026-08-05", artistSlug: "sierra-ferrell", venueSlug: "the-wiltern" },
  { date: "2026-08-06", artistSlug: "sierra-ferrell", venueSlug: "santa-barbara-bowl" },
  { date: "2026-08-09", artistSlug: "sierra-ferrell", venueSlug: "grand-targhee-resort" },
  { date: "2026-08-11", artistSlug: "sierra-ferrell", venueSlug: "dillon-amphitheater" },
  { date: "2026-08-12", artistSlug: "sierra-ferrell", venueSlug: "red-rocks-amphitheatre" },
  { date: "2026-08-14", artistSlug: "sierra-ferrell", venueSlug: "the-momentary" },
  { date: "2026-08-15", artistSlug: "sierra-ferrell", venueSlug: "avondale-brewing" },
  { date: "2026-08-16", artistSlug: "sierra-ferrell", venueSlug: "wv-state-fair" },
  { date: "2026-08-29", artistSlug: "sierra-ferrell", venueSlug: "landmark-credit-union-live" },
  { date: "2026-08-30", artistSlug: "sierra-ferrell", venueSlug: "mn-state-fair" },
];
