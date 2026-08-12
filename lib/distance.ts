/**
 * lib/distance.ts
 *
 * Turns a US zip code into a lat/lng (via the bundled Census lookup),
 * and calculates the distance in miles between two points using the
 * haversine formula — the standard "as the crow flies" distance
 * calculation for two points on a sphere.
 */

import zipLookup from "@/data/zip-lookup.json";

type LatLng = [number, number]; // [lat, lng]

const EARTH_RADIUS_MILES = 3958.8;

/** Look up a zip code's center-point coordinates. Returns null if unknown. */
export function coordsForZip(zip: string): LatLng | null {
  const clean = zip.trim().slice(0, 5);
  const hit = (zipLookup as unknown as Record<string, LatLng>)[clean];
  return hit ?? null;
}

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Straight-line distance in miles between two [lat, lng] points. */
export function haversineMiles(a: LatLng, b: LatLng): number {
  const [lat1, lng1] = a;
  const [lat2, lng2] = b;

  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const sinLat = Math.sin(dLat / 2);
  const sinLng = Math.sin(dLng / 2);

  const h =
    sinLat * sinLat +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * sinLng * sinLng;

  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));

  return EARTH_RADIUS_MILES * c;
}

/**
 * Distance in miles from a zip code to a venue's [lat, lng].
 * Returns null if the zip isn't recognized, so callers can show
 * "we don't recognize that zip" instead of a wrong number.
 */
export function milesFromZip(zip: string, venue: LatLng): number | null {
  const origin = coordsForZip(zip);
  if (!origin) return null;
  return Math.round(haversineMiles(origin, venue));
}