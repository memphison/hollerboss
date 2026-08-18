/**
 * app/api/shows/route.ts
 *
 * The Route Sheet's HTTP entry point. The actual data-merging logic
 * (sheet + Ticketmaster + dedup) lives in lib/liveShows.ts, shared with
 * server components — e.g. an artist page's "Coming through" card —
 * that need the same data without an extra HTTP round trip.
 */

import { NextResponse } from "next/server";
import { fetchLiveShows } from "@/lib/liveShows";

export async function GET() {
  try {
    const result = await fetchLiveShows();
    return NextResponse.json(result);
  } catch (err) {
    console.error("Failed to build show list:", err);
    return NextResponse.json(
      { error: "Failed to load shows. Check TICKETMASTER_API_KEY and the artist sheet URL." },
      { status: 500 }
    );
  }
}
