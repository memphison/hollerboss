import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import TornDivider from "@/components/TornDivider";
import JoinList from "@/components/JoinList";
import ArtistHero from "@/components/artist/ArtistHero";
import ArtistBody from "@/components/artist/ArtistBody";
import type { ThumbArtist } from "@/components/encyclopedia/ArtistThumbCard";
import { fetchArtists, type Artist } from "@/lib/sheetData";
import { fetchLiveShows } from "@/lib/liveShows";

// Sheet data changes as HOLLERBOSS edits artist entries — revalidate
// periodically rather than only at build time.
export const revalidate = 300;

export async function generateStaticParams() {
  // Every artist gets a page, including calendar=NO ones — see the note
  // in app/encyclopedia/page.tsx on what that field actually scopes.
  const artists = await fetchArtists();
  return artists.map((a) => ({ slug: a.slug }));
}

async function getArtist(slug: string): Promise<{ artist: Artist; allArtists: Artist[] } | null> {
  const allArtists = await fetchArtists();
  const artist = allArtists.find((a) => a.slug === slug);
  if (!artist) return null;
  return { artist, allArtists };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const found = await getArtist(slug);
  if (!found) return { title: "Artist Not Found" };
  const { artist } = found;
  return {
    title: artist.name,
    description: artist.blurb || `${artist.name} on the HOLLERBOSS encyclopedia.`,
  };
}

export default async function ArtistPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const found = await getArtist(slug);
  if (!found) notFound();
  const { artist, allArtists } = found;

  const relatedArtists: ThumbArtist[] = artist.relatedSlugs
    .map((relSlug) => allArtists.find((a) => a.slug === relSlug))
    .filter((a): a is Artist => Boolean(a))
    .map((a) => ({ slug: a.slug, name: a.name, home: a.home, tag: a.tag, photoUrl: a.photoUrl }));

  // calendar=NO artists aren't tracked for shows at all (ArtistBody hides
  // the "Coming through" card entirely for them), so skip the fetch —
  // no point hitting Ticketmaster/the shows sheet for data that won't
  // render.
  //
  // For everyone else: fetchLiveShows() already isolates per-artist
  // Ticketmaster failures (see lib/liveShows.ts), so this try/catch is
  // just defense against fetchLiveShows() itself failing outright (e.g.
  // the artist sheet being unreachable) — fail soft into the same empty
  // state ArtistBody already shows when nothing's booked, rather than
  // 500ing the whole page over a "Coming through" card.
  let upcomingShows: Awaited<ReturnType<typeof fetchLiveShows>>["shows"] = [];
  if (artist.calendar) {
    try {
      const { shows } = await fetchLiveShows();
      const today = new Date().toISOString().slice(0, 10);
      upcomingShows = shows
        .filter((s) => s.artistSlug === artist.slug && s.date >= today)
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 3);
    } catch (err) {
      console.error(`Failed to load shows for ${artist.slug}:`, err);
    }
  }

  return (
    <>
      <Nav />
      <main id="main">
        <ArtistHero artist={artist} />
        <TornDivider fill="kraft" />
        <ArtistBody artist={artist} upcomingShows={upcomingShows} relatedArtists={relatedArtists} />
        <TornDivider fill="kraft" />
        <JoinList
          heading="Stay Connected to the Holler"
          copy={`Get Route Sheet updates, new encyclopedia entries, and first word on ${artist.name}'s shows.`}
        />
      </main>
      <Footer />
    </>
  );
}
