/**
 * lib/sheetsConfig.ts
 *
 * The three published-to-web CSV URLs. These are PUBLIC URLs by design
 * (that's what "Publish to web" means) — fine for tour dates, since
 * that information is public anyway. Don't put anything sensitive in
 * these sheets.
 *
 * After File > Share > Publish to web on each sheet (format: CSV),
 * paste the resulting URL below. Each one ends in /pub?output=csv.
 */

export const SHEET_URLS = {
  artists: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQRKxjW7hXxzpA1pk2buMzDar1CwTFCsxmi9KyBbMPCjVmmQ_8xu80Io0XWKaA6NaqlflHIQvTbHVz3/pub?gid=5263936&single=true&output=csv",
  venues: "https://docs.google.com/spreadsheets/d/e/2PACX-1vRMA_YCp1_4Dka1YTxLGzw7wnbkoSFvwUOvHdLajMdPhT4gOG0WBsZwxeEcG_83DgW1gv9GWloa2hSV/pub?gid=699384705&single=true&output=csv",
  shows: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQya2F0HcTjLYerCFkJ4aKTucwsRJqMdoA6KJfoBDrytHMHGUVqzvUYO8oPcrWBzwQ2RHE1ZLgfax6z/pub?gid=653786961&single=true&output=csv",
};
