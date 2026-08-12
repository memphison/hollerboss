/**
 * lib/csv.ts
 *
 * A small, dependency-free CSV parser. Handles quoted fields containing
 * commas (e.g. the artist "blurb" column) and escaped quotes ("").
 * Not a general-purpose CSV library — just enough for the sheets
 * HOLLERBOSS actually uses.
 */

/** Parses raw CSV text into an array of row objects keyed by header. */
export function parseCSV(text: string): Record<string, string>[] {
  const rows = splitRows(text.trim());
  if (rows.length === 0) return [];

  const headers = rows[0];
  return rows.slice(1).map((row) => {
    const obj: Record<string, string> = {};
    headers.forEach((header, i) => {
      obj[header] = row[i] ?? "";
    });
    return obj;
  });
}

function splitRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++; // skip the escaped quote's pair
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ",") {
        row.push(field.trim());
        field = "";
      } else if (char === "\n" || char === "\r") {
        // handle \r\n by skipping the paired \n
        if (char === "\r" && next === "\n") i++;
        row.push(field.trim());
        rows.push(row);
        row = [];
        field = "";
      } else {
        field += char;
      }
    }
  }

  // last field/row if the file doesn't end with a newline
  if (field.length > 0 || row.length > 0) {
    row.push(field.trim());
    rows.push(row);
  }

  return rows.filter((r) => r.some((cell) => cell !== ""));
}
