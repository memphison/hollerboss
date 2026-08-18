"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Artist } from "@/lib/sheetData";
import ArtistThumbCard from "./ArtistThumbCard";
import styles from "./EncyclopediaBrowser.module.css";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const ALL_TOPICS = "All";

export default function EncyclopediaBrowser({ artists }: { artists: Artist[] }) {
  const [search, setSearch] = useState("");
  const [activeTopic, setActiveTopic] = useState(ALL_TOPICS);
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  const sorted = useMemo(
    () => [...artists].sort((a, b) => a.name.localeCompare(b.name)),
    [artists]
  );

  // Sheet tags are compound ("Country / Folk", "Old-Time / String Band").
  // Splitting on "/" turns those into atomic, reusable chips — the raw
  // compound string is close to unique per artist, which would make the
  // filter useless.
  const artistTopics = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const a of sorted) {
      map.set(
        a.slug,
        a.tag
          .split("/")
          .map((t) => t.trim())
          .filter(Boolean)
      );
    }
    return map;
  }, [sorted]);

  const topics = useMemo(() => {
    const unique = new Set<string>();
    artistTopics.forEach((tokens) => tokens.forEach((t) => unique.add(t)));
    return [ALL_TOPICS, ...Array.from(unique).sort((a, b) => a.localeCompare(b))];
  }, [artistTopics]);

  const lettersPresent = useMemo(
    () => new Set(sorted.map((a) => a.name.charAt(0).toUpperCase())),
    [sorted]
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return sorted.filter((a) => {
      if (query && !a.name.toLowerCase().includes(query)) return false;
      if (activeTopic !== ALL_TOPICS && !artistTopics.get(a.slug)?.includes(activeTopic)) return false;
      if (activeLetter && a.name.charAt(0).toUpperCase() !== activeLetter) return false;
      return true;
    });
  }, [sorted, search, activeTopic, activeLetter, artistTopics]);

  return (
    <section className={styles.section} id="browse">
      <div className="wrap">
        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <div className={styles.sidebarBlock}>
              <p className={styles.sidebarEyebrow}>Search the encyclopedia</p>
              <div className={styles.searchWrap}>
                <input
                  type="search"
                  className={styles.searchInput}
                  placeholder="Search all artists…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search artists by name"
                />
              </div>
            </div>

            <div className={styles.sidebarBlock}>
              <p className={styles.sidebarEyebrow}>Browse by topic</p>
              <div className={styles.chips}>
                {topics.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    className={`${styles.chip} ${activeTopic === topic ? styles.chipActive : ""}`}
                    onClick={() => setActiveTopic(topic)}
                    aria-pressed={activeTopic === topic}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.sidebarBlock}>
              <p className={styles.sidebarEyebrow}>Browse by A–Z</p>
              <div className={styles.azGrid}>
                {ALPHABET.map((letter) => {
                  const available = lettersPresent.has(letter);
                  const active = activeLetter === letter;
                  return (
                    <button
                      key={letter}
                      type="button"
                      className={`${styles.azLetter} ${active ? styles.azLetterActive : ""}`}
                      disabled={!available}
                      onClick={() => setActiveLetter(active ? null : letter)}
                      aria-pressed={active}
                    >
                      {letter}
                    </button>
                  );
                })}
              </div>
            </div>

            <Link href="/#join" className={`btn btn-primary ${styles.submitBtn}`}>
              Submit an artist
            </Link>
          </aside>

          <div className={styles.main}>
            <p className={styles.tally}>
              <strong>{filtered.length}</strong> artist{filtered.length === 1 ? "" : "s"}
              {activeTopic !== ALL_TOPICS ? ` in ${activeTopic}` : ""}
              {activeLetter ? ` starting with "${activeLetter}"` : ""}
            </p>

            {filtered.length === 0 ? (
              <div className={styles.empty}>
                <h3>Nothing matches yet</h3>
                <p>Try a different search, or clear the topic and A–Z filters.</p>
              </div>
            ) : (
              <div className={styles.grid}>
                {filtered.map((artist) => (
                  <ArtistThumbCard key={artist.slug} artist={artist} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
