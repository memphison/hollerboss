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
  const artists = await fetchArtists();
  return artists.filter((a) => a.calendar).map((a) => ({ slug: a.slug }));
}

async function getArtist(slug: string): Promise<{ artist: Artist; allArtists: Artist[] } | null> {
  const allArtists = await fetchArtists();
  const artist = allArtists.find((a) => a.slug === slug && a.calendar);
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

  // A single artist's Ticketmaster call failing (rate limit, timeout, etc.)
  // rejects fetchLiveShows() for every artist, since it fetches the whole
  // tracked roster in one batch. That shouldn't take down this artist's
  // whole page over a "Coming through" card — fail soft into the same
  // empty state ArtistBody already shows when nothing's booked.
  let upcomingShows: Awaited<ReturnType<typeof fetchLiveShows>>["shows"] = [];
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
