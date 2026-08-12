/**
 * app/test-shows/page.tsx
 *
 * Scratch page to confirm showsWithinRadius actually works end to end —
 * data/shows.ts + data/venues.ts + data/artists.ts joined and filtered
 * by real distance from a typed-in zip code.
 *
 * Visit /test-shows in the browser once `npm run dev` is running.
 * Safe to delete once you trust it — this isn't meant to ship.
 */

"use client";

import { useState } from "react";
import { showsWithinRadius, type RouteSheetEntry } from "@/lib/shows";
import { coordsForZip } from "@/lib/distance";

const RADII = [25, 50, 100, 500, 9999];

export default function TestShowsPage() {
  const [zip, setZip] = useState("10001");
  const [radius, setRadius] = useState(500);
  const [results, setResults] = useState<RouteSheetEntry[]>(() =>
    showsWithinRadius("10001", 500)
  );
  const [notFound, setNotFound] = useState(false);

  function run(nextZip: string, nextRadius: number) {
    setResults(showsWithinRadius(nextZip, nextRadius));
    setNotFound(coordsForZip(nextZip) === null);
  }

  return (
    <main style={{ padding: "40px", fontFamily: "monospace", maxWidth: 900 }}>
      <h1>showsWithinRadius — test</h1>
      <p>Confirms the shows/venues/artists join and the distance filter both work.</p>

      <div style={{ display: "flex", gap: 16, alignItems: "flex-end", margin: "24px 0" }}>
        <label>
          Zip code
          <br />
          <input
            value={zip}
            onChange={(e) => setZip(e.target.value)}
            maxLength={5}
            style={{ fontFamily: "monospace", fontSize: "1rem", padding: 6, width: 100 }}
          />
        </label>
        <label>
          Radius
          <br />
          <select
            value={radius}
            onChange={(e) => setRadius(Number(e.target.value))}
            style={{ fontFamily: "monospace", fontSize: "1rem", padding: 6 }}
          >
            {RADII.map((r) => (
              <option key={r} value={r}>
                {r === 9999 ? "No limit" : `${r} miles`}
              </option>
            ))}
          </select>
        </label>
        <button
          onClick={() => run(zip, radius)}
          style={{ fontFamily: "monospace", fontSize: "1rem", padding: "7px 16px" }}
        >
          Run
        </button>
      </div>

      <p>
        <strong>{results.length}</strong> show{results.length === 1 ? "" : "s"} found
      </p>

      {results.length === 0 ? (
        <p style={{ color: "#777" }}>
          {notFound
            ? `"${zip}" isn't a zip code we recognize.`
            : "Nothing in range — try widening the radius. All ten Sierra Ferrell August dates are spread across the US, so a small radius from most zips will come up empty."}
        </p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 16 }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "2px solid #333" }}>
              <th style={{ padding: "6px 4px" }}>Date</th>
              <th style={{ padding: "6px 4px" }}>Artist</th>
              <th style={{ padding: "6px 4px" }}>Venue</th>
              <th style={{ padding: "6px 4px" }}>City</th>
              <th style={{ padding: "6px 4px" }}>Miles</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.date + r.venueName} style={{ borderBottom: "1px solid #ccc" }}>
                <td style={{ padding: "6px 4px" }}>{r.date}</td>
                <td style={{ padding: "6px 4px" }}>{r.artistName}</td>
                <td style={{ padding: "6px 4px" }}>{r.venueName}</td>
                <td style={{ padding: "6px 4px" }}>
                  {r.city}, {r.state}
                </td>
                <td style={{ padding: "6px 4px", fontWeight: "bold" }}>{r.miles} mi</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p style={{ marginTop: 24, color: "#777" }}>
        Delete this page (app/test-shows/) once you trust the results.
      </p>
    </main>
  );
}
